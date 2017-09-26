Meteor.startup(() => {
    let sslRootCAs = require('ssl-root-cas/latest');
    sslRootCAs.inject();
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
});
