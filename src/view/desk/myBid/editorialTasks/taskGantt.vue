<template>
  <div id="ganttMain" style="height:520px;width:100%">
    <Gantt class="left-container" :tasks="tasks" @task-updated="logTaskUpdate" />
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
import { mapGetters, mapMutations } from "vuex";
import Gantt from "@/common/gantt/gantt";
import { httpPut } from "@/utils/http.js";
import { successTips, errTips } from "@/utils/tips.js";
import { timestamp, timeReversal } from "@/utils/getDate.js";
export default {
  components: {
    Gantt
  },
  data: function() {
    return {
      dialogTableVisible: false,
      tasks: {
        data: []
      },
      source: {
        git: "",
        fileName: ""
      }
    };
  },
  computed: {
    ...mapGetters(["gettaskList"])
  },
  watch: {
    //监听任务数据变化重新渲染甘特图
    gettaskList() {
      let taskList = this.gettaskList.map(item => {
        return {
          id: item.id,
          userId: item.userId,
          start_date: timeReversal(item.startTime),
          end_date: timestamp(item.endTime),
          text: item.content +'/'+item.subtitle ,
          name: item.userName,
          durationTime: item.sustainTime,
          progress: item.accomplishProgress * 0.01,
          fileName: item.fileName,
          trusteeship: item.trusteeship
        };
      });
      this.$set(this.tasks, "data", taskList);
      gantt.clearAll();
      gantt.parse(this.tasks);
    }
  },
  created: function() {
    //甘特图配置
    gantt.config.readonly = false;
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
    //甘特图弹窗
    gantt.showLightbox = id => {
      let task = gantt.getTask(id);
      this.source = task;
      this.dialogTableVisible = !this.dialogTableVisible;
    };
    //初次渲染甘特图
    let taskList = this.gettaskList.map(item => {
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
    this.$set(this.tasks, "data", taskList);
  },
  methods: {
    ...mapMutations(["settaskList", "setCache"]),
    //更新甘特图
    logTaskUpdate(id, mode, task) {
      task.accomplishProgress = parseInt(task.progress * 100);
      let newList = [...this.gettaskList];
      for (let i = 0; i < newList.length; i++) {
        if (newList[i].id === task.id) {
          if (task.accomplishProgress === newList[i].accomplishProgress) {
            return false;
          }
        }
      }
      httpPut("/v1/authorization/bids/accomplishprogress/update", task)
        .then(results => {
          const { httpCode, msg } = results.data;
          if (httpCode === 200) {
            for (let i = 0; i < newList.length; i++) {
              if (newList[i].id === task.id) {
                newList[i].accomplishProgress = task.accomplishProgress;
                this.settaskList(newList);
                successTips("甘特图已更新");
                return false;
              }
            }
          } else if (httpCode === 400) {
            this.setCache("myBid");
          } else if (httpCode !== 401) {
            errTips(msg);
            gantt.undo();
          } else {
            gantt.undo();
          }
        })
        .catch(err => gantt.undo());
    }
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