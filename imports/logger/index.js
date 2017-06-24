//export logger as es6 format
import winston from 'winston'
const si = require('systeminformation');
let details = {};

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
    si.getStaticData(data => {
        details.platform = data.os.platform;
        details.version = data.os.distro;
        details.arch = data.os.arch;
        details.ip4 = data.net[0].ip4;
        details.ip6 = data.net[0].ip6;
        details.mac = data.net[1].mac;
        Meteor.call('logs.insert', {
            log:{
                level: level,
                log: msg,
                meta: '',
                details: details
            }
        }, (err, response) => {
        })
    });


});