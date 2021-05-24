<template>
  <div class="chatright">
    <el-container style="height:100%;width:600px;background-color: #545c64">

      <el-main style=" background-color: #ffffff;padding:0px">
        <el-button  type="primary" @click="robotClose"  size="small" style="position:absolute;background-color: #f02e2e;margin: 0px 0px 0px 535px;z-index : 30">关闭</el-button>
        <JwChat-index
            :taleList="list"
            :config="config"
            @enter="bindEnter"
            v-model="inputMsg"
            :showRightBox="false"
            scrollType="noscroll"
            :toolConfig="tool"
            width="100%"
            height="60%"

        />
      </el-main>

    </el-container>
  </div>


</template>

<script>
export default {
  name: "codeSearch",
  data() {
    return {
      config: {
        img: require("@/assets/img/contributor/yuanqi.jpg"),
        name: '代码搜索',
        dept: '代码搜索',
        callback: this.bindCover,
        historyConfig:{
          show: true,
          tip: '加载更多',
          callback: this.bindLoadHistory,
        },
      },
      inputMsg:'',
      list:[{
        "text": { "text": '代码搜索' },
        "mine": false,
        "img": require("@/assets/img/contributor/yuanqi.jpg")
      }],
      tool: {
        callback: this.toolEvent
      },


    };
  },

  methods: {

    bindEnter() {
      const msg = this.inputMsg
      if (!msg) return;
      var date = new Date();
      const msgObj = {
        "date": date.toLocaleString(),
        "text": {"text": msg},
        "mine": true,
        "img": require("@/assets/img/contributor/xwj.jpg")
      }
      this.list.push(msgObj)
      const msgObj1 = {
        "date": date.toLocaleString(),
        "text": {"text": "你可以试试说代码搜索"},
        "mine": false,
        "img": require("@/assets/img/contributor/rqj.jpg")
      }
      this.list.push(msgObj1)
    },
    toolEvent(type, plyload) {
      console.log('tools', type, plyload)
    },

    robotClose() {
      this.$emit("childFn", false);
    },
  }
}
</script>

<style scoped>
.chatright {
  background-color: #ffffff;

  height: 100%;
}
.chatright .top {
  width: 100%;
  display: flex;
  float:left;
}

ul {
  padding: 10px;
}
li {
  padding: 10px;
  margin: 20px;
  width: 80%;
}
p{
  display: inline-block;
}
.msgcard {
  margin: 0 10px 0 10px;
  background-color: rgb(51, 233, 75);
  border-radius: 10px;
  max-width: 80%;
}
.msgleft {
  float: left;
  height: 20px;
}
.imgstyle{
  border-radius: 20px; vertical-align: top; height:20px;width:20px
}
.msgright {
  float: right;
  height: 20px;
}
.chatright .footer {
  background-color: #FBFCFC;
  text-align: right;
}
.sendbtn {
  height: 40px;
  width: 50px;
  border-radius: 10px;
  background-color: #58D68D;
  color: white;
  font-weight: bold;
  margin:10px 20px 0 0;

}

</style>