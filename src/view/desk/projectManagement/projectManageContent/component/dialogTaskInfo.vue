<!--功能：任务管理页面调用的查看任务详情
    调用页面：task Manage
             -->
<template>
    <el-dialog :title="form.titleName" :visible.sync="dialogFormVisible" :before-close="changeVisible"
               style="width:100%;text-align:left; font-weight: bolder;">
        <el-form :model="form" v-loading="loading">
            <el-row :gutter="20">
                <el-col :span="10">
                    <el-form-item label="任务名称" :label-width="formLabelWidth">
                        <el-input v-model="form.missionTypeName" auto-complete="off" :readonly="isReadOnly"/>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="任务状态" :label-width="formLabelWidth">
<!--                        <el-input v-model="form.status " auto-complete="off" :readonly="isReadOnly"/>-->
                        <el-select v-model="form.status">
                            <el-option value="1" label="执行中"></el-option>
                            <el-option value="2" label="完成"></el-option>
                            <el-option value="3" label="放弃"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="10">
                    <el-form-item label="任务创建时间" :label-width="formLabelWidth">
                        <el-input v-model="form.gmtCreate " auto-complete="off" :readonly="isReadOnly"/>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="任务修改时间" :label-width="formLabelWidth">
                        <el-input v-model="form.gmtModified  " auto-complete="off" :readonly="isReadOnly"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">

                <el-form-item label="执行人" :label-width="formLabelWidth">
                    <el-input v-model="form.participantList" auto-complete="off" :readonly="isReadOnly"/>

                </el-form-item>

            </el-row>
            <el-row :gutter="20">

                    <el-form-item label="执行时间" :label-width="formLabelWidth">
                        <el-date-picker
                                v-model="form.startTime"
                                type="date"
                                placeholder="开始时间"
                                value-format="yyyy-MM-dd"
                        ></el-date-picker>
<!--                        <el-input style="width: 30%" v-model="form.startTime" auto-complete="off" />-->
                    到
                        <el-date-picker
                                v-model="form.endTime"
                                type="date"
                                placeholder="开始时间"
                                value-format="yyyy-MM-dd"
                        ></el-date-picker>
<!--                        <el-input style="width: 30%" v-model="form.endTime" auto-complete="off" />-->
                    </el-form-item>

            </el-row>
            <el-row :gutter="20">
                <el-col :span="16">
                    <el-form-item label="任务描述" :label-width="formLabelWidth">
                        <el-input v-model="form.description" type="textarea" :rows="6" placeholder="请输入内容"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="20">
                    <el-table :data="form.resourceList" border :header-cell-style="rowClass">
                        <el-table-column prop="gmtCreate" label="上传时间"></el-table-column>
                        <el-table-column prop="resourceName" label="附件名称"
                                         :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <a target="_Blank" :href="scope.row.resourceUrl"> 下载 </a>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
            <div style="text-align: center;margin-top: 50px">
                <el-button type="primary" @click="submit">保存修改</el-button>
            </div>
        </el-form>

    </el-dialog>
</template>

<script>
    import {httpPut} from '@/utils/http.js';
    import {errTips, successTips} from '@/utils/tips.js';
    export default {
        name: "editorViewDetail",
        props: {
            form: {
                type: Object,
                default: null,
            },
            dialogFormVisible: {
                type: Boolean,
                default: false,
            },
            loading: {
                type: Boolean,
                default: false,
            }
        },
        methods: {
            changeVisible() {
                this.$emit('closeDialog');
            },
            submit() {
                let dataForm = this.form;
                console.log("120", dataForm);
                httpPut("/v1/authorization/manage/mission/update",dataForm).then(results => {
                    const {httpCode} = results.data;
                    if (httpCode===200) {
                        successTips("修改成功！");
                    } else {
                        console.log("126", httpCode);
                        errTips("修改失败！");
                    }
                })
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

</style>
