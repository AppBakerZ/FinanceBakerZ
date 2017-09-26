import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

class PaymentCollection extends Mongo.Collection {}

export const Payments = new PaymentCollection('payments');

// Deny all client-side updates since we will be using methods to manage this collection
Payments.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; }
});

Payments.schema = new SimpleSchema({
    userId: {
        type: String,
        label: 'User of payment'
    },
    amount: {
        type: Number,
        label: 'Amount of Payment'
    },
    method: {
        type: String,
        label: 'Method of Payment'
    },
    status: {
        type: String,
        label: 'status of Payment',
        optional: true
    },
    description: {
        type: String,
        label: 'description about Payment',
        optional: true
    },
    createdAt: {
        type: Date,
        label: 'Payment creation Date',
        denyUpdate: true,
        autoValue: function() {
            if (this.isInsert) {
                return new Date();
            }
        }
    },
    updatedAt: {
        type: Date,
        label: 'Updated At expense',
        autoValue: function() {
            if (this.isUpdate) {
                return new Date();
            }
        },
        denyInsert: true,
        optional: true
    }
});

Payments.attachSchema(Payments.schema);

// This represents the keys from Lists objects that should be published
// to the client. If we add secret properties to List objects, don't list
// them here to keep them private to the server.
Payments.publicFields = {
    user: 1
};


Payments.helpers({

});