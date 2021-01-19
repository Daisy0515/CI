const mixinRegular = {
    data() {
        const userReg = /^.{0,20}$/;
        const RequirementReg = /^.{0,50}$/;
        const detailReg = /^([\s\S]*){0,500}$/;
        const validateName = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请项目名称"));
            } else if (!userReg.test(value)) {
                callback(new Error("不可输入符号，不超过20个字"));
            } else {
                callback();
            }
        };
        const requirement = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入一句话描述"));
            } else if (!RequirementReg.test(value)) {
                callback(new Error("一句话描述不超过50个字"));
            } else {
                callback();
            }
        };
        const detail = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入详细描述"));
            } else if (value.length >= 500) {
                callback(new Error("详细描述不可超过500个字"));
            } else {
                callback();
            }
        };
        return {
            rules: {
                // name: [
                //   { required: true, message: "请输入活动名称", trigger: "blur" },
                //   { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
                // ],
                region: [{
                    required: true,
                    message: "请选择活动区域",
                    trigger: "change"
                }],
                date1: [{
                    type: "date",
                    required: true,
                    message: "请选择日期",
                    trigger: "change"
                }],
                date2: [{
                    type: "date",
                    required: true,
                    message: "请选择时间",
                    trigger: "change"
                }],
                type: [{
                    type: "array",
                    required: true,
                    message: "请至少选择一个活动性质",
                    trigger: "change"
                }],
                name: [{
                    validator: validateName,
                    trigger: "blur",
                    required: true
                }],
                requirement: [{
                    validator: requirement,
                    trigger: "blur",
                    required: true
                }],
                detail: [{
                    validator: detail,
                    trigger: "blur",
                    required: true
                }]
            }
        };
    }
};
export default mixinRegular
