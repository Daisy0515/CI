<!--功能：查看缺陷历史
    调用页面：codeDefect
             -->
<template>
    <el-dialog :visible.sync="dialogFormVisible" :before-close="changeVisible"
               width="70%">
        <div class="container deskHeader">
            <el-table

                    :data="ruleForm"
                    style="width: 100%;margin-top:30px"
                    msgStatus
                    :header-cell-style="rowClass"
            >
                <el-table-column prop="content" :label=title align="left">
                    <template slot-scope="scope">
                        <el-tooltip
                                class="item"
                                effect="dark"
                                :content="scope.row.userName"
                                placement="top-start"
                        >
                            <span class="tablehidden">{{scope.row.userName}}</span>
                        </el-tooltip>
                        &nbsp;
                        <el-tooltip
                                class="item"
                                effect="dark"
                                :content="scope.row.content"
                                placement="top-start"
                        >
                            <span class="tablehidden">{{scope.row.content}}</span>
                        </el-tooltip>
                        &nbsp;
                        <el-tooltip
                                class="item"
                                effect="dark"
                                :content="scope.row.status"
                                placement="top-start"
                        >
                            <span class="tablehidden" v-if="scope.row.status===1" style="color:red">待解决</span>
                            <span class="tablehidden" v-if="scope.row.status===2" style="color:red">解决中</span>
                            <span class="tablehidden" v-if="scope.row.status===3" style="color:red">已解决</span>
                            <span class="tablehidden" v-if="scope.row.status===4" style="color:red">结束</span>
                        </el-tooltip>
                        &nbsp;
                        <el-tooltip
                                class="item"
                                effect="dark"
                                :content="scope.row.gmtCreate"
                                placement="top-start"
                        >
                            <span class="tablehidden">{{scope.row.gmtCreate}}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: "viewDefectHistory",
        props: {
            dialogFormVisible: {
                type: Boolean,
                default: false,
            },
            ruleForm:{
                type:Array,
            },
            title:{
                type:String,
            }
        },
        methods:{
            changeVisible() {
                this.$emit('closeDialog');
            },
            rowClass() {
                return "background:#F4F6F9;";
            }
        }
    }
</script>

<style scoped>

</style>
