// methods related to companies

import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';

import webshot from 'webshot';
import fs from 'fs';
import Future from 'fibers/future';
import moment from 'moment';

import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';

import { Expenses } from '../expences/expenses.js';
import { Incomes } from '../incomes/incomes.js';
import { Accounts } from '../accounts/accounts.js';
import { Categories } from '../categories/categories.js';
import { accountHelpers } from '/imports/helpers/accountHelpers.js'


export const incomesGroupByMonth = new ValidatedMethod({
    name: 'statistics.incomesGroupByMonth',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to get Incomes Group By Project'
    },
    validate: new SimpleSchema({
        year: {
            type: Number,
            optional: true
        }
    }).validator(),
    run({year}) {

        let match = {"$match": {
                owner: this.userId
            }};

        const getYears = Incomes.aggregate([
            match,
            { "$group": {
                "_id": null,
                "years": { $addToSet:  {$year: "$receivedAt"} }
            }}
        ]);


        let years = [];
        if(getYears.length){
            year = year || getYears[0].years[0];
            years = getYears[0].years;
        }

        const yearQuery = {
            $gte: new Date(moment([year]).startOf('year').format()),
            $lte: new Date(moment([year]).endOf('year').format())
        };

        match.$match.receivedAt = yearQuery;
        const sumOfIncomesByMonth = Incomes.aggregate([
            match,
            { "$group": {
                "_id": { "$month": "$receivedAt" },
                "income": { "$sum": "$amount" }
            }}
        ]);

        delete match.$match.receivedAt;
        match.$match.spentAt = yearQuery;
        const sumOfExpensesByMonth = Expenses.aggregate([
            match,
            { "$group": {
                "_id": { "$month": "$spentAt" },
                "expense": { "$sum": "$amount" }
            }}
        ]);

        const incomeAndExpensesArray = _.groupBy(sumOfIncomesByMonth.concat(sumOfExpensesByMonth), '_id');

         let groupedByMonths = _.map(incomeAndExpensesArray, (arrayGroup) => {
            let item = {};
            if(arrayGroup.length > 1){
                item = _.extend(arrayGroup[0], arrayGroup[1]);
            }else{
                item = arrayGroup[0]
            }

            if(!_.has(item, 'income')) item.income = 0;
            if(!_.has(item, 'expense')) item.expense = 0;

            return item
        });

        return {years: years, result: groupedByMonths}
    }
});


export const incomesGroupByProject = new ValidatedMethod({
    name: 'statistics.incomesGroupByProject',
    mixins: [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to get Incomes Group By Project'
    },
    validate: new SimpleSchema({
        'project': {
            type: Object
        },
        'project._id': {
            type: String
        }
    }).validator(),
    run({ project }) {
        const paidAmountArray = Incomes.aggregate([{
            $match: {
                'project._id': project._id
            }
        }, {
            $group: {
                _id: 'project._id', total: {
                    $sum: '$amount'
                }
            }
        }]);

        return paidAmountArray.length ? paidAmountArray[0] : {total: 0}
    }
});


export const availableBalance = new ValidatedMethod({
    name: 'statistics.availableBalance',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to get Available Balance'
    },
    validate: new SimpleSchema({
        accounts: {
            type: [String]
        }
    }).validator(),
    run({accounts}) {
        let query = {
            owner: this.userId
        };
        if(accounts.length){
            query['account'] = {$in: accounts}
        }
        const sumOfIncomes = Incomes.aggregate({
            $match: query
        },{
            $group: { _id: null, total: { $sum: '$amount' } }
        });

        const sumOfExpenses = Expenses.aggregate({
            $match: query
        },{
            $group: { _id: null, total: { $sum: '$amount' } }
        });

        const totalIncomes = sumOfIncomes.length ? sumOfIncomes[0].total : 0;
        const totalExpenses = sumOfExpenses.length ? sumOfExpenses[0].total : 0;

        return totalIncomes - totalExpenses;
    }
});

export const totalIncomesAndExpenses = new ValidatedMethod({
    name: 'statistics.totalIncomesAndExpenses',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to get total Incomes and Expenses'
    },
    validate: new SimpleSchema({
        accounts: {
            type: [String]
        },
        date: {
            type: Object
        },
        'date.start': {
            type: String
        },
        'date.end': {
            type: String
        }
    }).validator(),
    run({accounts, date}) {
        let query = {
            owner: this.userId
        };
        if(accounts.length){
            query['account'] = {$in: accounts}
        }
        if(date){
            query['receivedAt'] = {
                $gte: new Date(date.start),
                $lte: new Date(date.end)
            };
        }
        const sumOfIncomes = Incomes.aggregate({
            $match: query
        },{
            $group: { _id: null, total: { $sum: '$amount' } }
        });

        query.spentAt = query.receivedAt;
        delete query.receivedAt;

        const sumOfExpenses = Expenses.aggregate({
            $match: query
        },{
            $group: { _id: null, total: { $sum: '$amount' } }
        });

        return {
            incomes: sumOfIncomes.length ? sumOfIncomes[0].total : 0,
            expenses: sumOfExpenses.length ? sumOfExpenses[0].total : 0
        };
    }
});

export const generateReport = new ValidatedMethod({
    name: 'statistics.generateReport',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to get total Incomes and Expenses'
    },
    validate: new SimpleSchema({
        params : {
            type: Object
        },
        'params.report' : {
            type: String
        },
        'params.date': {
            type: Object
        },
        'params.date.start': {
            type: String
        },
        'params.date.end': {
            type: String
        },
        'params.filterBy' : {
            type: String
        },
        'params.multiple' : {
            type: [String]
        }
    }).validator(),
    //run({report, date, filterBy}) {
    run({params}) {
        let record, data, html_string, options, pdfData,
            fut = new Future(),
            fileName = "report.pdf",
            css = Assets.getText('bootstrap.min.css'), // GENERATE HTML STRING
            reportStyle = Assets.getText('report.css');

        let query = {
            owner: this.userId
        };

        if(params.multiple.length){
            query['account'] = {$in: params.multiple};
        }
        if(params.date){
            let fetch = (params.report == 'incomes') ? 'receivedAt' : 'spentAt';
            query[fetch] = {
                $gte: new Date(params.date.start),
                $lte: new Date(params.date.end)
            };
        }

        SSR.compileTemplate('layout', Assets.getText('layout.html'));

        Template.layout.helpers({
            getDocType: function() {
                return "<!DOCTYPE html>";
            }
        });

        SSR.compileTemplate('report', Assets.getText('report.html'));

        /*Todo use later relation */
        Template.report.helpers({
            accountName : (id) => {
                let account = Accounts.findOne({_id : id, owner: this.userId});
                return accountHelpers.alterName(account.bank)
            },
            categoryName : function(category){
                return Categories.findOne({_id : category._id}).name;
            },
            totalIncome : function(){
                if(params.date){
                    let incomes = Incomes.aggregate({
                        $match: query
                    },{
                        $group: { _id: null, total: { $sum: '$amount' } }
                    });
                    return incomes.length ? incomes[0].total : 0;
                }
            },
            totalExpenses : function(){
                if(params.date){
                    let expenses = Expenses.aggregate({
                        $match: query
                    },{
                        $group: { _id: null, total: { $sum: '$amount' } }
                    });
                    return expenses.length ? expenses[0].total : 0;
                }
            },
            dateFormat : function(data){
               return moment(data).format('L')
            }
        });

        // PREPARE DATA
        //createdAt
        let option = {sort: {}};
        (params.report == 'incomes') ? option.sort['receivedAt'] = 1 : option.sort['spentAt'] = 1;
        record =  (params.report == 'incomes') ? Incomes.find(query, option).fetch() : Expenses.find(query, option).fetch();

        if(!record.length){
            throw new Meteor.Error( 404, 'result not found' );
        }

        data = {
            heading : (params.report == 'incomes') ? ('Incomes Report for ' + params.filterBy) : ('Expenses Report for ' + params.filterBy),
            record: record,
            income : (params.report == 'incomes')

        };


        html_string = SSR.render('layout', {
            reportStyle: reportStyle,
            css: css,
            template: "report",
            data: data
        });

        // Setup Webshot options
        options = {
            //renderDelay: 2000,
            "paperSize": {
                "format": "Letter",
                "orientation": "portrait",
                "margin": "1cm"
            },
            siteType: 'html'
        };

        // Commence Webshot
        console.log("Commencing webshot...");
        webshot(html_string, fileName, options, function(err) {
            fs.readFile(fileName, function (err, data) {
                if (err) {
                    return console.log(err);
                }

                fs.unlinkSync(fileName);
                fut.return(data);

            });
        });

        pdfData = fut.wait();
        return new Buffer(pdfData).toString('base64');

    }
});


const EXPENSES_METHODS = _.pluck([
    incomesGroupByMonth,
    incomesGroupByProject,
    availableBalance,
    totalIncomesAndExpenses,
    generateReport
], 'name');

if (Meteor.isServer) {
    DDPRateLimiter.addRule({
        name(name) {
            return _.contains(EXPENSES_METHODS, name);
        },

        // Rate limit per connection ID
        connectionId() { return true; }
    }, 5, 1000);
}
