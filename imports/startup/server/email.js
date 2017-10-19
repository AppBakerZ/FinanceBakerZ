import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base'

Meteor.startup(() => {
    process.env.MAIL_URL = `smtp://${encodeURIComponent(Meteor.settings.SESUser)}:${encodeURIComponent(Meteor.settings.SESPASSWORD)}@email-smtp.us-east-1.amazonaws.com:465`;
    Accounts.emailTemplates.from = "Finance Bakerz <no-reply@financebakerz.com>"
    Accounts.urls.resetPassword = function(token) {
        return Meteor.absoluteUrl('forgotPassword/' + token);
    };
});
