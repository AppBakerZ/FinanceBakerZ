import React, { Component } from 'react';

import theme from './theme';

export default class Loader extends Component {
    constructor(props) {
        super(props);
    }
    getType(){
        let type;
        _.find(this.props, (val, key) => {
            type = key;
            return _.contains(['primary', 'accent', 'danger']);
        });
        return type;
    }
    render() {
        return (
            <div className={`${theme.loader} ${theme[this.getType()]}`}>
                <ul>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            </div>
        );
    }
}