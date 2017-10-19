import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
    //send email with mailgun
    process.env.MAIL_URL = `smtp://${encodeURIComponent(Meteor.settings.SESUser)}:${encodeURIComponent(Meteor.settings.SESPASSWORD)}@email-smtp.us-east-1.amazonaws.com:465`;
});
