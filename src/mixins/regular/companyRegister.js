const mixinRegular = {
    data() {
        const userReg = /^[A-Za-z0-9\u4e00-\u9fa5]{6,16}$/;
        const phoneReg = /^1[3456789]\d{9}$/;
        const passReg = /^[0-9a-zA-Z_]{4,32}$/;
        const emallReg = /^[a-zA-Z0-9_\.-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        const validateUser = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入公司名称"));
            } else if (!userReg.test(value)) {
                callback(new Error("不能输入符号，长度为6到16"));
            } else {
                callback();
            }
        };
        const validateCredit = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入统一社会信用代码"));
            } else {
                callback();
            }
        };
        const validateEmail = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入邮箱地址"));
            } else if (!emallReg.test(value)) {
                callback(new Error("邮箱格式不正确"));
            } else {
                callback();
            }
        };
        const validateCity = (rule, value, callback) => {
            if (this.selectedOptions.length == 0) {
                callback(new Error("请选择省市"));
            } else {
                callback();
            }
        };
        const validateAddress = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入详细地址"));
            } else {
                callback();
            }
        };
        const validatePhone = (rule, value, callback) => {
            if (value == "") {
                callback(new Error("请输入手机号"));
            } else if (!phoneReg.test(value)) {
                callback(new Error("手机号码格式不正确"));
            } else {
                callback();
            }
        };
        const validatePass = (rule, value, callback) => {
            if (!value) {
                callback(new Error("请输入密码"));
            } else if (!passReg.test(value)) {
                callback(new Error("数字字母下划线，长度为4-32位"));
            } else {
                callback();
            }
        };
        const validateCode = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入验证码"));
            } else {
                callback();
            }
        };
        const validatePass2 = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请再次输入密码"));
            } else if (!passReg.test(value)) {
                callback(new Error("数字字母下划线，长度为4-32位"));
            } else if (value !== this.companyForm.password) {
                callback(new Error("两次输入密码不一致!"));
            } else {
                callback();
            }
        };
        return {
            errorList: {
                userError: "",
                passError: "",
                codeError: "",
                emailError: "",
                phoneError: "",
                businessLicenseError: ""
            },
            rules: {
                companyName: [{
                    validator: validateUser,
                    trigger: "blur"
                }],
                password: [{
                    validator: validatePass,
                    trigger: "blur"
                }],
                checkPass: [{
                    validator: validatePass2,
                    trigger: "blur"
                }],
                businessLicense: [{
                    validator: validateCredit,
                    trigger: "blur"
                }],
                email: [{
                    validator: validateEmail,
                    trigger: "blur"
                }],
                address: [{
                    validator: validateAddress,
                    trigger: "blur"
                }],
                city: [{
                    type: "array",
                    validator: validateCity,
                    trigger: "change"
                }],
                phone: [{
                    validator: validatePhone,
                    trigger: "blur"
                }],
                code: [{
                    validator: validateCode,
                    trigger: "blur"
                }],
                type: [{
                    type: "array",
                    required: true,
                    message: "请阅读并同意用户守则",
                    trigger: "change"
                }]
            }
        };
    },
    created() {},
    methods: {}
};
export default mixinRegular