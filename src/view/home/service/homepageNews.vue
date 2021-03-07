<template>
    <div class="applicationView">
        <ul class="knowledge_list">
            <li>
                <router-link
                        :to="{path:'homepageView',query:{id:item.id}}"
                        v-for="(item,index) in singlePageInfo"
                        :key="index"
                >
                    <el-card class="knowledge_card">
                        <el-tooltip class="item" effect="dark" :content="item.title" placement="top-start">
                            <h2>{{item.title}}</h2>
                        </el-tooltip>
                
                        
                        <p>{{item.description}}</p>
                        
                    </el-card>
                </router-link>
            </li>
        </ul>
        <div class="pagerHold">
            <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page.sync="pageNo"
                    :total="total"
                    :page-size="pageSize"
                    layout="prev, pager, next, jumper"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
    import {httpGet} from "@/utils/http.js";
    import {errTips, message} from "@/utils/tips.js";

    export default {
        data() {
            return {
                infoList: [],
                total: 1,
                pageNo: 1,
                pageSize: 5,
                singlePageInfoList:[],
                singlePageInfo:[],
                count:0,
            };
        },
        created: function () {
            this.getViewData();
        },
        methods: {
            getViewData() {
                httpGet("/v1/public/homepage/get/list").then(results => {
                    const {httpCode, data, msg} = results.data;
                    if (httpCode === 200) {
                        this.infoList = data.infoList;
                        this.total = this.infoList.length;
                        //console.log(this.total);
                        //this.pageNo = data.pageNo;
                        let count=parseInt(this.total/this.pageSize)+1;
                        //console.log(count);
                        let arr=[];
                        for(let i=0;i<count-1;i++){
                            arr=[];
                            for(let j=i*this.pageSize;j<(i+1)*this.pageSize;j++){
                                arr.push(this.infoList[j]);
                            }
                            this.singlePageInfoList.push(arr);
                        }
                        arr=[];
                        for(let i=(count-1)*this.pageSize;i<this.total;i++){
                            arr.push(this.infoList[i]);
                        }
                        this.singlePageInfoList.push(arr);
                        //console.log(this.singlePageInfoList);
                        this.singlePageInfo = this.singlePageInfoList[this.pageNo-1];
                        if(this.infoList.length === 0){
                            message("该条件暂无数据");
                        }
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                });
            },
            handleCurrentChange(val) {
                this.pageNo = val;
                this.singlePageInfo = this.singlePageInfoList[this.pageNo-1];
                
                
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
