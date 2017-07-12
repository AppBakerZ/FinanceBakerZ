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

    componentWillMount() {
        let { pager } = this.state;
        if (pager){
            let skip = Math.ceil(pager * this.props.local.limit);
            updateFilter('reports', 'skip', skip)
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