import React, { Component } from 'react';

import theme from './theme';

export default class Arrow extends Component {
    constructor(props) {
        super(props);
        this.up = `M1.075,30.203c-2.52,4.244-0.458,7.716,4.582,7.716h12.075v26.599c0,3.268,2.649,5.917,5.912,5.917h17.731
	c3.263,0,5.912-2.649,5.912-5.917V37.919h12.072c5.04,0,7.103-3.471,4.582-7.716L37.091,2.685c-3.65-3.648-5.653-3.511-9.165,0
	C27.925,2.685,1.075,30.203,1.075,30.203L1.075,30.203z`;

        this.down = `M63.941,40.231c2.52-4.244,0.458-7.716-4.582-7.716H47.284V5.917C47.284,2.649,44.635,0,41.373,0H23.641
	c-3.263,0-5.912,2.649-5.912,5.917v26.599H5.658c-5.04,0-7.103,3.471-4.582,7.716l26.849,27.518c3.65,3.648,5.653,3.511,9.165,0
	C37.091,67.749,63.941,40.231,63.941,40.231L63.941,40.231z`
    }
    getType(){
        let type;
        _.find(this.props, (val, key) => {
            type = key;
            return _.contains(['primary', 'accent', 'danger'], key);
        });
        return type;
    }
    isDown(){
        return _.find(this.props, (val, key) => {
            return _.contains(['down'], key);
        });
    }
    render() {
        return (
            <svg className={`${theme.arrow} ${theme[this.getType()]}`}
                 width="65.016px" height="70.434px" viewBox="0 0 65.016 70.434" enableBackground="new 0 0 65.016 70.434">
                <path fill="#fff" d={this.isDown() ? this.down : this.up}/>
            </svg>
        );
    }
}