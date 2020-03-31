 const mixinRegular = {
     data() {
         const phoneReg = /^1[3456789]\d{9}$/;
         const passReg = /^[0-9a-zA-Z_]{4,32}$/;
         const validatephone = (rule, value, callback) => {
             if (value == "") {
                 callback(new Error("请输入手机号"));
             } else if (!phoneReg.test(value)) {
                 callback(new Error("手机号码格式不对"));
             } else {
                 callback();
             }
         };
         const validatePass = (rule, value, callback) => {
             if (!value) {
                 callback(new Error("请输入密码"));
             } else if (!passReg.test(value)) {
                 callback(new Error("密码格式为数字字母下划线,长度为4-32位"));
             } else {
                 callback();
             }
         };
         return {
             rules: {
                 password: [{
                     validator: validatePass,
                     trigger: "blur"
                 }],
                 phone: [{
                     validator: validatephone,
                     trigger: "blur"
                 }]
             }
         };
     },
     created() {},
     methods: {}
 };
 export default mixinRegular