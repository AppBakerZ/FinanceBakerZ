import { Meteor } from 'meteor/meteor';
import { _ } from 'underscore'
import { Migrations } from 'meteor/percolate:migrations';
import { Projects } from '../../api/projects/projects.js';
import { Transactions } from '../../api/transactions/transactions.js';
import { Accounts } from '../../api/accounts/accounts.js';

//MUST SPECIFY HERE THE CURRENT VERSION : #1

// Note: Migrations should be run from Meteor.startup

/*  Don't remove previous Versions to save all migrations history here
    steps to do performs migrations
    update schema according each and every field carefully
    update all relevant functions and methods very with extra care

    Error: #1
    not migrating, control is locked

    Migrations set a lock when they are migrating.so if migration throw error then we need to manually
    remove that lock with following method
    $ meteor mongo
    db.migrations.update({_id:"control"}, {$set:{"locked":false}});
 */

Migrations.add({
    version: 1,
    name: 'Add description field to projects.',
    up() {
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
    },
});

Migrations.add({
    version: 2,
    name: 'account field changed from string to Object in transactions.',
    up() {
        let transactions = Transactions.find().fetch();
        transactions.forEach(transaction => {
            let account = Accounts.findOne({_id: transaction.account});
            let update = {};
            if(account){
                update._id = account._id;
                update.bank = account.bank;
                if(account.number){
                    update.number = account.number
                }
            }

            //set account to null as discussed because only old account id is useless
            else{
                update = null;
            }
            Transactions.update({
                    _id: transaction._id},
                {
                    $set: {
                        account: update
                    }
                },{
                    validate: false
            })
        })
    },
    down() {
        let transactions = Transactions.find().fetch();
        transactions.forEach(transaction =>{
            if(_.isObject(transaction.account)){
                Transactions.update({
                    _id: transaction._id
                },{
                    $set: {
                        account: transaction.account ? transaction.account._id : null
                    }

                },{
                    validate: false
                })
            }

        });
    },
});

// Meteor.startup(() => Migrations.migrateTo(1));
Meteor.startup(()=>{
    Migrations.migrateTo(2)
});