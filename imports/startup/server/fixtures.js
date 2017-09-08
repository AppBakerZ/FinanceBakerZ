// fill the DB with example data on startup

import { Meteor } from 'meteor/meteor';
import { Categories } from '/imports/api/categories/categories.js'
import { Projects } from '/imports/api/projects/projects.js'



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
    //TODO: remove below code after one time deployment
    let availableUsers = Meteor.users.find().fetch();
    if(availableUsers && availableUsers.length){
        availableUsers.forEach((user) => {
            if(!Categories.findOne({owner: user._id})){
                Categories.insert({owner: user._id, name: 'Default Category', icon: 'icon-icons_building' });
            }
            if(!Projects.findOne({owner: user._id})){
                Projects.insert({owner: user._id, name: 'Default Project', type: 'fixed', status: 'progress', startAt: new Date()});
            }
        })
    }

    setGravatars();
});