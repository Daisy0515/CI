<template>
    <div class="personal">
        <el-form
                label-width="100px"
                class="demo-ruleForm clearfix"
        >
            <h3>第三方账号</h3>
            <el-form-item label="微信" prop="userName">
                <span v-show="weixinId==null">暂未绑定</span>
                <span v-show="weixinId!=null">{{weixinId}}</span>
                <el-button type="text" style="float: right" @click="unBind(2)">解除绑定</el-button>
            </el-form-item>
            <el-form-item label="QQ" prop="name">
                <span v-show="QQId==null">暂未绑定</span>
                <span v-show="QQId!=null">{{QQId}}</span>
                <el-button type="text" style="float: right" @click="unBind(3)">解除绑定</el-button>
            </el-form-item>

            <el-form-item label="微博" class="gaiphone" prop="phone">
<!--                <el-input :disabled="true" v-model="customerForm.phone"></el-input>-->
                <span v-show="weiboId==null">暂未绑定</span>
                <span v-show="weiboId!=null">{{weiboId}}</span>
                <el-button type="text" style="float: right" @click="unBind(1)">解除绑定</el-button>

            </el-form-item>


        </el-form>
    </div>
</template>

<script>
    import {httpGet, httpPost} from "@/utils/http.js";
    import {errTips, successTips} from "@/utils/tips.js";
    export default {
        data() {
            return {
                QQId:null,
                weixinId:null,
                weiboId:null
            };
        },
        created:function () {
            this.getBindInfo();
        },
        methods: {
            getBindInfo(){
                httpGet("v1/private/thirdparty/thirdpartyInfo/get").then(results => {
                    const {httpCode, msg, data} = results.data;
                    this.QQId = null;
                    this.weixinId = null;
                    this.weiboId = null;
                    if (httpCode === 200) {
                        let infoList = data.userInfoList;
                        for (let i=0; i<infoList.length; i++) {
                            if (infoList[i].type === 1) {
                                this.weiboId = infoList[i].thirdpartyId;
                            }
                            if (infoList[i].type === 2) {
                                this.weixinId = infoList[i].thirdpartyId;
                            }
                            if (infoList[i].type === 3) {
                                this.QQId = infoList[i].thirdpartyId;
                            }
                        }

                    } else {
                        errTips(msg);
                    }
                })
            },
            unBind(type){
                httpPost("/v1/private/thirdparty/untie/delete",{type:type}).then(results => {
                    const {httpCode, msg} = results.data;
                    if (httpCode === 200) {
                        successTips("解绑成功！");
                        this.getBindInfo();
                    } else {
                        errTips(msg);
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
