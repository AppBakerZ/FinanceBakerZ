import { Meteor } from 'meteor/meteor';
import { Incomes } from '../../incomes/incomes.js';
import { Expenses } from '../../expences/expenses.js';
import { Counter } from 'meteor/natestrauser:publish-performant-counts';

//here we define two sorting option based on income and expenses keys
let incomeSort = {
    receivedAt: -1
};
let expenseSort = {
    spentAt: -1
};

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

    if( options.type === 'incomes' ) {
        return [
            findQuery(Incomes, query, options, incomeSort),
            new Counter('incomesCount', Incomes.find(query, {
                sort: sort
            }))
        ]
    }

    if(options.type === 'expenses') {
        return [
            findQuery(Expenses, query, options, expenseSort),
            new Counter('expensesCount', Expenses.find(query, {
                sort: sort
            }))
        ]
    }

    //computing 'Transactions' below
    return transactions(options, query);
});


let datefilter = (options, query) => {
    let dateQuery = {$gte: new Date(options.dateFilter.start), $lte: new Date(options.dateFilter.end)};
    let temp = {$or: [{receivedAt: dateQuery}, {spentAt: dateQuery}]};
    query.$and.push(temp);
};



let filterByCategory = (options, query) => {
    let temp = {
        'category._id': {
            $in: options.filterByCategory
        }
    };
    query.$and.push(temp);
};



let filterByProjects = (options, query) => {
    let temp = {
        'project._id': {
            $in: options.filterByProjects
        }
    };
    query.$and.push(temp);
};



let transactions = (options, query) => {

    return [
        findQuery(Incomes, query, options, incomeSort),
        findQuery(Expenses, query, options, expenseSort),
        new Counter('countIncomes', Incomes.find(query, {
            sort: incomeSort
        })),
        new Counter('countExpenses', Expenses.find(query, {
            sort: expenseSort
        }))
    ]
};

findQuery =(Collection, query, options, sort) => {
    return Collection.find(query, {
        sort: sort,
        limit: options.limit,
        skip: options.skip
    })
};