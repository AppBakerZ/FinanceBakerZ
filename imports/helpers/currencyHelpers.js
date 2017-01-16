import numeral from 'numeral';

export const currencyFormatHelpers = {

    currencyWithUnits(currency){
        return numeral(currency).format('0.[0000]a')
    },

    currencyStandardFormat(currency){
        return numeral(currency).format('0,0')
    }

};