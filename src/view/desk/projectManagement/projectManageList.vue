<template>
    <div class="myTable">
        <div class="header">
            <div class="container deskHeader">
                <h4>项目列表</h4>
            </div>
        </div>
        <div class="header_top">
            <el-input v-model="searchData.projectName" placeholder="项目名称"></el-input>
            <el-input v-model="searchData.teamName" placeholder="团队名称"></el-input>
            <el-date-picker
                    v-model="searchData.startTime"
                    type="date"
                    placeholder="项目更新时间"
                    value-format="yyyy-MM-dd"
                    :picker-options="startDatePicker"
            ></el-date-picker>
            <span style="margin-right: 15px;">到</span>
            <el-date-picker
                    v-model="searchData.endTime"
                    :picker-options="endDatePicker"
                    type="date"
                    placeholder="项目更新时间"
                    value-format="yyyy-MM-dd"
            ></el-date-picker>
            <el-cascader placeholder="请选择项目类型" :options="getNormalType" clearable
                         v-model="selectedOptions"></el-cascader>
            <el-button type="primary" @click="searchList()">搜索</el-button>
            <el-button type="primary" @click="addProject()" v-if="projectRole===2">添加项目</el-button>
        </div>

        <add-project :dialogVisible="dialogAddProjectVisible" @closeDialog="closeAddProjectDialog"></add-project>

        <el-dialog title="项目团队信息" :visible.sync="dialogTeamInfoVisible" :close-on-click-modal="false" width="60%">
            <el-form   class="demo-ruleForm">
                    <el-col :span="12">
                        <el-form-item label="项目名称:" >
                            <el-input style="width:200px;" v-model="teamInfo.projectName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="项目类型:" >
                            <el-input style="width:200px;" v-model="teamInfo.projectType"></el-input>
                        </el-form-item>
                    </el-col>
                <el-form-item label="一句话描述需求:" >
                    <el-input style="width:100%;" v-model="teamInfo.projectCognize"></el-input>
                </el-form-item>
                <el-form-item label="详细描述:" >
                    <el-input type="textarea" v-model="teamInfo.detailedPlanning" :rows="10"></el-input>
                </el-form-item>
                <el-form-item label="团队名称:" >
                    <el-input style="width:100%;"  v-model="teamInfo.teamName"></el-input>
                </el-form-item>
                <el-form-item label="团队介绍:" >
                    <el-input type="textarea" v-model="teamInfo.teamIntroduction" :rows="10"></el-input>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-table :data="bidTable" style="width:1200px;margin:0 auto" :header-cell-style="rowClass" v-loading="loading">
            <el-table-column prop="projectCode" label="项目编号" align="center">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.projectCode" placement="top-start">
                        <span class="tablehidden">{{scope.row.projectCode}}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="projectName" label="项目/比赛" align="center">
                <template slot-scope="scope">
                    <router-link @click.native="storeUserId(scope.row.userId)"
                                 :to="{name:'projectManageContent',
                                       query:{teamId:scope.row.teamId}}" 
                                    >
                        <el-tooltip class="item" effect="dark" :content="scope.row.projectName" placement="top-start">
                            <span class="tablehidden">{{scope.row.projectName}}</span>
                        </el-tooltip>
                    </router-link>
                </template>
            </el-table-column>
            <el-table-column prop="teamName" label="团队名称" align="center">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.teamName " placement="top-start">
                        <span class="tablehidden">{{scope.row.teamName }}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="gmtCreate" label="创建时间" align="center"></el-table-column>
            <el-table-column prop="gmtModified" label="更新时间" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.gmtModified===''">暂未更新</span>
                    <span v-else>{{scope.row.gmtModified}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="type" label="项目类型" width="180" align="center"></el-table-column>
            <el-table-column label="操作" align="center" width="350">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="getTeamInfo(scope.row)">
                        <i class="el-icon-search"></i>
                        项目团队信息
                    </el-button>
                    <el-button size="small" @click="removeProject(scope.row)" v-if="projectRole===2">移除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="bid_footer">
            <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page.sync="searchData.pageNo"
                    :total="totalPage"
                    layout="prev, pager, next, jumper"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
    import {httpGet, httpDelete} from "@/utils/http.js";
    import {specificDate} from "@/utils/getDate.js";
    import timeLimit from "@/mixins/regular/timeLimit.js";
    import {message, successTips, errTips} from "@/utils/tips.js";
    import {MessageBox} from "element-ui";
    import addProject from "@/view/desk/projectManagement/addProject.vue";
    import {mapMutations, mapActions, mapGetters} from "vuex";

    export default {
        name: "projectManageList",
        inject: ["reload"],
        mixins: [timeLimit],
        components:{addProject},
        data() {
            return {
                selectedOptions: [],
                options: [],
                loading: false,
                typeList: [],
                totalPage: 0,
                totalCount:0,//总记录数
                searchData: {
                    projectName: "", //项目名称
                    teamName:"",     //团队名称
                    startTime: null,
                    endTime: null,
                    parentId: null,
                    pageNo: 1,
                    typeId: null,
                    pageSize: 10,
                    orderType: "DESC",
                    orderBy: "id"
                },
                bidTable: [],
                dialogAddProjectVisible:false,//控制添加项目对话框是否显示
                dialogTeamInfoVisible:false,//控制项目团队信息的显示
                teamInfo:{
                    projectName:"",     //项目名称
                    projectType:"",     //项目类型
                    projectCognize:"",  //一句话描述需求
                    detailedPlanning:"",//详细需求
                    teamName:"",        //团队名称
                    teamIntroduction:"",//团队介绍
                },
                projectRole:null, //2:项目经理，3：项目开发者
            };
        },
        created: function () {
            this.projectRole = parseInt(sessionStorage.getItem("projectRole"));
            this.GETNORMALTYPE();
            this.searchList();
        },
        computed: {
            ...mapGetters(["getNormalType"])
        },
        methods: {
            ...mapMutations(["setCache"]),
            ...mapActions(["GETNORMALTYPE"]),

            //搜索查询
            searchList() {
                let {searchData, selectedOptions} = this;
                searchData.parentId = selectedOptions[0];
                searchData.typeId = selectedOptions[1];
                this.getView(searchData);
            },
            handleCurrentChange(val) {
                this.searchData.pageNo = val;
                this.getView();
            },
            //获取页面数据
            getView(val = this.searchData) {
                this.loading = true;
                let url = "/v1/authorization/manage/manage/list";
                if(this.projectRole === 3){   //项目开发者角色对应的项目列表链接
                    url = "/v1/authorization/manage/member/list";
                }
                httpGet(url, val).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200) {
                        this.pageNo = data.pageNo;
                        this.totalPage = parseInt(data.totalPage);
                        let {typeList, list} = data;
                        this.typeList = typeList;
                        for (let i of list) {
                            for (let p of typeList) {
                                if (i.parentId === p.id) {
                                    i.parentName = p.type;
                                }
                                if (i.typeId === p.id) {
                                    i.typetName = p.type;
                                    i.type = i.parentName + "/" + p.type;
                                }
                            }
                            i.gmtCreate = specificDate(i.gmtCreate);
                            i.gmtModified = specificDate(i.gmtModified);
                        }
                        this.$set(this, "bidTable", list);
                    } else if (msg === "该条件暂无数据") {
                        this.bidTable = [];
                        message("该条件暂无数据");
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                    this.loading = false;
                });
            },
            /**从项目管理列表中移除项目*/
            removeProject(row){
                MessageBox.confirm("从项目管理列表中移除改项目?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    httpDelete(`/v1/authorization/manage/manage/delete/${row.id}`).then(results=>{
                        const {httpCode, msg} = results.data;
                        if (httpCode === 200) {
                            successTips('删除成功');
                        } else {
                            errTips("删除失败：",msg);
                        }
                        this.searchList();
                    })
                }).catch(()=>{});
            },
            /**从中标项目或者比赛中添加项目*/
            addProject(){
                this.dialogAddProjectVisible = true;
            },
            /**关闭添加项目的对话框*/
            closeAddProjectDialog(){
                this.dialogAddProjectVisible = false;
                this.searchList();
            },
            /**获取项目团队信息*/
            getTeamInfo(row){
                this.dialogTeamInfoVisible =true;
                httpGet("/v1/authorization/manage/manage/get",{teamId:row.teamId}).then(results=>{
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200) {
                        this.teamInfo = data;
                        this.teamInfo.projectType = row.type;
                    }else{
                        errTips("获取团队信息失败:",msg);
                    }
                })
            },
            rowClass() {
                return "background:#F4F6F9;";
            },
            storeUserId(val) {
                sessionStorage.setItem('userId', val)
            },
        }
    };
</script>
<style lang='scss'>
    @import "@/assets/scss/myTable.scss";
    @import '@/assets/scss/publishtask.scss';
    .header_two0 {
        .userImg {
            float: right;
            width: 65px;

            .icon-xiaoxi {
                cursor: pointer;
                font-size: 26px;
                color: white;
                transition: all 0.4s;
                float: left;
                margin-top: 4px;

                &:hover {
                    color: rgba(0, 0, 0, 0.74);
                }
            }

            img {
                margin-top: 3px;

                &:hover {
                    cursor: pointer;
                }
            }
        }

        a {
            color: #666;
            font-weight: 400;
            width: 100px;
            font-size: 16px;

            &:hover {
                border-bottom: 1.9px solid #4c83c3;
                padding-bottom: 10px;
            }
        }

        .login_two {
            border: 1px solid #fff;
            padding: 5px 13px 5px 13px;
            margin-right: 10px;
            border-radius: 3px;

            &:hover {
                background: #426ea1;
            }
        }

        .register_two {
            background: white;
            color: black;
            padding: 5px 13px 5px 13px;
            border: 1px solid #fff;
            border-radius: 3px;

            &:hover {
                background: #e8e8e8;
            }
        }

        .c-header {
            -webkit-box-shadow: 0 1px 0 rgba(255, 255, 255, 0.2);
            box-shadow: 0 1px 0 rgba(255, 255, 255, 0.2);
            width: 100%;
            z-index: 100;
        }

        .c-header--fixed,
        .c-header--solid0 {
            border-bottom: 1px solid #e8e8e8;
            padding: 15px 0 15px;
        }

        .c-header__row {
            height: 70px;
            padding-top: 20px;
            box-sizing: border-box;
        }

        .c-header__logowrap {
            border: 0;
            height: 30px;
            width: 130px;
            outline: 0;
            margin-right: auto;
            float: left;
        }

        .c-header__logo {
            width: 130px;
            height: 30px;
            fill: #333;
        }

        .c-header__options {
            float: right;
            width: 65px;

            img {
                width: 27px;
                height: 27px;
                border-radius: 50%;
                margin-left: 10px;
            }
        }

        .c-header__options__signin {
            display: inline-block;
        }

        .c-header__navigation {
            width: 940px;
            float: left;
            // text-align: center;
            list-style: none;
        }

        .c-header__navigation__item {
            padding: 0 15px 0 15px;
            display: inline-block;
            vertical-align: middle;
            height: 100%;
            font-size: 14px;
            font-weight: 600;
        }

        .header_active {
            border-bottom: 1.9px solid #4c83c3;
            padding-bottom: 10px;
            // background: #0760c5;
        }

        .c-header--transparent:not(.c-header--fixed) {
            position: absolute;
        }

        .c-header--transparent:not(.c-header--fixed) .c-header__navigation__item a {
            color: #fff;
            text-shadow: 0 0 1px rgba(0, 0, 0, 0.9);
        }

        .c-header--transparent:not(.c-header--fixed) .c-header__options__join {
            border-color: #fff;
            background-color: #fff;
            color: #444;
            font-weight: 400;
        }

        .c-header--transparent:not(.c-header--fixed) .c-header__options__join:hover {
            background-color: #4c83c3;
            border-color: #4c83c3;
            color: #fff;
        }

        .c-header--transparent:not(.c-header--fixed) .c-header__options__signin {
            background-color: transparent;
            border: 1px solid #fff;
            color: #fff;
        }

        .c-header--transparent:not(.c-header--fixed) .c-header__options__signin:hover {
            background-color: #fff;
            color: #444;
        }

        .c-header--breadcrumbs .c-header__logowrap {
            margin-right: 2rem;
        }

        .c-header--breadcrumbs .c-header__breadcrumb,
        .c-header--breadcrumbs .c-header__breadcrumb a {
            font-size: 14px;
            font-size: 0.875rem;
            color: #fff;
            text-shadow: 0 0 1px rgba(0, 0, 0, 0.9);
        }

        .c-header--breadcrumbs .mobileBreadcrumb {
            display: block;
        }

        .c-header--breadcrumbs .fullscreenBreadcrumb {
            display: none;
        }
    }
</style>
