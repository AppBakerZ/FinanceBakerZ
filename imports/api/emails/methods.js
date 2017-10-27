import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
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
        'email.subject': {
            type: String
        },
        'email.template': {
            type: String
        },
    }).validator(),
    run({ email }) {
        let { to, template, subject } = email;
        let user = Meteor.users.findOne({'emails.address': "raza2022@gmail.com"});
        let data = {
            userName: user && user.profile.fullName
        };

        SSR.compileTemplate( template, Assets.getText( template ));

        Accounts.emailTemplates.from = "FinanceBakerz <no-reply@financebakerz.com>";
        this.unblock();
        Email.send({
            to: to,
            from: 'no-reply@financebakerz.com',
            subject: subject,
            html: SSR.render( template, data )
        });
    }
});