//export logger as es6 format
import winston from 'winston'

let modifiedConsole = new winston.transports.Console({
    name: "console",
    timestamp: true
});

export const logger = new winston.Logger({
    transports: [
        modifiedConsole,
    ]
});

logger.on('logging', function (transport, level, msg, meta) {
    Meteor.call('logs.insert', {
        log:{
            level: level,
            log: msg,
            meta: ''
        }
    }, (err, response) => {
    })
});