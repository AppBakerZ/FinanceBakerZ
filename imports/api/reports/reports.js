// definition of the Report collection

import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

class ReportCollection extends Mongo.Collection {}

export const Reports = new ReportCollection('reports');

// Deny all client-side updates since we will be using methods to manage this collection
Reports.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; }
});

Reports.schema = new SimpleSchema({
    owner: {
        type: String,
        label: 'Owner of report'
    },
    //TODO: implement limit or max count
    //i.e monthly or weekly limit reached for any plan
    reportUrl:{
        type: String,
        label: 'Url of report'
    },
    expireAt: {
        type: Date,
        label: 'report Expire At',
        defaultValue: new Date()
    },
    dateFrom: {
        type: Date,
        label: 'report Date From',
        optional: true
    },
    dateTo: {
        type: Date,
        label: 'report Date To',
        optional: true
    },
    type: {
        type: String,
        label: 'report type',
        optional: true
    },
    exportType: {
        type: String,
        label: 'report type',
        optional: true
    },
    FinancialType: {
        type: String,
        label: 'report type',
        optional: true
    },
    createdAt: {
        type: Date,
        label: 'Created At report',
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
});

Reports.attachSchema(Reports.schema);

// This represents the keys from Lists objects that should be published
// to the client. If we add secret properties to List objects, don't list
// them here to keep them private to the server.
Reports.publicFields = {
    owner: 1
};


Reports.helpers({

});