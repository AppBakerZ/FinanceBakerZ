import { Meteor } from 'meteor/meteor';
import { Transactions } from '../../transactions/transactions.js';
import { Counter } from 'meteor/natestrauser:publish-performant-counts';

sortbyDate = {
    date: -1
};
//remove the 's' from transactions to respect the new Transactions collection
Meteor.publish('transaction', function(options) {
    let query = {
        owner: this.userId,
        $and: []
    };

    if(options.accounts.length)
        query['account'] = {$in: ArrayGuard(options.accounts)};

    options.dateFilter && (query.date = {$gte: new Date(options.dateFilter.start), $lte: new Date(options.dateFilter.end)});

    options.filterByCategory && options.filterByCategory.length && filterByCategory(options, query);
    options.filterByProjects && options.filterByProjects.length && filterByProjects(options, query);

    if(!query.$and.length) delete query.$and;

    if(options.type === 'incomes') {
        options.type = "income"
    }

    else if(options.type === 'expenses') {
        options.type = "expense"
    }

    //computing 'Transactions' below
    return transactions(options, query);
});


let datefilter = (options, query) => {
    let dateQuery = {
        $gte: new Date(options.dateFilter.start),
        $lte: new Date(options.dateFilter.end)
    };
    let temp = {
        $or: [{
            date: dateQuery
        }
        ]};
    query.$and.push(temp);
};



let filterByCategory = (options, query) => {
    query['category._id'] = {
        $in: options.filterByCategory
    }
};



let filterByProjects = (options, query) => {
    query['project._id'] = {
        $in: options.filterByProjects
    }
};



let transactions = (options, query) => {

    //call asynchronous method just to get result delay :)
    Meteor.call('copyTransactions', (err, res) => {
    });

    if(options.type && options.type !== 'both'){
        query.type = options.type
    }
    return [
        Transactions.find(query, {
            sort: sortbyDate,
            skip: options.skip,
            limit: options.limit,
        }),
        new Counter('transactionsCount', Transactions.find(query, {
            sort: sortbyDate
        }))
    ];
};

//Guard for Operator which only work with Array like $in
ArrayGuard = (ele) => {
    (ele instanceof Array) || (ele = [ele]);
    return ele
};