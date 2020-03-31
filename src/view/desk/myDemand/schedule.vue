<template>
  <div class="chedule">
    <div class="Crumbs">
      <div class="container deskHeader">
        <h4>
          您的位置：
          <router-link to="myDemand">我的需求</router-link>>
          <router-link :to="{path:'teamProgress', query:{id:projectId}}">团队进度</router-link>>
          <span class="active">进度明细</span>
        </h4>
      </div>
    </div>
    <div class="container deskHeader">
      <div id="ganttMain" style="height:500px;width:100%" v-loading="loading">
        <Gantt class="left-container" :tasks="tasks" />
      </div>
    </div>
    <el-dialog title="资源地址" :visible.sync="dialogTableVisible" width="1000px">
      <p class="loadClass">
        资源托管地址：
        <a
          target="_Blank"
          :href="source.trusteeship?source.trusteeship:'javascript:void(0)'"
        >{{source.trusteeship?source.trusteeship:"暂无托管地址"}}</a>
      </p>
      <p class="loadClass">
        资源上传地址：
        <a
          target="_Blank"
          :href="source.fileName?source.fileName:'javascript:void(0)'"
        >{{source.fileName?source.fileName:"暂未上传资源"}}</a>
      </p>
    </el-dialog>
  </div>
</template>

<script>
import Gantt from "@/common/gantt/gantt";
import { httpGet } from "@/utils/http.js";
import { errTips } from "@/utils/tips.js";
import { timeReversal, timestamp } from "@/utils/getDate.js";
export default {
  components: {
    Gantt
  },
  data: function() {
    return {
      loading: false,
      dialogTableVisible: false,
      projectId: "",
      tasks: {
        data: []
      },
      source: {
        git: "",
        fileName: ""
      },
      messages: []
    };
  },
  created: function() {
    const id = this.$route.query.id;
    this.projectId = this.$route.query.projectId;
    if (!id || !this.projectId) {
      this.$router.push({ path: "myDemand" });
      return false;
    }
    //甘特图配置
    gantt.config.readonly = true;
    let colContent = function(task) {
      return `<a href="javascript:void(0)" onclick="gantt.showLightbox(${task.id})">资源详情</a>`;
    };
    let colHeader = "<div>资源</div>";
    gantt.config.columns = [
      { name: "text", align: "center", resize: true },
      { name: "start_date", align: "center", resize: true },
      {
        name: "duration",
        align: "center",
        template: task => {
          let duration = task.durationTime;
          return duration;
        }
      },
      {
        name: "buttons",
        label: colHeader,
        align: "center",
        template: colContent
      }
    ];
    gantt.showLightbox = id => {
      var task = gantt.getTask(id);
      this.source = task;
      this.dialogTableVisible = !this.dialogTableVisible;
    };
    this.loading = true;
    //获取甘特图数据
    httpGet("/v1/authorization/bids/ganttchart/get", {
      id: id
    }).then(results => {
      const { httpCode, msg, data } = results.data;
      if (httpCode === 200) {
        let { ganttChartList } = data;
        let newList = ganttChartList.map(item => {
          return {
            id: item.id,
            start_date: timeReversal(item.startTime),
            end_date: timestamp(item.endTime),
            text: item.content,
            name: item.userName,
            durationTime: item.sustainTime,
            progress: item.accomplishProgress * 0.01,
            fileName: item.fileName,
            trusteeship: item.trusteeship
          };
        });
        this.$set(this.tasks, "data", newList);
        this.loading = false;
        gantt.clearAll();
        gantt.parse(this.tasks);
      } else if (msg === "不存在任务信息") {
        this.loading = false;
        errTips("暂未创建任务");
      } else if (httpCode !== 401) {
        errTips(msg);
      }
    });
  }
};
</script>
<style lang='scss' scoped>
.loadClass {
  margin-bottom: 17px;
}
.el-input {
  width: 200px;
  margin-right: 20px;
}
.el-input--suffix .el-input__inner {
  width: 250px;
}
.ganttHeader {
  margin-top: 20px;
  margin-bottom: 25px;
}
.ganttHeader_left {
  float: left;
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
</style>