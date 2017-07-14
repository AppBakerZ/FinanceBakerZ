import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { browserHistory } from 'react-router';

import ReactPaginate from 'react-paginate';
import theme from './theme';
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


    componentWillReceiveProps(nextprops){
        let flag = false;
        let { pager } = this.state;
        let { location } = this.props.test;
        let { local } = nextprops;
        if (pager){
            let skip = Math.ceil(pager * local.limit);
            updateFilter('reports', 'skip', skip)
        }
        let query = location.query;
        if( query.type !== local.type ){
            query.type = local.type;
            flag = true;
        }
        if( local.categories.length ){
            query.categories = query.categories || '';
            if(query.categories !== local.categories.join(",")){
                flag = true;
                // query.categories = `${[local.categories.join("','")]}`;
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
        if(flag){
            browserHistory.pushState(null, location.pathname, query);
        }
    }


    handlePageClick(data) {
        const { location } = this.props.test;
        let query = location.query;
        let selected = data.selected;

        //set the params in case of greater than 0 else default
        selected && browserHistory.pushState(null, `/app/reports/paginate/${selected}`, query);
        selected || browserHistory.pushState(null, "/app/reports", query);
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