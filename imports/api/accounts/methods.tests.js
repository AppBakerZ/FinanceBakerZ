// tests for those methods
import { Meteor } from 'meteor/meteor'
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Accounts } from 'meteor/accounts-base'
import { assert } from 'meteor/practicalmeteor:chai';

import './methods.js'


//Initializing and declaring test variables

let currentUser, account;

testUser = {
    "name": "Mohammad Kashif Sulaiman",
    "username": "kashifsulaiman",
    "password": "123456"
};

testAccount = {
    account: {
        country: 'Pakistan',
        number: '100921920',
        bank: 'Meezan'
    }
};


//Testing begins

if(Meteor.isClient) {

    describe('accountMethods', () => {

        before((done) => {
            resetDatabase();
            Accounts.createUser(testUser, (err) => {
                done(err);
            });
        });

        it('can insert accounts', (done) => {
            Meteor.call('accounts.insert', testAccount, (error, response) => {
                try {
                    assert.isUndefined(error, error && error.reason);
                    assert.isString(response);
                    done();
                } catch(err) {
                    done(err);
                }
            });
        });

    });

}
