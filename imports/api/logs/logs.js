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
        label: 'logs related to user'
    },
    name: {
        type: String,
        label: 'name related to user'
    },
});

Logs.attachSchema(Logs.schema);

// This represents the keys from Lists objects that should be published
// to the client. If we add secret properties to List objects, don't list
// them here to keep them private to the server.
Logs.publicFields = {
    user: 1
};