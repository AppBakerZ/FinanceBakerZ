import { Meteor } from 'meteor/meteor';
import { Transactions } from '../transactions';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

Meteor.publish('transactions', function(limit){
    new SimpleSchema({
        limit: {type: Number}
    }).validate({limit});


    return Transactions.find(
        {
            owner: this.userId
        },
        {
            limit: limit,
            sort: {
                transactionAt: -1
            }
        });
});