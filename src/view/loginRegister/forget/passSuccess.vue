<template>
    <div class="registerSuccess">
        <Index-Header/>
        <div class="container">
            <el-card class="box-card">
                <div class="text_main">
                    <h3>
                        <i class="el-icon-success"></i>
                        <span>恭喜您，密码修改成功</span>
                    </h3>
                    <p>
                        <router-link to="login">{{time}}秒后跳转到登录界面，如果没有跳转请点击这里</router-link>
                    </p>
                </div>
            </el-card>
        </div>
        <Footer/>
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
        name: "passSuccess",
        data() {
            return {
                time: "5"
            };
        },
        mounted: function () {
            const dinshi = setInterval(() => {
                this.time -= 1;
                if (this.time == 0) {
                    clearInterval(dinshi);
                    this.$router.push({name: 'login'});
                }
            }, 1000);
        }
    };
</script>
<style lang='scss'>
    .registerSuccess {
        .container {
            .box-card {
                width: 900px;
                height: 450px;
                margin: 50px auto 10%;

                .text_main {
                    text-align: center;
                    margin-top: 100px;

                    h3 {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }

                    .el-icon-success {
                        font-size: 35px;
                        color: #4c83c3;
                        margin-right: 15px;
                    }

                    p {
                        margin-top: 50px;
                    }
                }
            }
        }
    }
</style>
