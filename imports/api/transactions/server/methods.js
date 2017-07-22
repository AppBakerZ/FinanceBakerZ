import { Expenses } from '../../../api/expences/expenses'
import { Incomes } from '../../../api/incomes/incomes'
import { Transactions } from '../transactions'
import Future from 'fibers/future';
export const copyTransactions = new ValidatedMethod({
    name: 'copyTransactions',
    validate:null,
    run() {
        //we are using future here to make it asynchronous
        let fu = new Future();
        //here Expenses directly copied in new collection name Transactions
        // TODO: use $rename or $addField in aggregate instead of $project
        Expenses.aggregate([{
            $project: {
                account : "$account",
                amount : "$amount",
                transactionAt : "$spentAt",
                description : "$description",
                category : "$category",
                type: {
                    $literal: 'expense'
                },
                owner : "$owner",
                createdAt : "$createdAt"
            }
        }, {
            $out: "transactions"
        } ]);
        //now append Transactions collection with incomes with batch insert
        Incomes.aggregate([{
            $project: {
                account : "$account",
                amount : "$amount",
                transactionAt : "$receivedAt",
                type:{
                    $literal: 'income'
                },
                // TODO add fallback for old doc which not have CreditType
                creditType : "$creditType",
                project : "$project",
                owner : "$owner",
                createdAt : "$createdAt"
            }
        }], function (err, result) {
            if(result.length) {
                Transactions.batchInsert(result, function (err, res) {
                    fu.return('completed')
                })
            }
            else{
                fu.return('completed')
            }
        });
        return fu.wait();
    }
});
