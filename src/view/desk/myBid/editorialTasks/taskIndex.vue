<template>
  <div class="gantt" style="height:100%;width:100%">
    <div class="Crumbs">
      <div class="container deskHeader">
        <h4>
          您的位置：
          <router-link to="myBid">我的投标</router-link>>
          <span class="active">编辑任务</span>
        </h4>
      </div>
    </div>
    
    <div class="container deskHeader">
      <p class="Tips">
        <i class="el-icon-info"></i>请团队所有成员务必使用git托管资源，后期验收全部以git仓库中master分支为验收标准，master分支已创建请勿重复创建
      </p>
    </div>
    
    <div class="container deskHeader">
      <div class="ganttHeader">
        <div class="ganttHeader_left">
          <router-link :to="{path:'taskHome',query:{projectId:projectId}}">
            <p @click="routerIndex='taskHome'" :class="routerIndex=='taskHome' ? 'is-active' : '' ">
              <i class="el-icon-menu"></i>任务管理
            </p>
          </router-link>
          <p
            class="ganttHeader_addTask"
            v-show="watchIndex||showIndex"
            @click="watchIndex=!watchIndex"
            :class="watchIndex==true ? 'is-active':''"
          >添加任务</p>
        </div>
        <div class="ganttHeader_right">
          <router-link :to="{path:'taskGantt',query:{projectId:projectId}}" style="margin-right:20px">
            <p
              @click="routerIndex='taskGantt'"
              :class="routerIndex=='taskGantt' ? 'is-active' : '' "
            >甘特图</p>
          </router-link>
          <router-link :to="{path:'submitHistory',query:{teamId:teamId}}">
            <el-button type="primary" size="mini"
              @click="routerIndex='submitHistory'"
            >提交历史</el-button>
          </router-link>
           <p v-if="gettaskList[0]" style="float: right;">
            <source-Upload
              :goUpload="goUpload"
              :fileName="fileName"
              v-on:setIdCard="setIdCard($event)"
            />
          </p>
          <p v-if="!gettaskList[0]" style="float: right;"><i class="el-icon-warning" style="margin-right:6px;"></i>任务创建完成后才能上传资源</p>
          

        </div>
      </div>
      <div class="ganttHeader_main" v-show="watchIndex">
        <!-- <div class="ganttHeader_form"> -->
          <!-- <el-input placeholder="请输入内容" v-model="content"></el-input>
          <el-popover placement="right" trigger="click">
            <div class="popo-item">
              <el-select
                v-model="select"
                slot="prepend"
                placeholder="请选择用户"
                size="small"
                style="width:100%;"
              >
                <el-option
                  :value="item.userName"
                  v-for="(item,index) in userSele"
                  :key="index"
                  :label="item.userName"
                ></el-option>
              </el-select>
            </div>
			
            <div class="popo-item">
              <el-date-picker
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                v-model="startTime"
                type="date"
                size="small"
                placeholder="开始时间"
                :picker-options="startDatePicker"
              ></el-date-picker>
            </div>
			
            <div class="popo-item">
              <el-date-picker
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                :picker-options="endDatePicker"
                size="small"
                v-model="endTime"
                type="date"
                placeholder="结束时间"
              ></el-date-picker>
            </div>
            <el-button class="taskdata" slot="reference">{{gettaskdata}}</el-button>
          </el-popover>
          <el-button
            @click="addTask"
            size="small"
            style="color:white;background:#4c83c3;margin-left:10px;"
          >确定</el-button>
          <el-button size="small" @click="watchIndex=!watchIndex">取消</el-button> -->
		  
		  
       <!-- </div> -->
	   <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
		<el-form-item label="任务类型" prop="missionType">
			<el-select v-model="ruleForm.missionType" clearable placeholder="请选择任务类型">
			    <el-option label="需求设计" value="1"></el-option>
			    <el-option label="概要设计" value="2"></el-option>
			    <el-option label="详细设计" value="3"></el-option>
				<el-option label="编码实现" value="4"></el-option>
				<el-option label="软件测试" value="5"></el-option>
				<el-option label="部署运维" value="6"></el-option>
				<el-option label="其他" value="7" ></el-option>
			</el-select>
		</el-form-item>
		
		<div v-show="ruleForm.missionType==7||ruleForm.missionType==1">
			<el-form-item label="标题" prop="content">
			  <el-input class="input_title title" v-model="ruleForm.content"></el-input>
			</el-form-item>
			
			
			<el-form-item label="参与人员" prop="participantList">
        <el-checkbox-group v-model="ruleForm.participantList">
          <el-checkbox v-for="(item,index) in userList" :key="index" :label="item.id">{{item.userName}}</el-checkbox>
        </el-checkbox-group>
			</el-form-item>
			
			<el-form-item label="任务开始时间" prop="startTime">
			  <el-date-picker
			  style="margin-left:0%"
			    v-model="ruleForm.startTime"
			    :picker-options="endDatePicker"
			    type="date"
			    placeholder="开始时间"
			    value-format="yyyy-MM-dd"
			  ></el-date-picker>
			</el-form-item>
			
			<el-form-item label="任务截止时间" prop="endTime">
			  <el-date-picker
			  style="margin-left:0%"
			    v-model="ruleForm.endTime"
			    :picker-options="endDatePicker"
			    type="date"
			    placeholder="截止时间"
			    value-format="yyyy-MM-dd"
			  ></el-date-picker>
			</el-form-item>
			
			<el-form-item label="描述" prop="description">
			  <el-input type="textarea" class="input_textarea " v-model="ruleForm.description " :rows="5" style="width:40%;float:left"></el-input>
			</el-form-item>
			<el-form-item class="cancel">
			  <el-button type="primary" @click="returnSquare" size="small" style="width:100px;margin-left:10%">返回</el-button>
			    <el-button type="primary" @click="submitForm('ruleForm')" size="small" style="width:100px;margin-left:10%">保存</el-button>
			  </el-form-item>
		</div>
		
		<div v-show="ruleForm.missionType==5">
			
			<el-form-item label="指派人员" prop="participantList">
        <el-checkbox-group v-model="ruleForm.participantList">
          <el-checkbox v-for="(item,index) in userList" :key="index" :label="item.id">{{item.userName}}</el-checkbox>
        </el-checkbox-group>
			</el-form-item>
			
			<el-form-item label="任务开始时间" prop="startTime">
			  <el-date-picker
			  style="margin-left:0%"
			    v-model="ruleForm.startTime"
			    :picker-options="endDatePicker"
			    type="date"
			    placeholder="开始时间"
			    value-format="yyyy-MM-dd"
			  ></el-date-picker>
			</el-form-item>
			
			<el-form-item label="任务截止时间" prop="endTime">
			  <el-date-picker
			  style="margin-left:0%"
			    v-model="ruleForm.endTime"
			    :picker-options="endDatePicker"
			    type="date"
			    placeholder="截止时间"
			    value-format="yyyy-MM-dd"
			  ></el-date-picker>
			</el-form-item>
			
			<el-form-item label="测试任务" prop="sourceFile">
        <!-- 此处改为文件上传 -->			  
        <sourceUpload :uploadIndex="testUploadIndex" v-on:setIdCard="setIdCard2($event)" />
      </el-form-item>
			
			
			<el-form-item label="描述" prop="description">
			  <el-input type="textarea" class="input_textarea " v-model="ruleForm.description " :rows="5" style="width:40%;float:left"></el-input>
			</el-form-item>
			<el-form-item class="cancel">
			  <el-button type="primary" @click="returnSquare" size="small" style="width:100px;margin-left:10%">返回</el-button>
			    <el-button type="primary" @click="submitForm('ruleForm')" size="small" style="width:100px;margin-left:10%">保存</el-button>
			  </el-form-item>
		</div>
		
		<div v-show="ruleForm.missionType==2||ruleForm.missionType==3||ruleForm.missionType==4||ruleForm.missionType==6">
      <el-form-item label="需求" prop="parentMissionId">
        <!-- 此处为下拉框，下拉框里的东西为我投标的项目/需求 -->
              <el-select
                  style="width:200px;margin-left:15px"
                  v-model="ruleForm.parentMissionId"
                  placeholder="请选择"
                  size="small"
                >
                  <el-option 
                    v-for="(items,index) in contentList"
                    :key="index"
                    :value="items.id"
                    :label="items.content"
                  ></el-option>
              </el-select>
      </el-form-item>			
			<el-form-item label="参与人员" prop="participantList">
        <el-checkbox-group v-model="ruleForm.participantList">
          <el-checkbox v-for="(item,index) in userList" :key="index" :label="item.id">{{item.userName}}</el-checkbox>
        </el-checkbox-group>
			</el-form-item>
			
			<el-form-item label="任务开始时间" prop="startTime">
			  <el-date-picker
			  style="margin-left:0%"
			    v-model="ruleForm.startTime"
			    :picker-options="endDatePicker"
			    type="date"
			    placeholder="开始时间"
			    value-format="yyyy-MM-dd"
			  ></el-date-picker>
			</el-form-item>
			
			<el-form-item label="任务截止时间" prop="endTime">
			  <el-date-picker
			  style="margin-left:0%"
			    v-model="ruleForm.endTime"
			    :picker-options="endDatePicker"
			    type="date"
			    placeholder="截止时间"
			    value-format="yyyy-MM-dd"
			  ></el-date-picker>
			</el-form-item>
			
			<el-form-item label="描述" prop="description">
			  <el-input type="textarea" class="input_textarea " v-model="ruleForm.description" :rows="5" style="width:40%;float:left"></el-input>
			</el-form-item>
			<el-form-item class="cancel">
			  <el-button type="primary" @click="returnSquare" size="small" style="width:100px;margin-left:10%">返回</el-button>
			    <el-button type="primary" @click="submitForm('ruleForm')" size="small" style="width:100px;margin-left:10%">保存</el-button>
			  </el-form-item>
		</div>		   
	   </el-form>
	  </div>	  
	  <div class="ganttIndex" style="height:100%;width:100%">
        <div class="ganttIndexMain">
          <div class="gitAddress">
            git仓库地址:
            <input id="httpUrlToRepo" class="address"
                  autocomplete="off"
                  style="width:300px;"
                  v-model="httpUrlToRepo"
                  disabled="disabled"
                >
              <el-button class="btn" 
                type="primary" 
                size="mini" 
                style="margin-left:20px" 
                v-on:click="copyAddress">
                复制地址</el-button>
            <router-link to="/git-2" style="margin-left:20px;color:blue">如何使用git</router-link>
          </div>
          <router-view>
          </router-view>
        </div>
      </div>
     </div>   
  </div>
</template>

<script>
import Clipboard from 'clipboard'
import { mapGetters, mapMutations } from "vuex";
import { httpGet, httpPost } from "@/utils/http.js";
import { specificDate } from "@/utils/getDate.js";
import { errTips, successTips } from "@/utils/tips.js";
import sourceUpload from "@/common/upload/resourceUpload";
import timeLimit from "@/mixins/regular/timeLimit.js";
export default {
  //结束时间大于等于开始时间
  mixins: [timeLimit],
  components: {
    sourceUpload
  },
  data: function() {
    return {
      str:[],
		ruleForm: {
      castId:"",
      content:"",
      description:"",
      endTime:"",
      missionType:"",
      parentMissionId:"",
      participantList:[],
      sourceFile:"",
      startTime:"",
      testMission:""
    },
    uploadIndex: false,
    testUploadIndex:false,
    contentList:[],
    userList:[],
      fileName: "bidTask",
      qiniuData: {
        key: "",
        token: ""
      },
      goUpload: true,
      fileList: [],
      showIndex: true,
      watchIndex: false,
	    typeIndex:0,
      projectId: "",
      teamId:"",
      routerIndex: "",
      userSele: [{ name: "xxs" }, { name: "xwr" }, { name: "ssd" }],
      startTime: "",
      endTime: "",
      content: "",
      select: "",
      restaurants: [],
      tasks: {
        user: [],
        data: [],
        links: []
      },
      messages: [],
      httpUrlToRepo:""
    };
  },
  created: function() {
    this.routerIndex = this.$route.name;
    this.projectId = this.$route.query.projectId;
    if (!this.projectId) {
      this.$router.push({ path: "myBid" });
      return false;
    }
    this.getContent();
    this.settaskList([]);
    this.getTask();

  },
  computed: {
    ...mapGetters(["gettaskList", "getuploadIndex"]),
    //拼接任务信息
    gettaskdata() {
      let endTime = "";
      if (this.endTime) {
        endTime = "至" + " " + this.endTime;
      }
      if (this.select || this.startTime || this.endTime) {
        return this.select + " " + this.startTime + " " + " " + endTime;
      } else {
        return "未分配任务,时间";
      }
    }
  },
  watch: {
    //监听路由高亮
    $route() {
      this.watchIndex = false;
      this.showIndex = true;
	  // this.typeIndex = 0;
    }
  },
  methods: {
    ...mapMutations(["settaskList", "setResource", "setCache"]),
    //上传资源
    setIdCard(data) {
      httpGet("/v1/authorization/bids/resource/upload", {
        castId: this.projectId,
        uploadResource: data
      }).then(results => {
        const { httpCode, msg } = results.data;
        if (httpCode === 200) {
          successTips("上传成功");
          this.setResource(data);
        } else if (httpCode !== 401) {
          errTips(msg);
        }
      });
    },
    //复制Git地址
    copyAddress: function (event) {   
      var gitAddress=this.httpUrlToRepo  
      var clipboard = new Clipboard('.btn',{
        text: function () {
          return gitAddress;
        }
      });
      clipboard.on('success', e => {
       console.log('复制成功')
        // 释放内存
        clipboard.destroy()
      });
      clipboard.on('error', e => {
        // 不支持复制
         console.log('该浏览器不支持自动复制')
        // 释放内存
         clipboard.destroy()
      });
      },

    //获取任务数据
    getTask() {
      httpGet("/v1/authorization/bids/missioninfo/get", {
        castId: this.projectId
      }).then(results => {
        const { msg, data, httpCode } = results.data;
        if (httpCode === 200) {
          this.$set(this, "httpUrlToRepo", data.httpUrlToRepo);
          this.$set(this, "teamId", data.teamId);
          this.userList = data.userList;
          this.setResource(data.uploadResource);
          let taskList = [...data.missList];
          taskList.forEach(item => {
            item.userList = this.userList;
            item.participantNames="";
            for (let i of item.participantList) {
              for (let p of this.userList) {
                if (i === p.id) {
                  item.participantNames = item.participantNames+p.userName+" ";
                }
              }
            }
            
            item.endTime = specificDate(item.endTime);
            item.startTime = specificDate(item.startTime);
            item.changeTask = false;
            item.changeTitle = item.content;
            item.describeModel = item.description;
            item.upData = {
              accomplishProgress: item.accomplishProgress,
              endTime: item.endTime,
              id: item.id,
              startTime: item.startTime,
              // userId: item.userId
            };
          });
          this.settaskList(taskList);
        } else if (httpCode === 400) {
          this.setCache("myBid");
        } else if (httpCode !== 401) {
          errTips(msg);
        }
      });
    },

    //获得标题下拉框及可选成员信息
    getContent(){
      httpGet(`/v1/authorization/bids/get/content?castId=${this.projectId}`).then(
        results => {
          const { msg, data, httpCode } = results.data;
          if (httpCode === 200) {
            this.contentList=data.contentList;
            this.userList = data.userList;
          } else if (httpCode === 400) {
            this.setCache("");
          } else if (httpCode !== 401) {
            errTips(msg);
          }
        }
      );
    },
    
    setIdCard2(data) {    
      data && (this.ruleForm.sourceFile = data);     
      // alert(this.ruleForm.missionType);
      // alert(this.ruleForm.parentMissionId);
      // alert(this.ruleForm.participantList);
      // // alert(this.ruleForm.content);
      // alert(this.ruleForm.startTime);
      // alert(this.ruleForm.endTime);
      // alert(this.ruleForm.description);
      httpPost("/v1/authorization/bids/missioninfo/add", this.ruleForm).then(results => {
        const { msg, httpCode,data } = results.data;
        if (httpCode === 200) {         
          successTips("添加任务成功！");
          // this.setCache("");
        } else if (httpCode !== 401) {
          errTips(msg);
        }
         this.ruleForm.content="";
          this.ruleForm.description="";
          this.ruleForm.endTime="";
          this.ruleForm.missionType="";
          this.ruleForm.parentMissionId="";
          this.ruleForm.participantList=[];
          this.ruleForm.sourceFile="";
          this.ruleForm.startTime="";
          this.ruleForm.testMission="";
          this.testUploadIndex=false;
      });
    },
    //添加任务
    submitForm(formName) {
      this.ruleForm.castId=this.$route.query.projectId;        
      this.ruleForm.sourceFile?this.setIdCard2():(this.testUploadIndex = !this.testUploadIndex);       
      // this.setIdCard2();
    },

    //添加任务
    addTask() {
      if (!this.content) {
        errTips("请输入任务内容");
        return false;
      }
      if (this.content.length > 20) {
        errTips("任务名称不可超过20个字");
        return false;
      } else if (!this.select) {
        errTips("请选择成员");
        return false;
      } else if (!this.startTime) {
        errTips("请选择开始时间");
        return false;
      } else if (!this.endTime) {
        errTips("请选择结束时间");
        return false;
      } else if (
        new Date(this.startTime.replace(/\-/g, "/")) >
        new Date(this.endTime.replace(/\-/g, "/"))
      ) {
        errTips("开始时间不能大于结束时间");
        return false;
      }
      let userId = "";
      for (let i of this.userSele) {
        i.userName === this.select && (userId = i.id);
      }
      let startCompare = new Date(this.startTime);
      let endCompare = new Date(this.endTime);
      let sustainTime = (endCompare - startCompare) / (1000 * 60 * 60 * 24) + 1;
      let postData = {
        userList: this.userSele,
        userName: this.select,
        userId: userId,
        castId: this.$route.query.projectId,
        startTime: this.startTime,
        endTime: this.endTime,
        changeTitle: this.content,
        content: this.content,
        description: "",
        describeModel: "",
        changeTask: false,
        accomplishProgress: 0,
        sustainTime: sustainTime
      };
      httpPost("/v1/authorization/bids/missioninfo/insert", postData).then(
        results => {
          const { httpCode, msg, data } = results.data;
          if (httpCode === 200) {
            // this.getTask();

            let newList = [...this.gettaskList];
            postData.id = data.id;
            postData.upData = {
              accomplishProgress: 0,
              userList: this.userSele,
              endTime: postData.endTime,
              id: results.data.data.id,
              startTime: postData.startTime,
              userId: postData.userId
            };
            newList.push(postData);
            this.settaskList(newList);
            this.content = "";
            this.startTime = "";
            this.endTime = "";
            this.select = "";
            successTips("添加任务成功");
          } else if (httpCode === 400) {
            this.setCache("myBid");
          } else if (httpCode !== 401) {
            errTips(msg);
          }
        }
      );
    }
  }
};
</script>
<style lang='scss' scoped>
.gantt {
  .Tips {
    text-align: center;
    margin-top: 15px;
    color: #909399a8;
  }
  .header {
    padding: 15px 0 15px 0;
    h4 {
      margin: 0;
    }
  }
  a {
    color: black;
    text-decoration: none;
  }
  .taskdata {
    background: transparent;
    border-color: transparent;
    font-size: 14px;
  }
  .taskdata:focus,
  .taskdata:hover {
    color: black;
    border-color: transparent;
    background: transparent;
  }

  .getBtn {
    margin-top: 15px;
  }
  .el-input {
    width: 250px;
    margin-right: 20px;
  }
  .el-input--suffix .el-input__inner {
    width: 250px;
  }
  .ganttHeader {
    margin-top: 5px;
    margin-bottom: 5px;
    padding-bottom: 10px;
  }
  .ganttHeader_left {
    float: left;
    p {
      display: inline-block;
      margin-right: 10px;
      font-size: 17px;
    }
    .ganttHeader_addTask {
      cursor: pointer;
      font-size: 13px;
      margin-top: 3px;
      &:hover {
        color: #3e76b8;
      }
    }
  }
  .ganttHeader_right {
    float: right;
  }
  .ganttHeader_right p {
    float: left;
    margin-left: 20px;
  }
  .ganttHeader::after {
    content: "";
    display: table;
    clear: both;
  }
  .el-range-editor.el-input__inner {
    width: 400px;
  }
  .left-container {
    margin-top: 20px;
  }
}
.popo-item {
  margin-bottom: 10px;
}
.is-active {
  color: #3e76b8;
}
.el-icon-circle-plus {
  font-size: 16px;
}
.gantt_hor_scroll {
  display: none;
}
.ganttIndex {

  .ganttIndexMain {
    border-top: 1px solid #e8e8e8;
    margin-top: 30px;
    & > ul {
      margin-top: 35px;
    }
  }
  .gitAddress {
    margin-top: 20px;
    font-size: 14px;
    i:hover {
      cursor: pointer;
    }
  }
}
</style>

