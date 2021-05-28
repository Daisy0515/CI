<template>
<el-card>
  <div slot="header">
    <span>code</span>
  </div>
  <div>
    <div style="border: 1px solid #909399">
      <el-table :data="tableData"
                highlight-current-row
                max-height = "700"
                ref = "codeTable"
                :row-style="{height:'20px'}"
                :cell-style="{padding :'0px'}"
                :show-header = "false" fit>
        <!--                  :row-class-name = "tableRowClassName"-->
        <el-table-column type="index" width="45"></el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <div v-html = "scope.row.code" class="span"></div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</el-card>
</template>

<script>
import axios from "axios";
import hljs from "highlight.js";
import 'highlight.js/styles/tomorrow.css';

export default {
name: "codeCard",
  props:{
    HOST:{
      type:String,
      required:true
    }
  },
  data:function (){
    return {
      tableData:[],
    }
  },
  methods:{
    showCode:async function (id){
      console.log("showCode from code",id);
      var _this = this;
      this.loadCode(id).then(startLine =>{
        console.log(startLine);
        _this.tableMove(startLine);
      })
    },
    loadCode:async function (id){
      var _this = this;
      var startLine = 0;
      const HOST = this.HOST;
      await axios.get(`${HOST}/code?id=`+id)
      .then(function (response){
        var data = response.data;
        console.log("code",data);
        var startPosition = data["startPosition"];
        var code = data["code"];

        startLine = _this.getStartLine(code,startPosition);
        var codeAfterHighlight = hljs.highlightAuto(code).value;

        _this.display(codeAfterHighlight);
        console.log(startLine);
      })
      return startLine;
    },
    getStartLine:function (code,startPosition){
      var snsArr=code.split(/[\r\n]+/);
      var cnt = 0;
      var startLine = 0;
      snsArr.forEach((item,index)=>{
        if(startPosition >= cnt){
          cnt += item.length+1;
          if(startPosition < cnt){
            startLine = index;
          }
        }
      });

      return startLine;
    },
    display:function (code){
      console.log("display");
      this.tableData = [];
      var snsArr = code.split(/[\r\n]+/);
      //删除空项
      snsArr.forEach((item,index)=>{
        //console.log(index +":" + item);
        if(!item){
          snsArr.splice(index,1);
        }
      });
      //console.log(snsArr);
      var reg_start = /<span[^>]*>/;
      var reg_end = /<\/span>/;

      var startArr = new Array();
      var top = -1;
      for(var i = 0;i<snsArr.length;i++){
        var cnt = 0;
        var str = snsArr[i];
        var newStr = "";

        var j = 0;
        for(j = 0; j<= top ;j++){
          newStr += startArr[j];
          cnt += 1;
        }

        newStr += str;

        var startList = reg_start.exec(str);
        if(startList != null){
          for(j=0;j<startList.length;j++){
            top += 1;
            startArr[top] = startList[j];
            cnt += 1;
          }
        }


        var endList = reg_end.exec(str);
        if(endList != null){
          for(j=0;j<endList.length;j++){
            top -= 1;
            cnt -= 1;
          }
        }

        for(j=0;j<cnt;j++){
          newStr += "</span>";
        }

        var item = {code : ""};
        item.code = newStr;
        this.tableData.push(item);
      }
      console.log(this.tableData);
    },
    tableMove:function (index){
      console.log("tableMoe" + index);
      var refName = "codeTable";
      var vmEl = this.$refs[refName].$el;

      // console.log(vmEl.querySelectorAll('.el-table__row'));
      // console.log(vmEl.querySelectorAll('.el-table__row')[index]);
      const targetTop = vmEl.querySelectorAll('.el-table__row')[index].getBoundingClientRect().top;
      const containerTop = vmEl.querySelectorAll('.el-table__body tbody')[0].getBoundingClientRect().top;
      const scrollParent = vmEl.querySelector('.el-table__body-wrapper')
      scrollParent.scrollTop = targetTop - containerTop;
      this.$refs[refName].setCurrentRow(this.tableData[index]);
    },
    tableRowClassName({row,rowIndex}){
      //console.log("class" + row + "," + rowIndex);
      if(rowIndex == this.startPosition){
        return 'warning-row';
      }
      return '';
    },
  }
}
</script>

<style scoped>
>>>.el-table .warning-row {
  background: oldlace;
}
/*.el-table__row.warning-row {*/
/*  background: oldlace;*/
/*}*/
.span{
  white-space: pre;
}
>>>.el-table td, .el-table th.is-leaf {
  border-bottom: transparent;
}
</style>
