import { Meteor } from 'meteor/meteor';
import { Transactions } from '../transactions';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

Meteor.publish('transactions', function(limit){
    new SimpleSchema({
        limit: {type: Number}
    }).validate({limit});

    return [
        new Counter('transactionsTotal', Transactions.find(
            {
                owner: this.userId
            })),
        Transactions.find(
            {
                owner: this.userId
            },
            {
                limit: limit,
                sort: {
                    transactionAt: -1
                }
            })
    ];
});

Meteor.publish('transactions.single', function (id) {
    return Transactions.find({
        owner: this.userId,
        _id: id
    });
});

//publish only Transaction (incomes)
Meteor.publish('transactions.incomes', function (limit) {
    new SimpleSchema({
        limit: {type: Number}
    }).validate({limit});


    return Transactions.find(
        {
            owner: this.userId,
            type: 'income'
        },
        {
            limit: limit,
            sort: {
                transactionAt: -1
            }
        });
});

//publish only Transaction (expenses)
Meteor.publish('transactions.expenses', function (limit) {
    new SimpleSchema({
        limit: {type: Number}
    }).validate({limit});


    return Transactions.find(
        {
            owner: this.userId,
            type: 'expense'
        },
        {
            limit: limit,
            sort: {
                transactionAt: -1
            }
        });
});