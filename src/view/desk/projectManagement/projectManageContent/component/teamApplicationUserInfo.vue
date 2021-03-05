<template>
    <el-dialog :visible.sync="dialogFormVisible" :before-close="changeVisible"
               width="70%">
        <div class="container deskHeader">
            <el-card class="box-card0">
                <div slot="header" class="clearfix">
                    <h2 style="color:#7cabb1">申请人信息</h2>
                </div>
                <!-- <div class="content">
                    <div class="content_top">
                        <div class="content_name">
                            <h3>用户名：{{userData.userName}}</h3>
                        </div>
                    </div>
                </div> -->
                <ul class="content_main myIcon">
                    <li>
                        <h3>
                            <i class="el-icon-user" aria-hidden="true"></i>
                            {{userData.userName}}
                        </h3>
                    </li>
                    <li>
                        <h3>
                            <i class="el-icon-message" aria-hidden="true"></i>
                            {{userData.email}}
                        </h3>
                    </li>
                    <li>
                        <h3>
                            <i class="el-icon-mobile-phone" aria-hidden="true"></i>
                            {{userData.phone}}
                        </h3>
                    </li>
                    
                    
                </ul>
            </el-card>
        </div>
    </el-dialog>
</template>

<script>

    export default {
        name: "teamApplicationUserInfo",
        props: {
            dialogFormVisible: {
                type: Boolean,
                default: false,
            },

            userData: {
                type: Object,
            },
        },

        methods: {
            changeVisible() {
                this.$emit('closeDialog');
            },
        },
    };
</script>

<style lang='scss' scoped>
.myIcon {
    font-size: 16px;
}
</style>
