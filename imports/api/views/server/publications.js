import { Meteor } from 'meteor/meteor';
import { Views } from '../views';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

Meteor.publish('views', function(limit){
    new SimpleSchema({
        limit: {type: Number}
    }).validate({limit});

    return Views.find();
});