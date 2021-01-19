<template>
    <div class="myTable" style="margin-top:20px">

        <el-table
                :data="tableData"
                style="width:1200px;margin:0 auto;"
                :header-cell-style="rowClass"
        >
            <el-table-column fixed prop="shortId" label="编号" align="center" width="250">
                <template slot-scope="scope">
                    <div class="dot"></div>
                    <div class="line" v-if="scope.$index<tableData.length-1"></div>
                    <el-tooltip
                            class="item"
                            effect="dark"
                            :content="scope.row.shortId"
                            placement="top-start"
                    >
                        <span class="tablehidden">{{scope.row.shortId}}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="日期" align="center" width="250">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.createdAt" placement="top-start">
                        <span class="tablehidden">{{scope.row.createdAt}}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="作者" align="center" width="250">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.authorName" placement="top-start">
                        <span class="tablehidden">{{scope.row.authorName}}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="title" label="注释" align="center">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.title" placement="top-start">
                        <span class="tablehidden">{{scope.row.title}}</span>
                    </el-tooltip>
                </template>
            </el-table-column>


        </el-table>
        <div class="bid_footer">

        </div>
    </div>
</template>
<script>
    import {httpGet, httpPut, httpDelete} from "@/utils/http.js";
    import {specificDate} from "@/utils/getDate.js";
    import {successTips, message, errTips} from "@/utils/tips.js";
    import {mapMutations, mapActions, mapGetters} from "vuex";
    import {MessageBox} from "element-ui";
    import timeLimit from "@/mixins/regular/timeLimit.js";

    export default {
        mixins: [timeLimit],
        name: "myDemand",
        components: {},
        data() {
            return {
                teamId: "",
                tableData: []
            };
        },
        created: function () {
            //获取项目类型数据
            this.teamId = this.$route.query.teamId;
            this.getView();
        },

        methods: {
            //获取页面数据
            getView(val = this.pageData) {
                httpGet(`/v1/authorization/bid/gitlab/commit?id=${this.teamId}`)
                    .then(results => {
                        const {msg, data, httpCode} = results.data;
                        if (httpCode === 200) {
                            let {commitList, httpUrlToRepo} = data;

                            this.$set(this, "tableData", commitList);
                        } else if (httpCode === 400) {
                            this.setCache("myBid");
                        } else if (httpCode !== 401) {
                            errTips(msg);
                        }
                    });

            },

            rowClass() {
                return "background:#F4F6F9;";
            }
        }
    };
</script>
<style lang='scss'>
    @import "@/assets/scss/myTable.scss";

    .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: red;
        position: absolute;
        margin: auto;
        left: 30px;
        top: 20px;
    }

    .line {
        width: 2px;
        height: 40px;
        background: red;
        vertical-align: top;
        margin: auto;
        position: absolute;
        left: 34px;
        top: 30px;
    }

</style>
