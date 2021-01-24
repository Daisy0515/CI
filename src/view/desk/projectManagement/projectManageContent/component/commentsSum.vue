<template>
    <el-dialog :visible.sync="dialogFormVisible" :before-close="changeVisible"
               width="70%">
        <div class="container deskHeader">
            <h1 style="margin: 10px">{{projectName}}意见汇总</h1>
            <el-card class="box-card0">
                <ul class="services">
                    <li class="serviceItem clearfix" v-for="(item, index) in opinionSummaryList " :key="index">
                        <div style="border: #d8d8d8 1px solid; padding: 10px 20px 20px 10px; box-shadow: 0 2px 2px 0 rgba(0,0,0,.1);">
                    <li>
                        意见标题：{{item.opinionTitle}}
                    </li>
                    <li>
                        提交人：{{item.submitterName}}

                    </li>
                    <li>

                        描述：{{item.opinionDescription}}

                    </li>
                    <!-- <span>{{item.opinionTitle}}</span> -->

                    <!-- <div class="clearfix rhythmMargin">
                        <div class="serviceHeader clearfix">
                            <span class="servTitle">
                                <h2>
                                    <a href="javascript:;">{{ item.opinionTitle  }}</a>
                                </h2>
                            </span>
                        </div>
                    </div> -->


        </div>
        </li>
        </ul>
        </el-card>
    </div>
    </el-dialog>
</template>
<script>

    export default {
        name: "commentsSum",
        props: {
            dialogFormVisible: {
                type: Boolean,
                default: false,
            },
            opinionSummaryList: {
                type: Array,
                default: null,
            },
            projectName: {
                type: String,
                default: "",
            }
        },
        data() {
            return {
                demandList: [],
                id: "",
                list: [{value: "是"}, {value: "否"}],
                //parentValue: "",
                typeValue: "",
                ruleForm: {},
            };
        },

        methods: {
            changeVisible() {
                this.$emit('closeDialog');
            },
        }
    };
</script>
<style lang='scss' scoped>
    @import "@/assets/scss/applicationView.scss";

    .applicationView {
        .seeClass {
            color: #3e76b8;
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
                background: #3e76b8;
            }
        }

        .el-table {
            border: 1px solid #d8d8d8;
        }

        .buttons {
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

    .box-card0 {
        li {
            margin-top: 15px;
            padding-top: 5px;
            color: #666;
            position: relative;
            cursor: pointer;

        }
    }
</style>
