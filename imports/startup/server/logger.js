import { logger } from "/imports/logger";
import { _ } from 'meteor/underscore';


let wrapMethodsForLogs, loggingStarted;

// here we wrap all method for logs
wrapMethodsForLogs = function(name, originalHandler, methodMap) {
    return methodMap[name] = function() {
        let  ex, params, result;
        try {
            params = _.toArray(arguments);
            //from here we are sending params in meta data
            logger.info(`Event: ${name} user=${this.userId}`, params);
            result = originalHandler.apply(this, params);
            return result;
        } catch (error) {
            ex = error;
            logger.error(ex);
            throw ex;
        }
    };
};

init_method_logger = () => {
    //here methods logged
    _.each(Meteor.default_server.method_handlers, (handler, name) =>{
        wrapMethodsForLogs(name, handler, Meteor.default_server.method_handlers)
    })


};

if( !loggingStarted ){
    init_method_logger();
    loggingStarted = true;
}