import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

/*
that method added to retrieve email from given token and send password change mail to that user
*/
export const getUserEmail = new ValidatedMethod({
    name: 'users.retrieveEmail',
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to create transaction'
    },
    validate: new SimpleSchema({
        'users': {
            type: Object
        },
        'users.token': {
            type: String
        },
    }).validator(),
    run({ users }) {
        let { token } = users;
        let user = Meteor.users.findOne({
            'services.password.reset.token': token
        });
        if(user){
            return user.emails[0].address
        }

    }
});