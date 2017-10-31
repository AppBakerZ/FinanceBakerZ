import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Email } from 'meteor/email';
import { _ } from 'underscore';

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
        'email.data': {
            type: Object,
            optional: true,
            blackbox: true
        },
    }).validator(),
    run({ email }) {
        let { to, template, subject, data } = email;
        let user = Meteor.users.findOne({'emails.address': to});
        let templateData = {
            userName: user && user.profile.fullName
        };
        if(data){
            _.extend(templateData, data)
        }

        SSR.compileTemplate( template, Assets.getText( template ));

        Accounts.emailTemplates.from = "FinanceBakerz <no-reply@financebakerz.com>";
        this.unblock();
        Email.send({
            to: to,
            from: 'no-reply@financebakerz.com',
            subject: subject,
            html: SSR.render( template, templateData )
        });
    }
});