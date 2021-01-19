<template>
    <div class="demandScoring">
        <div class="Crumbs">
            <div class="container deskHeader">
                <h4>
                    您的位置：
                    <router-link to="myDemand">我的需求</router-link>
                    >
                    <span class="active">立即打分</span>
                </h4>
            </div>
        </div>
        <div class="container deskHeader" v-loading="isLoding">
            <div class="card_item" v-for="(item,index) in selestate" :key="index">
                <i class="icon iconfont icon-yonghu"></i>
                <el-card class="card">
                    <p>
                        <span class="textLabel">团队组长：</span>
                        {{item.leaderName}}
                    </p>
                    <p>
                        <span class="textLabel">团队人数：</span>
                        {{item.count}}
                    </p>
                    <p>
                        <span class="textLabel">完成度：</span>
                        {{item.accomplishProgress}}%
                    </p>
                    <p>
                        <span class="textLabel">任务进度：</span>
                        <span class="seeProgress" @click="openGantt(item.id)">点击查看</span>
                    </p>
                    <el-form ref="selestate" :model="selestate[index]" label-width="95px">
                        <div class="scoring_input">
                            <el-form-item label="团队分：" prop="teamScore" :error="item.errData">
                                <el-input
                                        placeholder="请输入1到100的分数"
                                        :disabled="!scoreIndex"
                                        v-model="item.teamScore"
                                ></el-input>
                            </el-form-item>
                        </div>
                        <div class="scoring_input">
                            <el-form-item
                                    label="负责人分："
                                    label-width="95px"
                                    prop="leaderScore"
                                    :error="item.errData2"
                            >
                                <el-input
                                        placeholder="请输入1到100的分数"
                                        :disabled="!scoreIndex"
                                        v-model="item.leaderScore"
                                ></el-input>
                            </el-form-item>
                        </div>
                        <div class="comm_input">
                            <el-form-item
                                    label="优秀之处："
                                    label-width="95px"
                                    prop="commentasd123"
                                    :error="item.errData3"
                            >
                                <el-input
                                        maxlength="200"
                                        placeholder="请输入优秀之处"
                                        style="width:300px"
                                        :disabled="!scoreIndex"
                                        v-model="item.teamMerit"
                                        type="textarea"
                                        :autosize="{ minRows: 4, maxRows: 4}"
                                ></el-input>
                            </el-form-item>
                            <el-form-item
                                    label="不足之处："
                                    label-width="95px"
                                    prop="commentasd123"
                                    :error="item.errData3"
                            >
                                <el-input
                                        maxlength="200"
                                        placeholder="请输入不足之处"
                                        style="width:300px"
                                        :disabled="!scoreIndex"
                                        v-model="item.teamDefect"
                                        type="textarea"
                                        :autosize="{ minRows: 4, maxRows: 4}"
                                ></el-input>
                            </el-form-item>
                            <source-Upload
                                    v-if="scoreIndex"
                                    :goUpload="true"
                                    :ref="index"
                                    :fileIndex="index"
                                    v-on:setIdCard="setIdCard($event)"
                            />
                        </div>
                        <div class="comm_input" v-if="!scoreIndex">
                            <el-form-item label="资源地址：" label-width="95px">
                                <a
                                        v-if="item.commentFile"
                                        target="_Blank"
                                        :href="item.commentFile"
                                        style="display:block;width:700px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"
                                >查看资源</a>
                                <a href="javascript:void(0)" v-if="!item.commentFile">暂无附件</a>
                            </el-form-item>
                        </div>
                    </el-form>
                </el-card>
            </div>
            <div class="scoring">
                <el-button v-if="scoreIndex" type="primary" @click="scroe()">打分</el-button>
                <router-link to="myDemand">
                    <el-button type="primary">返回</el-button>
                </router-link>
            </div>
            <el-dialog
                    width="1200px"
                    title="任务进度"
                    :visible.sync="dialogTableVisible"
                    :append-to-body="true"
            >
                <div id="gant" style="height:400px;width:100%">
                    <Gantt class="left-container" :tasks="tasks"/>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    import {httpGet, httpPut} from "@/utils/http.js";
    import {successTips, errTips} from "@/utils/tips.js";
    import Gantt from "@/common/gantt/gantt";
    import {timeReversal, timestamp} from "@/utils/getDate.js";
    import {mapGetters, mapMutations} from "vuex";
    import sourceUpload from "@/common/upload/resourceUpload";

    export default {
        components: {
            Gantt,
            sourceUpload
        },
        data() {
            return {
                isLoding: false,
                dialogTableVisible: false,
                dialogFormVisible: false,
                selestate: [{missionNameList: []}],
                scoreIndex: false,
                tasks: {
                    data: []
                }
            };
        },
        created: function () {
            if (!this.$route.query.id) {
                this.$router.push({path: "myDemand"});
                return false;
            }
            //甘特图配置
            gantt.config.readonly = true;
            gantt.config.columns = [
                {name: "text", align: "center", resize: true},
                {name: "start_date", align: "center", resize: true},
                {
                    name: "duration",
                    align: "center",
                    template: task => {
                        let duration = task.durationTime;
                        return duration;
                    }
                }
            ];
            this.getScore();
        },
        computed: {
            ...mapGetters(["getdiaLog"])
        },
        methods: {
            ...mapMutations(["setdiaLog", "setCache"]),
            setIdCard(data) {
                this.selestate[data.fileIndex].commentFile = data.fileName;
            },
            //打开甘特图
            openGantt(id) {
                httpGet("/v1/authorization/bid/ganttchart/get", {
                    id: id
                }).then(results => {
                    const getData = results.data;
                    if (getData.httpCode === 200) {
                        this.dialogTableVisible = true;
                        let {ganttChartList} = getData.data;
                        let newList = ganttChartList.map(item => {
                            return {
                                id: item.id,
                                start_date: timeReversal(item.startTime),
                                end_date: timestamp(item.endTime),
                                text: item.content,
                                name: item.userName,
                                durationTime: item.sustainTime,
                                progress: item.accomplishProgress * 0.01
                            };
                        });
                        this.$set(this.tasks, "data", newList);
                        this.loading = false;
                        this.setdiaLog(!this.getdiaLog);
                    } else if (getData.msg === "不存在任务信息") {
                        this.loading = false;
                        errTips("暂未创建任务");
                    } else if (getData.msg === "没有中标，无法查看甘特图") {
                        this.loading = false;
                        errTips("没有中标，无法查看甘特图");
                    } else if (getData.msg === "没有权限") {
                        this.loading = false;
                        errTips("没有权限");
                    }
                });
            },
            //打分
            scroe() {
                const scorezz = /^([1-9][0-9]{0,1}|100)$/;
                let newData = this.selestate;
                let passScore = true;
                for (let i = 0; i < newData.length; i++) {
                    if (!scorezz.test(newData[i].teamScore)) {
                        newData[i].errData = "请输入1至100的分数";
                        newData[i].teamScore = "";
                        passScore = false;
                    } else {
                        newData[i].errData = "";
                    }
                    if (!scorezz.test(newData[i].leaderScore)) {
                        newData[i].errData2 = "请输入1至100的分数";
                        newData[i].leaderScore = "";
                        passScore = false;
                    } else {
                        newData[i].errData2 = "";
                    }
                    // if (newData[i].comment&&newData[i].comment.length >= 200) {
                    //   newData[i].errData3 = "请输入小于200数量的字数";
                    //   passScore = false;
                    // } else {
                    //   newData[i].errData3 = "";
                    // }
                }
                if (!passScore) {
                    return false;
                }
                this.isLoding = true;
                httpPut("/v1/authorization/bid/teamscore/update", {
                    teamScoreList: newData
                }).then(results => {
                    this.isLoding = false
                    const {httpCode, msg} = results.data;
                    if (httpCode === 200) {
                        this.scoreIndex = false;
                        this.setCache("myDemand");
                        successTips("打分成功！");
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                });
            },
            //获取打分
            getScore() {
                httpGet("/v1/authorization/bid/selectteamscore/select", {
                    id: this.$route.query.id
                }).then(results => {
                    const {httpCode, msg} = results.data;
                    if (httpCode === 200) {
                        this.selestate = results.data.data.scoreList;
                        this.selestate.forEach(ele => {
                            if (ele.leaderScore === 0) {
                                this.scoreIndex = true;
                                ele.leaderScore = null;
                            }
                            if (ele.teamScore === 0) {
                                this.scoreIndex = true;
                                ele.teamScore = null;
                            }
                            ele.errData = "";
                            ele.errData2 = "";
                            ele.errData3 = "";
                        });
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                });
            }
        }
    };
</script>
<style lang='scss'>
    .demandScoring {
        .textLabel {
            width: 85px;
            display: inline-block;
        }

        .seeProgress {
            color: #4c83c3;
            cursor: pointer;
        }

        .el-form-item__label {
            text-align: left;
            font-size: 16px;
            color: #303133;
        }

        line-height: 35px;

        .card_item {
            position: relative;
            margin-top: 40px;

            .card {
                padding: 18px 0 10px 30px;
                height: 640px;

                p {
                    margin-bottom: 12px;
                }

                .el-input {
                    display: inline-block;
                    width: 163px;
                }

                .el-input__inner {
                    height: 28px;
                }

                .scoring_input {
                    span {
                        display: inline-block;
                        width: 80px;
                    }
                }
            }

            .icon-yonghu {
                position: absolute;
                top: -15px;
                left: 0px;
                border: 2px solid black;
                border-radius: 50%;
                padding: 3px 5px 3px 5px;
                background: black;
                color: white;
                font-size: 30px;
            }
        }

        .scoring {
            text-align: center;
            margin: 25px 0 20px 0;

            button {
                margin-right: 20px;
            }
        }
    }
</style>
