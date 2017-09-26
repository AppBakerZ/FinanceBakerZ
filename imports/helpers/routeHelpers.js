import { browserHistory } from 'react-router';

export const routeHelpers = {
    /***** when want to change route programmatically and optional delay *****/
     //@route string (required) given the route with params
    //@time number (optional) if given routes changed after given time
    //@query object (optional) if given then append
    changeRoute: (pathname, time, query = {}) => {
        if(time){
            Meteor.setTimeout(() => {
                browserHistory.push({
                    pathname: pathname,
                    query: query
                })
            }, time)
        }
        else{
            browserHistory.push({
                pathname: pathname,
                query: query
            })
        }
    },

    /***** Reset the pagination route params to 0 on filter changes *****/
    //@path string (required) give the route with params
    resetPagination: (pathname) => {
        let paginationExists = (pathname.indexOf('paginate') !== -1);
        if( paginationExists ){
            pathname = pathname.slice(0, pathname.lastIndexOf('/') + 1) + 0;
        }
        return pathname
    }
};