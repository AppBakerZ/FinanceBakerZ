import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { routeHelpers } from '../../../helpers/routeHelpers.js'

import ReactPaginate from 'react-paginate';
import theme from './theme';
class Pagination extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pageSelected : 0
        }
    }

    componentWillReceiveProps (p){
        const { parentProps } = p;
        const { params } = parentProps;
        this.setState({
            pageSelected: params.number || 0
        })
    }


    handlePageClick(data) {
        const { parentProps } = this.props;
        const { location, history } = parentProps;
        let query = location.query;
        let selected = data.selected;
        let pathName = location.pathname;
        let paginationExists = (pathName.indexOf('paginate') !== -1);
        if( !paginationExists ){
            pathName = `${pathName}/paginate`;
        }
        else{
            pathName = pathName = pathName.slice(0, pathName.lastIndexOf('/'))
        }

        //set the params in case of greater than 0 else default
        routeHelpers.changeRoute(`${pathName}/${selected}`, 0, query)
        let skip = Math.ceil(selected * this.props.local.limit);

        // updateFilter('reports', 'skip', skip)
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
                    forcePage={Number(this.state.pageSelected)}
                    subContainerClassName={'pages pagination'}
                    activeClassName={'active'}
                />
            </div>
        );
    }

}

Pagination.propTypes = {
    parentProps: PropTypes.object.isRequired

}

export default createContainer(() => {
    return {
        local: LocalCollection.findOne({
            name: 'reports'
        })
    };
}, Pagination);