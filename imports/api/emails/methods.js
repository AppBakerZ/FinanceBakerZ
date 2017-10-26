import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Email } from 'meteor/email';

export const sendEmail = new ValidatedMethod({
    name: 'emails.send',
    validate: new SimpleSchema({
        'email': {
            type: Object
        },
        'email.to': {
            type: String
        },
        'email.from': {
            type: String
        },
    }).validator(),
    run({ email }) {
        let { from, to } = email;
        console.log(from);
        console.log(to);
        if(Meteor.isServer){
            this.unblock();
            Email.send({
                to: 'raza2022@gmail.com',
                from: 'no-reply@financebakerz.com',
                subject: 'Hello from Meteor!',
                html: 'This is a test of Email.send.'
            });
        }

    }
});