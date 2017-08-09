// methods related to companies

import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';

import { Categories } from './categories.js';

export const insert = new ValidatedMethod({
    name: 'categories.insert',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to create category'
    },
    validate: new SimpleSchema({
        'category': {
            type: Object
        },
        'category.name': {
            type: String
        },
        'category.icon': {
            type: String
        },
        'category.parent': {
            type: Object,
            optional: true
        },
        'category.parent.name': {
            type: String,
            optional: true
        },
        'category.parent.id': {
            type: String,
            optional: true
        }
    }).validator(),
    run({ category }) {
        // Set Owner of category
        category.owner = this.userId;
        let CategoryName = category.name;
        const { parent } = category;
        let CategoryId = Categories.insert(category);

        //save a copy for parent update
        if(parent){
            let { id } = category.parent;
            if(id){
                return Categories.update({
                    _id: id, owner: this.userId
                }, {
                    $addToSet : {
                        children: {
                            id: CategoryId,
                            name: CategoryName
                        }
                    }
                });
            }
            //fallback code for old records
            else{
                return Categories.update({
                    name: parent, owner: this.userId
                }, {
                    $addToSet : {
                        children: {
                            id: CategoryId,
                            name: CategoryName
                        }
                    }
                });
            }
        }
        // return CategoryId
        return CategoryId
    }
});

export const update = new ValidatedMethod({
    name: 'categories.update',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to update category'
    },
    validate: new SimpleSchema({
        'category': {
            type: Object
        },
        'category._id': {
            type: String
        },
        'category.name': {
            type: String
        },
        'category.icon': {
            type: String
        },
        'category.parent': {
            type: Object,
            optional: true
        },
        'category.parent.name': {
            type: String,
            optional: true
        },
        'category.parent.id': {
            type: String,
            optional: true
        }
    }).validator(),
    run({ category }) {
        let {_id, name, icon, parent} = category;
        let type = 'name', oldParent, newParent = parent;
        const oldCategory = Categories.findOne(_id);
        if(parent && parent.id){
            parent = parent.id;
            type = '_id'
        }
        if(oldCategory.parent && oldCategory.parent.id){
            oldParent = oldCategory.parent.id;
        }
        else{
            oldParent = oldCategory.parent
        }

        if(oldParent !== parent || oldCategory.name !== name){
            //if found any old value then omit
            Categories.update({[type]: parent, owner: this.userId}, {$pull: {"children": oldCategory.name}});
            Categories.update({'children.id': _id, owner: this.userId}, {$pull: {"children": {id: _id}}});
            Categories.update({[type]: parent, owner: this.userId}, {$pull: {"children": {id: _id}}});
            Categories.update({[type]: parent, owner: this.userId}, {$addToSet : {
                children: {
                    id: _id,
                    name: name
                }
            }});
        }

        // if(oldCategory.parent !== parent || oldCategory.name !== name){
        //     Categories.update({name: oldCategory.parent, owner: this.userId}, {$pull: {children: oldCategory.name}});
        //     Categories.update({name: parent, owner: this.userId}, {$addToSet : {children: name}});
        // }

        return Categories.update({_id, owner: this.userId}, {$set: {name, icon, parent: newParent}})
    }
});

export const removeFromParent = new ValidatedMethod({
    name: 'categories.removeFromParent',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to remove category'
    },
    validate: new SimpleSchema({
        'category': {
            type: Object
        },
        'category.name': {
            type: String
        },
        'category._id': {
            type: String
        }
    }).validator(),
    run({ category }) {
        const { _id, name } = category;
        Categories.update({_id, owner: this.userId}, {$set: {parent: null}});
        if(_id){
            Categories.update({'children.id': _id, owner: this.userId}, {$pull: {"children": {id: _id}}});
        }
        //fall back for old code
        else{
            Categories.update({children: name, owner: this.userId}, {$pull: {"children": name}});
        }

    }
});

export const remove = new ValidatedMethod({
    name: 'categories.remove',
    mixins : [LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged',
        message: 'You need to be logged in to remove category'
    },
    validate: new SimpleSchema({
        'category': {
            type: Object
        },
        'category._id': {
            type: String
        },
        'category.name': {
            type: String
        },
        'category.parent': {
            type: String,
            optional: true
        },
        'category.ids': {
            type: [String],
            optional: true
        },
        'category.names': {
            type: [String],
            optional: true
        }
    }).validator(),
    run({ category }) {
        const {_id, parent, name, ids, names} = category;
        //remove it as parent category from children by Ids
        ids && removeParent(category.ids, '_id');

        //fallback by names for old records
        names && removeParent(category.names, 'name');
        if(parent){
            Categories.update({'children.id': _id, name: parent, owner: this.userId}, {$pull: {"children": {id: _id}}});
        }

        return Categories.remove(_id);
    }
});

let removeParent =(childrens, type) =>{
    childrens.forEach((cat) => {
        Categories.update({
            [type]: cat
        },{
            $set: {
                parent: null
            }
        })
    })

};
const CATEGORIES_METHODS = _.pluck([
    insert,
    update,
    remove
], 'name');

if (Meteor.isServer) {
    DDPRateLimiter.addRule({
        name(name) {
            return _.contains(CATEGORIES_METHODS, name);
        },

        // Rate limit per connection ID
        connectionId() { return true; }
    }, 5, 1000);
}
