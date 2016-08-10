import React, { Component } from 'react';

import { List, ListItem, ListDivider, Button } from 'react-toolbox';

export default class Accounts extends Component {

    constructor(props) {
        super(props);

        this.state = {
        };

    }

    toggleSidebar(){
        this.props.toggleSidebar();
    }

    render() {
        return (
            <List selectable ripple>
                <Button icon='add' floating accent className='add-button' />

                <ListItem
                    onClick={ this.toggleSidebar.bind(this) }
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