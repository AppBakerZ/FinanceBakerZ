// methods related to settings

import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';

export const updateAccount = new ValidatedMethod({
    name: 'settings.updateAccount',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to create currency'
    },
    validate: new SimpleSchema({
        'settings': {
            type : Object
        },
        'settings.currency': {
            type : Object
        },
        'settings.currency.label': {
            type : String
        },
        'settings.currency.value': {
            type : String
        },
        'settings.language': {
            type : Object
        },
        'settings.language.label': {
            type : String
        },
        'settings.language.value': {
            type : String
        },
        'settings.language.direction': {
            type : String
        }
    }).validator(),
    run({ settings }) {

        let query = {};

        if(settings.language)
            query['profile.language'] = settings.language;

        if(settings.currency)
            query['profile.currency'] = settings.currency;

            Meteor.users.update({
                _id: this.userId
            }, {
                $set: query
            });
    }
});



export const updateProfile = new ValidatedMethod({
    name: 'settings.updateProfile',
    mixins: [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to update profile'
    },
    validate: new SimpleSchema({
        'users': {
            type: Object
        },
        'users.name': {
            type: String
        },
        'users.username': {
            type: String,
            optional: true
        },
        'users.number': {
            type: String
        },
        'users.email': {
            type: String,
            optional: true
        },
        'users.address': {
            type: String
        },
        'users.imageUrl': {
            type: String,
            optional: true
        }
    }).validator(),
    run({ users }) {
        if(!users.username && !users.email){
            throw new Meteor.Error(500, 'You cannot empty the username/email.');
        }
        let alreadyExists = Meteor.users.findOne({'emails.address': users.email});
        if(alreadyExists && alreadyExists._id !== Meteor.user()._id){
            throw new Meteor.Error(500, 'Email already attached with another Account');
        }
        let update = {'profile.fullName': users.name, 'profile.address': users.address , 'profile.contactNumber': users.number};
        if(users.username) {
            update['username'] = users.username;
        }
        if(users.email) {
            update['emails.0.address'] = users.email;
        }
        if(users.imageUrl) {
            update['profile.avatar'] = users.imageUrl;
        }
        Meteor.users.update({_id: Meteor.userId()} , {$set: update});

        if(users.email){
            Meteor.users.update( { _id: Meteor.user()._id }, {
                   $set: { 'profile.md5hash': Gravatar.hash( users.email ) }
                     });
        }
    }
});

export const updateProfileImage = new ValidatedMethod({
    name: 'settings.updateProfileImage',
    mixins: [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to update profile'
    },
    validate: new SimpleSchema({
        'users': {
            type: Object
        },
        'users.imageUrl': {
            type: String,
            optional: true
        }
    }).validator(),
    run({ users }) {
        Meteor.users.update({_id: Meteor.userId()} , {$set: {'profile.avatar': users.imageUrl}});
    }
});

export const updateUserProfile = new ValidatedMethod({
    name: 'settings.updateUserProfile',
    mixins: [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to update profile'
    },
    validate: new SimpleSchema({
        'users': {
            type: Object
        },
        'users.name': {
            type: String
        },
        'users.username': {
            type: String,
            optional: true
        },
        'users.number': {
            type: String
        },
        'users.email': {
            type: String,
            optional: true
        },
        'users.address': {
            type: String
        },
        'users.imageUrl': {
            type: String,
            optional: true
        },
        'users.currency': {
            type : Object
        },
        'users.currency.label': {
            type : String
        },
        'users.currency.value': {
            type : String
        },
        'users.language': {
            type : Object
        },
        'users.language.label': {
            type : String
        },
        'users.language.value': {
            type : String
        },
        'users.language.direction': {
            type : String
        },
        'users.check1': {
            type: Boolean
        }
    }).validator(),
    run({ users }) {
        if(!users.username && !users.email){
            throw new Meteor.Error(500, 'You cannot empty the username/email.');
        }
        let alreadyExists = Meteor.users.findOne({'emails.address': users.email});
        if(alreadyExists && alreadyExists._id !== Meteor.user()._id){
            throw new Meteor.Error(500, 'Email already attached with another Account');
        }
        let update = {'profile.fullName': users.name, 'profile.address': users.address , 'profile.contactNumber': users.number};
        if(users.username) {
            update['username'] = users.username;
        }
        if(users.email) {
            update['emails.0.address'] = users.email;
        }
        if(users.imageUrl) {
            update['profile.avatar'] = users.imageUrl;
        }

        if(users.language){
            update['profile.language'] = users.language;
        }

        if(users.currency){
            update['profile.currency'] = users.currency;
        }
        update['profile.emailNotification'] = users.check1;

        Meteor.users.update({_id: Meteor.userId()} , {$set: update});

        if(users.email){
            Meteor.users.update( { _id: Meteor.user()._id }, {
                $set: { 'profile.md5hash': Gravatar.hash( users.email ) }
            });
        }
    }
});

const SETTINGS_METHODS = _.pluck([
    updateAccount,
    updateProfile
], 'name');

if (Meteor.isServer) {
    DDPRateLimiter.addRule({
        name(name) {
            return _.contains(SETTINGS_METHODS, name);
        },

        // Rate limit per connection ID
        connectionId() { return true; }
    }, 5, 1000);
}
