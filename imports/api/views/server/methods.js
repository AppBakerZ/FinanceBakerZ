import { Expenses } from '../../../api/expences/expenses'
import { Incomes } from '../../../api/incomes/incomes'
import { Views } from '../../views/views'
import Future from 'fibers/future';
export const testMethod = new ValidatedMethod({
    name: 'testMethod',
    validate:null,
    run() {
        //we are using future here to make it asynchronous
        let fu = new Future();
        //here Expenses directly copied in new collection name Views
        Expenses.aggregate([ { $out: "views" } ]);
        //now append views collection with incomes with batch insert
        Incomes.aggregate([], function(err, result){
            Views.batchInsert(result, function(err, res){
                //after completed rename the both keys with date :)
                // TODO: update it with one query instead of two
                Views.update({},
                    {
                        $rename: {
                            spentAt:'date'
                        }
                    }, {
                        multi:true
                    }, (err, res) => {
                        Views.update({},{
                            $rename:{
                                receivedAt:'date'
                            }
                        }, {
                            multi:true
                        }, (err, res) =>{
                            fu.return('completed')
                        });
                    });
            })
        });
        return fu.wait();
    }
});
