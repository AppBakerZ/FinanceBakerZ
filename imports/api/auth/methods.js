// methods related to signUp and Login

import { Meteor } from 'meteor/meteor';
import { Accounts as MeteorAccounts } from 'meteor/accounts-base'
import { Accounts } from '../accounts/accounts.js';



MeteorAccounts.onCreateUser(function(options, user) {
    var account = {owner: user._id};
    //Inserting default bank account on signup
    Accounts.insert({owner: account.owner, bank: 'bank-Default', country: 'PK', purpose: 'Bank Account', icon: 'abc' });
    //Reset user object
    if (options.profile)
        user.profile = options.profile;

    return user;

});



MeteorAccounts.onLogin(function(){

    var userId = Meteor.user()._id;

    //Inserting default bank account on login
    if(!Accounts.findOne({owner: userId}))
        Accounts.insert({owner: userId, bank: 'bank-Default', country: 'PK', purpose: 'Bank Account', icon: 'abc' });

    //Inserting default currency on login
    if(Meteor.users.findOne( {_id: userId, 'profile.currency': { $exists: false } }))
        Meteor.users.update({ _id: userId}, { $set: { 'profile.currency': {symbol: "$", name: "Dollar", symbol_native: "$", decimal_digits: 2, rounding: 0}  }});

    //Setting email Notification to 'true' by default
    if(Meteor.users.findOne( {_id: userId, 'profile.emailNotificaton': { $exists: false } }))
        Meteor.users.update({ _id: userId}, { $set: { 'profile.emailNotification': true}});

});