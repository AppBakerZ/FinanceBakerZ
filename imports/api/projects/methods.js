// methods related to companies

import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';
import { Projects } from './projects.js';
import { Transactions } from '../transactions/transactions.js';

export const insert = new ValidatedMethod({
    name: 'projects.insert',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to create expense'
    },
    validate: new SimpleSchema({
        'project': {
            type: Object
        },
        'project._id': {
            type: String,
            optional: true
        },
        'project.name': {
            type: String
        },
        'project.description': {
            type: String
        },
        'project.type': {
            type: String
        },
        'project.client': {
            type: Object,
            blackbox: true
        },
        'project.status': {
            type: String
        },
        'project.amount': {
            type: Number,
            optional: true
        },
        'project.startAt': {
            type: Date,
            optional: true
        }
    }).validator(),
    run({ project }) {
        project.owner = this.userId;
        return Projects.insert(project);
    }
});

export const update = new ValidatedMethod({
    name: 'projects.update',
    mixins: [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to update project'
    },
    validate: new SimpleSchema({
        'project': {
            type: Object
        },
        'project._id': {
            type: String,
            optional: true
        },
        'project.name': {
            type: String
        },
        'project.description': {
            type: String
        },
        'project.type': {
            type: String
        },
        'project.client': {
            type: Object,
            blackbox: true
        },
        'project.status': {
            type: String
        },
        'project.amount': {
            type: Number,
            optional: true
        },
        'project.startAt': {
            type: Date,
            optional: true
        }
    }).validator(),
    run({ project }) {
        const {_id} = project;
        delete project._id;

        let oldProject = Projects.findOne({_id});

        //update fields in linked transactions
        let update = {$set:{}}, linkedDocUpdate = false;
        if(oldProject.name !== project.name){
            linkedDocUpdate = true;
            update.$set['project.name'] = project.name
        }
        //so if core fields changed then
        if(linkedDocUpdate){
            Transactions.update({'project._id': _id}, update, {multi: true})
        }
        return Projects.update(_id, {$set: project});
    }
});

export const remove = new ValidatedMethod({
    name: 'projects.remove',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to remove project'
    },
    validate: new SimpleSchema({
        'project': {
            type: Object
        },
        'project._id': {
            type: String
        }
    }).validator(),
    run({ project }) {
        if (!(Projects.find({owner: Meteor.userId()}).fetch().length > 1)) {
            throw new Meteor.Error(500, 'Invalid action! Single Project is mandatory,You cant remove it.');
        }
        else if(Transactions.findOne({'project._id': project._id})){
            throw new Meteor.Error(500, 'Invalid action! some transactions found with this Project, please update them with another Project.');
        }
        return Projects.remove(project._id);
    }
});

const PROJECTS_METHODS = _.pluck([
    insert,
    update,
    remove
], 'name');

if (Meteor.isServer) {
    DDPRateLimiter.addRule({
        name(name) {
            return _.contains(PROJECTS_METHODS, name);
        },

        // Rate limit per connection ID
        connectionId() { return true; }
    }, 5, 1000);
}
