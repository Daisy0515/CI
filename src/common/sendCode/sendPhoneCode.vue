<template>
    <div class="sendCode">
        <el-button class="sendYz" @click="sendYz" :disabled="yzIndex?false:true">
            发送验证码
            <span v-show="!yzIndex">({{time}})</span>
        </el-button>
    </div>
</template>
<script>
    import {httpPost} from "@/utils/http.js";

    export default {
        props: ["phone", "codeType"],
        data() {
            return {
                time: "59",
                yzIndex: true
            };
        },
        methods: {
            sendYz() {
                const phoneReg = /^1[3456789]\d{9}$/;
                this.$emit("setPhoneErr", "");
                if (this.phone === "") {
                    this.$emit("setPhoneErr", "请输入手机号码");
                } else if (!phoneReg.test(this.phone)) {
                    this.$emit("setPhoneErr", "手机号码格式不正确");
                } else {
                    this.$emit("setPhoneErr", "");
                    httpPost("/v1/public/sms/sendcode", {
                        codeType: this.codeType,
                        phone: this.phone
                    }).then(results => {
                        const getData = results.data;
                        if (getData.httpCode === 200) {
                            this.yzIndex = false;
                            let setTime = setInterval(() => {
                                this.time -= 1;
                                if (this.time === 0) {
                                    clearInterval(setTime);
                                    this.yzIndex = true;
                                    this.time = 59;
                                }
                            }, 1000);
                        } else if (getData.msg === "该号码尚未注册") {
                            this.$emit("setPhoneErr", "该号码尚未注册");
                        } else if (getData.msg === "该号码已被注册,请勿重复注册") {
                            this.$emit("setPhoneErr", "该号码已被注册,请勿重复注册");
                        }
                    });
                }
            }
        }
    };
</script>
<style lang='scss'>
    .sendCode {
        .sendYz {
            float: right;
        }
    }
</style>
