<template>
    <div class="teamApplication">
        <div class="header">
            <div class="container deskHeader">
                <h4>我的评分</h4>
            </div>
        </div>
        <div class="container deskHeader">
            <el-dialog :title="title" :visible.sync="diaIndex" width="30%">
                <p
                        style="word-wrap:break-word;width:100%;display:inline-block"
                >{{content}}</p>
                <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="diaIndex = false">确 定</el-button>
        </span>
            </el-dialog>
            <div class="header_top">
                <el-input v-model="searchData.name" placeholder="请输入项目名称"></el-input>
<!--                <el-select v-model="searchData.role" placeholder="请选择角色" clearable>-->
<!--                    <el-option-->
<!--                            v-for="item in roleOptions"-->
<!--                            :key="item.value"-->
<!--                            :label="item.label"-->
<!--                            :value="item.value"-->
<!--                    ></el-option>-->
<!--                </el-select>-->
                <div class="get_btn">
                    <el-button size="primary" @click="searchList">搜索</el-button>
                </div>
            </div>
            <el-table
                    :data="teamFrom"
                    style="width: 100%"
                    :header-cell-style="rowClass"
                    v-loading="loading"
            >
                <el-table-column fixed prop="projectCode" label="项目编号" align="center">
                    <template slot-scope="scope">
                        <el-tooltip
                                class="item"
                                effect="dark"
                                :content="String(scope.row.projectCode)"
                                placement="top-start"
                        >
                            <span class="tablehidden">{{scope.row.projectCode}}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="项目名称" align="center">
                    <template slot-scope="scope">
                        <el-tooltip
                                class="item"
                                effect="dark"
                                :content="scope.row.projectName"
                                placement="top-start"
                        >
                            <span class="tablehidden">{{scope.row.projectName}}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="role" label="角色" align="center">
                    <template slot-scope="scope">
                        <span class="tablehidden">{{scope.row.role==1?"经理":"组员"}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="membersScore" label="组内分" align="center">
                    <template slot-scope="scope">
                        <span class="tablehidden">{{scope.row.membersScore?scope.row.membersScore:"—"}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="membersMerit" label="优点（组）" align="center">
                    <template slot-scope="scope">
                   <span
                           @click="openDia(scope.row.membersMerit,'优点（组）')"
                           v-if="scope.row.membersMerit"
                           class="seeClass"
                   >点击查看</span>
                        <span v-if="!scope.row.membersMerit" class="seeClass">—</span>
                    </template>
                </el-table-column>
                <el-table-column prop="membersDefect" label="不足（组）" align="center">
                    <template slot-scope="scope">
            <span
                    @click="openDia(scope.row.membersDefect,'不足（组）')"
                    v-if="scope.row.membersDefect"
                    class="seeClass"
            >点击查看</span>
                        <span v-if="!scope.row.membersDefect" class="seeClass">—</span>
                    </template>
                </el-table-column>
                <el-table-column prop="membersCommentFile" label="评论文件（组）" align="center">
                    <template slot-scope="scope">
                        <a
                                :href="scope.row.membersCommentFile"
                                target="_Blank"
                                v-if="scope.row.membersCommentFile"
                        >查看附件</a>
                        <a target="_Blank" v-if="!scope.row.membersCommentFile">暂无附件</a>
                    </template>
                </el-table-column>
                <el-table-column prop="teamScore" label="团队分" align="center">
                    <template slot-scope="scope">
                        <span class="tablehidden">{{scope.row.teamScore?scope.row.teamScore:"—"}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="teamMerit" label="优点（团）" align="center">
                    <template slot-scope="scope">
            <span
                    @click="openDia(scope.row.teamMerit,'优点（团）')"
                    v-if="scope.row.teamMerit"
                    class="seeClass"
            >点击查看</span>
                        <span v-if="!scope.row.teamMerit" class="seeClass">—</span>
                    </template>
                </el-table-column>
                <el-table-column prop="teamDefect" label="不足（团）" align="center">
                    <template slot-scope="scope">
            <span
                    @click="openDia(scope.row.teamDefect,'不足（团）')"
                    v-if="scope.row.teamDefect"
                    class="seeClass"
            >点击查看</span>
                        <span v-if="!scope.row.teamDefect" class="seeClass">—</span>
                    </template>
                </el-table-column>
                <el-table-column prop="teamCommentFile " label="评论文件（团）" align="center">
                    <template slot-scope="scope">
                        <a
                                :href="scope.row.teamCommentFile"
                                target="_Blank"
                                v-if="scope.row.teamCommentFile"
                        >查看附件</a>
                        <a target="_Blank" v-if="!scope.row.teamCommentFile">暂无附件</a>
                    </template>
                </el-table-column>
                <!-- <template slot-scope="scope">
                    <router-link @click.native="dele(scope)" to v-if="scope.row.status==='失败'">
                      <i class="el-icon-delete"></i>
                      删除
                    </router-link>
                    <router-link
                      @click.native="pass(scope.row)"
                      to
                      v-if="scope.row.status==='审核中'&&scope.row.show"
                    >
                      <i class="el-icon-circle-check"></i>
                      通过
                    </router-link>
                    <router-link
                      @click.native="nopass(scope.row)"
                      to
                      v-if="scope.row.status==='审核中'&&scope.row.show"
                    >
                      <i class="el-icon-error"></i>
                      不通过
                    </router-link>
                  </template>
                </el-table-column>-->
            </el-table>
            <div class="bid_footer">
                <el-pagination
                        @current-change="handleCurrentChange"
                        :current-page.sync="pageData.pageNo"
                        :total="totalPage"
                        layout="prev, pager, next, jumper"
                ></el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
    import {httpGet, httpPut, httpDelete} from "@/utils/http.js";
    import {message, errTips, successTips} from "@/utils/tips.js";
    import {mapMutations} from "vuex";
    import {MessageBox} from "element-ui";

    export default {
        components: {},
        name: "teamApplication",
        data() {
            return {
                roleOptions: [
                    {
                        value: 1,
                        label: "项目经理"
                    },
                    {
                        value: 2,
                        label: "组员"
                    }
                ],
                loading: false,
                content: "",
                title: "",
                selectedOptions: "",
                diaIndex: false,
                options: [],
                selestate: [],
                typeList: [],
                totalPage: 0,
                searchData: {
                    role: "",
                    name: "",
                    startTime: null,
                    endTime: null,
                    parentId: null,
                    pageSize: 10,
                    pageNo: 1,
                    orderType: "DESC",
                    typeId: null,
                    orderBy: "id"
                },
                pageData: {
                    role: "",
                    name: "",
                    orderType: "DESC",
                    startTime: null,
                    endTime: null,
                    parentId: null,
                    pageNo: 1,
                    typeId: null,
                    pageSize: 10,
                    orderBy: "id"
                },
                teamFrom: []
            };
        },
        created: function () {
            this.getView();
        },
        methods: {
            ...mapMutations(["setCache"]),
            rowClass() {
                return "background:#F4F6F9;";
            },
            openDia(content, title) {
                this.diaIndex = !this.diaIndex;
                this.content = content;
                this.title = title
            },
            //搜索查询
            searchList() {
                let {searchData} = this;
                this.getView(searchData);
            },
            //页码变化
            handleCurrentChange(val) {
                this.pageData.pageNo = val;
                this.getView();
            },
            //通过申请
            pass(row) {
                httpPut("/v1/authorization/team/statussucceed/update", {
                    id: row.id
                }).then(results => {
                    const {httpCode, msg} = results.data;
                    if (httpCode === 200) {
                        row.status = "成功";
                        successTips("已同意此用户加入团队！");
                    } else if (httpCode === 400) {
                        this.setCache("teamApplication");
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                });
            },
            //获取页面数据
            getView(val = this.pageData) {
                let role = JSON.parse(sessionStorage.getItem("projectRole"));
                if(role===2){
                    val.role = 1; //项目经理
                }else if(role===3){
                    val.role = 2; //开发者
                }
                this.loading = true;
                httpGet("/v1/authorization/comment/search/get", val).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200) {
                        let getData = data;
                        this.pageNo = getData.pageNo;
                        this.totalPage = parseInt(getData.totalPage + "0");
                        let {list} = getData;
                        this.teamFrom = list;
                        Object.assign(this.pageData, val);
                    } else if (msg === "该条件暂无数据") {
                        this.teamFrom = [];
                        message("该条件暂无数据");
                    }
                    this.loading = false;
                });
            },
            //不通过
            nopass(row) {
                httpPut("/v1/authorization/team/statuscome/update", {id: row.id}).then(
                    results => {
                        const {httpCode, msg} = results.data;
                        if (httpCode === 200) {
                            row.status = "失败";
                            message("已拒绝此用户加入此团队！");
                        } else if (httpCode === 400) {
                            this.setCache("teamApplication");
                        } else if (httpCode !== 401) {
                            errTips(msg);
                        }
                    }
                );
            },
            //删除记录
            dele(scope) {
                MessageBox.confirm("此操作将删除此条申请记录, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    httpDelete(
                        `/v1/authorization/team/teamapplyforid/delete/${scope.row.id}`
                    ).then(results => {
                        const {msg, httpCode} = results.data;
                        if (httpCode === 200) {
                            this.getView();
                            successTips("已成功删除此项申请信息！");
                        } else if (httpCode === 400) {
                            this.setCache("teamApplication");
                        } else if (httpCode !== 401) {
                            errTips(msg);
                        }
                    });
                });
            }
        }
    };
</script>
<style lang='scss'>
    .teamApplication {
        .seeClass {
            color: #7cabb1;
            cursor: pointer;
        }

        .bid_footer {
            .el-input__inner {
                width: 70px;
            }

            .el-pagination {
                text-align: center;
                margin: 50px 0 50px 0;
            }

            .el-pagination.is-background .el-pager li:not(.disabled).active {
                background: #7cabb1;
            }
        }

        .el-table {
            border: 1px solid #d8d8d8;
        }

        .get_btn {
            float: right;
        }

        .header_top {
            margin-top: 15px;
            padding-bottom: 20px;

            button {
                margin-left: 20px;
            }
        }

        .el-input {
            display: inline-block;
            width: 200px;
            margin-right: 25px;
        }

        .el-input__inner {
            border: 1px solid #c0c0c0;
            width: 200px;
            height: 35px;
            line-height: 35px;
        }

        .el-table td,
        .el-table th.is-leaf {
            color: black;
            border-bottom: 1px solid #d8d8d8;
        }
    }
</style>
