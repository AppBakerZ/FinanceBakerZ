import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
    //send email with mailgun
    process.env.MAIL_URL = 'smtp://postmaster@timebakerz.com:09f608c679760541401045798ff263b1@smtp.mailgun.org:587';
});
