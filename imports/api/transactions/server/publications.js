import { Meteor } from 'meteor/meteor';
import { Incomes } from '../../incomes/incomes.js';
import { Expenses } from '../../expences/expenses.js';

Meteor.publish('transactions', function(options) {
    let query = {owner: this.userId};
    options.accounts.length && (query['account'] = {$in: options.accounts});

    query.$or = [];

    if(options.dateFilter){
        let dateQuery = {$gte: new Date(options.dateFilter.start), $lte: new Date(options.dateFilter.end)};
        query.$or.push({receivedAt: dateQuery}, {spentAt: dateQuery});
    }

    if(options.filterByCategory){
        query.$or.push({category: options.filterByCategory});
        query.$or.push({'category._id': options.filterByCategory});
    }
    if(options.filterByProjects){
        query.$or.push({project: options.filterByProjects});
        query.$or.push({'project._id': options.filterByProjects});
    }

    if(!query.$or.length) delete query.$or;

    if(options.type == 'incomes') return Incomes.find(query, {sort: {receivedAt: -1}, limit: options.limit});
    if(options.type == 'expenses') return Expenses.find(query, {sort: {spentAt: -1}, limit: options.limit});

    //computing 'Transactions' below
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
});