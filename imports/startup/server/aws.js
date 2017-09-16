import { Meteor } from 'meteor/meteor';
import { Slingshot } from 'meteor/edgee:slingshot'

Meteor.startup(() => {
    Slingshot.fileRestrictions("imageUploader", {
        allowedFileTypes: ["image/png", "image/jpeg", "image/jpg"],
        maxSize: 4 * 1024 * 1024 // 4 MB (use null for unlimited).
    });


    Slingshot.createDirective("imageUploader", Slingshot.S3Storage, {
        bucket: "financebakerz", // change this to your s3's bucket name

        acl: "public-read",

        authorize: function (file, metaContext) {

            //Deny uploads if user is not logged in.
            if (!this.userId) {
                let message = "Please login before posting files";
                throw new Meteor.Error("Login Required", message);
            }

            return true;
        },
        key: function (file, metaContext) {
            // image url with ._id attached:
            return metaContext.uploaderId + "/" + metaContext.folder + '/' + Date.now() + "-" + file.name.replace(/\s/g, '_');
        }
    });
});
