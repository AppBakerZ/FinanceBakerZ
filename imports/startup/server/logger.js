import { logger } from "/imports/utils/logger";
import { actions } from "/imports/utils/catchActions"
import { _ } from 'meteor/underscore';

let wrapMethodsForLogs;

// here we wrap all method for logs
wrapMethodsForLogs = function(name, originalHandler, methodMap) {
    return methodMap[name] = function() {
        let  ex, params, result, filterParams, meta = {};
        try {
            params = _.toArray(arguments);
            filterParams = _.compact(params);
            let isUserCollection = name.indexOf('settings') !== -1;
            if(!(name.indexOf('insert') !== -1) ){
                meta.doc = actions(name, params, false, isUserCollection)
            }
            result = originalHandler.apply(this, params);

            //here insert block goes
            if( name.indexOf('insert') !== -1 ){
                meta.doc = actions(name, result, true, isUserCollection);
            }
            meta.params = filterParams;
            logger.info(`Event: ${name} user=${this.userId}`, meta);
            return result;
        } catch (error) {
            ex = error;
            logger.error(`Error: ${name} user=${this.userId}`, ex);
            throw ex;
        }
    };
};

init_method_logger = () => {
    //here excluded methods goes
    let excludesMethods = ['logs.insert', 'login', 'Mongol', 'MeteorToys', 'statistics', 'copyTransactions'];
    _.each(Meteor.default_server.method_handlers, (handler, name) => {

        if (new RegExp((excludesMethods.join("|"))).test(name)){
            //do nothing
        }
        else{
            wrapMethodsForLogs(name, handler, Meteor.default_server.method_handlers)
        }
    })
};

//init logger
init_method_logger();

Accounts.onLogin(function(options){
    logger.info(`Event: LOGIN user=${options.user._id}`, [])
});