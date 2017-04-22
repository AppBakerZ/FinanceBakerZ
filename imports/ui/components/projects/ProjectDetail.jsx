import React, { Component } from 'react';
import { Button } from 'react-toolbox';
import theme from './theme';

export default class ProjectDetail extends Component {

    constructor(props) {
        super(props);

        this.state = {
            amountPaid: null
        };

        this.getPaidAmountOfProject()
    }
    getPaidAmountOfProject(){
        Meteor.call('statistics.incomesGroupByProject', {
            project: {
                _id: this.props.project._id
            }
        }, (err, project) => {
            if (!err) {
                this.setState({
                    amountPaid: project.total
                });
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
                    <div> <p>Amount Paid :</p> <p>{this.state.amountPaid == null ? 'Loading ...' : this.state.amountPaid} </p></div>
                    <div> <p>Amount Remaining :</p> <p>{ this.state.amountPaid == null ? 'Loading ...' : project.amount - this.state.amountPaid } </p></div>
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