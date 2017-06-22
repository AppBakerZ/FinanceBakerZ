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
    console.log('level', level);
    console.log('msg', msg);
    console.log('meta', meta);
    Meteor.call('logs.insert',{name: 'test'}, (err, response) => {
        console.log('err', err);
        console.log('res', response);
    })
});