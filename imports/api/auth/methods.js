// methods related to signUp and Login

import { Accounts as MeteorAccounts } from 'meteor/accounts-base'
import { Accounts } from '../accounts/accounts.js';
import { Categories } from '../categories/categories.js';
import { Projects } from '../projects/projects.js';



MeteorAccounts.onCreateUser(function(options, user) {
    let account = {owner: user._id};
    //Inserting default bank account on signup
    Accounts.insert({owner: account.owner, bank: 'bank-Gullak-Bank', country: 'PK', purpose: 'Bank Account', icon: 'abc' });
    Categories.insert({owner: account.owner, name: 'Default Category', icon: 'icon-icons_building' });
    Projects.insert({owner: account.owner, name: 'Default Project', type: 'fixed', status: 'progress', startAt: new Date()});
   // Reset user object
    if (options.profile)
        user.profile = options.profile;
    if(user.emails && user.emails.length)
        user.profile.md5hash = Gravatar.hash(user.emails[0].address);
    return user;

});