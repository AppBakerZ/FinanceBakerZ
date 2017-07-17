import { browserHistory } from 'react-router';

//TODO: confirm if loading required instead of time?
export const routeHelpers = {
    //@route string (required) given the route with params
    //@time number (optional) if given routes changed after given time
    //@query object (optional) if given then append
    changeRoute: (pathname, time = 0, query = {}) => {
        Meteor.setTimeout(() => {
            browserHistory.push({
                pathname: pathname,
                query: query
            })
        }, time)
    }
};