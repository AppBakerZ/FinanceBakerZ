import { Accounts } from './../api/accounts/accounts';
import { Categories } from './../api/categories/categories';
import { Incomes } from './../api/incomes/incomes.js';
import { Expenses } from './../api/expences/expenses';
import { Projects } from './../api/projects/projects';
import { Logs } from '../api/logs/logs'
import { _ } from 'meteor/underscore';
// TODO: insert have some more checks
let applicableActions = ['insert', 'update', 'remove'];
let Collections = {
    Accounts: Accounts,
    Categories: Categories,
    Incomes: Incomes,
    Expenses: Expenses,
    Projects: Projects,
    Logs: Logs
};
//@MethodName comes as 'project.insert'
export const actions = (methodName, paramsArray, isInsert) => {
    let params, splitMethod, collection, action, currentCollection, doc, keys, docId,
        length = applicableActions.length;
    while( length-- ) {
        if ( methodName.indexOf(applicableActions[length]) !==-1 ) {

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

            //dynamic collection name for querying record
            currentCollection = Collections[capitalize(collection)];
            doc = currentCollection.findOne({
                _id: docId
            });

            //add collection key to flexible query afterwards
            doc.collection = collection;
            return doc
        }
    }
};

//Capitalize Method name to match Collection name
let capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);