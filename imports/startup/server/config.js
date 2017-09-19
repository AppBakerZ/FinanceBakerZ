export const appConfig = ({
    //just update when ever core plans updated or changed
    availablePlans : ['Free', 'Personal', 'Professional'],
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
    }
});