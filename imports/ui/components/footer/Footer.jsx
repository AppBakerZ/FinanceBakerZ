import React, { Component } from 'react';

import theme from './theme';

export default class Footer extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className={theme.appFooter}>
                <span className="margin-top-5 margin-bottom-5">A Product of AppBakerz</span>
            </div>
        );
    }
}