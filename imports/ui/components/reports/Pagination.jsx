import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { browserHistory } from 'react-router';

import ReactPaginate from 'react-paginate';
import theme from './theme';
let flag = 5;
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
        const { history} = this.props.test;
        let { pager } = this.state;
        let { location } = this.props.test;
        let { local } = nextprops;
        if (pager){
            let skip = Math.ceil(pager * local.limit);
            updateFilter('reports', 'skip', skip)
        }
        let query = location.query;
        if( local.type === "incomes" || local.type === "expenses" ){
            if(query.type !== local.type){
                query.type = local.type;
            }
        }
        if( local.categories.length ){
            query.categories = query.categories || '';
            if(query.categories.split(".") !== local.categories){
                flag--;
                // query.categories = `${[local.categories.join("','")]}`;
                query.categories = `${[local.categories]}`;
                // if(query.categories && query.categories.length){
                //     query.categories = `"${[local.categories.join(",")]}"`
                // }
                // browserHistory.push(`${this.props.test.location.pathname}?categories=["${local.categories}"]`);
            }
        }
        if(local.projects.length){
            query.projects = query.project || '';
            if(query.projects.split(".") !== local.projects){
                flag--;
                // query.projects = `[${local.projects.join("','")}]`;
                query.projects = `${[local.projects]}`;
                // if(query.projects && query.projects.length){
                //     query.projects = `"[${local.projects.join(",")}]"`;
                // }

                // browserHistory.push(`${this.props.test.location.pathname}?projects=["${local.projects}"]`);
            }
        }
        if(flag >= 0 && flag !== 5){
            // flag = false;
            history.pushState(null, `/app/reports/paginate/`, query);
        }
    }


    handlePageClick(data) {
        let selected = data.selected;
        //set the params in case of greater than 0
        selected && browserHistory.push(`/app/reports/paginate/${selected}`);
        // else default to index page
        selected || browserHistory.push("/app/reports/paginate");
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