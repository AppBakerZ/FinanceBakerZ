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
    icon: {
        type: String,
        label: 'icon of account',
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