<template>
    <div class="introduction">
        <el-form
                :model="ruleForm"
                :rules="rules"
                ref="ruleForm"
                label-width="100px"
                class="demo-ruleForm2"
        >
            <h3>个人简介</h3>
            <el-form-item label="学历" prop="education">
                <el-select v-model="regionIndex" placeholder="请选择学历" @change="selectDiploma">
                    <el-option
                            v-for="(item,index) in education"
                            :value="item.value"
                            :key="index"
                            :label="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="学校" prop="school">
                <el-input v-model="ruleForm.school"></el-input>
            </el-form-item>
            <el-form-item>
                <uoloadCard v-bind:idCard="ruleForm.idCard" v-on:setIdCard="setIdCard($event)"/>
            </el-form-item>
            <el-form-item label="擅长领域" prop="fieldList">
                <el-checkbox-group v-model="ruleForm.goTypeList">
                    <el-checkbox v-for="(item,index) in types" :key="index" :label="item.id">{{item.type}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <div class="work" v-for="(item,index) in ruleForm.workList" :key="index">
                <div class="addWork">
                    <span>工作经验</span>
                    <i :class="index===0?'el-icon-plus':'el-icon-minus'" @click="addExperience(index)"></i>
                </div>
                <el-form-item label="公司名称" prop="companyName">
                    <el-input v-model="item.companyName"></el-input>
                </el-form-item>
                <el-form-item label="在职时间" prop="workingStrTime" :error="item.errEnd">
                    <el-date-picker
                            value-format="yyyy-MM-dd"
                            v-model="item.workingStrTime"
                            type="date"
                            style="width:210px"
                            size="small"
                            placeholder="在职时间"
                            @blur="timeReg(item)"
                    ></el-date-picker>
                    <el-date-picker
                            value-format="yyyy-MM-dd"
                            size="small"
                            v-model="item.resignationStrTime"
                            type="date"
                            style="width:210px"
                            placeholder="结束时间"
                            @blur="timeReg(item)"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="职位" prop="name">
                    <el-input v-model="item.position"></el-input>
                </el-form-item>
                <el-form-item label="工作描述">
                    <el-input type="textarea" v-model="item.jobDescription" :rows="5" maxlength="600"></el-input>
                </el-form-item>
                <div style="clear:both"></div>
            </div>
            <el-form-item>
                <el-button @click="submitForm('ruleForm')" type="primary">修改</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import {httpGet, httpPut} from "@/utils/http.js";
    import {specificDate} from "@/utils/getDate.js";
    import {errTips} from "@/utils/tips.js";
    import uoloadCard from "@/common/upload/idCard";
    import {Notification} from "element-ui";

    export default {
        components: {uoloadCard},
        data() {
            const validateEducation = (rule, value, callback) => {
                if (!this.ruleForm.education) {
                    callback(new Error("请选择学历"));
                } else {
                    callback();
                }

            };
            return {
                loading: false,
                field: [],
                types: [],
                education: [
                    {value: "高中"},
                    {value: "大专"},
                    {value: "本科"},
                    {value: "研究生"},
                    {value: "博士"},
                    {value: "博士后"},
                    {value: "院士"}
                ],
                regionIndex: "",
                ruleForm: {
                    idCard: "",
                    education: "",
                    school: "",
                    name: "",
                    type: [],
                    resource: "",
                    typeList: [],
                    goTypeList: [], //擅长领域回显
                    fieldList: [],   //选择擅长领域后 fieldList=goTypeList fieldList用来提交
                    workList: [
                        {
                            index: 0,
                            companyName: "",
                            position: "",
                            workingStrTime: "",
                            resignationStrTime: "",
                            jobDescription: "",
                            errStart: "",
                            errEnd: ""
                        }
                        //   {index:2,name:'',startdate:'',enDate:'',describe:''}
                    ]
                },
                rules: {
                    school: [{required: true, trigger: "blur", message: "学校不能为空"}],
                    education: [
                        {
                            type: "array",
                            trigger: "change",
                            validator: validateEducation,
                            required: true,
                            message: "请选择学历"
                        }
                    ],
                }
            };
        },
        created: function () {
            this.getIntroduction();
        },
        computed: {},
        methods: {

            timeReg(item) {
                if (
                    new Date(item.resignationStrTime.replace(/\-/g, "/")) <
                    new Date(item.workingStrTime.replace(/\-/g, "/"))
                ) {
                    item.errEnd = "结束时间不能小于开始时间"
                } else {
                    item.errEnd = ""
                }
            },
            //获取个人简介
            getIntroduction() {
                httpGet("/v1/authorization/coreuser/brief/get").then(results => {
                    let formData = this.ruleForm;
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200) {
                        Object.assign(formData, data);

                        // 筛选得到父类别
                        this.types = formData.typeList.filter(function (item) {
                            if (item.parentId === 0)
                                return item;
                        })
                        //学历回显
                        this.$set(
                            this,
                            "regionIndex",
                            this.education[data.education - 1].value
                        );

                        if (data.respCoreExperienceInfoList.length == 0) {
                            this.$set(this.ruleForm, "workList", [
                                {
                                    index: 0,
                                    companyName: "",
                                    position: "",
                                    workingStrTime: "",
                                    resignationStrTime: "",
                                    jobDescription: "",
                                    errEnd: ""
                                }
                            ]);
                        } else {
                            formData.workList = data.respCoreExperienceInfoList.map(item => {
                                item.errEnd = "";
                                return item;
                            });
                            formData.workList.forEach((ele, index) => {
                                ele.index = index;
                                this.$set(
                                    ele,
                                    "resignationStrTime",
                                    specificDate(ele.resignationTime)
                                );
                                this.$set(ele, "workingStrTime", specificDate(ele.workingTime));
                            });
                        }
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                });
            },
            setIdCard(idCard) {
                this.ruleForm.idCard = idCard;
            },
            selectDiploma(value) {
                let newData = this.education;
                for (let index in newData) {
                    if (newData[index].value == value) {
                        this.ruleForm.education = parseInt(index) + 1;
                        return false;
                    }
                }
            },
            //添加（删除）工作经历
            addExperience(index) {
                let workItem = this.ruleForm.workList;
                if (index === 0) {
                    workItem.push({
                        index: index + 1,
                        companyName: "",
                        position: "",
                        workingStrTime: "",
                        resignationStrTime: "",
                        jobDescription: "",
                        errEnd: ""
                    });
                } else {
                    workItem.splice(index, 1);
                }
            },
            //提交修改
            submitForm(formName) {
                //选择擅长领域后 fieldList=goTypeList fieldList用来提交
                this.ruleForm.fieldList = this.ruleForm.goTypeList;
                if (this.ruleForm.fieldList.length == 0) {
                    errTips("请选择擅长领域！");
                    return false;
                }
                let value = this.regionIndex;
                for (let i = 0; i < this.ruleForm.workList.length; i++) {
                    if (this.ruleForm.workList[i].errEnd != "") {
                        return false
                    }
                }
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.selectDiploma(value);
                        httpPut(
                            "/v1/authorization/coreuser/brief/update",
                            this.ruleForm
                        ).then(results => {
                            const {httpCode, msg} = results.data;
                            if (httpCode === 200) {
                                Notification({
                                    title: "成功",
                                    message: "已修改成功！",
                                    type: "success",
                                    position: "bottom-right",
                                    duration: 1300
                                });
                            } else if (httpCode === 400) {
                                errTips("请上传身份照照片");
                            } else if (httpCode !== 401) {
                                errTips(msg);
                            }
                        });
                    } else {
                        return false;
                    }
                });
            }
        }
    };
</script>
<style lang='scss'>
    .introduction {
        .avatar {
            width: 320px;
            height: 170px;
            display: block;
        }

        .addWork {
            .el-icon-plus,
            .el-icon-minus {
                cursor: pointer;
                font-size: 23px;
            }
        }

        .work {
            border-top: 1px solid #e8e8e8;
            padding-top: 20px;
        }

        .el-textarea__inner {
            background: rgb(251, 251, 251);
        }
    }
</style>
