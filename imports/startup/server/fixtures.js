// fill the DB with example data on startup

import { Meteor } from 'meteor/meteor';
import { Reports } from "/imports/api/reports/reports";


function setGravatars() {
    let users = Meteor.users.find( { md5hash: { $exists: false } } );
    users.forEach( ( user ) => {
        if(user.emails && user.emails.length)
        Meteor.users.update( { _id: user._id }, {
            $set: { "profile.md5hash": Gravatar.hash( user.emails[0].address ) }
        });
    });
}





// if the database is empty on server start, create some sample data.
Meteor.startup(() => {
    setGravatars();
    //TODO: delete that line after successful deployment once
    Reports.rawCollection().dropIndexes();
});