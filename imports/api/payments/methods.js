import { Meteor } from 'meteor/meteor';
import { Match } from 'meteor/check';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';
import { Payments } from './payments.js';
import { easyPaisa } from './easypaisa'

export const insert = new ValidatedMethod({
    name: 'payments.insert',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to create expense'
    },
    validate: new SimpleSchema({
        'payment': {
            type: Object
        },
        'payment.status': {
            type: String
        },
        'payment.amount': {
            type: Number,
        },
        'payment.method': {
            type: String,
        },
        'payment.description': {
            type: String,
            optional: true
        },
    }).validator(),
    run({ payment }) {
        payment.userId = this.userId;
        // easyPaisa.maketestreqest((err, response) => {
        //     console.log('err', err);
        //     console.log('response', response)
        // });

        return Payments.insert(payment);
    }
});

const PAYMENTS_METHODS = _.pluck([
    insert,
], 'name');

if (Meteor.isServer) {
    DDPRateLimiter.addRule({
        name(name) {
            return _.contains(PAYMENTS_METHODS, name);
        },

        // Rate limit per connection ID
        connectionId() { return true; }
    }, 5, 1000);
}