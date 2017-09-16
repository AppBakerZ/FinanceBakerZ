import { Meteor } from 'meteor/meteor';
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
            optional: true
        },
    }).validator(),
    run({ payment }) {
        payment.user = this.userId;
        // console.log(easyPaisa);

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