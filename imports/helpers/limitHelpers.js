//set different expiry time for different plans
import { dateHelpers } from './dateHelpers.js'
//TODO: main data should be comes from config
let availablePlans = {
    Free : dateHelpers.updateDate(new Date(), 'days', 3),
    Personal: dateHelpers.updateDate(new Date(), 'days', 7),
    Professional: dateHelpers.updateDate(new Date(), 'month', 1)};

export const limitHelpers = {
    //currently there are three Free, Personal, Professional
    getReportExpiryDate(plan){
        if(plan){
        //    nothing to do here
        }
        else{
            let user = Meteor.user();
            //set default to Free
            plan = user.profile.businessPlan || 'Free';
        }

        if(plan && availablePlans[plan]){
            return availablePlans[plan]
        }
    }
};