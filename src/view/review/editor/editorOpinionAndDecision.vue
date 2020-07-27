<template>
    <div>
        <el-row>
            <h2>意见与决定</h2>
        </el-row>
        <el-row>
            <el-col :offset="3">
                <h2>评审任务名称：一种将人体服装图像转换为平面服装图像的生成对抗网络</h2>
            </el-col>
        </el-row>
        <br>
        <el-row>
            <el-col :offset="2">
                <h3 v-if="isComplete===true">提示：当前评审任务已有设定的评审专家完成评审任务，没有评审专家处于评审中或邀请未回复状态，您可以提交您的意见</h3>
                <h3 v-if="isComplete===false">提示：当前评审任务还有未完成评审的评审专家，您可以中止未完成评审的专家的任务来进行下一步操作</h3>
            </el-col>
        </el-row>
        <br>
        <el-row>
            <el-col>
                <h3>本次评审需要审核专家人数: <span style="margin-left:20px;">3</span></h3>
            </el-col>
        </el-row>
        <el-table :data="resultList" style="margin-top: 20px;" border v-loading="resultListLoading">
            <el-table-column property="scoreTitle" label="评审专家" align="center"></el-table-column>
            <el-table-column property="hint" label="邀请时间" align="center"></el-table-column>
            <el-table-column property="type" label="状态" align="center"></el-table-column>
            <el-table-column label="评审结果" align="center">
                <template slot-scope="scope">
                    <el-button @click="handleEditItem(scope.$index)" type="text" size="medium"
                    ><i class="el-icon-search"></i>详情
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-row style="margin: 20px 0">
            <el-col :offset="2">
                <h3 v-if="isComplete===false">提示：中止未完成任务，评审任务会从上面表格中的评审专家里的任务列表中转移到已中止页面 ，
                    您可以为在这个任务中相关评审专家发送提醒邮件。 如果有需要，您也可以重新邀请这些评审专家。</h3>
            </el-col>
        </el-row>
        <div>
            <h3>给作者的意见:</h3>
            <el-input type="textarea" :rows="5" v-model="commentsToAuthor"></el-input>
        </div>
        <br>
        <div>
            <h3>给管理员的意见:</h3>
            <el-input type="textarea" :rows="5" v-model="commentsToEditor"></el-input>
            <br>
        </div>
        <el-form  ref="form"  v-if="isComplete===true">
            <el-form-item label="管理员决定" style="margin:20px 0 0 35%">
                <el-col :span="6">
                    <el-select v-model="reviewerOpinion" placeholder="请选择">
                        <el-option label="通过" value=1></el-option>
                        <el-option label="需要修改" value=2></el-option>
                        <el-option label="不通过" value=3></el-option>
                        <el-option label="没有意见" value=4></el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item >
                <h3>管理员的意见:</h3>
                <el-input type="textarea" :rows="5" placeholder="请输入管理员意见！"></el-input>
            </el-form-item>
            <el-row>
                <el-col :span="12">
                    <el-form-item>
                        <el-table :data="attachments" style="margin-top: 20px;" border>
                            <el-table-column property="scoreTitle" label="附件名" align="center"></el-table-column>
                            <el-table-column property="hint" label="上传者" align="center"></el-table-column>
                            <el-table-column property="type" label="让作者可见" align="center">
                                <template slot-scope="scope">
                                    <el-checkbox v-model="scope.row">备选项</el-checkbox>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form-item>
                </el-col>
                <el-col :span="6" :offset="2">
                    <el-form-item>
                        <sourceUpload style="margin-top: 30px;" :uploadIndex="uploadIndex" v-on:setIdCard="setIdCard($event)"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item style="margin-left: 35%">
                <el-button type="primary" @click="submitEditorOpinion" :loading="submitLoading">提交意见</el-button>
                <el-button>取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import sourceUpload from '@/common/upload/resourceUpload';
    import {httpGet,httpPost} from "@/utils/http.js";
    export default {
        name: "editorOpinionAndDecision",
        props:{
            id:{//管理员任务编号ID
                type:Number,
                default:null,
            },
            isComplete:{//true表示进入管理员提交意见的页面，false表示管理员进入中止任务的页面
                type:Boolean,
                default:true,
            }
        },
        components: {
            sourceUpload
        },
        data() {
            return {
                /**提交意见前的信息显示**/
                title:null,// 评审任务名称 ,
                configList:[],//评价模板信息配置集合
                number: null,//评审专家完成人数要求 ,
                resultList : [],//评价详情结果集（评审专家意见）
                userList:[],// 评审者信息集合
                resultListLoading:false,//控制评价详情结果集的加载显示

                reviewerOpinion: null,//管理员意见
                submitLoading:false,//提交时，按钮处于加载状态，防止重复提交

                attachments: null,//上传的附件
                uploadIndex: false,//控制上传组件是否上传
                commentsToAuthor: null,//给作者的意见
                commentsToEditor: null,//给管理员的意见
            };
        },
        methods:{
            getView(){
                this.resultListLoading = true;
                httpGet("/v1/authorization/review/adminopinion/get",{id:this.id}).then(results => {
                    const {httpCode, msg, data} = results.data;
                    console.log("data", data);
                    if (httpCode == 200) {
                        this.title = data.title;
                        this.configList = data.configList;
                        this.number = data.number;
                        this.resultList = data.resultList;
                        this.userList = data.userList;
                    }else if(httpCode !== 401) {
                        errTips(msg);
                    }
                    this.resultListLoading = false;
                });
            },
            submitEditorOpinion(){
                this.submitLoading = true;
                httpPost('/v1/authorization/review/adminopinion/insert', ).then(results => {
                    const {msg, httpCode} = results.data;
                    if (httpCode === 200) {
                        successTips('提交意见成功');

                    } else if (httpCode !== 401) {
                        errTips(msg);
                    } else {
                        alert(httpCode);
                    }
                    this.submitLoading = false;
                });
            }
        },
    }
</script>

<style scoped>

</style>
