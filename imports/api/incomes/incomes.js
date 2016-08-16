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
    name: {
        type: String,
        label: 'Name of income',
        max: 50
    },
    purpose: {
        type: String,
        label: 'Purpose of income',
        max: 50,
        optional: true
    },
    icon: {
        type: String,
        label: 'Icon of income',
        optional: true
    },
    createdAt: {
        type: Date,
        label: "Created At income",
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
        label: "Updated At income",
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
    name: 1
};


Incomes.helpers({

});