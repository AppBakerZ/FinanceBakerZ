import { Meteor } from 'meteor/meteor';
import { Incomes } from '../../incomes/incomes.js';
import { Expenses } from '../../expences/expenses.js';
import { Counter } from 'meteor/natestrauser:publish-performant-counts';

Meteor.publish('transactions', function(options) {
    let query = {
        owner: this.userId,
        $and: []
    };

    if(options.accounts.length)
        query['account'] = {$in: options.accounts};

    options.dateFilter && datefilter(options, query);
    options.filterByCategory && options.filterByCategory.length && filterByCategory(options, query);
    options.filterByProjects && options.filterByProjects.length && filterByProjects(options, query);

    if(!query.$and.length) delete query.$and;

    if(options.type == 'incomes') {
        return Incomes.find(query, {
            sort: {
                receivedAt: -1
            },
            limit: options.limit,
            skip: options.skip
        })
    }

    if(options.type == 'expenses') {
        return Expenses.find(query, {
            sort: {
                spentAt: -1
            },
            limit: options.limit,
            skip: options.skip
        })
    }

    //computing 'Transactions' below
    return transactions(options, query);
});


var datefilter = (options, query) => {
    let dateQuery = {$gte: new Date(options.dateFilter.start), $lte: new Date(options.dateFilter.end)};
    let temp = {$or: [{receivedAt: dateQuery}, {spentAt: dateQuery}]};
    query.$and.push(temp);
};



var filterByCategory = (options, query) => {
    let temp = {
        'category._id': {
            $in: options.filterByCategory
        }
    };
    query.$and.push(temp);
};



var filterByProjects = (options, query) => {
    let temp = {
        'project._id': {
            $in: options.filterByProjects
        }
    };
    query.$and.push(temp);
};



var transactions = (options, query) => {
    return [
        Incomes.find(query, {
            sort: {
                receivedAt: -1
            },
            limit: options.limit,
            skip: options.skip
        }),
        Expenses.find(query, {
            sort: {
                spentAt: -1
            },
            limit: options.limit,
            skip: options.skip
        }),
        new Counter('countIncomes', Incomes.find(query, {sort: {receivedAt: -1}})),
        new Counter('countExpenses', Expenses.find(query, {sort: {spentAt: -1}}))
    ]
};