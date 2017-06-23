import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

class LogsCollection extends Mongo.Collection {}

export const Logs = new LogsCollection('logs');

// Deny all client-side updates since we will be using methods to manage this collection
Logs.deny({
    insert() { return true; },
    // update() { return true; },
    // remove() { return true; }
});

Logs.schema = new SimpleSchema({
    user: {
        type: String,
        label: 'User of logs'
    },
    level: {
        type: String,
        label: 'level of Log',
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
});

Logs.attachSchema(Logs.schema);

// This represents the keys from Lists objects that should be published
// to the client. If we add secret properties to List objects, don't list
// them here to keep them private to the server.
Logs.publicFields = {
    level: 1
};


Logs.helpers({

});