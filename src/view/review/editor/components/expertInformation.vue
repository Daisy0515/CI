<!--专家搜索专家信息的对话框的组件-->
<template>
    <el-dialog title="专家信息" :visible.sync="dialogFormVisible" :before-close="changeVisible"
               style="width:100%;text-align:left; font-weight: bolder;">
        <div style="width: 70%; margin: 0 auto;">
            <el-row :gutter="40">
                <el-col>

                    <h2 style="text-align: left;font-weight: bolder;margin-top: 2%;">基本资料</h2>

                    <el-form :model="ruleForm" style="margin-top: 2%;" ref="ruleForm" class="demo-ruleForm">
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
                                    <el-input v-model="ruleForm.name" :readonly="true"></el-input>
                                </el-form-item>
                                <el-form-item label="性别" :label-width="formLabelWidth">
                                    <el-input v-model="ruleForm.sex" :readonly="true"></el-input>

                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <div style="text-align: center;">
                                    <img :src="ruleForm.headurl" class="rounded-circle">
                                </div>

                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="邮箱" :label-width="formLabelWidth">
                                    <el-input v-model="ruleForm.email" :readonly="true"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="手机" :label-width="formLabelWidth">
                                    <el-input v-model="ruleForm.phone" :readonly="true"></el-input>
                                </el-form-item>
                            </el-col>

                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="学历" :label-width="formLabelWidth">
                                    <el-input v-model="ruleForm.education" :readonly="true"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="职位" :label-width="formLabelWidth">
                                    <el-input v-model="ruleForm.position" :readonly="true"></el-input>
                                </el-form-item>
                            </el-col>

                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="职称" :label-width="formLabelWidth">
                                    <el-input v-model="ruleForm.jobTitle" :readonly="true"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="个人主页" :label-width="formLabelWidth">
                                    <el-input v-model="ruleForm.homepage" :readonly="true"></el-input>
                                </el-form-item>
                            </el-col>

                        </el-row>
                        <el-row :gutter="20">

                            <el-col :span="12">
                                <el-form-item label="工作单位" :label-width="formLabelWidth">
                                    <el-input v-model="ruleForm.workUnit" :readonly="true"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="部门" :label-width="formLabelWidth">
                                    <el-input v-model="ruleForm.department" :readonly="true"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="国家" :label-width="formLabelWidth">
                                    <el-input v-model="ruleForm.nation" :readonly="true"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="省市/自治区" :label-width="formLabelWidth">
                                    <el-input v-model="ruleForm.province" :readonly="true"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="通讯地址" :label-width="formLabelWidth">
                                    <el-input v-model="ruleForm.contactAddress" :readonly="true"></el-input>
                                </el-form-item>
                            </el-col>
                            <hr style="width: 100%; color: #303133;">
                        </el-row>
                        <h2 style="text-align: left;font-weight: bolder;margin-top: 2%;margin-bottom: 2%;">研究兴趣</h2>
                        <el-row :gutter="20">
                            <el-form-item label="研究方向" :label-width="formLabelWidth" prop="researchDirection">
                                <el-input v-model="ruleForm.researchDirectionList" style="width: 100%"
                                          :readonly="true"></el-input>

                            </el-form-item>
                        </el-row>
                        <el-row :gutter="20">
                            <el-form-item label="个人关键词" :label-width="formLabelWidth">
                                <el-input v-model="ruleForm.cruxList" :readonly="true" style="width: 100%"></el-input>
                            </el-form-item>
                        </el-row>
                    </el-form>


                </el-col>

            </el-row>
        </div>

    </el-dialog>
</template>

<script>
    export default {
        name: "expertInformation",
        props: {
            ruleForm: {
                type: Object,
                default: null,
            },
            dialogFormVisible: {
                type: Boolean,
                default: false,
            },
        },
        methods: {
            changeVisible() {
                this.$emit('closeDialog');
            },
            rowClass() {
                return "background:#F4F6F9;";
            }
        },
        data() {
            return {
                formLabelWidth: "100px",
                isReadOnly: true,
            }
        }
    }
</script>

<style scoped>
    .rounded-circle {
        width: 90px;
        height: 90px;
        border: 1px solid #f0f0f0;
    }
</style>
