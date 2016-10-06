// definition of the Currencies collection.

import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

class CurrencyCollection extends Mongo.Collection {}

export const Currencies = new CurrencyCollection('currencies');

// Deny all client-side updates since we will be using methods to manage this collection

Currencies.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; }
});

Currencies.schema = new SimpleSchema({
    name: {
        type: String,
        label: 'Name of currency'
    },
    icon: {
        type: String,
        label: 'Icon of currency'
    },
    owner: {
        type: String,
        label: 'Owner of currency'
    },
    createdAt: {
        type: Date,
        label: 'Created At currency',
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
        label: 'Updated At currency',
        autoValue: function() {
            if (this.isUpdate) {
                return new Date();
            }
        },
        denyInsert: true,
        optional: true
    }
});

Currencies.attachSchema(Currencies.schema);

// This represents the keys from Lists objects that should be published
// to the client. If we add secret properties to List objects, don't list
// them here to keep them private to the server.
Currencies.publicFields = {
    owner: 1
};
