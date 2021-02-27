<template>
    <div class="bidScoring">
        <div class="Crumbs">
            <div class="container deskHeader">
                <h4>
                    您的需求：
                    <router-link to="myBid">我的投标</router-link>
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
                        <span class="textLabel">组员名称：</span>
                        {{item.userName}}
                    </p>
<!--                    <p>-->
<!--                        <span class="textLabel">完成度：</span>-->
<!--                        {{item.accomplishProgress}}-->
<!--                    </p>-->
                    <div>
                        <p class="taskName">
                            <span class="textLabel">任务明细：</span>
                        </p>
                        <span v-if="item.missionNameList.length===0">暂无任务</span>
                        <div class="taskMain" v-for="(itemTask,index) in item.missionNameList" :key="index">
                            <p>{{itemTask.content}}</p>
                            <el-popover class placement="top" title="资源详情" width="200" trigger="click">
                                <p class="tgAddress">
                                    资源上传地址：
                                    <a
                                            target="_Blank"
                                            v-if="itemTask.fileName"
                                            :href="itemTask.fileName"
                                    >{{itemTask.fileName}}</a>
                                    <span v-if="!itemTask.fileName">暂未上传资源</span>
                                </p>
                                <p class="tgAddress">
                                    托管地址：
                                    <a
                                            target="_Blank"
                                            v-if="itemTask.trusteeship"
                                            :href="itemTask.trusteeship"
                                    >{{itemTask.trusteeship}}</a>
                                    <span v-if="!itemTask.trusteeship">暂无托管地址</span>
                                </p>
                                <a slot="reference" href="javascript:void(0)">资源详情</a>
                            </el-popover>
                        </div>
                    </div>
                    <el-form ref="selestate" :model="selestate[index]" label-width="95px">
                        <div class="scoring_input">
                            <el-form-item label="打分：" prop="teamScore" :error="item.errData">
                                <el-input
                                        placeholder="请输入1到100的分数"
                                        :disabled="!scoreIndex"
                                        v-model="item.personageScore"
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
                                        v-model="item.membersMerit"
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
                                        v-model="item.membersDefect"
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
                                        v-if="item.membersCommentFile"
                                        target="_Blank"
                                        :href="item.membersCommentFile"
                                        style="display:block;width:700px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"
                                >查看资源</a>
                                <a href="javascript:void(0)" v-if="!item.membersCommentFile">暂无附件</a>
                            </el-form-item>
                        </div>
                    </el-form>
                </el-card>
            </div>
            <div class="scoring">
                <el-button v-if="scoreIndex" type="primary" @click="scroe()">打分</el-button>
                <router-link to="myBid">
                    <el-button type="primary">返回</el-button>
                </router-link>
            </div>
        </div>
    </div>
</template>
<script>
    import {httpGet, httpPut} from "@/utils/http.js";
    import {successTips, errTips} from "@/utils/tips.js";
    import {mapMutations} from "vuex";
    import sourceUpload from "@/common/upload/resourceUpload";

    export default {
        components: {sourceUpload},
        data() {
            return {
                selestate: [
                    {userName: "", accomplishProgress: "", missionNameList: []}
                ],
                scoreIndex: false,
                castId: "",
                isLoding: false
            };
        },
        created: function () {
            if (!this.$route.query.id) {
                this.$router.push({path: "myBid"});
                return false;
            }
            this.getScore();
        },
        methods: {
            ...mapMutations(["setCache"]),
            //打分
            setIdCard(data) {
                this.selestate[data.fileIndex].membersCommentFile = data.fileName;
            },
            scroe() {
                const scorezz = /^([1-9][0-9]{0,1}|100)$/;
                let newData = this.selestate;
                let passScore = true;
                for (let i = 0; i < newData.length; i++) {
                    if (!scorezz.test(newData[i].personageScore)) {
                        newData[i].errData = "请输入1至100的分数";
                        newData[i].personageScore = "";
                        passScore = false;
                    } else {
                        newData[i].errData = "";
                    }
                }
                if (!passScore) {
                    return false;
                }
                this.isLoding = true
                httpPut("/v1/authorization/bids/personagescore/update", {
                    personageScoreList: newData
                }).then(results => {
                    this.loading = false
                    const {httpCode, msg} = results.data;
                    if (httpCode === 200) {
                        this.scoreIndex = false;
                        successTips("打分成功！");
                        this.setCache("myBid");
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                });
            },
            //获取打分
            getScore() {
                httpGet("/v1/authorization/bids/personagescore/select", {
                    id: this.$route.query.id
                }).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (data.scoreList.length === 0) {
                        errTips("此项目没有成员");
                    }
                    if (httpCode === 200) {
                        let selestate = [...data.scoreList];
                        selestate.forEach(ele => {
                            if (ele.personageScore === 0) {
                                this.scoreIndex = true;
                                ele.personageScore = null;
                            }
                            ele.castId = data.castId;
                            ele.missionNameList.forEach((i, index) => {
                                Object.assign(i, ele.resourcesList[index]);
                            });
                            ele.accomplishProgress = ele.accomplishProgress + "%";
                            ele.errData = "";
                        });
                        this.$set(this, "selestate", selestate);
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                });
            }
        }
    };
</script>
<style lang='scss'>
    .tgAddress {
        margin-top: 10px;

        a {
            text-decoration: underline;
        }
    }

    .bidScoring {
        .textLabel {
            width: 85px;
            display: inline-block;
        }

        .taskName {
            display: inline-block;
        }

        .taskMain {
            vertical-align: text-top;
            display: inline-block;
            margin-right: 20px;
            text-align: center;
            border: 1px solid rgb(208, 211, 218);
            padding: 8px 15px 6px 15px;
            border-radius: 5px;
            font-size: 14px;

            p {
                line-height: 23px;
                text-overflow: ellipsis;
            }
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

            .taskItem {
                margin-right: 20px;
            }

            .card {
                padding: 18px 0 10px 30px;
                height: 550px;

                p {
                    margin-bottom: 5px;
                }

                .el-input {
                    display: inline-block;
                    width: 163px;
                }

                .el-input__inner {
                    height: 28px;
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

            a {
                margin-left: 20px;
            }
        }
    }
</style>
