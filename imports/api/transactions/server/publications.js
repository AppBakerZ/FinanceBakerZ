import { Meteor } from 'meteor/meteor';
import { Incomes } from '../../incomes/incomes.js';
import { Expenses } from '../../expences/expenses.js';
import { Transactions } from '../../transactions/transactions.js';
import { Counter } from 'meteor/natestrauser:publish-performant-counts';

//here we define three types of sorting options
let sortOptions = {
    incomeSort: {
        receivedAt: -1
    },
    expenseSort: {
        spentAt: -1
    },
    viewSort: {
        date: -1
    }
};

//remove the 's' from transactions to respect the new Transactions collection
Meteor.publish('transaction', function(options) {
    //we only return Transactions if view Flag found to not break the old functionality
    let viewFlag = options.viewFlag;
    let query = {
        owner: this.userId,
        $and: []
    };

    if(options.accounts.length)
        query['account'] = {$in: ArrayGuard(options.accounts)};

    if( viewFlag && options.type === 'both' ){
        options.dateFilter && (query.date = {$gte: new Date(options.dateFilter.start), $lte: new Date(options.dateFilter.end)});
    }
    else {
        options.dateFilter && datefilter(options, query);
    }

    options.filterByCategory && options.filterByCategory.length && filterByCategory(options, query);
    options.filterByProjects && options.filterByProjects.length && filterByProjects(options, query);

    if(!query.$and.length) delete query.$and;

    if(options.type === 'incomes') {
        return [
            findCursor(Incomes, query, options, sortOptions.incomeSort),
            new Counter('incomesCount', Incomes.find(query, {
                sort: sortOptions.incomeSort
            }))
        ]
    }

    if(options.type === 'expenses') {
        return [
            findCursor(Expenses, query, options, sortOptions.expenseSort),
            new Counter('expensesCount', Expenses.find(query, {
                sort: sortOptions.expenseSort
            }))
        ]
    }

    //computing 'Transactions' below
    return transactions(options, query, viewFlag);
});


let datefilter = (options, query) => {
    let dateQuery = {
        $gte: new Date(options.dateFilter.start),
        $lte: new Date(options.dateFilter.end)
    };
    let temp = {
        $or: [{
            receivedAt: dateQuery
        }, {
            spentAt: dateQuery
        }
        ]};
    query.$and.push(temp);
};



let filterByCategory = (options, query) => {
    let temp = {
        'category._id': {
            $in: ArrayGuard(options.filterByCategory)
        }
    };
    query.$and.push(temp);
};



let filterByProjects = (options, query) => {
    let temp = {
        'project._id': {
            $in: ArrayGuard(options.filterByProjects)
        }
    };
    query.$and.push(temp);
};



let transactions = (options, query, viewFlag) => {
    if( viewFlag ){
        //call asynchronous method just to get result delay :)
        Meteor.call('copyTransactions', (err, res) => {
            return [
                findCursor(Incomes, query, options, sortOptions.incomeSort),
                findCursor(Expenses, query, options, sortOptions.expenseSort),
                new Counter('countIncomes', Incomes.find(query, {
                    sort: sortOptions.incomeSort
                })),
                new Counter('countExpenses', Expenses.find(query, {
                    sort: sortOptions.expenseSort
                }))
            ]
        });
        return [
            findCursor(Transactions, query, options, sortOptions.viewSort),
            new Counter('transactionsCount', Transactions.find(query, {
                sort: sortOptions.viewSort
            }))
        ];
    }
    return [
        findCursor(Incomes, query, options, sortOptions.incomeSort),
        findCursor(Expenses, query, options, sortOptions.expenseSort),
        new Counter('countIncomes', Incomes.find(query, {
            sort: sortOptions.incomeSort
        })),
        new Counter('countExpenses', Expenses.find(query, {
            sort: sortOptions.expenseSort
        }))
    ]
};

//return dynamic cursor based on given options
findCursor =(Collection, query, options, sort) => {
    return Collection.find(query, {
        sort: sort,
        limit: options.limit,
        skip: options.skip
    })
};

//Guard for Operator which only work with Array like $in
ArrayGuard = (ele) => {
    (ele instanceof Array) || (ele = [ele]);
    return ele
};