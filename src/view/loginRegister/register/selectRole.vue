<template>
    <div class="selectRole height_main">
        <Index-Header></Index-Header>
        <div class="container clearfix">
            <div class="selecyCard clearfix">
                <router-link to="personalRegister">
                    <el-card class="box-card">
                        <i class="icon iconfont icon-yonghu"></i>
                        <div style="padding: 14px;">
                            <div class="bottom clearfix">
                                <el-button type="text" class="button">个人注册</el-button>
                            </div>
                        </div>
                    </el-card>
                </router-link>
                <router-link to="companyRegister">
                    <el-card class="box-card_two">
                        <i class="icon iconfont icon-gongsi00"></i>
                        <div style="padding: 14px;">
                            <div class="bottom clearfix">
                                <time class="time"></time>
                                <el-button type="text" class="button">公司注册</el-button>
                            </div>
                        </div>
                    </el-card>
                </router-link>
            </div>


        </div>
<!--        <div class="container clearfix">-->
<!--            <div class="selecyCard clearfix">-->
<!--                <router-link to="adminRegister">-->
<!--                    <el-card class="box-card">-->
<!--                        <i class="el-icon-setting"></i>-->
<!--                        <div style="padding: 14px;">-->
<!--                            <div class="bottom clearfix">-->
<!--                                <el-button type="text" class="button">评审管理员注册</el-button>-->
<!--                            </div>-->
<!--                        </div>-->
<!--                    </el-card>-->
<!--                </router-link>-->
<!--            </div>-->
<!--        </div>-->
        <div style="clear:both"></div>
        <Footer class="height_footer"></Footer>
    </div>
</template>
<script>
    import IndexHeader from "@/common/header/userHeader";
    import Footer from "@/common/footer/footer";

    export default {
        components: {
            IndexHeader,
            Footer
        },
        data: function () {
            return {};
        },
        created: function () {
            if (sessionStorage.getItem("userToken")) {
                this.$router.push("/");
                return false;
            }
        }
    };
</script>
<style lang='scss'>
    .selectRole {
        width: 100%;
        height: 100%;

        .selecyCard {
            margin-top: 15%;
            margin-bottom: 11%;
        }

        .button {
            color: black;
        }

        .box-card {
            width: 400px;
            height: 250px;
            float: left;
            text-align: center;
            cursor: pointer;

            &:hover {
                background: #f8f8f8;
            }
        }

        .el-card__body {
            margin-top: 30px;
        }

        .box-card_two {
            width: 400px;
            height: 250px;
            float: right;
            text-align: center;
            cursor: pointer;

            &:hover {
                background: #f8f8f8;
            }
        }

        .icon-yonghu {
            font-size: 90px;
            color: #4c83c3;
        }

        .icon-gongsi00 {
            font-size: 90px;
            color: #4c83c3;
        }

        .el-icon-setting {
            font-size: 90px;
            color: #4c83c3;
        }
    }
</style>
