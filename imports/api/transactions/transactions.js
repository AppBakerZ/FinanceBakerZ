// definition of the Expense collection

import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

class TransactionsCollection extends Mongo.Collection {}

export const Transactions = new TransactionsCollection('transactions');

// Deny all client-side updates since we will be using methods to manage this collection
Transactions.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; }
});


Transactions.schema = new SimpleSchema({
    owner: {
        type: String,
        label: 'Owner of transaction'
    },
    account: {
        type: Object,
        blackbox: true,
        label: 'Account of transaction'
    },
    amount: {
        type: Number,
        label: 'Amount of transaction'
    },
    description: {
        type: String,
        label: 'Description of transaction',
        optional: true
    },
    type: {
        type: String,
        label: 'Type of transaction',
    },
    creditType: {
        type: String,
        label: 'Type of transaction',
        optional: true
    },
    category: {
        type: Object,
        blackbox: true,
        label: 'Category Object',
        optional: true
    },
    project: {
        type: Object,
        blackbox: true,
        label: 'project Object',
        optional: true
    },
    transactionAt: {
        type: Date,
        label: 'When transaction happens',
    },
    billUrl: {
        type: String,
        label: 'Bill url of expense',
        optional: true
    },
    createdAt: {
        type: Date,
        label: 'When transaction created',
        denyUpdate: true,
        autoValue: function() {
            if (this.isInsert) {
                return new Date();
            } else if (this.isUpsert) {
                return {$setOnInsert: new Date()};
            } else {
                this.unset();
            }
        }
    },
    updatedAt: {
        type: Date,
        label: 'When transaction updated',
        autoValue: function() {
            if (this.isUpdate) {
                return new Date();
            }
        },
        denyInsert: true,
        optional: true
    }
});
//
Transactions.attachSchema(Transactions.schema);
//
// // This represents the keys from Lists objects that should be published
// // to the client. If we add secret properties to List objects, don't list
// // them here to keep them private to the server.
Transactions.publicFields = {
    owner: 1
};
//
//
Transactions.helpers({

});