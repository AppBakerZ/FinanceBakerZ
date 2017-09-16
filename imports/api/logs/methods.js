import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
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
        'log.params': {
            type: Object,
            blackbox: true,
            optional: true
        },
        'log.details': {
            type: Object,
            blackbox: true,
            optional: true
        },
        'log.record': {
            type: Object,
            blackbox: true,
            optional: true
        },
        'log.timeStamp': {
            type: Date,
        },
    }).validator(),
    run({ log }) {
        log.userId = log.log && log.log.split('user=')[1];
        return Logs.insert(log);
    }
});