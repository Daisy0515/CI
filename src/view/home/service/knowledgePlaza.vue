<template>
    <div class="applicationView">
        <ul class="knowledge_list">
            <li>
                <router-link
                        :to="{path:'knowledgeView',query:{id:item.id}}"
                        v-for="(item,index) in infoList"
                        :key="index"
                >
                    <el-card class="knowledge_card">
                        <el-tooltip class="item" effect="dark" :content="item.title" placement="top-start">
                            <h2>{{item.title}}</h2>
                        </el-tooltip>
                        <div class="rightData">
                            <span>来源：{{item.source}}</span>
                            <span>作者：{{item.author}}</span>
                        </div>
                        
                        <p>{{item.digest}}</p>
                        <span class="seeNum">
              <i class="icon iconfont icon-chakan"></i>
              {{item.selectCount}}
            </span>
                    </el-card>
                </router-link>
            </li>
        </ul>
        <div class="pagerHold">
            <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page.sync="pageNo"
                    :total="totalPage"
                    layout="prev, pager, next, jumper"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
    import {httpGet} from "@/utils/http.js";
    import {errTips} from "@/utils/tips.js";

    export default {
        data() {
            return {
                infoList: [],
                totalPage: 1,
                pageNo: 1,
                pageData: {
                    pageSize: 8,
                    pageNo: 1,
                    orderBy: "id",
                    orderType: "DESC"
                }
            };
        },
        created: function () {
            this.getViewData();
        },
        methods: {
            getViewData() {
                httpGet("/v1/public/share/get/list", this.pageData).then(results => {
                    const {httpCode, data, msg} = results.data;
                    if (httpCode === 200) {
                        this.infoList = data.infoList;
                        this.totalPage = parseInt(data.totalPage + "0");
                        this.pageNo = data.pageNo;
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                });
            },
            handleCurrentChange(val) {
                this.pageData.pageNo = val;
                this.getViewData();
            }
        }
    };
</script>
<style lang='scss'>
    .knowledge_card {
        position: relative;
        margin-bottom: 20px;
        min-height: 200px;

        &:hover {
            background: #f0f0f0;
        }

        h2 {
            display: inline-block;
            width: 52%;
            margin-bottom: 10px;
            font-size: 21px;
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

            &:hover {
                text-decoration: underline;
                color: #7cabb1;
            }
        }

        .rightData {
            float: right;
            margin-right: 55px;
            margin-top: 5px;
            width: 40%;

            span {
                margin-left: 15px;
                font-size: 14px;
                width: 140px;
                display: inline-block;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }

        p {
            width: 100%;
        }

        .div1:before {
            position: absolute;
            z-index: 1;
            right: 0;
            top: 0;
            height: 0;
            padding-right: 10px;
            font-weight: bold;
            line-height: 0;
            color: white;
            border: 15px solid #7cabb1;
            border-right-color: transparent;
            content: "论文";
            box-shadow: 0 5px 5px -5px #000;
        }

        .div1:after {
            /*书签的夹角*/
            content: "";
            position: absolute;
            top: 280px;
            left: 20px;
            border: 4px solid #89540c;
            border-left-color: transparent;
            border-bottom-color: transparent;
        }

        .patent:before {
            position: absolute;
            z-index: 1;
            right: 0;
            top: 0;
            height: 0;
            padding-right: 10px;
            font-weight: bold;
            line-height: 0;
            color: white;
            border: 15px solid red;
            border-right-color: transparent;
            content: "专利";
            box-shadow: 0 5px 5px -5px #000;
        }

        .patent:after {
            content: "";
            position: absolute;
            top: 280px;
            left: 20px;
            border: 4px solid #89540c;
            border-left-color: transparent;
            border-bottom-color: transparent;
        }

        .seeNum {
            float: right;
            margin-right: 0;
            position: absolute;
            bottom: 10px;
            right: 10px;
        }
    }

    .pagerHold {
        text-align: center;
        margin: 10px 0;
    }
</style>
