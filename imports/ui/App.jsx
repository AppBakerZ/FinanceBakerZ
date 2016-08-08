import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Button } from 'react-toolbox/lib/button';

// App component - represents the whole app
export default class App extends Component {

    render() {
        return (
            <div className="container">
                <Button label="Hello World!" />
                <header>
                    <h1>Todo List</h1>
                </header>
            </div>
        );
    }
}