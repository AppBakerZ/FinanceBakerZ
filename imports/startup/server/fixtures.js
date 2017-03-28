// fill the DB with example data on startup

import { Meteor } from 'meteor/meteor';
import { Accounts } from '../../api/accounts/accounts.js';



function setGravatars() {
    let users = Meteor.users.find( { md5hash: { $exists: false } } );
    users.forEach( ( user ) => {
        console.log("user");
        console.log(user);
        if(user.emails.length)
        Meteor.users.update( { _id: user._id }, {
            $set: { "profile.md5hash": Gravatar.hash( user.emails[0].address ) }
        });
    });
}





// if the database is empty on server start, create some sample data.
Meteor.startup(() => {
    setGravatars()
});