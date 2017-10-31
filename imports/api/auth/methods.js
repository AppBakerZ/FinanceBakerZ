// methods related to signUp and Login

import { Accounts as MeteorAccounts } from 'meteor/accounts-base'
import { Accounts } from '../accounts/accounts.js';
import { Categories } from '../categories/categories.js';
import { Projects } from '../projects/projects.js';

//import config
import { AppConfig } from '../../utils/config.js'

MeteorAccounts.onCreateUser(function(options, user) {
    console.log("************", options)
    let account = {owner: user._id};
    //Inserting default bank account on signup
    Accounts.insert({
        owner: account.owner,
        bank: 'bank-Gullak-Bank',
        country: 'PK',
        purpose: 'Bank Account',
        icon: 'abc'
    });
    Categories.insert({
        owner: account.owner,
        name: 'Default Category',
        icon: 'icon-icons_building'
    });
    Projects.insert({
        owner: account.owner,
        name: 'Default Project',
        description: 'Default Project',
        type: 'fixed', status: 'progress',
        startAt: new Date()
    });
   // Reset user object
    if (options.profile) {
        //add plan from here untill it will be implemented in front end
        if (!options.profile.businessPlan) {
            options.profile.businessPlan = AppConfig.availablePlans[0];
        }
        user.profile = options.profile;
    }

    if(user.emails && user.emails.length){
        user.profile.md5hash = Gravatar.hash(user.emails[0].address);
        let obj = {
            email: {
                to: user.emails[0].address,
                subject: 'Welcome to FinanceBakerz',
                template: 'welcomeEmail.html',
                data: {
                    fullName: options.profile && options.profile.fullName,
                },
            }
        };
        Meteor.call('emails.send', obj, function(err, res){
            console.log(err)
            console.log(res)
        });
    }
    else{
        user.emails = []
    }

    return user;

});