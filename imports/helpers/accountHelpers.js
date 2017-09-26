
export const accountHelpers = {
    alterName(bank){
        if(bank && typeof bank === 'string'){
            return bank.substring(5).replace(/-/g, " ");
        }
        return ''
    }
};