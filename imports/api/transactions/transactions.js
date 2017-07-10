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
//
// Transactions.schema = new SimpleSchema({
//     owner: {
//         type: String,
//         label: 'Owner of expense'
//     },
//     account: {
//         type: String,
//         label: 'Account of expense'
//     },
//     amount: {
//         type: Number,
//         label: 'Amount of expense'
//     },
//     category: {
//         type: Object,
//         label: 'Type of expense'
//     },
//     'category._id': {
//         type: String,
//         label: 'Type of expense'
//     },
//     'category.name': {
//         type: String,
//         label: 'Type of expense'
//     },
//     'category.icon': {
//         type: String,
//         label: 'Type of expense'
//     },
//     description: {
//         type: String,
//         label: 'Project of expense',
//         optional: true
//     },
//     billUrl: {
//         type: String,
//         label: 'Bill url of expense',
//         optional: true
//     },
//     spentAt: {
//         type: Date,
//         label: 'Spent At'
//     },
//     createdAt: {
//         type: Date,
//         label: 'Created At expense',
//         denyUpdate: true,
//         autoValue: function() {
//             if (this.isInsert) {
//                 return new Date();
//             } else if (this.isUpsert) {
//                 return {$setOnInsert: new Date()};
//             } else {
//                 this.unset();
//             }
//         }
//     },
//     updatedAt: {
//         type: Date,
//         label: 'Updated At expense',
//         autoValue: function() {
//             if (this.isUpdate) {
//                 return new Date();
//             }
//         },
//         denyInsert: true,
//         optional: true
//     }
// });
//
// Transactions.attachSchema(Expenses.schema);
//
// // This represents the keys from Lists objects that should be published
// // to the client. If we add secret properties to List objects, don't list
// // them here to keep them private to the server.
Transactions.publicFields = {
    owner: 1
};
//
//
// Transactions.helpers({
//
// });