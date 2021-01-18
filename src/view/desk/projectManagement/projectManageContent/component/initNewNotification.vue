<!--功能：发起新的通知
    调用页面：notification
             -->
             <template>
                <el-dialog  :visible.sync="initNewNotificationVisible" :before-close="changeVisible"
                           style="width:100%;text-align:left; font-weight: bolder;">
                    <el-form  v-loading="loading">
                        <el-row :gutter="20">
                            <el-col :span="10">
                                <el-form-item label="通知主题" :label-width="formLabelWidth">
                                    <el-input v-model="noticeData.theme" auto-complete="off" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="通知类型" :label-width="formLabelWidth">
            <!--                        <el-input v-model="form.status " auto-complete="off" :readonly="isReadOnly"/>-->
                                        <el-select v-model="noticeData.type">
                                            <el-option value="1" label="会议通知"></el-option>
                                            <el-option value="2" label="其他"></el-option>
                                            
                                        </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="10">
                                <el-form-item label="相关人员" :label-width="formLabelWidth">
                                    <el-checkbox-group v-model="noticeData.participantsList">
                                        <el-checkbox v-for="(item, index) in userList" :key="index" :label="item.id">{{
                                            item.userName }}
                                        </el-checkbox>
                                    </el-checkbox-group>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
            
                                <el-form-item label="通知日期" :label-width="formLabelWidth">
                                    <el-date-picker
                                            v-model="noticeData.notificationTime"
                                            type="date"
                                            placeholder="开始时间"
                                            value-format="yyyy-MM-dd"
                                    ></el-date-picker>
                                </el-form-item>
            
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="16">
                                <el-form-item label="通知内容" :label-width="formLabelWidth">
                                    <el-input v-model="noticeData.content" type="textarea" :rows="6" placeholder="请输入内容"/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="16">
                                <el-form-item label="上传附件" :label-width="formLabelWidth">
                                    <!--此处改为文件上传 -->
                                     <sourceUpload :uploadIndex="testUploadIndex" :fileIndex="2"
                                                  v-on:setIdCard="setIdCard2($event)"/> 
                                </el-form-item> 
                            </el-col>
                        </el-row>
                        <div style="text-align: center;margin-top: 50px">
                            <el-button type="primary" @click="submitNotice">发起通知</el-button>
                        </div>
                    </el-form>
            
                </el-dialog>
            </template>
            
            <script>
                import {httpPut} from '@/utils/http.js';
                import {errTips, successTips} from '@/utils/tips.js';
                import {httpGet, httpDelete, httpPost} from '@/utils/http.js';
                import sourceUpload from '@/common/upload/resourceUpload';
                export default {
                    name: "editorViewDetail",
                    components: {
                        sourceUpload,
                    },
                    props: {
                        form: {
                            type: Object,
                            default: null,
                        },
                        initNewNotificationVisible: {
                            type: Boolean,
                            default: false,
                        },
                        loading: {
                            type: Boolean,
                            default: false,
                        }
                    },
                    created: function () {
            
                        this.projectId = this.$route.query.teamId;
                        console.log(this.projectId);
                        if (!this.projectId) {
                            console.log("no project");
                        }
                        this.getUserlist();
                    },
                    methods: {
                        changeVisible() {
                            this.$emit('closeDialog');
                        },
                        submit() {
                            let dataForm = this.form;
                            console.log(dataForm);
                            httpPut("/v1/authorization/manage/mission/update",dataForm).then(results => {
                                const {httpCode} = results.data;
                                if (httpCode===200) {
                                    successTips("修改成功！");
                                } else {
                                    errTips("修改失败！");
                                }
                            })
                        },
                        setIdCard2(data){
                            console.log(data);
                            data && (this.noticeData.resource = data.fileName);
                            let dataForm = this.noticeData.resource.split('/');
                            this.noticeData.resourceName=dataForm[dataForm.length-1];
                            //console.log(this.noticeData);
                            httpPost('/v1/authorization/notification/notification/insert', this.noticeData).then(results => {
                                const {msg, httpCode, data} = results.data;
                                if (httpCode === 200) {
                                    successTips('发布成功！');
                                } else {
                                    errTips(msg);
                                }
                                this.getUserlist();
                                this.noticeData.content = '';
                                this.noticeData.theme= '';
                                this.noticeData.participantsList = [];
                                this.noticeData.resource = '';
                                this.noticeData.notificationTime = '';
                                this.noticeData.type = '';
                                this.noticeData.resourceName = '';
                            });
                        },
                        getUserlist() {
                            httpGet('/v1/authorization/manage/user/list?',{teamId:this.projectId}).then(results => {
                            const {msg, data, httpCode} = results.data;
                            if (httpCode === 200) {
                                this.userList = data.userList;
                                //console.log(data);
                            } else if (httpCode === 400) {
                                this.setCache('');
                            } else if (httpCode !== 401) {
                                errTips(msg);
                            }
                        });
            },
                        
                        submitNotice() {
                            this.noticeData.resource ? this.setIdCard2() : (this.testUploadIndex = !this.testUploadIndex);
                        },
                        rowClass() {
                            return "background:#F4F6F9;";
                        }
                    },
                    data() {
                        return {
                            formLabelWidth: "100px",
                            isReadOnly: true,
                            testUploadIndex:false,
                            userList:[],
                            noticeData: {
                                theme:"",
                                participantsList:[],
                                type:"",
                                notificationTime:"",
                                content:"",
                                resource:"",
                                teamId:this.$route.query.teamId,
                                resourceName:'',
                        },
                        }
                    }
                }
            </script>
            
            <style scoped>
            
            </style>