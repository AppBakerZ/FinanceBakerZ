import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base'

Meteor.startup(() => {
    process.env.MAIL_URL = `smtp://${encodeURIComponent(Meteor.settings.SESUser)}:${encodeURIComponent(Meteor.settings.SESPASSWORD)}@email-smtp.us-east-1.amazonaws.com:465`;
    Accounts.emailTemplates.from = "FinanceBakerz <no-reply@financebakerz.com>";
    Accounts.urls.resetPassword = function(token) {
        return Meteor.absoluteUrl('forgotPassword/' + token);
    };
    Accounts.emailTemplates.resetPassword = {

        subject() {
            return "Reset Password Request!";
        },
        html(user, url) {
            //get precompiled template which compiled with http://premailer.dialect.ca/
            //the below one has better formatting in different cases
            // http://www.mailermailer.com/resources/tools/magic-css-inliner-tool.rwp
            SSR.compileTemplate('compiled', Assets.getText('compiled.html'));
            let data = {
                url,
                userName: user.profile.fullName
            };
            //then render the compiled template with data
            return SSR.render('compiled', data )
        }
    }
});
