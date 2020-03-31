<template>
  <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>
<script>
import { mapMutations } from "vuex";
export default {
  data: function() {
    return {
      include: [],
      isRouterAlive:true
    };
  },
  provide() {
    return {
      reload: this.reload
    };
  },
  created: function() {
    this.setLogin();
    // httpGet("/v1/public/bid/typeall/get").then(results => {
    //   if (results.data.httpCode === 200) {
    //     let { list } = results.data.data;
    //     sessionStorage.setItem("typeList", JSON.stringify(list));
    //   }
    // });
  },
  methods: {
    ...mapMutations(["setLogin"]),
    reload(){
      this.isRouterAlive = false
      this.$nextTick(function(){
        this.isRouterAlive = true
      })
    }
  }
};
</script>
<style>
html,
body,
#app {
  margin: 0px;
  padding: 0px;
  height: 100%; /*mandatory*/
}
</style>