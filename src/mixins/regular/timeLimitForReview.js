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
                    if (self.searchData && self.searchData.gmtCreateEnd) {          //项目经理，评审专家与发布者页面使用
                        //如果结束时间不为空，则小于结束时间
                        return new Date(self.searchData.gmtCreateEnd).getTime() < time.getTime();
                    } else if (self.searchData && self.searchData.submitTimeEnd) {    //评审管理员页面使用
                        return new Date(self.searchData.submitTimeEnd).getTime() < time.getTime();
                    } else if (self.gmtCreateEnd) {
                        return new Date(self.gmtCreateEnd).getTime() < time.getTime();
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
                    if (self.searchData && self.searchData.submitTimeStart) {           //项目经理与发布者页面使用
                        //如果开始时间不为空，则结束时间大于开始时间
                        let newTime = new Date(self.searchData.submitTimeStart).getTime() - 86400000
                        return (
                            newTime > time.getTime()
                        );
                    } else if (self.searchData && self.searchData.submitTimeStart) {    //评审管理员页面使用
                        //如果开始时间不为空，则结束时间大于开始时间
                        let newTime = new Date(self.searchData.submitTimeStart).getTime() - 86400000
                        return (
                            newTime > time.getTime()
                        );
                    } else if (self.searchData && self.searchData.gmtCreateStart) {    //评审专家页面使用
                        //如果开始时间不为空，则结束时间大于开始时间
                        let newTime = new Date(self.searchData.gmtCreateStart).getTime() - 86400000
                        return (
                            newTime > time.getTime()
                        );
                    } else if (self.submitTimeStart) {
                        let newTime = new Date(self.submitTimeStart).getTime() - 86400000
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
