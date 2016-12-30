import { Meteor } from 'meteor/meteor';
import { Incomes } from '../../incomes/incomes.js';
import { Expenses } from '../../expences/expenses.js';

Meteor.publishComposite('transactions', function(limit) {
    return {
        find: function() {
            return Incomes.find({owner: this.userId}, {sort: {receivedAt: -1}, limit: limit});
        },
        children: [
            {
                find: function(income) {
                    return Expenses.find({owner: this.userId, spentAt: {$gte: income.receivedAt}}, {sort: {spentAt: -1}, limit: limit});
                }
            }
        ]
    }
});