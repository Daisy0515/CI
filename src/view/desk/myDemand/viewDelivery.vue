<template>
    <div class="editorialTeam">
        <div class="Crumbs">
            <div class="container deskHeader">
                <h4>
                    您的位置：
                    <router-link to="myDemand">我的需求</router-link>
                    >
                    <el-button type="text" @click="$router.go(-1)">团队进度</el-button>
                    >
                    <span class="active">查看交付</span>
                </h4>
            </div>
        </div>

        <el-table :data="ResourceTable" style="width:900px;margin:50px auto;" :header-cell-style="rowClass"
                  v-loading="loading">
            <el-table-column label="资源下载" align="center">
                <el-table-column prop="id" label="编号" align="center">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" placement="top-start">
                            <span class="tablehidden">{{ scope.row.id }}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column fixed prop="resourceName" label="资源名称" align="center">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" :content="scope.row.resourceName" placement="top-start">
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
                        <a target="_Blank" :href="scope.row.resourceUrl">
                            下载
                        </a>
                        <!-- <el-button @click="handleClickFile(scope.row.resourceUrl)" type="text" size="medium"
                        >下载</el-button> -->
                    </template>
                </el-table-column>
            </el-table-column>
        </el-table>
        <div class="cancel" style="text-align: center;">
            <el-button type="primary" @click="returnMybid" size="medium" style="width:150px;">返回</el-button>

        </div>
    </div>

</template>
<script>
    import {httpGet, httpPost, httpDelete, httpPut} from '@/utils/http.js';
    import {mapGetters, mapMutations} from 'vuex';
    import {successTips, errTips} from '@/utils/tips.js';
    import {MessageBox} from 'element-ui';
    import sourceUpload from '@/common/upload/resourceUpload';

    export default {
        components: {
            sourceUpload
        },
        data() {
            return {
                uploadIndex: false,
                resourceId: "",
                resourceUrl: "",
                resourceUrlList: [],
                goUpload: true,
                fileName: 'bidTask',
                loading: false,
                Id: '',
                projectId: '',
                ReviewTable: [],
                ResourceTable: [],
                ReviewList: [],
                ruleForm: {
                    resourceUrlList: []
                }
            };
        },

        created: function () {
            this.projectId = this.$route.query.projectId;
            this.Id = this.$route.query.Id;
            this.getView();
        },
        methods: {
            ...mapMutations(['setCache']),
            returnMybid() {
                this.$router.push({path: './myDemand'});
            },
            getView() {
                this.loading = true;
                httpGet('/v1/authorization/review/team/list', {
                    id: this.Id
                }).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200) {
                        this.ReviewTable = data.reviewStatusList;
                        this.ResourceTable = data.reviewTeamList;
                        this.loading = false;
                    } else if (httpCode === 400) {
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                });
            },
            setIdCard2(data, id) {

                this.resourceUrl = data.fileName;
                this.resourceId = id;
                var item = {id: this.resourceId, resourceUrl: this.resourceUrl};
                console.log(item);
                this.resourceUrlList.push(item);
            },
            submitForm() {

                this.resourceUrl ? this.setIdCard2() : (this.uploadIndex = !this.uploadIndex);
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
</style>
