<!--
我的投标的交付，包括上传资源和查看评审结果
-->
<template>
    <div class="editorialTeam">
        <div class="Crumbs">
            <div class="container deskHeader">
                <h4>
                    您的位置：
                    <router-link to="myBid">我的投标</router-link>
                    >
                    <span class="active">项目交付</span>
                </h4>
            </div>
        </div>
        <div class="container deskHeader">
            <el-table :data="ReviewTable" style="width:900px;margin:50px auto;" :header-cell-style="rowClass"
                      v-loading="loading">
                <el-table-column label="评审状态" align="center">
                    <el-table-column fixed prop="typeName" label="评审流程" align="center">
                    </el-table-column>
                    <el-table-column prop="title" label="评审标题" align="center">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" :content="scope.row.title" placement="top-start">
                                <span class="tablehidden">{{ scope.row.title }}</span>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column label="评审结果" align="center">
                        <template slot-scope="scope">
                            <el-button @click="handleClickDetail(scope.row.id)" type="text" size="medium"><i
                                    class="el-icon-search"></i>查看详情
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="adminOpinion" label="管理员意见" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.adminOpinion === 1">通过</span>
                            <span v-if="scope.row.adminOpinion === 2">未通过</span>
                            <span v-if="scope.row.adminOpinion === 3">拒绝</span>
                            <span v-if="scope.row.adminOpinion === 4">没有意见</span>
                        </template>
                    </el-table-column>
                </el-table-column>
            </el-table>
            <el-dialog title="评审意见" :visible.sync="dialogVisible" width="60%" :close-on-click-modal="false">
                <el-form :model="form">
                    <h2 class="header">管理员意见：</h2>
                    <el-row :gutter="20">
                        <el-col :span="6">
                            <el-form-item label="管理员决定" :label-width="formLabelWidth">
                                <span v-if="form.adminOpinion.opinion === 1" class="score">通过</span>
                                <span v-if="form.adminOpinion.opinion === 2" class="score">未通过</span>
                                <span v-if="form.adminOpinion.opinion === 3" class="score">拒绝</span>
                                <span v-if="form.adminOpinion.opinion === 4" class="score">没有意见</span>
                            </el-form-item>
                        </el-col>

                        <el-col :span="6">
                            <el-button type="primary" size="medium">管理员意见附件</el-button>
                        </el-col>
                    </el-row>
					<el-row>
						<el-form-item label="管理员意见详情" :label-width="formLabelWidth">
							<el-input type="textarea" v-model="form.adminOpinion.details" auto-complete="off"
									  :readonly="isReadOnly" :rows="5"/>
						</el-form-item>
					</el-row>
                    <h2 class="header">评审专家意见：</h2>
                    <el-table :data="userList" :header-cell-style="rowClass">
                        <el-table-column prop="userName" label="评审专家" align="center"></el-table-column>
                        <el-table-column prop="totalScore" label="总分" align="center"></el-table-column>
                        <el-table-column prop="reviewScore" label="得分" align="center"></el-table-column>
                        <el-table-column label="评审结果" align="center">
                            <template slot-scope="scope">
                                <el-button @click="viewExpertReview(scope.row)" type="text" size="medium">
                                    <i class="el-icon-search"></i>详情
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <h2 class="header">发布者意见：</h2>
                    <el-row :gutter="20">
                        <el-col :span="6">
                            <el-form-item label="发布者决定" :label-width="formLabelWidth">
                                <el-input v-model="form.projectOpinion.result" auto-complete="off"
                                          :readonly="isReadOnly"/>
                            </el-form-item>

                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="评审得分" :label-width="formLabelWidth">
                                <el-input v-model="form.projectOpinion.score" auto-complete="off"
                                          :readonly="isReadOnly"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="评价内容" :label-width="formLabelWidth">
                                <el-input type="textarea" v-model="form.projectOpinion.content" auto-complete="off"
                                          :readonly="isReadOnly"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <el-dialog title="查看评价" :visible.sync="readReviewDialogVisible" width="80%"
                           style="text-align:left; font-weight: bolder;" append-to-body>
                    <read-review-result-for-manger :templateConfigList="templateConfigList" :totalScore="totalScore"
                                                   :result="result">
                    </read-review-result-for-manger><!--生成评审表单的组件-->
                </el-dialog>
            </el-dialog>
            <p class="Tips">
                <i class="el-icon-info"></i>
                只有当前项目的所有评审通过才能进行交付；多次上传资源只保留最后一次的上传
            </p>
            <el-table :data="ResourceTable" style="width:900px;margin:50px auto;" :header-cell-style="rowClass"
                      v-loading="loading">
                <el-table-column label="资源上传" align="center">
                    <el-table-column prop="id" label="编号" align="center">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" placement="top-start">
                                <span class="tablehidden">{{ scope.row.id }}</span>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column fixed prop="resourceName" label="资源名称" align="center">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" :content="scope.row.resourceName"
                                        placement="top-start">
                                <span class="tablehidden">{{ scope.row.resourceName }}</span>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column prop="remark" label="备注" align="center">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" :content="scope.row.remark" placement="top-start">
                                <span class="tablehidden">{{ scope.row.remark }}</span>
                            </el-tooltip>
                        </template>
                    </el-table-column>

                    <el-table-column prop="status" label="状态" align="center">

                    </el-table-column>

                    <el-table-column label="操作" align="center" width="350">
                        <template slot-scope="scope">
                            <sourceUpload :uploadIndex="uploadIndex" :fileIndex="scope.row.id"
                                          v-on:setIdCard="setIdCard2(data=$event,id=scope.row.id)"/>
                        </template>
                    </el-table-column>
                </el-table-column>
            </el-table>
            <div class="cancel">
                <el-button type="primary" @click="returnMybid" size="medium" style="width:150px;margin-left:25%">返回
                </el-button>
                <el-button type="primary" @click="submitForm" size="medium" style="width:150px;margin-left:25%">提交
                </el-button>
            </div>
        </div>
    </div>
</template>
<script>

    import {httpGet, httpPut} from '@/utils/http.js';
    import {mapMutations} from 'vuex';
    import {successTips, errTips} from '@/utils/tips.js';
    import sourceUpload from '@/common/upload/resourceUpload';
    import readReviewResultForManger from '@/view/desk/myBid/readReviewResultForManger';

    export default {
        components: {
            sourceUpload,
            readReviewResultForManger,
        },
        data() {
            return {
                totalScore: null,
                isReadOnly: true,
                userList: [],
                dialogVisible: false, //控制查看详情的对话框
                uploadIndex: false,
                resourceId: "",
                resourceUrl: "",
                resourceUrlList: [],
                goUpload: true,
                fileName: 'bidTask',
                loading: false,
                Id: null,
                projectId: null,
                ReviewTable: [],
                ResourceTable: [],
                ReviewList: [],
                ruleForm: {
                    resourceUrlList: []
                },
                typeList: [],
                form: {
                    adminOpinion: {
                        accessory: null,
                        details: null,
                        opinion: null
                    },
                    expertOpinionList: [],
                    projectOpinion: {
                        content: null,
                        result: null,
                        score: null
                    }
                },
                formLabelWidth: '150px',
                /*第三方专家评价*/
                readReviewDialogVisible: false,//控制专家评价框的显示
                templateConfigList: [],//评审模板配置列表
                result: {},//评审结果

            };
        },

        created: function () {
            this.Id = this.$route.query.Id;
            this.projectId = this.$route.query.projectId;
            if (!this.Id) {
                this.$router.push({
                    path: 'myBid'
                });
                return false;
            }
            this.getView();
            this.getTypeList();
        },
        watch: {
            resourceUrlList: function (val) {
                if (this.resourceUrlList.length == this.ResourceTable.length) {
                    for (let i = 0; i < this.resourceUrlList.length; i++) {
                        if (this.resourceUrlList[i].resourceUrl == null) {
                            this.resourceUrlList[i].resourceUrl = this.ResourceTable[i].resourceUrl;
                        }
                    }
                    this.ruleForm.resourceUrlList = this.resourceUrlList;
                    httpPut(
                        "/v1/authorization/review/team/update",
                        this.ruleForm
                    ).then(results => {
                        const {msg, httpCode} = results.data;
                        if (httpCode === 200) {
                            successTips("提交成功");
                            this.$router.push({
                                path: './mybid'
                            });
                        } else {
                            errTips(msg);
                        }
                    });
                }
            }
        },


        methods: {
            ...mapMutations(['setCache']),

            /**获取评审结果的详情*/
            handleClickDetail(val) {
                this.dialogVisible = true;
                httpGet("/v1/authorization/review/deliverydetails/get", {id: val}).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode == 200) {
                        this.form = data;
                        this.userList = data.expertOpinionList;
                    } else {
                        errTips(msg);
                    }
                });
            },
            /**查看单个专家的评审意见*/
            viewExpertReview(row) {
                alert(111);
                this.readReviewDialogVisible = true;
                httpGet("/v1/authorization/review/experttemplateopinion/get", {id: row.expertiInviteId}).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode == 200) {
                        this.templateConfigList = data.configList;
                        this.result = data.result;
                        this.templateName = data.templateName;
                        this.totalScore = data.totalScore;
                    } else {
                        errTips(msg);
                    }
                });
            },
            getTypeList() {
                httpGet("/v1/authorization/review/process/list", {
                    id: this.projectId
                }).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode == 200) {
                        this.typeList = data.processList;
                    } else {
                        this.typeList = [];
                        errTips(msg);
                    }
                });
            },
            returnMybid() {
                this.$router.push({
                    path: './mybid'
                });
            },

            sortBykey(arr, key) {
                return arr.sort(function (a, b) {
                    let x = a[key]
                    let y = b[key]
                    return ((x < y) ? -1 : (x > y) ? 1 : 0)
                })
            },
            getView() {
                this.loading = true;
                httpGet('/v1/authorization/review/team/list', {
                    id: this.Id
                }).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200) {
                        this.ReviewTable = data.reviewStatusList;
                        let list = this.ReviewTable;
                        for (let i of list) {
                            let index = i.type;
                            for (let j of this.typeList) {
                                if (j.id === index) {
                                    i.typeName = j.processName;
                                    break;
                                }
                            }
                        }
                        this.ResourceTable = data.reviewTeamList;
                        this.loading = false;
                    } else if (httpCode === 400) {
                        this.setCache('myBid');
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                });
            },
            setIdCard2(data, id) {
                this.resourceUrl = data.fileName;
                this.resourceId = id;
                let item = {
                    id: this.resourceId,
                    resourceUrl: this.resourceUrl
                };
                this.resourceUrlList.push(item);
                this.resourceUrlList = this.sortBykey(this.resourceUrlList, 'id')
            },
            submitForm() {
                this.uploadIndex = true;
            },
            rowClass() {
                return 'background:#F4F6F9;';
            }
        }
    };
</script>
<style lang="scss">
    .Tips {
        text-align: center;
        margin-top: 15px;
        color: #909399a8;
    }

    .header {
        font-weight: bolder;
        margin-top: 15px;
    }

    .cancel {
        margin-bottom: 30px;
    }

    .score {
        font-weight: bolder;
    }
</style>
