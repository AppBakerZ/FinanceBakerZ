import { logger } from "/imports/logger";
import { _ } from 'meteor/underscore';


let wrapMethodsForLogs, loggingStarted;

// here we wrap all method for logs
wrapMethodsForLogs = function(name, originalHandler, methodMap) {
    return methodMap[name] = function() {
        let  ex, params, result, filterParams;
        try {
            params = _.toArray(arguments);
            filterParams = _.compact(params);
            //from here we are sending logger meta data
            logger.info(`Event: ${name} user=${this.userId}`, filterParams);
            result = originalHandler.apply(this, params);
            return result;
        } catch (error) {
            ex = error;
            logger.error(`Error: ${name} user=${this.userId}`, ex);
            throw ex;
        }
    };
};

init_method_logger = () => {
    //here methods logged
    _.each(Meteor.default_server.method_handlers, (handler, name) =>{
        //ignore the log insert self method to prevent infinite loop
        if( name === 'logs.insert' || name.indexOf('MeteorToys') !== -1 ){
            //do nothing
        }
        else{
            wrapMethodsForLogs(name, handler, Meteor.default_server.method_handlers)
        }
    })


};

if( !loggingStarted ){
    init_method_logger();
    loggingStarted = true;
}