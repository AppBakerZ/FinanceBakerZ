// definition of the Accounts collection

import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

class AccountsCollection extends Mongo.Collection {}

export const Accounts = new AccountsCollection('accounts');

// Deny all client-side updates since we will be using methods to manage this collection
Accounts.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; }
});

Accounts.schema = new SimpleSchema({
    owner: {
        type: String,
        label: 'Owner of account'
    },
    name: {
        type: String,
        label: 'Name of account',
        max: 50
    },
    purpose: {
        type: String,
        label: 'Purpose of account',
        max: 50,
        optional: true
    },
    number: {
        type: String,
        label: 'Number of account',
        optional: true
    },
    icon: {
        type: String,
        label: 'Icon of account',
        optional: true
    },
    createdAt: {
        type: Date,
        label: "Created At account",
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
        label: "Updated At account",
        autoValue: function() {
            if (this.isUpdate) {
                return new Date();
            }
        },
        denyInsert: true,
        optional: true
    }
});

Accounts.attachSchema(Accounts.schema);

// This represents the keys from Lists objects that should be published
// to the client. If we add secret properties to List objects, don't list
// them here to keep them private to the server.
Accounts.publicFields = {
    name: 1
};


Accounts.helpers({

});