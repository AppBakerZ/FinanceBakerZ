import moment from 'moment';

export const dateHelpers = {

    filterByDate(filter, range, self){
        let date = {};
        if(filter == 'months'){
            date.start = moment().subtract(1, 'months').startOf('month').format();
            date.end = moment().subtract(1, 'months').endOf('month').format();
        }
        else if(filter == 'range'){
            date.start = moment(range.dateFrom || self.state.dateFrom).startOf('day').format();
            date.end = moment(range.dateTo || self.state.dateTo).endOf('day').format();
        }
        else{
            date.start = moment().startOf(filter).format();
            date.end = moment().endOf(filter).format();
        }
        return date
    }

};