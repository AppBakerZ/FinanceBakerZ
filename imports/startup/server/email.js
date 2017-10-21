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
            SSR.compileTemplate('emailLayout', Assets.getText('emailLayout.html'));
            SSR.compileTemplate('test', Assets.getText('test.html'));
            Template.emailLayout.helpers({
                getDocType: function() {
                    return "<!DOCTYPE html>";
                }
            });
            let css = Assets.getText('bootstrap.min.css');
            let customStyle = Assets.getText('forgotPassword.css');
            let Group = Assets.getText('Group.png');
            let footerLogo = Assets.getText('footer-logo.png');
            let data = {
                css,
                customStyle,
            };
            return SSR.render('emailLayout', {
                css: css,
                customStyle,
                template: "test",
                Group,
                footerLogo,
                data: {
                    Group,
                    footerLogo
                },
            });
        }
    }
});
