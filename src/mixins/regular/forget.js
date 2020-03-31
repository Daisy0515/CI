const mixinRegular = {
    data() {
        const phoneReg = /^1[3456789]\d{9}$/;
        const validatePhone = (rule, value, callback) => {
            if (value == "") {
                callback(new Error("请输入手机号"));
            } else if (!phoneReg.test(value)) {
                callback(new Error("手机号码格式不正确"));
            } else {
                callback();
            }
        };
        const passReg = /^[0-9a-zA-Z_]{4,32}$/;
        const validateCode = (rule, value, callback) => {
            if (value == "") {
                callback(new Error("请输入验证码"));
            } else {
                callback();
            }
        };
        const validatePass = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入新密码"));
            } else if (!passReg.test(value)) {
                callback(new Error("数字字母下划线，长度为4-32位"));
            } else {
                callback();
            }
        };

        const validatePass2 = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请再次输入密码"));
            } else if (!passReg.test(value)) {
                callback(new Error("数字字母下划线，长度为4-32位"));
            } else if (value !== this.forgetForm.password) {
                callback(new Error("两次输入密码不一致!"));
            } else {
                callback();
            }
        };
        return {
            phoneError: "",
            passError: "",
            codeError: "",
            rules: {
                phone: [{
                    validator: validatePhone,
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
                code: [{
                    validator: validateCode,
                    trigger: "blur"
                }]
            }
        };
    }
};
export default mixinRegular