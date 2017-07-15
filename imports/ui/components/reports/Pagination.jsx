import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { browserHistory } from 'react-router';
import moment from 'moment';

import ReactPaginate from 'react-paginate';
import theme from './theme';
let initialParamsFlag = true;
class Pagination extends Component {

    constructor(props) {
        super(props);
        let parentProps = props.test;
        this.state = {
            //if found set else false
            pager: parentProps.params.number,
            query: parentProps.location.query,
            data: [],
            offset: 0
        };
    }


    componentWillReceiveProps(nextProps){
        let typeChanged = false;
        let { pager } = this.state;
        if(initialParamsFlag){
            //first time it will update the local collection with given url Params
            let { query } = nextProps.test.location;
            query.type && updateFilter('reports', 'type', query.type);
            query.accounts && updateFilter('reports', 'accounts', query.accounts.split(","));
            query.projects && updateFilter('reports', 'projects', query.projects.split(","));
            query.categories && updateFilter('reports', 'categories', query.categories.split(","));
            //date filters
            query.filter && updateFilter('reports', 'filter', query.filter);
            query.dateFrom && updateFilter('reports', 'dateFrom', moment(query.dateFrom).format());
            query.dateTo && updateFilter('reports', 'dateTo', moment(query.dateTo).format());
            initialParamsFlag = false;

            //if given then update skip first time too
            if (pager){
                let skip = Math.ceil(pager * nextProps.local.limit);
                updateFilter('reports', 'skip', skip)
            }
        }
        if(nextProps.pageCount <= nextProps.local.limit){
            //else no skip in any way
            updateFilter('reports', 'skip', 0);
        }
        let flag = false;
        let { location } = this.props.test;
        let { local } = nextProps;

        let query = location.query;
        if( query.type !== local.type ){
            typeChanged = true;
            query.type = local.type;
            flag = true;
        }
        if( local.categories.length ){
            query.categories = query.categories || '';
            if(query.categories !== local.categories.join(",")){
                flag = true;
                query.categories = `${[local.categories]}`;
            }
        }
        else if((!local.categories.length) && query.categories){
            delete query.categories;
            flag = true
        }
        if( local.projects.length ){
            query.projects = query.projects || '';
            if(query.projects !== local.projects.join(",")){
                flag = true;
                query.projects = `${[local.projects]}`;
            }
        }
        else if((!local.projects.length) && query.projects){
            delete query.projects;
            flag = true
        }
        if( local.accounts.length ){
            query.accounts = query.accounts || '';
            if(query.accounts !== local.accounts.join(",")){
                flag = true;
                query.accounts = `${[local.accounts]}`;
            }
        }
        else if((!local.accounts.length) && query.accounts){
            delete query.accounts;
            flag = true
        }
        //date filters
        if( query.filter !== local.filter ){
            query.filter = local.filter;
            flag = true;
        }
        if( new Date(query.dateFrom).getTime() !== new Date(local.dateFrom).getTime() ){
            query.dateFrom = moment(local.dateFrom).format();
            flag = true;
        }
        if( new Date(query.dateTo).getTime() !== new Date(local.dateTo).getTime() ){
            query.dateTo = moment(local.dateTo).format();
            flag = true;
        }
        //add conditions on states and change filter
        if(flag && typeChanged){
            browserHistory.push({
                pathname: '/app/reports',
                query: query
            });
        }
        else if( flag ){
            browserHistory.push({
                pathname: location.pathname,
                query: query
            });
        }
    }


    handlePageClick(data) {
        const { location } = this.props.test;
        let query = location.query;
        let selected = data.selected;

        //set the params in case of greater than 0 else default
        selected && browserHistory.push({pathname: `/app/reports/paginate/${selected}`, query: query});
        selected || browserHistory.push({pathname: "/app/reports", query: query});
        let skip = Math.ceil(selected * this.props.local.limit);

        updateFilter('reports', 'skip', skip)
    }

    render() {
        return (
            <div className={theme.paginationList}>
                <ReactPaginate 
                    previousLabel={'Previous'}
                    nextLabel={'Next'}
                    breakClassName={'break-me'}
                    pageCount={Math.ceil(this.props.pageCount / this.props.local.limit)}
                    marginPagesDisplayed={0}
                    pageRangeDisplayed={10}
                    onPageChange={this.handlePageClick.bind(this)}
                    containerClassName={'pagination'}
                    subContainerClassName={'pages pagination'}
                    activeClassName={'active'}
                />
            </div>
        );
    }

}

export default createContainer(() => {
    return {
        local: LocalCollection.findOne({
            name: 'reports'
        })
    };
}, Pagination);