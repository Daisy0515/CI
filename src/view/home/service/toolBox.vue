<template>
    <div class='tool-box'>
            <el-card>
                <p>{{title}}</p>
            </el-card>
    </div>
</template>

<script>

    export default {
        name: "ToolBox",
        props: {
            title: {
                type: String,
                default: '',
            }
        },
        data() {
            return {};
        },
        methods: {}
    };
</script>
<style lang='scss'>
        .tool-box {
            opacity: 0.8;
            box-shadow:25px 0 25px -25px #999, -25px 0 25px -25px #999;
            // cursor: pointer;
            // display: inline-block;
            height: 165px;

            & :hover {
                background: #7cabb1;
                opacity:  0.8;
                color: #FFFFFF;
                box-shadow:25px 0 25px -25px #ABC8CC, -25px 0 25px -25px #ABC8CC;
            }

            .el-card {
                height: 100%;
                border: none;
            }

            .el-card__body {
                height: 100%;
                padding: 0;
                pointer-events:  none;
                display: flex;
                align-items: center;
                justify-content: center;

            p {
                font-size: 24px;
                //font-family: PingFang HK;
                font-weight: 500;
                color: #011A24;
                padding: 0 10px 0 10px;
            }
        }
    }
</style>