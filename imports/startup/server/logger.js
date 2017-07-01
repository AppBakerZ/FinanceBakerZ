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
            meta.doc = actions(name, params);
            // console.log('meta.doc', meta.doc)
            //from here we are sending utils meta data
            result = originalHandler.apply(this, params);
            meta.params = filterParams;
            // meta.doc = actions(params);
            logger.info(`Event: ${name} user=${this.userId}`, meta);
            // console.log(method);
            // console.log('===result===');
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
    let excludesMethods = ['logs.insert', 'login', 'Mongol_verifyDoc'];
    _.each(Meteor.default_server.method_handlers, (handler, name) => {
        //ignore all meteor Toys method from logging
        if( _.contains(excludesMethods, name) || name.indexOf('MeteorToys') !== -1 ){
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