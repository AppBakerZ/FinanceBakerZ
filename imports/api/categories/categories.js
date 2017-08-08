// definition of the Category collection

import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

class CategoryCollection extends Mongo.Collection {}

export const Categories = new CategoryCollection('categories');

// Deny all client-side updates since we will be using methods to manage this collection
Categories.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; }
});

Categories.schema = new SimpleSchema({
    name: {
        type: String,
        label: 'Name of category'
    },
    icon: {
        type: String,
        label: 'Icon of category'
    },
    children: {
        type: [Object],
        label: 'children Array of category',
        defaultValue: []
    },
    'children.$.id': {
        type: String,
        label: 'id of child category',
        optional: true
    },
    'children.$.name': {
        type: String,
        label: 'name of child category',
        optional: true
    },
    parent: {
        type: Object,
        label: 'Parent of category',
        defaultValue: null,
        optional: true
    },
    'parent.name': {
        type: String,
        label: 'name of Parent category',
        optional: true
    },
    'parent.id': {
        type: String,
        label: 'id of Parent category',
        optional: true
    },
    owner: {
        type: String,
        label: 'Owner of category'
    },
    createdAt: {
        type: Date,
        label: 'Created At category',
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
        label: 'Updated At category',
        autoValue: function() {
            if (this.isUpdate) {
                return new Date();
            }
        },
        denyInsert: true,
        optional: true
    }
});

Categories.attachSchema(Categories.schema);

// This represents the keys from Lists objects that should be published
// to the client. If we add secret properties to List objects, don't list
// them here to keep them private to the server.
Categories.publicFields = {
    owner: 1
};


Categories.helpers({

});