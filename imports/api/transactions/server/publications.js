import { Meteor } from 'meteor/meteor';
import { Incomes } from '../../incomes/incomes.js';
import { Expenses } from '../../expences/expenses.js';
import { Views } from '../../views/views';
import { Counter } from 'meteor/natestrauser:publish-performant-counts';

//here we define three types of sorting options
let sortOptions = {
    incomeSort: {
        receivedAt: -1
    },
    expenseSort: {
        spentAt: -1
    },
    viewSort: {
        date: -1
    }
};


Meteor.publish('transactions', function(options) {
    //we only return Views if view Flag found to not break the old functionality
    let viewFlag = options.viewFlag;
    let query = {
        owner: this.userId,
        $and: []
    };

    if(options.accounts.length)
        query['account'] = {$in: ArrayGuard(options.accounts)};

    if( viewFlag && options.type === 'both' ){
        options.dateFilter && (query.date = {$gte: new Date(options.dateFilter.start), $lte: new Date(options.dateFilter.end)});
    }
    else {
        options.dateFilter && datefilter(options, query);
    }

    options.filterByCategory && options.filterByCategory.length && filterByCategory(options, query);
    options.filterByProjects && options.filterByProjects.length && filterByProjects(options, query);

    if(!query.$and.length) delete query.$and;

    if(options.type === 'incomes') {
        return [
            findQuery(Incomes, query, options, sortOptions.incomeSort),
            new Counter('incomesCount', Incomes.find(query, {
                sort: sortOptions.incomeSort
            }))
        ]
    }

    if(options.type === 'expenses') {
        return [
            findQuery(Expenses, query, options, sortOptions.expenseSort),
            new Counter('expensesCount', Expenses.find(query, {
                sort: sortOptions.expenseSort
            }))
        ]
    }

    //computing 'Transactions' below
    return transactions(options, query, viewFlag);
});


let datefilter = (options, query) => {
    let dateQuery = {
        $gte: new Date(options.dateFilter.start),
        $lte: new Date(options.dateFilter.end)
    };
    let temp = {
        $or: [{
            receivedAt: dateQuery
        }, {
            spentAt: dateQuery
        }
        ]};
    query.$and.push(temp);
};



let filterByCategory = (options, query) => {
    let temp = {
        'category._id': {
            $in: ArrayGuard(options.filterByCategory)
        }
    };
    query.$and.push(temp);
};



let filterByProjects = (options, query) => {
    let temp = {
        'project._id': {
            $in: ArrayGuard(options.filterByProjects)
        }
    };
    query.$and.push(temp);
};



let transactions = (options, query, viewFlag) => {
    if( viewFlag ){
        // Expenses.aggregate([ { $out: "views" } ]);
        // Incomes.aggregate([], function(err, result){
        //     Views.batchInsert(result, function(err, res){
        //         Views.update({},
        //             {
        //                 $rename: {
        //                     spentAt:'date'
        //                 }
        //             }, {
        //             multi:true
        //             }, (err, res) => {
        //                 console.log('second last Point');
        //                 Views.update({},{
        //                     $rename:{
        //                         receivedAt:'date'
        //                     }
        //                 }, {
        //                     multi:true
        //                 }, (err, res) =>{
        //                     console.log('lastPoint', options);
        //
        //                 });
        //             });
        //     })
        // })
        return [
            findQuery(Views, query, options, sortOptions.viewSort),
            new Counter('viewsCount', Views.find(query, {
                sort: sortOptions.viewSort
            }))
        ];
    }
    return [
        findQuery(Incomes, query, options, sortOptions.incomeSort),
        findQuery(Expenses, query, options, sortOptions.expenseSort),
        new Counter('countIncomes', Incomes.find(query, {
            sort: sortOptions.incomeSort
        })),
        new Counter('countExpenses', Expenses.find(query, {
            sort: sortOptions.expenseSort
        }))
    ]




};

findQuery =(Collection, query, options, sort) => {
    return Collection.find(query, {
        sort: sort,
        limit: options.limit,
        skip: options.skip
    })
};

//Guard for Operator which only work with Array like $in
ArrayGuard = (ele) => {
    (ele instanceof Array) || (ele = [ele]);
    return ele
};