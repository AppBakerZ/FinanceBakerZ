
export const accountHelpers = {
    alterName(bank){
        return bank.substring(5).replace(/-/g , " ");
    }
};