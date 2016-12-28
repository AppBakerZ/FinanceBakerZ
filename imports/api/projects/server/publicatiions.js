import { Meteor } from 'meteor/meteor';
import { Projects } from '../projects.js';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

Meteor.publish('projects.all', function(){
    return Projects.find(
        {
            owner: this.userId
        }, {fields: {name: 1}});
});


Meteor.publish('projects', function(query){
    new SimpleSchema({
        query: {type: Object},
        'query.limit' :{
            type : Number
        },
        'query.name' :{
            type : Object,
            optional: true
        },
        'query.name.$regex' :{
            type : String,
            optional: true
        },
        'query.client.name' :{
            type : Object,
            optional: true
        },
        'query.client.name.$regex' :{
            type : String,
            optional: true
        },
        'query.status' :{
            type : String,
            optional: true
        }
    }).validate({query});
    let options = {
        limit: query.limit,
        sort: {
            startAt: -1
        }
    };

    query.owner =  this.userId;

    delete query.limit;

    return Projects.find(query, options);
});