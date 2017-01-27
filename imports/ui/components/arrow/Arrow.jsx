import React, { Component } from 'react';

import theme from './theme';

export default class Arrow extends Component {
    constructor(props) {
        super(props);
    }
    getType(){
        let type;
        _.find(this.props, (val, key) => {
            type = key;
            return _.contains(['primary', 'accent', 'danger'], key);
        });
        return type;
    }
    getDirection(){
        let direction;
        _.find(this.props, (val, key) => {
            direction = key;
            return _.contains(['up', 'down', 'left', 'right'], key);
        });
        return direction;
    }
    render() {
        return (
            <svg className={`${theme.arrow} ${theme[this.getType()]} ${theme[this.getDirection()]}`}
                 width={this.props.width || '65.016px'} height={this.props.height || '70.434px'} viewBox="0 0 65.016 70.434" enableBackground="new 0 0 65.016 70.434">
                <path fill="#fff" d="M1.075,30.203c-2.52,4.244-0.458,7.716,4.582,7.716h12.075v26.599c0,3.268,2.649,5.917,5.912,5.917h17.731
                      c3.263,0,5.912-2.649,5.912-5.917V37.919h12.072c5.04,0,7.103-3.471,4.582-7.716L37.091,2.685c-3.65-3.648-5.653-3.511-9.165,0
                    C27.925,2.685,1.075,30.203,1.075,30.203L1.075,30.203z" />
            </svg>
        );
    }
}