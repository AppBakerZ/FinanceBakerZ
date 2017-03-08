// fill the DB with example data on startup

import { Meteor } from 'meteor/meteor';
import { Accounts } from '../../api/accounts/accounts.js';
import { Categories } from '../../api/categories/categories.js';


let categories = [
    {name: 'car', icon: 'icon-icons_automobile', children: ["petrol", "car-wash", "pump"]},
    {name: "petrol", icon: 'icon-icons_petrol', parent: "car"},
    {name: "car-wash", icon: 'icon-icons_car-wash', parent: "car"},
    {name: "pump", icon: 'icon-icons_fuel-pump', parent: "car"},
    {name: 'edu', icon: 'icon-icons_edu', children: ["fee", "book-charges"]},
    {name: "fee", icon: 'icon-icons_tution-fee', parent: "edu"},
    {name: "book-charges", icon: 'icon-icons_book-charges', parent: "edu"},
    {name: 'travel', icon: 'icon-icons_groceries', children: ["train", "trip"]},
    {name: "train", icon: 'icon-icons_train', parent: "travel"},
    {name: "trip", icon: 'icon-icons_trip', parent: "travel"},
    {name: 'Food', icon: 'icon-icons_food', children: ["chocolate", "coffee"]},
    {name: "chocolate", icon: 'icon-icons_chocolate', parent: "Food"},
    {name: "coffee", icon: 'icon-icons_coffee', parent: "Food"}
];

// if the database is empty on server start, create some sample data.
let defaultCategory = () => {
    if (!Categories.findOne({owner: {$exists: false}})) {
        categories.map(function (category) {
                Categories.insert(category);
            }
        );
    }
};

Meteor.startup(() => {
    defaultCategory();
});