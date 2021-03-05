<template>
    <el-dialog :visible.sync="dialogFormVisible" :before-close="changeVisible"
               width="70%">
        <div class="container deskHeader">
            <el-card>
                <div class="card_main">
                    <img :src="ruleForm.headurl?ruleForm.headurl:getnoImg"/>
                    <h2 style="color:#7cabb1">{{ruleForm.userName}}</h2>
                </div>
            </el-card>
            <el-card>
                <h3 class="myh3">个人资料</h3>
                <div class="card_main">
                    <p>邮箱：{{ruleForm.email}}</p>
                    <p>手机号：{{ruleForm.phone}}</p>
                    <p>性别：{{ruleForm.sex}}</p>
                    <p>姓名：{{ruleForm.name?ruleForm.name:"暂无信息"}}</p>
                </div>
            </el-card>
            <el-card>
                <h3 class="myh3">个人简介</h3>
                <div class="personal_txt">
                    <p v-if="!ruleForm.education">学历：暂无数据</p>
                    <p v-if="ruleForm.education===1">学历：高中</p>
                    <p v-if="ruleForm.education===2">学历：大专</p>
                    <p v-if="ruleForm.education===3">学历：本科</p>
                    <p v-if="ruleForm.education===4">学历：研究生</p>
                    <p v-if="ruleForm.education===5">学历：博士</p>
                    <p v-if="ruleForm.education===6">学历：博士后</p>
                    <p v-if="ruleForm.education===7">学历：院士</p>
                    <p v-if="ruleForm.school">学校：{{ruleForm.school}}</p>
                </div>
            </el-card>
            <el-card>
                <h3 class="experience myh3">工作经历</h3>
                <div class="expresice"
                        v-if="ruleForm.experienceInfoList !== undefined && ruleForm.experienceInfoList.length ===0">
                    <p>暂无数据</p>
                </div>
                <div class="expresice" v-for="(item,index) in ruleForm.experienceInfoList" :key="index">
                    <p>公司名称：{{item.companyName}}</p>
                    <p>在职时间：{{item.workingTime?item.workingTime:'暂无数据'}}</p>
                    <p>离职时间：{{item.resignationTime?item.resignationTime:'暂无数据'}}</p>
                    <p>职位：{{item.position?item.position:'暂无数据'}}</p>
                    <p>描述：{{item.jobDescription?item.jobDescription:'暂无数据'}}</p>
                </div>
            </el-card>
        </div>
    </el-dialog>
</template>
<script>
    // import {httpGet} from "@/utils/http.js";
    // import {specificDate} from "@/utils/getDate.js";
    import {mapGetters} from "vuex";
    // import {errTips} from "@/utils/tips.js";

    export default {
        name: "teamMemberInfo",
        props: {
            dialogFormVisible: {
                type: Boolean,
                default: false,
            },

            ruleForm: {
                type: Object,
                default: null,
            },
        },
        computed: {
            ...mapGetters(["getnoImg"])
        },
        data() {
            return {
                teamId: "",
                selestate: [],
            };
        },
        methods: {
            changeVisible() {
                this.$emit('closeDialog');
            }
        }
    };
</script>
<style lang='scss' scoped>
    .myh3 {
        color: #7cabb1;
        margin-bottom: 10px !important;
    }

    .container .deskHeader .el-card {
        margin-bottom: 10px;
    }
    
</style>
