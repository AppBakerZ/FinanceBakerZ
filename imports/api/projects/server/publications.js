import { Meteor } from 'meteor/meteor';
import { Projects } from '../projects.js';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'underscore'

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
        'query.skip' :{
            type : Number,
            optional:true
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
        skip: query.skip || 0,
        limit: query.limit,
        sort: {
            startAt: -1
        }
    };

    query.owner =  this.userId;

    query = _.omit(query, (value) => {
        //if empty obj then neglect it
        if(_.isObject(value)) {
            return !_.keys(value).length
        }
        //remove empty values too
        return !value
    });

    delete query.limit;
    delete query.skip;

    return [
        new Counter('projectsCount', Projects.find(query, {
            sort: {
                startAt: -1
            }
        })),
        Projects.find(query, options)
    ]
});

Meteor.publish('projects.single', function (id) {
    return Projects.find({
        owner: this.userId,
        _id: id
    });
});