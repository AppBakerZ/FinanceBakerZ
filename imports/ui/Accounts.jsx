import React, { Component } from 'react';

import { List, ListItem, ListDivider } from 'react-toolbox';

export default class Accounts extends Component {

    constructor(props) {
        super(props);

        this.state = {
        }
    }

    render() {
        return (
            <List selectable ripple>
                <ListItem
                    avatar='https://dl.dropboxusercontent.com/u/2247264/assets/m.jpg'
                    caption='Meezan Bank'
                    legend="Jonathan 'Jon' Osterman"
                    rightIcon='mode_edit'
                    />
                <ListDivider inset />
                <ListItem
                    avatar='https://dl.dropboxusercontent.com/u/2247264/assets/o.jpg'
                    caption='Dubai Islami Bank'
                    legend='Adrian Veidt'
                    rightIcon='mode_edit'
                    />
                <ListDivider inset />
                <ListItem
                    avatar='https://dl.dropboxusercontent.com/u/2247264/assets/r.jpg'
                    caption='UBL'
                    legend='Walter Joseph Kovacs'
                    rightIcon='mode_edit'
                    />
            </List>
        );
    }
}