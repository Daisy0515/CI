<template>
    <div id="gant" style="height:500px;width:100%" >
        <Gantt class="left-container" :tasks="tasks" v-if="hasTask" />
        <h2 v-if="!hasTask">暂未创建任务！</h2>
    </div>
</template>

<script>
    import Gantt from "@/common/gantt/gantt";
    import {httpGet} from "@/utils/http.js";
    import {errTips} from "@/utils/tips.js";
    import {timeReversal, timestamp} from "@/utils/getDate.js";
    import {mapGetters, mapMutations} from "vuex";
    export default {
        name: "projectProgress",
        components: {
            Gantt
        },
        data(){
            return{
                tasks: {
                    data: []
                },
                hasTask:true, //是否已经创建任务
                teamId:null,  //团队Id
            }
        },
        created: function () {
            //甘特图配置
            gantt.config.readonly = true;
            gantt.config.columns = [
                {name: "text", align: "center", resize: true},
                {name: "start_date", align: "center", resize: true},
                {
                    name: "duration",
                    align: "center",
                    template: task => {
                        let duration = task.durationTime;
                        return duration;
                    }
                }
            ];
            this.teamId = this.$route.query.teamId;
            this.getGanttContent(this.teamId);
        },
        computed: {
            ...mapGetters(["getuserData", "getnoImg", "getdiaLog"])
        },
        methods:{
            ...mapMutations(["setdiaLog"]),
            getGanttContent(id) {
                httpGet("/v1/authorization/bids/ganttchart/get", { id: id }).then(results => {
                    const {httpCode, msg, data} = results.data;
                    if (httpCode === 200) {
                        let {ganttChartList} = data;
                        let newList = ganttChartList.map(item => {
                            return {
                                id: item.id,
                                start_date: timeReversal(item.startTime),
                                end_date: timestamp(item.endTime),
                                text: item.content,
                                name: item.participantList,
                                durationTime: item.sustainTime,
                                progress: item.accomplishProgress * 0.01
                            };
                        });
                        this.$set(this.tasks, "data", newList);
                        this.setdiaLog(!this.getdiaLog);     //将数据渲染到甘特图中
                    } else if (msg === "不存在任务信息") {
                        this.hasTask = false;
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                });
            },
        }
    }
</script>

<style scoped>

</style>
