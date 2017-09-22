import { Meteor } from 'meteor/meteor';
import { Migrations } from 'meteor/percolate:migrations';
import { Projects } from '../../api/projects/projects.js';
/*  Don't remove previous Versions to save all migrations history here
    step to do performs migrations
    update schema according each and every field carefully
    update all relevant function and method very with extra care
    Error: #1
    not migrating, control is locked

    Note: Migrations should be run from Meteor.startup

    Migrations set a lock when they are migrating.so if migration throw then we need to manually
    remove that lock with following method
    $ meteor mongo
    db.migrations.update({_id:"control"}, {$set:{"locked":false}});
 */

Migrations.add({
    version: 1,
    name: 'Add description field to projects.',
    up() {
        // const projectsWithoutDescription = Projects.find(
        //     { description: { $exists: false } },
        //     { fields: { _id: 1 } },
        // ).fetch();
        //
        // projectsWithoutDescription.forEach(({ _id }) => {
        //     Projects.update(_id, { $set: { description: 'No Description' } });
        // });
        Projects.update({
            description: {$exists: false}
        },{
            $set: {
                description: 'No Description Available'
            }
        },{multi: true})
    },
    down() {
        Projects.update({
            description: {$exists: true}
        },{
            $unset: {
                description: 1
            }
        },{multi: true, validate: false})
        // const projectsWithDescription = Projects.find(
        //     { description: { $exists: true } },
        //     { fields: { _id: 1 } },
        // ).fetch();
        //
        // projectsWithDescription.forEach(({ _id }) => {
        //     Projects.update(_id, { $unset: { description: 1 }},{validate: false});
        // });
    },
});

Meteor.startup(() => Migrations.migrateTo(1));