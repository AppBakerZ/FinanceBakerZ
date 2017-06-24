import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import ReactPaginate from 'react-paginate';
import theme from './theme';

class Pagination extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            offset: 0
        };
    }

    handlePageClick(data) {
        let selected = data.selected;
        let offset = Math.ceil(selected * this.props.perPage);

        this.setState({offset: offset})
    }

    render() {
        return (
            <div className={theme.paginationList}>
                <ReactPaginate 
                    previousLabel={'Previous'}
                    nextLabel={'Next'}
                    breakLabel={<a href=''>...</a>}
                    breakClassName={'break-me'}
                    pageCount={Math.ceil(this.props.pageCount / 10)}
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

    };
}, Pagination);