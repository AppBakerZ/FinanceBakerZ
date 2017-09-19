//set different expiry time for different plans
import { dateHelpers } from './dateHelpers.js'
//import config
import { appConfig } from '../startup/server/config.js'
let applyLimits = {
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
            plan = user.profile.businessPlan || appConfig.availablePlans[0];
        }

        if(plan && applyLimits[plan]){
            return applyLimits[plan]
        }
    }
};