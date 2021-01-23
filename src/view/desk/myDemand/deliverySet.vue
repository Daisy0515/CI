<!--功能：交付汇总页面
    调用页面：teamList
-->
<template>
    <el-dialog title="交付汇总" :visible.sync="dialogVisible" :close-on-click-modal="false" width="60%"
               :before-close="changeVisible">
        <div class="dialog_header_top">
            <el-input v-model="searchData.teamName" placeholder="团队名称"></el-input>
            <el-input v-model="searchData.resourceName" placeholder="交付任务名称"></el-input>
            <el-date-picker
                    v-model="searchData.startTime"
                    :picker-options="startDatePicker"
                    type="date"
                    placeholder="上传时间开始"
                    value-format="yyyy-MM-dd"
            ></el-date-picker>
            <span style="margin: auto 15px;">到</span>
            <el-date-picker
                    v-model="searchData.endTime"
                    :picker-options="endDatePicker"
                    type="date"
                    placeholder="上传时间结束"
                    value-format="yyyy-MM-dd"
            ></el-date-picker>
            <el-input v-model="searchData.uploader" placeholder="上传者" style="margin-left: 20px;"></el-input>
            <el-button type="primary" @click="searchList">搜索</el-button>
            <el-button type="primary" @click="download">批量下载</el-button>
        </div>
        <el-table :data="tableData" :header-cell-style="rowClass" style="margin-top: 20px;" v-loading="loading"
                  @selection-change="handleSelectionChange">
            <el-table-column prop="teamName" label="团队名称" align="center"></el-table-column>
            <el-table-column prop="resourceName" label="交付任务名称" align="center"></el-table-column>
            <el-table-column prop="gmtModified" label="上传时间" align="center"></el-table-column>
            <el-table-column prop="uploader" label="上传者" align="center"></el-table-column>
            <el-table-column prop="fileName" label="文件名" align="center"></el-table-column>
            <el-table-column type="selection"  align="center" header-align="center" width="70px"
                             label-class-name="setDownloadName"></el-table-column>
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
    import {httpGet} from "@/utils/http.js";
    import {message, errTips} from "@/utils/tips.js";
    import {specificDate} from '@/utils/getDate.js';
    import timeLimit from "@/mixins/regular/timeLimit.js";
    import {handleBatchDownload} from '@/utils/downloadFiles.js';
    export default {
        name: "deliverySet",
        mixins: [timeLimit],
        props: {
            dialogVisible: {  //控制对话框
                type: Boolean,
                default: false,
            },
            projectId: { //项目id
                type: [Number,String],
                default: null
            }
        },

        data() {
            return {
                multipleSelection: [],  //选中的行
                pageSizes:[10, 20, 40, 80],
                loading:false,
                searchData: {
                    pageNo: 1,
                    pageSize: 10,
                    orderType:"DESC",
                    orderBy:"gmtCreate",
                    projectId:this.projectId,    //项目编号ID
                    teamName:null,   //团队名称（模糊查询）
                    resourceName:null,//交付任务名称（模糊查询）
                    uploader:null,    //上传者（模糊查询）
                    startTime:null,   //上传开始时间
                    endTime:null,     //上传结束时间
                },
                totalPage: null,
                totalCount:null,
                tableData: [],
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
            //    console.log("searchData",JSON.stringify(this.searchData));
               httpGet("/v1/authorization/bid/teamresource/list",val).then(results => {
                   const {httpCode, msg, data} = results.data;
                //    console.log("data",data);
                   if (httpCode === 200) {
                       this.totalPage = data.totalPage;
                       this.totalCount = data.totalCount;
                       for(let item of data.list){
                           item.gmtModified = specificDate(item.gmtModified);
                           let urlList = item.resourceUrl.split('/');
                           item.fileName = urlList[urlList.length-1];
                       }
                       this.tableData = data.list;
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
            },
            /**批量下载交付文件*/
            download(){
                if(this.multipleSelection.length === 0){
                    message("请选择下载的文件！");
                    return ;
                }
                let urlList = this.multipleSelection.map(item => item.resourceUrl);
                // let urlList = ['https://pic3.zhimg.com/50/v2-d46d98e86c8badbf8e799eff33646c5a_hd.jpg'];
                // console.log(urlList);
                handleBatchDownload(urlList);
            },
            /**点击多选框触发*/
            handleSelectionChange(selection){
                this.multipleSelection = selection;
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
    }

    .bid_footer {
        margin: 15px auto;
        text-align: center;
    }
     ::v-deep .el-pagination .el-input .el-input__inner {
        width:100px;
    }

    .el-table /deep/.setDownloadName .cell .el-checkbox__inner{
        margin-left: -30px;
        position:relative;
    }
    .el-table /deep/.setDownloadName .cell:before{
        content:"下载";
        position:absolute;
        right:11px;
    }

</style>

