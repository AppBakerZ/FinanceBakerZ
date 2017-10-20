import { browserHistory } from 'react-router';
import { AppConfig } from '/imports/utils/config';

export const routeHelpers = {
    /***** when want to change route programmatically and optional delay *****/
     //@route string (required) given the route with params
    //@time number (optional) if given routes changed after given time
    //@query object (optional) if given then append
    changeRoute: (pathname, time, query = {}, history) => {
        if(history && AppConfig.previousRoute){
            // if(AppConfig.previousRoute.includes(Meteor.absoluteUrl())){
            Meteor.setTimeout(() => {
                browserHistory.push(AppConfig.previousRoute)
            }, time)
        }
        else {
            changePath(pathname, query, time)
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

//generalize function for all conditions
changePath = (pathname, query, time) =>{
    Meteor.setTimeout(() => {
        browserHistory.push({
            pathname: pathname,
            query: query
        })
    }, time)
};