<!--功能：用于添加中标项目或者比赛中以及完成的项目
    调用页面：projectManageList
-->
<template>
    <el-dialog title="添加项目" :visible.sync="dialogVisible" :close-on-click-modal="false" width="60%"
               :before-close="changeVisible">
        <div class="dialog_header_top">
            <el-input v-model="searchData.projectName" placeholder="项目名称"></el-input>
            <el-input v-model="searchData.teamName" placeholder="团队名称"></el-input>
            <el-date-picker
                    v-model="searchData.startTime"
                    type="date"
                    placeholder="更新时间"
                    value-format="yyyy-MM-dd"
                    :picker-options="startDatePicker"
            ></el-date-picker>
            <span style="margin-right: 15px;">到</span>
            <el-date-picker
                    v-model="searchData.endTime"
                    :picker-options="endDatePicker"
                    type="date"
                    placeholder="更新时间"
                    value-format="yyyy-MM-dd"
            ></el-date-picker>
            <el-select v-model="searchData.type" placeholder="请选择项目类型">
                <el-option label="中标项目" :value="1"></el-option>
                <el-option label="比赛项目" :value="2"></el-option>
            </el-select>
            <el-select v-model="searchData.status" placeholder="请选择状态">
                <el-option :label="searchData.type===1?'执行中':'比赛中'" :value="2">
                    <span  v-if="searchData.type===1">执行中</span>
                    <span v-else>比赛中</span>
                </el-option>
                <el-option label="完成" :value="3">完成</el-option>
            </el-select>
            <el-button type="primary" @click="searchList()">搜索</el-button>
        </div>
        <el-table :data="tableData" :header-cell-style="rowClass" style="margin-top: 20px;" v-loading="loading">
            <el-table-column prop="project" label="项目编号" align="center"></el-table-column>
            <el-table-column prop="projectName" :label="projectNameLabel" align="center"></el-table-column>
            <el-table-column prop="teamName" label="团队名称" align="center"></el-table-column>
            <el-table-column prop="gmtCreate" label="创建时间" align="center"></el-table-column>
            <el-table-column prop="gmtModified" label="更新时间" align="center"></el-table-column>
            <el-table-column prop="type" label="项目类型" align="center"></el-table-column>
            <el-table-column label="操作" align="center" width="350">
                <template slot-scope="scope">
                    <el-button type="primary" @click="addProject(scope.row)">添加</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="bid_footer ">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="searchData.pageNo"
                           :total="totalCount" :page-sizes="pageSizes" :page-size="searchData.pageSize"
                           layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
        </div>
    </el-dialog>
</template>

<script>
    import {httpGet, httpPost} from "@/utils/http.js";
    import {message, successTips, errTips} from "@/utils/tips.js";
    import {specificDate} from '@/utils/getDate.js';
    import timeLimit from "@/mixins/regular/timeLimit.js";
    export default {
        name: "addProject",
        mixins: [timeLimit],
        props: {
            dialogVisible: {  //控制对话框
                type: Boolean,
                default: false,
            },
        },

        data() {
            return {
                pageSizes:[10, 20, 40, 80],
                loading:false,
                searchData: {
                    pageNo: 1,
                    pageSize: 10,
                    orderType:"DESC",
                    orderBy:"gmtCreate",

                    teamName:null,    //团队名称（模糊查询）
                    resourceName:null,//交付任务名称（模糊查询）
                    uploader:null,    //上传者（模糊查询）
                    startTime:null,   //项目更新开始时间
                    endTime:null,     //项目更新结束时间
                    type:1,           // 1中标项目2比赛项目
                    status:2,         //项目状态 2执行中3完成       1竞标中 ,4非法需求 , 5放弃这3个不可选，下拉框只设置了2个
                },
                totalPage: null,
                totalCount:null,
                tableData: [],
                projectNameLabel:"项目名称",//还有比赛名称可选，用户每次搜索完后，会根据搜索条件是中标项目还是比赛项目来确定
            }
        },
        watch: {
            dialogVisible: function (val) {
                if (val === true) {
                    this.getView();
                }
            }
        },
        methods: {

            getView(val=this.searchData){
                this.loading = true;
                httpGet("/v1/authorization/manage/search/list",val).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200) {
                        this.totalPage = data.totalPage;
                        this.totalCount = data.totalCount;
                        for(let item of data.list){
                            item.gmtModified = specificDate(item.gmtModified);
                            item.gmtCreate  = specificDate(item.gmtCreate );
                        }
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

                        this.tableData = data.list.filter( item=>{ //过滤掉已经添加到项目管理列表中的数据
                            return item.is === false;
                        });
                    }else if (msg === "该条件暂无数据") {
                        this.tableData = [];
                        message("该条件暂无数据");
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                    this.loading = false;
                })
            },
            /**搜索交付文件*/
            searchList() {
                this.getView();
                this.projectNameLabel = this.searchData.type===1?"项目名称":"比赛名称";
            },

            /**更改每页显示的内容*/
            handleSizeChange(){
                this.getView()
            },
            /**下一页*/
            handleCurrentChange(val) {
                this.searchData.pageNo = val;
                this.getView();
            },
            changeVisible() {
                this.$emit("closeDialog"); ////changeVisible事件触发后，自动触发closeDialog
            },
            /**添加项目*/
            addProject(row){
                httpPost("/v1/authorization/manage/project/insert",{projectId:row.id}).then(results=>{
                    const {httpCode, msg} = results.data;
                    if(httpCode === 200){
                        successTips("添加项目成功！");
                        this.getView();
                    }else{
                        errTips("添加失败:",msg);
                    }
                })
            },
            rowClass() {
                return "background:#F4F6F9;";
            }
        }
    }
</script>

<style lang="scss" scoped>
    .dialog_header_top {
        .el-input, .el-select {
            display: inline-block;
            width: 150px;
            margin: 15px 20px 15px 0;
        }
        ::v-deep .el-input__inner {
            width:150px;
        }
    }

    .bid_footer {
        margin: 15px auto;
        text-align: center;
    }
    ::v-deep .el-pagination .el-input .el-input__inner {
        width:100px;
    }

</style>
