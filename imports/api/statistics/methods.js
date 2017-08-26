// methods related to companies

import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';

// import webshot from 'webshot';
// import fs from 'fs';
import Future from 'fibers/future';
import moment from 'moment';

import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';

import { Transactions } from '../transactions/transactions.js'
import { Reports } from '../reports/reports.js';
import { limitHelpers } from '../../helpers/limitHelpers.js';

let AWS = require('aws-sdk');

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

        //match for current user transactions
        let match = {"$match": {
                owner: this.userId
            }};

        //get all unique years exists in DB
        const getYears = Transactions.aggregate([
            match,
            { "$group": {
                "_id": null,
                "years": { $addToSet:  {$year: "$transactionAt"} }
            }}
        ]);


        let years = [];
        if(getYears.length){
            year = year || getYears[0].years[0];
            years = getYears[0].years;
        }

        // specify formatted year query in $match
        match.$match.transactionAt = {
            $gte: new Date(moment([year]).startOf('year').format()),
            $lte: new Date(moment([year]).endOf('year').format())
        };

        //UPDATED METHOD BEGINS
        //here in first group stage we nest group with two keys income and expense
        //both have own type of sum based on condition
        let CountedArrayByMonths = Transactions.aggregate([match,
            { "$group": {
                "_id": { "$month": "$transactionAt" },
                "income": {
                    "$sum": {
                        "$cond": [
                            { "$eq": [ "$type", "income" ] },
                            '$amount',
                            0
                        ]
                    }
                },
                "expense": {
                    "$sum": {
                        "$cond": [
                            { "$eq": [ "$type", "expense" ] },
                            "$amount",
                            0
                        ]
                    }
                },
            }}]);
        //
        if(CountedArrayByMonths.length){
            CountedArrayByMonths = _.sortBy(CountedArrayByMonths, '_id')
        }

        return {years: years, result: CountedArrayByMonths}
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
        const paidAmountArray = Transactions.aggregate([{
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
            owner: this.userId,
        };
        if(accounts.length){
            query['account'] = {$in: accounts}
        }

        let counting = Transactions.aggregate([{
            $match: query
        }, { "$group": {
            "_id": "null",
            "income": {
                "$sum": {
                    "$cond": [
                        { "$eq": [ "$type", "income" ] },
                        '$amount',
                        0
                    ]
                }
            },
            "expense": {
                "$sum": {
                    "$cond": [
                        { "$eq": [ "$type", "expense" ] },
                        "$amount",
                        0
                    ]
                }
            },
        }},{
            //now just subtract total expense from incomes to get current Balance
            "$project": {
            "count": {
                "$subtract": [ "$income", "$expense" ]
            }
        }}]);
        return counting.length ? counting[0].count : 0
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
            owner: this.userId,
        };
        if(accounts.length){
            query['account'] = {$in: accounts}
        }
        if(date){
            query['transactionAt'] = {
                $gte: new Date(date.start),
                $lte: new Date(date.end)
            };
        }

        let countedArray = Transactions.aggregate([{
            $match: query
        }, { "$group": {
            "_id": "null",
            "income": {
                "$sum": {
                    "$cond": [
                        { "$eq": [ "$type", "income" ] },
                        '$amount',
                        0
                    ]
                }
            },
            "expense": {
                "$sum": {
                    "$cond": [
                        { "$eq": [ "$type", "expense" ] },
                        "$amount",
                        0
                    ]
                }
            },
        }}]);
        return {
            incomes: countedArray.length ? countedArray[0].income : 0,
            expenses: countedArray.length ? countedArray[0].expense : 0
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

        params.owner = this.userId;
        let user = Meteor.user();
        //set default to Free
        let plan = user.profile.businessPlan || 'Free';
        params.context = {
            folder: 'reports',
            plan : plan,
        };

        //configure AWS
        AWS.config.update({ "accessKeyId": Meteor.settings.AWSAccessKeyId,
            "secretAccessKey": Meteor.settings.AWSSecretAccessKey,
            "AWSRegion": "us-east-1"
        });

        const Lambda = new AWS.Lambda({
            region: 'us-east-1'
        });

        const pullParams = {
            FunctionName: 'generate-pdf',
            InvocationType: 'RequestResponse',
            LogType: 'None',
            Payload: JSON.stringify(params)
        };

        let fut = new Future();

        Lambda.invoke(pullParams, (err, data) => {
            if(err){
                fut.return(err);
            }
            else{
                fut.return(data)
            }
        });
        let data = fut.wait();
        if(data.message){
            throw new Meteor.Error(500, 'ERROR! something went wrong please contact customer support official.');
        }
        if( data.Payload ){
            let parseData = JSON.parse(data.Payload);
            if(!parseData.Location){
                throw new Meteor.Error(403, 'ERROR! something went wrong please contact customer support official.');
            }
            Reports.insert({ reportUrl: parseData.Location, owner: this.userId, expireAt: limitHelpers.getReportExpiryDate()});
            return data.Payload
        }
    }
});
// export const generateReport = new ValidatedMethod({
//     name: 'statistics.generateReport',
//     mixins : [LoggedInMixin],
//     checkLoggedInError: {
//         error: 'notLogged',
//         message: 'You need to be logged in to get total Incomes and Expenses'
//     },
//     validate: new SimpleSchema({
//         params : {
//             type: Object
//         },
//         'params.report' : {
//             type: String
//         },
//         'params.date': {
//             type: Object
//         },
//         'params.date.start': {
//             type: String
//         },
//         'params.date.end': {
//             type: String
//         },
//         'params.filterBy' : {
//             type: String
//         },
//         'params.multiple' : {
//             type: [String]
//         }
//     }).validator(),
//     //run({report, date, filterBy}) {
//     run({params}) {
//         //check for incomes only or expenses;
//         let isIncome = params.report === 'incomes';
//         let record, data, html_string, options, pdfData,
//             fut = new Future(),
//             fileName = "report.pdf",
//             css = Assets.getText('bootstrap.min.css'), // GENERATE HTML STRING
//             reportStyle = Assets.getText('report.css');
//
//         let query = {
//             owner: this.userId,
//             type: isIncome ? 'income' : 'expense'
//         };
//
//         if(params.multiple.length){
//             query['account'] = {$in: params.multiple};
//         }
//         if(params.date){
//             query.transactionAt = {
//                 $gte: new Date(params.date.start),
//                 $lte: new Date(params.date.end)
//             };
//         }
//
//         SSR.compileTemplate('layout', Assets.getText('layout.html'));
//
//         Template.layout.helpers({
//             getDocType: function() {
//                 return "<!DOCTYPE html>";
//             }
//         });
//
//         SSR.compileTemplate('report', Assets.getText('report.html'));
//
//         /*Todo use later relation */
//         Template.report.helpers({
//             accountName : (id) => {
//                 let account = Accounts.findOne({_id : id, owner: this.userId});
//                 return accountHelpers.alterName(account.bank)
//             },
//             categoryName : function(category){
//                 let Category = Categories.findOne({_id : category._id});
//                 return Category && Category.name
//             },
//             totalIncome : function(){
//                 if(params.date){
//                     let incomes = Transactions.aggregate({
//                         $match: query
//                     },{
//                         $group: { _id: null, total: { $sum: '$amount' } }
//                     });
//                     return incomes.length ? incomes[0].total : 0;
//                 }
//             },
//             totalExpenses : function(){
//                 query.type = 'expense';
//                 if(params.date){
//                     let expenses = Transactions.aggregate({
//                         $match: query
//                     },{
//                         $group: { _id: null, total: { $sum: '$amount' } }
//                     });
//                     return expenses.length ? expenses[0].total : 0;
//                 }
//             },
//             dateFormat : function(data){
//                return moment(data).format('L')
//             }
//         });
//
//         // PREPARE DATA
//         //createdAt
//         let option = {
//             sort: {
//                 transactionAt: 1
//             }
//         };
//         record =  Transactions.find(query, option).fetch();
//
//         if(!record.length){
//             throw new Meteor.Error( 404, 'result not found' );
//         }
//
//         data = {
//             heading : isIncome ? ('Incomes Report for ' + params.filterBy) : ('Expenses Report for ' + params.filterBy),
//             record: record,
//             income : isIncome
//
//         };
//
//
//         html_string = SSR.render('layout', {
//             reportStyle: reportStyle,
//             css: css,
//             template: "report",
//             data: data
//         });
//
//         // Setup Webshot options
//         options = {
//             //renderDelay: 2000,
//             "paperSize": {
//                 "format": "Letter",
//                 "orientation": "portrait",
//                 "margin": "1cm"
//             },
//             siteType: 'html'
//         };
//
//         // Commence Webshot
//         console.log("Commencing webshot...");
//         webshot(html_string, fileName, options, function(err) {
//             fs.readFile(fileName, function (err, data) {
//                 if (err) {
//                     return console.log(err);
//                 }
//
//                 fs.unlinkSync(fileName);
//                 fut.return(data
//
//             });
//         });
//
//         pdfData = fut.wait();
//         return new Buffer(pdfData).toString('base64');
//
//     }
// });

// TODO: that is the sample call for update plan move it to client when needed
// Meteor.call('statistics.changePlan', {params: {newPlan:'Professional'} } , (err, res) => {
//     this.setState({
//         loading: false
//     });
//     if (err) {
//         console.error(err);
//     } else if (res) {
//         console.log(res)
//     }
// })

export const changePlan = new ValidatedMethod({
    name: 'statistics.changePlan',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to change your current Plan'
    },
    validate: new SimpleSchema({
        params : {
            type: Object
        },
        'params.newPlan': {
            type: String
        }
    }).validator(),

    run({params}) {

        params.owner = this.userId;
        let user = Meteor.user();
        //set default to Free
        params.oldPlan = user.profile.businessPlan || 'Free';

        //configure AWS
        AWS.config.update({ "accessKeyId": Meteor.settings.AWSAccessKeyId,
            "secretAccessKey": Meteor.settings.AWSSecretAccessKey,
            "AWSRegion": Meteor.settings.AWSRegion
        });

        const Lambda = new AWS.Lambda({
            region: Meteor.settings.AWSRegion
        });

        const pullParams = {
            FunctionName: 'update-plan',
            InvocationType: 'RequestResponse',
            LogType: 'None',
            Payload: JSON.stringify(params)
        };

        let fut = new Future();

        Lambda.invoke(pullParams, (err, data) => {
            if(err){
                fut.return(err);
            }
            else{
                fut.return(data)
            }
        });
        let data = fut.wait();
        if(data.message){
            throw new Meteor.Error(500, 'ERROR! something went wrong please contact customer support official.');
        }
        Reports.find({owner: params.owner}).fetch().forEach(function(doc) {
            let updated_url = doc.reportUrl.replace(params.oldPlan, params.newPlan);
            Reports.update(
                {_id: doc._id},
                { $set: {
                    reportUrl: updated_url,
                    expireAt: limitHelpers.getReportExpiryDate(params.newPlan)
                } }
            );
        });

        return Meteor.users.update({
            _id: params.owner
        }, { $set: {
            'profile.businessPlan': params.newPlan
        }})
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
