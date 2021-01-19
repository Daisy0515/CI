<template>
    <div id="gan" ref="gantt" style="height:100%;width:100%"></div>
</template>

<script>
    import {mapGetters} from "vuex";
    import "dhtmlx-gantt";
    import "dhtmlx-gantt/codebase/locale/locale_cn.js";
    import "dhtmlx-gantt/codebase/ext/dhtmlxgantt_undo.js";

    export default {
        name: "gantt",
        mytask: "",
        props: {
            tasks: {
                type: Object,
                default() {
                    return {data: [], links: []};
                }
            }
        },
        watch: {
            getdiaLog() {
                gantt.clearAll();
                gantt.parse(this.$props.tasks);
            }
        },
        computed: {
            ...mapGetters(["gettaskList", "getdiaLog"])
        },
        mounted: function () {
            // gantt.config.readonly = true;
            gantt.config.work_time = true;
            gantt.templates.rightside_text = function (start, end, task) {
                return task.name;
            };
            gantt.templates.task_cell_class = function (task, date) {
                if (!gantt.isWorkTime({task: task, date: date})) return "weekend";
            };
            // gantt.config.autoscroll_speed = 50;
            gantt.config.preserve_scroll = false;
            gantt.config.order_branch = true;
            gantt.init(this.$refs.gantt);
            gantt.config.undo = true;
            gantt.clearAll();
            gantt.parse(this.$props.tasks);
            gantt.attachEvent("onBeforeLightbox", function () {
                return false;
            });
            gantt.attachEvent("onTaskDrag", () => {
                gantt.render();
            });
            //     gantt.attachEvent("onAfterTaskUpdate", (id,item)=>{
            //       console.log(item)
            //     this.$httpPost("http://192.168.1.185:81/ceshi",{name:'ww'}).then(results=>{

            //     }).catch(err=>{
            //       console.log("錯誤")
            //       gantt.undo();
            //     })
            // });
            gantt.attachEvent("onAfterTaskUpdate", (id, task) => {
                this.$emit("task-updated", id, "updated", task);
            });
            gantt.attachEvent("onBeforeTaskChanged", function (id, mode, task) {
                return task.progress === 1 ? false : true;
            });
        },
        methods: {}
    };
</script>

<style scoped>
    @import "~dhtmlx-gantt/codebase/dhtmlxgantt.css";
</style>
