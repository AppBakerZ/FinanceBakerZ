// definition of the Income collection

import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

class IncomeCollection extends Mongo.Collection {}

export const Incomes = new IncomeCollection('incomes');

// Deny all client-side updates since we will be using methods to manage this collection
Incomes.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; }
});

Incomes.schema = new SimpleSchema({
    owner: {
        type: String,
        label: 'Owner of income'
    },
    account: {
        type: String,
        label: 'Account of income'
    },
    amount: {
        type: Number,
        label: 'Amount of income'
    },
    type: {
        type: String,
        label: 'Type of income'
    },
    creditType: {
        type: String,
        optional: true
    },
    project: {
        type: Object,
        label: 'Project of income',
        optional: true
    },
    'project._id': {
        type: String,
        label: "Project's id of income",
        optional: true
    },
    'project.name': {
        type: String,
        label: "Project's name of income",
        optional: true
    },
    receivedAt: {
        type: Date,
        label: 'received At income'
    },
    createdAt: {
        type: Date,
        label: 'Created At income',
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
        label: 'Updated At income',
        autoValue: function() {
            if (this.isUpdate) {
                return new Date();
            }
        },
        denyInsert: true,
        optional: true
    }
});

Incomes.attachSchema(Incomes.schema);

// This represents the keys from Lists objects that should be published
// to the client. If we add secret properties to List objects, don't list
// them here to keep them private to the server.
Incomes.publicFields = {
    owner: 1
};


Incomes.helpers({

});