<template>
  <div id="foot">
<footer class="myfooter">
    <div class="footer_top">
        <p><i class="icon iconfont icon-shouye"></i>哈尔滨工业大学（深圳）</p>
        <p><i class="icon iconfont icon-youjian"></i>cosineHIT@163.com</p>
        <p><i class="icon iconfont icon-dianhua"></i>联系方式：0755-26033086</p>
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
  data: function() {
    return {

    };
  },
  methods: {}
};
</script>
<style lang="scss">
.myfooter {
    background: rgba(0, 0, 0, 0.842);
    height: 140px;
    width: 100%;
    color: rgba(255, 255, 255, 0.877);
    white-space: nowrap;
    i{
      color: white;
    }
}

.footer_bottom p {
    font-weight: 600;
    font-size: 0.8rem;
    padding-top: 20px;
    text-align: center;
    font-family: "Microsoft YaHei light";
}

.footer_top p {
    display: inline-block;
    font-size: 0.8rem;
    font-family: "Microsoft YaHei light";
    margin: 40px 15px 0px 11px;
    font-weight: 600;
}

.footer_top {
    text-align: center;
}
</style>