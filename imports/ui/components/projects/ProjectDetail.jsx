import React, { Component } from 'react';

import { Button } from 'react-toolbox';

import theme from './theme';

export default class ProjectDetail extends Component {

    constructor(props) {
        super(props);

        this.state = {};


        Meteor.call('calculateIncome', {
            project: {
                _id: props.project._id
            }
        }, (err, response) => {
            if (err) {

            }
            else {
                this.setState({amountPaid: response[0].total});
            }

        });

}
    render() {
        let {project} = this.props;
        return (
            <div className={theme.contentParent}>
                <h4>{project.name}</h4>
                <div className={theme.contentTwo}>
                    <div> <p>Client Name :</p> <p>{project.client.name}</p></div>
                    <div> <p>Amount Agreed :</p> <p>{project.amount}</p></div>
                    <div> <p>Amount Paid :</p> <p>{this.state.amountPaid || 0} </p></div>
                    <div> <p>Amount Remaining :</p> <p>{project.amount - this.state.amountPaid || project.amount} </p></div>
                    <div> <p>Project Status :</p> <p>{project.status}</p></div>
                </div>

                <div className={theme.buttonBox}>
                    <Button label='Edit Information' raised accent onClick={this.props.openPopup.bind(null, 'edit', project)} />
                    <Button label='Remove Project' raised accent onClick={this.props.openPopup.bind(null, 'remove', project)} />
                </div>
            </div>
        );
    }
}