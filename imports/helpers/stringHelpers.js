
export const stringHelpers = {
    capitalize(word){
        if(typeof word === 'string')
        return word.charAt(0).toUpperCase() + word.slice(1);
    }
};