// definition of the Project collection

import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

class ProjectCollection extends Mongo.Collection {}

export const Projects = new ProjectCollection('projects');

// Deny all client-side updates since we will be using methods to manage this collection
Projects.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; }
});

Projects.schema = new SimpleSchema({
    owner : {
        type : String,
        label : 'Project owner id'
    },
    name : {
      type : String,
      label : 'Project name'
    },
    description : {
      type : String,
      label : 'Project description'
    },
    type:{
        type: String,
        label : 'Project type'
    },
    client :{
        type: Object,
        optional: true,
        label : 'Client details',
        blackbox:true
    },
    status :{
        type: String,
        label : 'Status'
    },
    startAt :{
        type: Date,
        label : 'Project start date',
        optional: true
    },
    amount : {
        type: Number,
        label : 'Amount of project',
        optional: true
    },
    budget : {
        type: Number,
        label : 'Amount of project',
        optional: true
    },
    endAt :{
        type: Date,
        label : 'Project end date',
        optional: true
    },
    createdAt: {
        type: Date,
        label: 'Created At Project',
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
        label: 'Updated At Project',
        autoValue: function() {
            if (this.isUpdate) {
                return new Date();
            }
        },
        denyInsert: true,
        optional: true
    }
});

Projects.attachSchema(Projects.schema);

// This represents the keys from Lists objects that should be published
// to the client. If we add secret properties to List objects, don't list
// them here to keep them private to the server.
Projects.publicFields = {
    owner: 1
};


Projects.helpers({

});