<template>
    <div class="register">
        <reviewHead/>
<!--        <div v-if="registerIsShow==false" style="height: 100%;">-->
<!--            <el-card class="box-card" style="text-align: center;font-weight: bolder;font-size: large;">-->
<!--                {{displayMsg}}-->
<!--            </el-card>-->
<!--        </div>-->
        <div class="container">
            <el-card class="messageBox" v-if="registerIsShow==false" >
                {{displayMsg}}
            </el-card>
            <el-card class="box-card" v-if="registerIsShow==true">
                <div slot="header" class="clearfix" style="text-align:center">
                    <span>评审管理员注册</span>
                </div>
                <h2 style="text-align: left;font-weight: bolder;margin-top: 2%;">基本资料</h2>
                <div>
                    <el-form :rules="rules" :model="ruleForm" style="margin-top: 2%;" ref="ruleForm"
                             class="demo-ruleForm">
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
                                    <el-input v-model="ruleForm.name"></el-input>
                                </el-form-item>
                                <el-form-item label="性别" :label-width="formLabelWidth" prop="sex">
                                    <el-select v-model="ruleForm.sex" placeholder="请选择性别" style="width: 100%;">
                                        <el-option label="男" value="1"></el-option>
                                        <el-option label="女" value="2"></el-option>
                                        <el-option label="未知" value="3"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <div style="text-align: center;">
                                    <Avatar></Avatar>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="邮箱" :label-width="formLabelWidth">
                                    <el-input v-model="ruleForm.email" :disabled="true"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="手机" :label-width="formLabelWidth">
                                    <el-input v-model="ruleForm.phone" :disabled="true"></el-input>
                                </el-form-item>
                            </el-col>

                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="学历" :label-width="formLabelWidth" prop="education">
                                    <el-select v-model="ruleForm.education" placeholder="请选择学历" style="width: 100%;">
                                        <el-option label="高中" value="1"></el-option>
                                        <el-option label="大专" value="2"></el-option>
                                        <el-option label="本科" value="3"></el-option>
                                        <el-option label="研究生" value="4"></el-option>
                                        <el-option label="博士" value="5"></el-option>
                                        <el-option label="博士后" value="6"></el-option>
                                        <el-option label="院士" value="7"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="职位" :label-width="formLabelWidth">
                                    <el-input v-model="ruleForm.position"></el-input>
                                </el-form-item>
                            </el-col>

                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="职称" :label-width="formLabelWidth">
                                    <el-input v-model="ruleForm.jobTitle"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="个人主页" :label-width="formLabelWidth">
                                    <el-input v-model="ruleForm.homepage"></el-input>
                                </el-form-item>
                            </el-col>

                        </el-row>
                        <el-row :gutter="20">

                            <el-col :span="12">
                                <el-form-item label="工作单位" :label-width="formLabelWidth" prop="workUnit">
                                    <el-input v-model="ruleForm.workUnit"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="部门" :label-width="formLabelWidth">
                                    <el-input v-model="ruleForm.department"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="国家" :label-width="formLabelWidth" prop="nation">
                                    <foreign-area popularCity="" selectBg="selectGray" groupBg="groupGray"
                                                  @selectCountry="selectCountry"></foreign-area>
                                </el-form-item>
                            </el-col>

                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="通讯地址" :label-width="formLabelWidth">
                                    <el-input v-model="ruleForm.contactAddress" style="width: 440px;"></el-input>
                                </el-form-item>
                            </el-col>
                            <hr style="width: 100%; color: #303133;">
                        </el-row>
                        <h2 style="text-align: left;font-weight: bolder;margin-top: 2%;margin-bottom: 2%;">研究兴趣</h2>
                        <el-row :gutter="20">
                            <el-col :span="19">
                                <el-form-item label="研究方向" :label-width="formLabelWidth" prop="researchDirection">
                                    <el-input v-model="researchName"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="5">
                                <div style="text-align: left;margin-top: 5px;">
                                    <el-button type="text" @click="keywordsVisible = true" class="add"><i
                                            class="el-icon-plus"></i>添加
                                    </el-button>
                                </div>

                                <el-dialog title="请选择个人研究方向" :visible.sync="keywordsVisible" style="text-align: left;"
                                           width="900px">
                                    <div style="width: 80%;text-align: center">

                                        <el-transfer
                                                style="text-align: left; display: inline-block"
                                                v-model="value"
                                                :data="data">
                                        </el-transfer>

                                    </div>
                                    <div slot="footer" class="dialog-footer">
                                        <el-button @click="keywordsVisible = false">取 消</el-button>
                                        <el-button type="primary" @click="printValue">确 定</el-button>
                                    </div>
                                </el-dialog>
                            </el-col>

                        </el-row>
                        <el-row :gutter="20">
                            <el-form-item label="个人关键词" :label-width="formLabelWidth">
                                <add-key-words :dynamic-tags="ruleForm.cruxList"
                                               @addKeyWord="addKeyWords"></add-key-words>
                            </el-form-item>
                        </el-row>

                        <el-form-item class="cancel" style="text-align: center;">
                            <el-button type="primary" @click="submitForm('ruleForm')" size="medium"
                                       style="width:150px;">注册
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-card>
        </div>
        <Footer></Footer>
    </div>
</template>
<script>
    import {provinceAndCityData, CodeToText} from "element-china-area-data";
    //import IndexHeader from "@/common/header/userHeader";
    import Footer from "@/common/footer/footer";
    import {httpGet, httpPut} from "@/utils/http.js";
    import regular from "@/mixins/regular/companyRegister.js";
    import foreignArea from "@/view/loginRegister/register/components/foreignArea";
    import Avatar from "@/common/upload/Avatar";
    import {errTips, successTips, message } from '@/utils/tips.js';
    import addKeyWords from "@/view/review/expert/components/addKeyWords";
    import reviewHead from "@/common/header/reviewLayout";

    export default {
        name: "adminRegister",
        components: {
            foreignArea,
            reviewHead,
            Footer,
            Avatar,
            addKeyWords
        },
        //表单验证
        mixins: [regular],
        data() {
            return {
                registerIsShow:false,
                displayMsg:"",
                rules: {
                    name: [{required: true, message: '请输入姓名', trigger: 'blur'}],
                    researchDirection: [{required: true, message: '请选择研究方向', trigger: 'blur'}],
                    workUnit: [{required: true, message: '工作单位不能为空', trigger: 'blur'}],
                    nation: [{required: true, message: '国家不能为空', trigger: 'blur'}],
                    education: [{required: true, message: '学历不能为空', trigger: 'blur'}],
                    sex: [{required: true, message: '性别不能为空', trigger: 'blur'}]

                },
                data: null,
                value: [],
                filterMethod(query, item) {
                    return item.pinyin.indexOf(query) > -1;
                },
                visible: false,
                keywordsVisible: false,
                interest: "",
                formLabelWidth: '100px',
                ruleForm: {
                    address: "",
                    city: "",
                    contactAddress: "",
                    cruxList: [],
                    department: "",
                    education: null,
                    email: "",
                    headurl: "",
                    homepage: "",
                    id: null,
                    jobTitle: "",
                    name: "",
                    nation: "",
                    phone: "",
                    position: "",
                    province: "",
                    researchDirectionList: [],
                    role: 4,
                    school: "",
                    sex: null,
                    workUnit: "",
                },
                researchName: null,
                options: provinceAndCityData,
                newcity: CodeToText,
                selectedOptions: [],
                companyForm: {
                    companyName: "",
                    password: "",
                    checkPass: "",
                    address: "",
                    province: "",
                    city: "",
                    businessLicense: "",
                    email: "",
                    code: "",
                    phone: "",
                    type: []
                },
                researchList: [],
            };
        },
        created: function () {
            //this.getApplayInfo();
            this.getResearchList();
            this.getPersonalInfo();
        },
        methods: {
            //查询申请记录
            getApplayInfo:function() {
                //type = 2 申请管理员的记录
                httpGet("/v1/authorization/coreuser/ApplyInfo/get?type=2").then(results => {
                    const {httpCode, msg} = results.data;
                    if (httpCode === 200) {
                        if (msg == "已提交过申请") {
                            this.displayMsg = "您已提交申请,请勿重复注册";
                        } else {
                            this.registerIsShow = true;
                        }
                    } else {
                        errTips(msg);
                    }
                })
            },
            addKeyWords(val) {
                this.ruleForm.cruxList = val;
            },
            printValue() {
                this.researchName = null;
                let arr = [];
                for (let i = 0; i < this.value.length; i++) {
                    arr.push(this.researchList[this.value[i] - 1].researchDirection);
                }
                this.researchName = arr.join();
                this.keywordsVisible = false;
            },
            getPersonalInfo() {
                httpGet("/v1/authorization/coreuser/review/register?role=4").then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200) {
                        this.ruleForm.phone = data.phone;
                        this.ruleForm.email = data.email;
                        this.ruleForm.id = data.id;
                        this.getApplayInfo();
                    } else {
                        if (msg == "该用户已拥有评审管理员角色，请勿重复注册") {
                            this.displayMsg = msg;
                        } else {
                            errTips(msg);
                        }
                    }
                })
            },
            setPhoneErr(msg) {
                this.errorList.phoneError = msg;
            },
            //表单提交

            selectCountry(val) {
                this.ruleForm.nation = val;
            },

            getResearchList() {
                httpGet("/v1/public/coreuser/list/research").then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200) {
                        this.researchList = data.researchDirectionList;

                        this.data = [];
                        for (var i = 0; i < this.researchList.length; i++) {
                            this.data.push({
                                label: this.researchList[i].researchDirection,
                                key: this.researchList[i].id
                                //   pinyin: pinyin[index]
                            });
                        }

                    } else {
                        errTips(msg);
                    }
                })
            },

            submitForm() {
                this.ruleForm.province = this.newcity[this.selectedOptions[0]];
                this.ruleForm.city = this.newcity[this.selectedOptions[1]];
                this.ruleForm.researchDirectionList = this.value;

                httpPut("/v1/authorization/coreuser/review/user", this.ruleForm).then(results => {
                    const {httpCode, msg} = results.data;
                    if (httpCode === 200) {
                        successTips('申请已提交，等待系统管理员审核');
                    } else {
                        errTips(msg);
                    }
                })
            },

            addMission() {
                if (this.interest == '') {
                    errTips('关键词不能为空');
                    this.visible = false;
                    return false;
                } else {
                    this.ruleForm.cruxList.push(this.interest);
                    this.interest = "";
                    this.visible = false;
                }

            },

        }

    }
</script>
<style lang='scss'>
    .register {
        width: 100%;
        height: 100%;
    }
    .container {
        width: 100%;
        height: 100%;
        .box-card {
            width: 80%;
            margin: 5% auto;
        }

        .el-card__header {
            padding: 20px 0 0 0;
            font-size: 30px;
            font-weight: 400;
            border-bottom: 0;
        }

        .add {
            cursor: pointer;
            color: #8c8c8c;

            &:hover {
                color: #3e76b8;
            }
        }

        .messageBox {
            margin-top: 20%;
            padding: 50px;
            text-align: center;
            font-weight: bolder;
            font-size: large;
        }
    }
</style>
