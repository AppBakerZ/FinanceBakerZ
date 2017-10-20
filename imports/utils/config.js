export const AppConfig = ({
    //just update when ever core plans updated or changed
    availablePlans : ['free', 'personal', 'professional'],
    Free: {
        reports: {
            count: 5,
            expires: 3 //days
        }
    },
    Personal: {
        reports: {
            count: 10,
            expires: 7 //days
        }
    },
    Professional: {
        reports: {
            count: 15,
            expires: 30 //days
        }
    },
    previousRoute : false,
    setPreviousRoute : (route) =>{
        route && (route = route.replace(Meteor.absoluteUrl(), '/'));
        AppConfig.previousRoute = route;
    }
});