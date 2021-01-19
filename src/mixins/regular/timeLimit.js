const mixinRegular = {
    data() {
        return {
            startDatePicker: this.beginDate(),
            endDatePicker: this.processDate()
        };
    },
    methods: {
        beginDate() {
            const self = this;
            return {
                disabledDate(time) {
                    if (self.searchData && self.searchData.endTime) {
                        //如果结束时间不为空，则小于结束时间
                        return new Date(self.searchData.endTime).getTime() < time.getTime();
                    } else if (self.endTime) {
                        return new Date(self.endTime).getTime() < time.getTime();
                    } else {
                        // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
                    }
                }
            };
        },
        processDate() {
            const self = this;
            return {
                disabledDate(time) {
                    if (self.searchData && self.searchData.startTime) {
                        //如果开始时间不为空，则结束时间大于开始时间
                        let newTime = new Date(self.searchData.startTime).getTime() - 86400000
                        return (
                            newTime > time.getTime()
                        );
                    } else if (self.startTime) {
                        let newTime = new Date(self.startTime).getTime() - 86400000
                        return (
                            newTime > time.getTime()
                        );
                    } else {
                        // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
                    }
                }
            };
        }
    }
};
export default mixinRegular