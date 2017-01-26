import { Meteor } from 'meteor/meteor';
import { Incomes } from '../../incomes/incomes.js';
import { Expenses } from '../../expences/expenses.js';

Meteor.publish('transactions', function(options) {
    let query = {owner: this.userId};
    options.accounts.length && (query['account'] = {$in: options.accounts});

    query.$and = [];
    options.dateFilter && datefilter(options, query);
    options.filterByCategory && filterByCategory(options, query);
    options.filterByProjects && filterByProjects(options, query);

    if(!query.$and.length) delete query.$and;
    if(options.type == 'incomes') return Incomes.find(query, {sort: {receivedAt: -1}, limit: options.limit});
    if(options.type == 'expenses') return Expenses.find(query, {sort: {spentAt: -1}, limit: options.limit});

    //computing 'Transactions' below
    return transactions(options,query);
});


var datefilter = (options, query) => {
    let dateQuery = {$gte: new Date(options.dateFilter.start), $lte: new Date(options.dateFilter.end)};
    let temp = {$or: [{receivedAt: dateQuery}, {spentAt: dateQuery}]};
    query.$and.push(temp);
};



var filterByCategory = (options, query) => {
    let temp = {$or: [{category: options.filterByCategory},{'category._id': options.filterByCategory}]};
    query.$and.push(temp);
};



var filterByProjects = (options, query) => {
    let temp = {$or: [{project: options.filterByProjects},{'project._id': options.filterByProjects}]};
    query.$and.push(temp);
};



var transactions=(options, query) => {
    let limits,
        incomes = Incomes.find(query, {sort: {receivedAt: -1}, limit: options.limit}).fetch(),
        expenses = Expenses.find(query, {sort: {spentAt: -1}, limit: options.limit}).fetch(),
        transactions = _.sortBy(incomes.concat(expenses), function(obj){return obj.receivedAt || obj.spentAt;}).reverse();
    transactions.length = options.limit;
    limits = _.countBy(transactions, function(obj) {return obj.receivedAt ? 'incomes': 'expenses';});
    return [
        Incomes.find(query, {sort: {receivedAt: -1}, limit: limits.incomes}),
        Expenses.find(query, {sort: {spentAt: -1}, limit: limits.expenses})
    ]

};