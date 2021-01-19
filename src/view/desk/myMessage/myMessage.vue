<template>
    <div class="myTable">
        <div class="header">
            <div class="container deskHeader">
                <h4>消息管理</h4>
            </div>
        </div>
        <div class="container deskHeader">
            <el-table
                    v-loading="loading"
                    :data="messageForm"
                    style="width: 100%;margin-top:30px"
                    msgStatus
                    :header-cell-style="rowClass"
            >
                <el-table-column prop="content" label="消息内容" align="center" width="650px">
                    <template slot-scope="scope">
             <span>{{scope.row.content}}

                <router-link
                        :to="{path:'/applicationView', query:{id:scope.row.projectId}}"
                        v-if="scope.row.msgType===15"
                >
                  <i class="el-icon-search"></i>
                  点击查看申请
                </router-link>


                <a style="cursor:pointer" v-if="scope.row.operationStatus===0&&scope.row.msgType===16"
                   @click=consent(1,scope.row.teamId,scope.row)><i class="el-icon-circle-check"></i>同意</a>
                <a style="cursor:pointer" v-if="scope.row.operationStatus===0&&scope.row.msgType===16"
                   @click=consent(2,scope.row.teamId,scope.row)><i class="el-icon-circle-close"></i>拒绝</a>

                <a style="cursor:pointer;color:gray;" v-if="scope.row.operationStatus===1&&scope.row.msgType===16"
                   href="#"><i class="el-icon-circle-check"></i>同意</a>
                <a style="cursor:pointer;color:gray;" v-if="scope.row.operationStatus===1&&scope.row.msgType===16"
                   href="#"><i class="el-icon-circle-close"></i>拒绝</a>

             </span>
                    </template>
                </el-table-column>
                <el-table-column label="是否读取" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.msgStatus===0?'未读':'已读'}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="date" label="消息类型" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.msgType===0">竞标申请</span>
                        <span v-if="scope.row.msgType===1">放弃需求</span>
                        <span v-if="scope.row.msgType===2">竞标成功</span>
                        <span v-if="scope.row.msgType===3">竞标失败</span>
                        <span v-if="scope.row.msgType===4">申请成功</span>
                        <span v-if="scope.row.msgType===5">申请失败</span>
                        <span v-if="scope.row.msgType===6">邀请成功</span>
                        <span v-if="scope.row.msgType===7">移除团队</span>
                        <span v-if="scope.row.msgType===8">需求结束</span>
                        <span v-if="scope.row.msgType===9">需求提醒</span>
                        <span v-if="scope.row.msgType===10">延期提醒</span>
                        <span v-if="scope.row.msgType===11">下架提醒（发布需求）</span>
                        <span v-if="scope.row.msgType===12">下架提醒（经典案例）</span>
                        <span v-if="scope.row.msgType===13">组员禁用</span>
                        <span v-if="scope.row.msgType===14">缺陷提醒</span>
                        <span v-if="scope.row.msgType===15">需求推荐</span>
                        <span v-if="scope.row.msgType===16">邀请提醒</span>
                        <span v-if="scope.row.msgType===17">任务提醒</span>
                        <span v-if="scope.row.msgType===18">提交/编辑文档提醒</span>
                        <span v-if="scope.row.msgType===19">文档意见提醒</span>
                        <span v-if="scope.row.msgType===20">意见解决提醒</span>
                        <span v-if="scope.row.msgType===21">成员招募提醒</span>
                        <span v-if="scope.row.msgType===22">测试项目更新提醒</span>
                        <span v-if="scope.row.msgType===23">测试项目任务提醒</span>
                        <span v-if="scope.row.msgType===24">测试任务结束提醒</span>
                        <span v-if="scope.row.msgType===25">测试项目结束提醒</span>
                        <span v-if="scope.row.msgType===26">评审即将超时</span>
                        <span v-if="scope.row.msgType===27">评审已经超时</span>
                        <span v-if="scope.row.msgType===28">比赛申请</span>
                        <span v-if="scope.row.msgType===29">报名成功</span>
                        <span v-if="scope.row.msgType===30">比赛结束</span>

                    </template>
                </el-table-column>
                <el-table-column prop="gmtCreate" label="接受时间" align="center"></el-table-column>
                <el-table-column label="操作" prop="province" align="center" width="250">
                    <template slot-scope="scope">
            <span class="caozuo" v-if="scope.row.msgStatus===0" @click="changeState(scope.row)">
              <i class="el-icon-circle-check"></i>
              已阅
            </span>
                        <span class="caozuo" @click="deteMessage(scope.row.id)">
              <i class="el-icon-delete"></i>
              删除
            </span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="bid_footer">
                <el-pagination
                        @current-change="handleCurrentChange"
                        :current-page.sync="pageData.pageNo"
                        layout="prev, pager, next, jumper"
                        :total="totalPage"
                ></el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
    import {httpGet, httpPut, httpDelete} from "@/utils/http.js";
    import {hoursSeconds} from "@/utils/getDate.js";
    import {successTips, message, errTips} from "@/utils/tips.js";
    import {MessageBox} from "element-ui";
    import {mapGetters, mapActions} from "vuex";

    export default {
        components: {},
        data() {
            return {
                messageForm: [],
                loading: false,
                pageData: {
                    name: "",
                    startTime: null,
                    endTime: null,
                    parentId: null,
                    typeId: null,
                    pageSize: 10,
                    pageNo: 1,
                    orderBy: "id",
                    orderType: "DESC"
                },
                totalPage: 0,
                ruleForm: {
                    status: "",
                    teamId: ""
                },
            };
        },
        created: function () {
            this.getView();
        },
        computed: {
            ...mapGetters(["getMessageList"])
        },
        methods: {
            ...mapActions(["GETMESSAGE", "CHANGEMESSAGESTATE"]),
            //页码变化
            handleCurrentChange(val) {
                this.pageData.pageNo = val;
                this.getView();
            },
            //获取页面数据
            getView(val = this.pageData) {
                this.loading = true;
                httpGet("/v1/authorization/msg/listsearch", val).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200) {
                        this.totalPage = parseInt(data.totalPage + "0");
                        for (let i of data.msgList) {
                            i.gmtCreate = hoursSeconds(i.gmtCreate);
                        }
                        this.messageForm = data.msgList;
                    } else if (msg === "暂无消息") {
                        this.messageForm = [];
                        message("暂无消息");
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                    this.loading = false;
                });
            },
            //删除消息
            deteMessage(id) {
                MessageBox.confirm("此操作将删除此消息, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        httpDelete(`/v1/authorization/msg/deletemsg/${id}`).then(results => {
                            const {httpCode, msg} = results.data;
                            if (httpCode === 200) {
                                successTips("删除成功");
                                this.getView();
                            } else if (httpCode !== 401) {
                                errTips(msg);
                            }
                        });
                    })
                    .catch(() => {
                    });
            },
            //改变消息状态
            changeState(row) {
                httpPut("/v1/authorization/msg/msgstatus", {id: row.id}).then(
                    results => {
                        const {httpCode, msg} = results.data;
                        if (httpCode === 200) {
                            row.msgStatus = 1;
                        } else if (httpCode !== 401) {
                            errTips(msg);
                        }
                    }
                );
            },
            rowClass() {
                return "background:#F4F6F9;";
            },

            consent(status, teamId, row) {
                this.ruleForm.status = status;
                this.ruleForm.teamId = teamId;
                httpPut("/v1/authorization/bids/consent/teamuser", this.ruleForm).then(
                    results => {
                        const {httpCode, msg} = results.data;
                        if (httpCode === 200) {
                            this.getView();
                            this.changeState(row);

                        } else if (httpCode !== 401) {
                            errTips(msg);
                        }
                    }
                );
            }
        }
    };
</script>
<style lang='scss'>
    @import "@/assets/scss/myTable.scss";
</style>
