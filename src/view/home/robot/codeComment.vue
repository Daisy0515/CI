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
    <el-dialog title="代码注释生成结果" :visible.sync="codeReviewVisible">
      <div id="pdfDom" v-show="true">
        <h1 style="text-align: center">代码注释生成结果</h1>
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
              <el-form-item label="代码注释">
                <div style="white-space: pre-wrap" align="left">{{pdf.commentRes}}</div>
                <!--              <el-input type="textarea" v-model="pdf.staticAnalysisRes" :autosize="{ minRows: 2, maxRows: 100}"></el-input>-->
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
          img: require("@/assets/img/contributor/yuanqi.jpg"),
          name: '代码注释生成',
          dept: '我可以为您生成代码注释',
          callback: this.bindCover,
          historyConfig:{
            show: true,
            tip: '加载更多',
            callback: this.bindLoadHistory,
          },
        },
        inputMsg:'',
        list:[{
          "text": { "text": "点击工具栏文件按钮，使用代码注释生成" },
          "mine": false,
          "img": require("@/assets/img/contributor/yuanqi.jpg")
        }],
        tool: {
          //添加文件和历史工具栏，其中文件工具栏开源组件封装好了上传功能
          show: ['file', 'history'],
          callback: this.toolEvent,
        },
        codeReviewVisible: false,
        title: '代码注释生成报告',
        pdf: {
          name: 'Stuyxr',
          time: '',
          originalCode: '',
          commentRes: '',

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
            const msgObj1 = {
                "date": date.toLocaleString(),
                "text": { "text": "点击工具栏文件按钮，使用代码注释生成" },
                "mine": false,
                "img": require("@/assets/img/contributor/yuanqi.jpg")
            }
            this.list.push(msgObj1)
      },
      //工具栏组件的回调方法
      toolEvent (type, payload) {
        if (type === 'file') {
          let file = payload
          this.doUpload(file)
        } else if (type === 'history') {
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
        axios.post('http://127.0.0.1:5000/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data;'
          }
        }).then(res => {
          console.log('success');
          console.log(res.data);
          this.pdf.originalCode = res.data.originalCode
          this.pdf.commentRes = res.data.commentRes
          let date = new Date()
          const msgStaticAnalysis = {
            "date": date.toLocaleString(),
            "text": { "text": '代码注释生成结果' + '\n' + this.pdf.commentRes },
            "mine": false,
            "img": require("@/assets/img/contributor/yuanqi.jpg")
          }
          this.list.push(msgStaticAnalysis)
          const codeFormat = {
            "date": date.toLocaleString(),
            "text": { "text": '更多注释生成结果请点击工具栏的历史按钮' },
            "mine": false,
            "img": require("@/assets/img/contributor/yuanqi.jpg")
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
  width: 800%;
}
  
</style>