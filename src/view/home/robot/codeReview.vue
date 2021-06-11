<template>
<div class="chatright">
  <el-container style="height:100%;width:600px;background-color: #545c64">
    <el-button  type="primary" @click="robotClose"  size="small" style="position:absolute;background-color: #f02e2e;margin: 0px 0px 0px 535px;z-index : 30">关闭</el-button>
    <el-main style=" background-color: #ffffff;padding:0px">
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
    <!--以下el-dialog是我自己编写的用于显示代码审查报告的组件    -->
    <el-dialog title="代码审查结果" :visible.sync="codeReviewVisible">
      <div id="pdfDom" v-show="true">
        <h1 style="text-align: center">代码审查结果</h1>
        <el-form label-position="right" :model="pdf" label-width="120px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="提交者">
                <el-input class="to-large" v-model="pdf.name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="时间">
                <el-input class="to-large" v-model="pdf.time"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-form-item label="提交代码">
                <div style="white-space: pre-wrap" align="left">{{pdf.originalCode}}</div>
                <!--              <el-input type="textarea" v-model="pdf.originalCode" :autosize="{ minRows: 2, maxRows: 100}"></el-input>-->
              </el-form-item>
            </el-col>
          </el-row>
<!--          <el-row>-->
<!--            <el-col :span="18">-->
<!--              <el-form-item label="编译结果">-->
<!--                <div style="white-space: pre-line" align="left">{{pdf.codeFormatRes}}</div>-->
<!--                &lt;!&ndash;              <el-input type="textarea" v-model="pdf.compileRes" :autosize="{ minRows: 2, maxRows: 100}"></el-input>&ndash;&gt;-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--          </el-row>-->
          <el-row>
            <el-col :span="18">
              <el-form-item label="静态代码分析">
                <div style="white-space: pre-wrap" align="left">{{pdf.staticAnalysisRes}}</div>
                <!--              <el-input type="textarea" v-model="pdf.staticAnalysisRes" :autosize="{ minRows: 2, maxRows: 100}"></el-input>-->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-form-item label="代码格式化">
                <div style="white-space: pre-wrap" align="left">{{pdf.codeFormatRes}}</div>
                <!--              <el-input type="textarea" v-model="pdf.codeFormatRes" :autosize="{ minRows: 2, maxRows: 100}"></el-input>-->
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-button type="primary" @click="toGetPdf">导出PDF</el-button>
    </el-dialog>

  </el-container>
</div>


</template>

<script>


import axios from "axios";

export default {
    name: "codeReview",
    data() {
      return {
        config: {
          img: require("@/assets/img/contributor/nakagawa.png"),
          name: '代码审查',
          dept: '我可以为您检查代码',
          callback: this.bindCover,
          historyConfig:{
            show: true,
            tip: '加载更多',
            callback: this.bindLoadHistory,
          },
        },
        inputMsg:'',
        list:[{
          "text": { "text": "点击工具栏的\"文件\"按钮，使用代码审查。\n或者在下方输入框直接输入代码。" },
          "mine": false,
          "img": require("@/assets/img/contributor/nakagawa.png")
        }],
        tool: {
          //添加文件和历史工具栏，其中文件工具栏开源组件封装好了上传功能
          show: ['file', 'more'],
          callback: this.toolEvent,
        },
        codeReviewVisible: false,
        title: '代码审查报告',
        pdf: {
          name: 'Euphonium',
          time: '',
          originalCode: '',
          compileRes: '',
          staticAnalysisRes: '',
          codeFormatRes: ''
        },


      };
    },

    methods: {
      //输入框点击回车之后触发的事件
      bindEnter(){
          const msg = this.inputMsg
            if (!msg) return;
            let date =new Date();
            const msgObj = {
                "date": date.toLocaleString(),
                "text": { "text": msg },
                "mine": true,
                "img": require("@/assets/img/contributor/xwj.jpg")
            }
            this.list.push(msgObj)
          this.doUploadWithJSON()

      },
      //工具栏组件的回调方法
      toolEvent (type, payload) {
        if (type === 'file') {
          let file = payload
          this.doUpload(file)
        } else if (type === 'more') {
          this.doHistory(payload)
        }

      },

      robotClose(){
        this.$emit("childFn",false);
      },

      toGetPdf() {
        /* 这行代码很重要，它让页面的滚动条跳到了最上方
        　　　　　　如果点击打印按钮的时候,滚动条没有在最上方,打印内容会是不完整的
        　　　　　　当然,用起来体验也会差一点,如果你有更好的办法,
        　　　　　　欢迎来评论区,我们一起探讨*/
        window.scrollTo(100, 0);
        this.getPdf(this.title);
      },

      /*
      以下两个方法是根据自己接入方法添加的
       */
      doUpload(payload) {
        let formData = new FormData()
        formData.append('file', payload[0])
        axios.post('http://1.15.173.185:8080/api/file/cosine', formData, {
          headers: {
            'Content-Type': 'multipart/form-data;'
          }
        }).then(res => {
          console.log('success');
          console.log(res.data);
          this.pdf.originalCode = res.data.originalCode
          this.pdf.compileRes = res.data.compileRes
          this.pdf.staticAnalysisRes = res.data.staticAnalysisRes
          this.pdf.codeFormatRes = res.data.codeFormatRes
          let date = new Date()
          const msgStaticAnalysis = {
            "date": date.toLocaleString(),
            "text": { "text": '静态代码分析结果' + '\n' + this.pdf.staticAnalysisRes },
            "mine": false,
            "img": require("@/assets/img/contributor/nakagawa.png")
          }
          this.list.push(msgStaticAnalysis)
          const codeFormat = {
            "date": date.toLocaleString(),
            "text": { "text": "更多审查结果请点击工具栏的\"更多\"按钮" },
            "mine": false,
            "img": require("@/assets/img/contributor/nakagawa.png")
          }
          this.list.push(codeFormat)
          this.pdf.time = date.toDateString()
          // this.codeReviewVisible = true
          // console.log(this.codeReviewVisible);
        }).catch(err => {
          console.log(err);
        })
      },

      doHistory() {
        this.codeReviewVisible = true
      },

      doUploadWithJSON() {
        let data = {
          code: this.inputMsg
        }
        axios.post('http://1.15.173.185:8080/api/file/cosineNoFile', data)
          .then(res => {
            console.log('success')
            let date = new Date()
            if (res.data.stats !== 0) {
              const errMsg = {
                "date": date.toLocaleString(),
                "text": { "text": "编译出错，请检查代码是否为C语言编译通过代码" },
                "mine": false,
                "img": require("@/assets/img/contributor/nakagawa.png")
              }
              this.list.push(errMsg)
            } else {
              console.log(res.data);
              this.pdf.originalCode = res.data.originalCode
              this.pdf.compileRes = res.data.compileRes
              this.pdf.staticAnalysisRes = res.data.staticAnalysisRes
              this.pdf.codeFormatRes = res.data.codeFormatRes
              const msgStaticAnalysis = {
                "date": date.toLocaleString(),
                "text": { "text": '静态代码分析结果' + '\n' + this.pdf.staticAnalysisRes },
                "mine": false,
                "img": require("@/assets/img/contributor/nakagawa.png")
              }
              this.list.push(msgStaticAnalysis)
              const codeFormat = {
                "date": date.toLocaleString(),
                "text": { "text": "更多审查结果请点击工具栏的\"更多\"按钮" },
                "mine": false,
                "img": require("@/assets/img/contributor/nakagawa.png")
              }
              this.list.push(codeFormat)
              this.pdf.time = date.toDateString()
            }

          }).catch(err => {
            console.log(err);
          })
      }


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

.to-large >>> .el-input__inner {
  width: 200%;
}

</style>
