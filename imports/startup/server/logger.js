import { logger } from "/imports/logger";

Accounts.onLogin(function(options){
    logger.info(`Event: USER_LOGIN user=${options.user._id}`)
});

Accounts.onLogout(function(options){
    logger.info(`Event: USER_LOGOUT user=${options.user._id}`)
});