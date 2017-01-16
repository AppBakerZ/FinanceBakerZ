import numeral from 'numeral';

export const currencyFormatHelpers = {

    currencyWithUnits(currency){
        return numeral(currency).format('0.[0000]a')
    },

    currencyStandardFormat(currency){
        return numeral(currency).format('0,0')
    }

};

export const userCurrencyHelpers = {
    loggedUserCurrency(){
        return Meteor.user().profile.currency && Meteor.user().profile.currency.symbol_native
    }
};