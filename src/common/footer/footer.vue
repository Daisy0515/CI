<template>
    <div id="foot">
        <footer class="myfooter">
            <div class="footer_top">
                <p><i class="icon iconfont icon-shouye"></i>哈尔滨工业大学（深圳）</p>
                <p><i class="icon iconfont icon-youjian"></i>cosineHIT@163.com</p>
                <p><i class="icon iconfont icon-dianhua"></i>0755-26033086</p>
            </div>
            <div class="footer_bottom">
                <p>Copyright © 2018 cos Inc. 粤ICP备17120953号</p>
            </div>
        </footer>
    </div>
</template>


<script>
    export default {
        name: "foot",
        data: function () {
            return {};
        },
        methods: {}
    };
</script>
<style lang="scss">
    .myfooter {
        background: #B2BABD;
        height: 213px;
        width: 100%;
        white-space: nowrap;
        color: #011A24;
        line-height: 24px;

        i {
            font-size: 24px;
            margin-right: 6px;
            vertical-align: middle;

        }
    }

    .footer_bottom p {
        font-size: 16px;
        font-family: PingFang HK;
        font-weight: 400;

        padding-top: 41px;
        text-align: center;
    }

    .footer_top p {
        font-size: 16px;
        font-family: PingFang HK;
        font-weight: 400;

        display: inline-block;
        
        margin: 66px 60px 0px 60px;
    }

    .footer_top {
        text-align: center;
    }
</style>
