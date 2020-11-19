<template>
    <div class="informatiom">
        <div class="selecyCard clearfix">
            <router-link to="expertDetail">
                <el-card class="box-card">
                    <i class="icon iconfont icon-yonghu"></i>
                    <div style="padding: 14px;">
                        <div class="bottom clearfix">
                            <el-button type="text" class="button">专家信息</el-button>
                        </div>
                    </div>
                </el-card>
            </router-link>
            <router-link to="expertTotal">
                <el-card class="box-card_two">
                    <i class="icon iconfont icon-gongsi00"></i>
                    <div style="padding: 14px;">
                        <div class="bottom clearfix">
                            <time class="time"></time>
                            <el-button type="text" class="button">评审统计信息</el-button>
                        </div>
                    </div>
                </el-card>
            </router-link>
        </div>
    </div>
</template>

<script>
</script>

<style lang='scss'>
    .informatiom {
        width: 100%;
        height: 100%;

        .selecyCard {
            /* margin-top: 1%; */
            /* margin-bottom: 11%; */
        }

        .button {
            color: black;
        }

        .box-card {
            width: 230px;
            height: 230px;
            float: left;
            margin-left: 10%;
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
            width: 230px;
            height: 230px;
            float: left;
            margin-left: 20%;
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
    }
</style>
