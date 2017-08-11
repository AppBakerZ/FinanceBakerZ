import { Accounts } from './../api/accounts/accounts';
import { Categories } from './../api/categories/categories';
import { Transactions } from './../api/transactions/transactions';
import { Projects } from './../api/projects/projects';
import { Logs } from '../api/logs/logs'
import { _ } from 'meteor/underscore';
let applicableActions = ['insert', 'update', 'remove'];
let Collections = {
    Accounts: Accounts,
    Categories: Categories,
    Transactions: Transactions,
    Projects: Projects,
    Logs: Logs
};
//@MethodName comes as 'project.insert'
export const actions = (methodName, paramsArray, isInsert, isUserSettings) => {
    let params, splitMethod, collection, action, currentCollection, doc, keys, docId,
        length = applicableActions.length;
    while( length-- ) {
        if ( methodName.indexOf(applicableActions[length]) !== -1 ) {

            //the original params comes at 0 index
            if( paramsArray instanceof Array ){
                params = paramsArray[0] || {};
            }

            //so split method and action sample @MethodName
            splitMethod = methodName.split('.');
            collection = splitMethod[0];
            action = splitMethod[1];

            //params look like "{ project: { _id: 'qMrEfkJ5gHwfvQq7A' } }" so parse params to get _id
            if( !isInsert ){
                keys = _.keys(params)[0];
                docId = keys && params[keys]._id;
            }
            //here direct doc id return in params in case of insertion
            else {
                docId = paramsArray
            }

            //check whether the method is related to settings
            if( isUserSettings ){
                docId = Meteor.userId();
                currentCollection = Meteor.users
            }
            else{
                currentCollection = Collections[capitalize(collection)];
            }
            if(docId) {
                doc = currentCollection.findOne({
                    _id: docId
                });
            }
            else{
                if(params){
                    doc = currentCollection.findOne( params[keys] );
                }
            }
            //add collection key to flexible query afterwards
            // TODO: check why doc undefined in some situations e.g category
            if(doc){
                doc.collection = collection
            }
            return doc
        }
    }
};

//Capitalize Method name to match Collection name
let capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);