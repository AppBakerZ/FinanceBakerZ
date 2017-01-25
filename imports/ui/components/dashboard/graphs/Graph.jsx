import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import ReactDOM from 'react-dom';
import { Dropdown, Card } from 'react-toolbox';

import { Meteor } from 'meteor/meteor';
import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';
import { currencyFormatHelpers, userCurrencyHelpers } from '../../../../helpers/currencyHelpers.js'

import theme from './theme';

export default class Graph extends Component {

    constructor(props) {
        super(props);

        this.state = {
            graph: null,
            graphSelectedYear: null,
            graphYears: []
        };

        this.months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
    }

    componentWillMount(){
        this.getGraphData()
    }

    getGraphData(year){
        Meteor.call('statistics.incomesGroupByMonth', {year}, (error, res) => {
            if(!error){
                let state = {graph: res.result, graphYears: res.years};
                if(!this.state.graphSelectedYear){
                    state.graphSelectedYear = res.years[0]
                }
                this.setState(state)
            }
        })
    }

    graphYears(){
        return this.state.graphYears.map((year) => {
            return {name: year, value: year}
        })
    }

    yearItem (year) {
        const containerStyle = {
            display: 'flex',
            flexDirection: 'row'
        };

        const contentStyle = {
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 2
        };

        return (
            <div style={containerStyle}>
                <div style={contentStyle}>
                    <strong>{year.name}</strong>
                </div>
            </div>
        );
    }

    onChangeGraphYear (val, e) {
        this.setState({[e.target.name]: val});
        this.getGraphData(val)
    }

    renderTooltipContent (o){
        const { payload, label } = o;
        return (
            <div className="customized-tooltip-content">
                <p className="total">{`${this.months[label-1]}`}</p>
                <ul>
                    {
                        payload.map((entry, index) => (
                            <li key={`item-${index}`} style={{color: entry.color}}>
                                {`${entry.name}: ${userCurrencyHelpers.loggedUserCurrency()}${currencyFormatHelpers.currencyStandardFormat(entry.value)}`}
                            </li>
                        ))
                    }
                </ul>
            </div>
        );
    };

    render() {
        let yearDropdown = null;
        if(this.state.graphSelectedYear){
            yearDropdown = <Dropdown
                className={theme.dashboardDropdown}
                auto={false}
                source={this.graphYears()}
                name='graphSelectedYear'
                onChange={this.onChangeGraphYear.bind(this)}
                //label='Filter By Year'
                value={this.state.graphSelectedYear}
                template={this.yearItem}
                required
                />
        }

        const chart = <Card className='card' theme={theme}>
            <div className={theme.graphHeader}>
                <h3>Income Overview</h3>
                {yearDropdown}
            </div>
            <div className={theme.areaChart}>
                <ResponsiveContainer>
                    <AreaChart data={this.state.graph}
                               margin={{top: 10, right: 0, left: 0, bottom: 0}}>
                        <defs>
                            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#008148" stopOpacity={1}/>
                                <stop offset="95%" stopColor="#008148" stopOpacity={0.6}/>
                            </linearGradient>
                            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#e0b255" stopOpacity={1}/>
                                <stop offset="95%" stopColor="#e0b255" stopOpacity={0.6}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="_id" tickFormatter={(tick) => {
                            return `${this.months[tick - 1]}`;
                            }}/>
                        <YAxis tickFormatter={(tick) => {
                            return `${userCurrencyHelpers.loggedUserCurrency()}${currencyFormatHelpers.currencyWithUnits(tick)}`;
                            }}/>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <Tooltip content={this.renderTooltipContent.bind(this)}/>
                        <Area type='monotone' dataKey='income' stroke="#008148" fill="url(#colorIncome)" fillOpacity={1} />
                        <Area type='monotone' dataKey='expense' stroke='#e0b255' fill="url(#colorExpense)" fillOpacity={1} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>;

        return this.state.graph ? chart : null;
    }
}