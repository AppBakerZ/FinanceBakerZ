// fill the DB with example data on startup

import { Meteor } from 'meteor/meteor';
import { Accounts } from '../../api/accounts/accounts.js';
import { Slingshot } from 'meteor/edgee:slingshot'



// if the database is empty on server start, create some sample data.
Meteor.startup(() => {
    Slingshot.fileRestrictions("imageUploader", {
        allowedFileTypes: ["image/png", "image/jpeg", "image/jpg"],
        maxSize: 2 * 500 * 500 // 2 MB (use null for unlimited)
    });


    Slingshot.createDirective("imageUploader", Slingshot.S3Storage, {
        bucket: "financebakerz", // change this to your s3's bucket name

        acl: "public-read",

        authorize: function (file, metaContext) {

            //Deny uploads if user is not logged in.
            if (!this.userId) {
                var message = "Please login before posting files";
                throw new Meteor.Error("Login Required", message);
            }

            return true;
        },
        key: function (file, metaContext) {
            // image url with ._id attached:

            return metaContext.uploaderId + "/" + Date.now() + "-" + file.name.replace(/\s/g, '_');
        }
    });

});