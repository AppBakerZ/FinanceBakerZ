import { Meteor } from 'meteor/meteor';
import { Match } from 'meteor/check';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';
import { Logs } from './logs';

export const insert = new ValidatedMethod({
    name: 'logs.insert',
    validate: new SimpleSchema({
        'log': {
            type: Object
        },
        'log.level': {
            type: String
        },
        'log.log': {
            type: String,
            optional: true
        },
        'log.meta': {
            type: String,
            optional: true
        },
    }).validator(),
    run({ log }) {
        log.userId = this.userId;
        return Logs.insert(log);
    }
});

// if (Meteor.isServer) {
//     DDPRateLimiter.addRule({
//         name(name) {
//             return _.contains(PAYMENTS_METHODS, name);
//         },
//
//         // Rate limit per connection ID
//         connectionId() { return true; }
//     }, 5, 1000);
// }