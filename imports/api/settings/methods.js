// methods related to companies

import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';

export const updateAccountSettings = new ValidatedMethod({
    name: 'updateAccountSettings',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to create currency'
    },
    validate: new SimpleSchema({
        "settings": {
            type : Object
        },
        "settings.currencyObj": {
            type : Object
        },
        "settings.languageSelected": {
            type : String
        },
        "settings.currencyObj.symbol": {
            type : String
        },
        "settings.currencyObj.name": {
            type : String
        },
        "settings.currencyObj.symbol_native": {
            type : String
        },
        "settings.currencyObj.decimal_digits": {
            type : Number
        },
        "settings.currencyObj.rounding": {
            type : Number
        },
        "settings.currencyObj.code": {
            type : String
        },
        "settings.currencyObj.value": {
            type : String
        },
        "settings.currencyObj.name_plural": {
            type : String
        }
    }).validator(),
    run({ settings }) {
      Meteor.users.update({_id: Meteor.userId()}, {$set: {"profile.currency": settings.currencyObj , "profile.language":settings.languageSelected }});
    }
});



export const updateProfile = new ValidatedMethod({
    name: 'updateProfile',
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
            type: String
        },
        'users.number': {
            type: String
        },
        'users.email': {
            type: String
        },
        'users.address': {
            type: String
        }
    }).validator(),
    run({ users }) {
        if(!users.username && !users.email){
            throw new Meteor.Error(500, 'You cannot empty the username/email.');
        }
        let update = {'profile.fullName': users.name, 'profile.address': users.address , 'profile.contactNumber': users.number};
        users.username ? update['username'] = users.username : update['emails.0.address'] = users.email;
        Meteor.users.update({_id: Meteor.userId()} , {$set: update});
    }
});

