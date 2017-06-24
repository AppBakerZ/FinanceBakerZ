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
        if(query.$and){

        }
        return Incomes.find(query, {sort: {receivedAt: -1}, limit: options.limit});
    }

    if(options.type == 'expenses') {
        return Expenses.find(query, {sort: {spentAt: -1}, limit: options.limit});
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
    let limits,
        incomes = Incomes.find(query, {sort: {receivedAt: -1}, limit: options.limit}).fetch(),
        expenses = Expenses.find(query, {sort: {spentAt: -1}, limit: options.limit}).fetch(),
        transactions = _.sortBy(incomes.concat(expenses), function(obj){return obj.receivedAt || obj.spentAt;}).reverse();
    transactions.length = options.limit;
    limits = _.countBy(transactions, function(obj) {return obj.receivedAt ? 'incomes': 'expenses';});
    return [
        Incomes.find(query, {sort: {receivedAt: -1}, limit: limits.incomes}),
        Expenses.find(query, {sort: {spentAt: -1}, limit: limits.expenses}),
        new Counter('countIncomes', Incomes.find(query, {sort: {receivedAt: -1}})),
        new Counter('countExpenses', Expenses.find(query, {sort: {spentAt: -1}}))
    ]
};