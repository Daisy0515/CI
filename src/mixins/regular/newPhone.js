const mixinRegular = {
    data() {
        const phoneReg = /^1[3456789]\d{9}$/;
        const validatePhone = (rule, value, callback) => {
            if (!phoneReg.test(value)) {
                callback(new Error("手机号码格式不正确"));
            } else {
                callback();
            }
        };
        const validateCode = (rule, value, callback) => {
            if (value == "") {
                callback(new Error("请输入验证码"));
            } else {
                callback();
            }
        };
        return {
            codeError: "",
            phoneError: "",
            rules: {
                phone: [{
                    validator: validatePhone,
                    trigger: "blur"
                }],
                code: [{
                    validator: validateCode,
                    trigger: "blur"
                }]
            }
        };
    }
};
export default mixinRegular
