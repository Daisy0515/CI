<template>
  <div class="publishtask">
    <div class="Crumbs">
      <div class="container deskHeader">
        <h4>
          <router-link to="myDemand">我的需求</router-link>>
          <span class="active">发布需求</span>
        </h4>
      </div>
    </div>
    <div class="container deskHeader">
      <Publish/>
    </div>
  </div>
</template>
<script>
import Publish from "@/common/publish/publish.vue";
export default {
  components: {
    Publish
  },
  data() {
    return {};
  }
};
</script>
<style lang='scss'>
</style>
