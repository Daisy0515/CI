<template>
    <div class="ttoolset">
        <router-link
                :to="{path:'caseDetails', query:{id:item.id}}"
                v-for="(item,index) in plazaList"
                :key="index"
        >
            <div style=" vertical-align:middle; margin-top:8%">
                <img :src="iconList[item.typeId]"
                     style="width:50px; height:50px; border-radius:50%; margin-left: 5%; ">
                <div style="display: inline-block; margin-left:15px;">
                    <div style="margin-bottom: 10px">
                        <a style="font-size: 18px;font-family: PingFang HK;font-weight: 500;color: #011A24;">{{
                                item.projectName
                            }}</a>
                    </div>
                    <div style="margin-top: -5px">
                        <a style="width: 175px;
                    font-size: 14px;
                    font-family: PingFang HK;
                    font-weight: 500;
                    color: #788DA4;
                    ">{{ item.detail }} </a>
                    </div>
                </div>
            </div>
        </router-link>
    </div>
</template>

<script>
import {httpGet} from "@/utils/http.js";
import {errTips, message} from "@/utils/tips.js";
import {specificDate as getDate} from "@/utils/getDate";

export default {
    name: "Projects",
    data() {
        return {
            pageData: {
                projectName: "",
                parentId: null,
                typeId: null,
                pageSize: 10,
                pageNo: 1,
                orderBy: "id",
                orderType: "DESC"
            },
            plazaList: [],
            iconList: [require('./project_icon_1.png'),
                require('./project_icon_2.png'),
                require('./project_icon_3.png'),
                require('./project_icon_4.png'),
                require('./project_icon_5.png'),
                require('./project_icon_6.png'),
                require('./project_icon_7.png'),
                require('./project_icon_8.png'),
                require('./project_icon_9.png'),
                require('./project_icon_10.png'),
                require('./project_icon_11.png'),
                require('./project_icon_12.png'),
                require('./project_icon_13.png'),
                require('./project_icon_14.png'),
            ],
        };
    },
    created() {
        this.getView();
    },
    methods: {
        getView(val = this.pageData) {
            this.loading = true;
            // !value && (value = "所有");
            httpGet("/v1/public/bid/classiccase/list", val).then(results => {
                let getData = results.data;
                console.log("89", getData);
                if (getData.httpCode === 200) {
                    this.plazaList = [...getData.data.classicCaseList].slice(0, 5);
                    console.log("92", this.plazaList);
                    this.pageData.pageNo = getData.data.pageNo;
                    this.totalPage = parseInt(getData.data.totalPage + "0");
                    for (let i of this.plazaList) {
                        i.gmtCreate = getDate(i.gmtCreate);
                    }
                    this.loading = false;
                    Object.assign(this.pageData, val);
                    this.tipData = false;
                    // this.seleValue = value;
                } else if (getData.msg == "该条件暂无数据") {
                    this.loading = false;
                    this.plazaList = [];
                    this.tipData = true;
                    message("暂无数据");
                }
            });
        }
    },
};
</script>
<style lang='scss'>
.ttoolset {
    width: 100%;

    .ttoolset_item {
        opacity: 0.8;
        box-shadow: 25px 0 25px -25px #999, -25px 0 25px -25px #999;
        cursor: pointer;
        // float: left;
        display: inline-block;
        width: 165px;
        margin-right: 30px;
        margin-bottom: 68px;
        height: 165px;


        & :hover {
            background: #80CCD0;
            color: #FFFFFF;
            box-shadow: 25px 0 25px -25px #ABC8CC, -25px 0 25px -25px #ABC8CC;
        }

        .el-card {
            height: 100%;
            border: none;
        }

        .el-card__body {
            height: 100%;
            padding: 0;
        }

        p {
            font-size: 24px;
            font-family: PingFang HK;
            font-weight: 500;
            color: #011A24;
            line-height: 30px;
            margin: 60px 20px 60px 20px;
        }
    }
}
</style>
