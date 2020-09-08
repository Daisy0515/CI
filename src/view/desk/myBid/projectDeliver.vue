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
                      v-loading="loading" :span-method="arraySpanMethod">
                <el-table-column label="评审状态" align="center">
                    <el-table-column fixed prop="typeName" label="评审流程" align="center">
                    </el-table-column>
                    <el-table-column prop="title" label="是否发起评审" align="center">
                        <template slot-scope="scope">
                                <span v-if="scope.row.id!== null">已发起评审</span>
                                <span v-else>未发起评审</span>
                        </template>
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
            <review-result :form="form"  :dialogVisible="dialogVisible" @closeDialog="closeDialog"></review-result>
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
    import reviewResult from '@/view/desk/myBid/reviewResult';

    export default {
        components: {
            sourceUpload,
            reviewResult,
        },
        data() {
            return {

                isReadOnly: true,
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
            /**合并没有邀请评审的评审流程的表格*/
            arraySpanMethod({ row, column, rowIndex, columnIndex }){
                if(row.id===null){
                    if(columnIndex===1){
                        return [1,4];
                    }
                }
            },
            /**获取评审结果的详情*/
            handleClickDetail(val) {
                this.dialogVisible = true;
                httpGet("/v1/authorization/review/deliverydetails/get", {id: val}).then(results => {
                    const {httpCode, msg, data} = results.data;
                    console.log("review data:",data);
                    if (httpCode == 200) {
                        this.form = data;
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
                        console.log("this.ReviewTable",this.ReviewTable);
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
            },
            closeDialog(){
                this.dialogVisible = false;
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

    .cancel {
        margin-bottom: 30px;
    }

    .score {
        font-weight: bolder;
    }
</style>
