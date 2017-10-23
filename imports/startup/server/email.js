import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base'

Meteor.startup(() => {
    process.env.MAIL_URL = `smtp://${encodeURIComponent(Meteor.settings.SESUser)}:${encodeURIComponent(Meteor.settings.SESPASSWORD)}@email-smtp.us-east-1.amazonaws.com:465`;
    Accounts.emailTemplates.from = "Finance Bakerz <no-reply@financebakerz.com>"
    Accounts.urls.resetPassword = function(token) {
        return Meteor.absoluteUrl('forgotPassword/' + token);
    };
    Accounts.emailTemplates.resetPassword = {

        subject() {
            return "Reset Password Request!";
        },
        html(user, url) {
            SSR.compileTemplate('compiled', Assets.getText('compiled.html'));
            // let html = Assets.getText('compiled.html')
            // SSR.compileTemplate('compiled', Assets.getText('compiled.html'));
            // Template.emailLayout.helpers({
            //     getDocType: function() {
            //         return "<!DOCTYPE html>";
            //     }
            // });
            //
            // let htmlString = SSR.render('emailLayout', {
            //     template: "compiled",
            //     data: {
            //         url
            //     },
            // });
            // console.log(html);
            return SSR.render( 'compiled', {url} )
        }
    }
});
