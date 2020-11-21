<template>
    <div class="teamApplication">
        <div class="header">
            <div class="container deskHeader">
                <h4>
                    您的位置：
                    <router-link to="issueManage">缺陷跟踪</router-link>
                    >
                    <span class="active">可视化</span>
                </h4>
            </div>
        </div>
        <br/>
        <!-- <el-card class="box-card0"> -->

        <!-- <div style="float:left;margin-left: 350px;margin-top:20px ;"><div id="main1" style="width: 600px;height: 400px;"></div></div>

        <div style="float:left;margin-left:10px;">
            <div style="margin-left: 60%;">
                <el-select v-model="selected2" placeholder="请选择" @change="getLine">
                    <el-option v-for="item in projectList" :key="item.projectId" :label="item.projectName" :value="item.projectId"></el-option>
                </el-select>
            </div>

            <div id="main2" style="width: 600px;height: 400px;"></div>
        </div> -->
        <div style="width: 100%; height: 25rem;padding-left: 15%;">
            <div style="float:left;width: 40%;height: 100%;">

                <div id="main1" style="width: 100%;height: 100%;margin-top: 2.5rem;"></div>
            </div>

            <div style="float:left;width: 40%;height: 100%;">
                <div style="margin-left: 60%;">
                    <el-select v-model="selected2" placeholder="请选择" @change="getLine">
                        <el-option v-for="item in projectList" :key="item.projectId" :label="item.projectName"
                                   :value="item.projectId"></el-option>
                    </el-select>
                </div>

                <div id="main2" style="width: 100%;height: 100%;"></div>
            </div>
        </div>
        <div style="width: 100%; height: 25rem; padding-left: 10%;">
            <div style="margin-top:50px ; width: 40%;height: 100%;float: left;">
                <div style="margin-left: 60%;">
                    <el-select v-model="selected3" placeholder="请选择" @change="getPie1">
                        <el-option v-for="item in projectList" :key="item.projectId" :label="item.projectName"
                                   :value="item.projectId"></el-option>
                    </el-select>
                </div>
                <div id="main3" style="width: 100%;height: 100%;"></div>
            </div>

            <div style="margin-top:50px ;width: 40%; height: 100%;float: left;">
                <div style="margin-left: 60%;">
                    <el-select v-model="selected4" placeholder="请选择" @change="getPie2">
                        <el-option v-for="item in projectList" :key="item.projectId" :label="item.projectName"
                                   :value="item.projectId"></el-option>
                    </el-select>
                </div>
                <div id="main4" style="width: 100%;height: 100%;"></div>
            </div>
        </div>
        <div style="text-align: center;width: 100%;margin-top:6rem ;margin-bottom:50px ;">
            <el-button type="primary" @click="returnBack" size="medium" style="width:150px;">返回</el-button>
        </div>
    </div>
</template>

<script>
    import {quillEditor} from 'vue-quill-editor'; //调用编辑器
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import {httpGet, httpPost} from '@/utils/http.js';
    import {errTips, successTips} from '@/utils/tips.js';
    import sourceUpload from '@/common/upload/resourceUpload';
    import {mapMutations, mapActions, mapGetters} from 'vuex';
    import regular from '@/mixins/regular/publish.js';
    import echarts from 'echarts';

    export default {
        mixins: [regular],
        data() {

            return {
                myChart2: '',
                myChart3: '',
                myChart4: '',
                selected2: '总体',
                selected3: '总体',
                selected4: '总体',
                Status: ['待解决', '解决中', '已解决', '结束'],
                Levels: ['马上解决', '急需解决', '高度重视', '正常处理', '低优先级'],
                projectList: [],
                bugList1: [], //柱状图
                bugList2: [],
                bugInfoList1: [],
                bugInfoList2: [],
                x1: [],
                y1: []
            };
        },

        created: function () {
            this.getProjectList();
        },

        mounted() {
            this.drawInit();
        },

        methods: {
            ...mapMutations(['setCache']),
            //获取用户所参与的项目
            getProjectList() {
                httpGet('/v1/authorization/bug/get/userproject').then(results => {
                    const {msg, data, httpCode} = results.data;
                    if (httpCode === 200) {
                        this.projectList = data.projectList;
                    } else if (httpCode === 400) {
                        this.setCache('issueManage');
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                });
            },
            returnBack() {
                this.$router.push({path: "./issueManage"});
            },

            drawInit() {
                var myChart1 = echarts.init(document.getElementById('main1'));
                myChart1.setOption({
                    title: {
                        text: '项目缺陷数量统计'
                    },
                    tooltip: {},
                    legend: {
                        data: ['个数']
                    },

                    xAxis: {
                        data: []
                    },
                    yAxis: [{}],

                    series: [
                        {
                            //顶上小图标名称
                            name: '缺陷数',
                            type: 'bar',
                            //barWidth: 20,
                            data: []
                        }
                    ]
                });
                myChart1.showLoading();

                httpGet('/v1/authorization/bug/get/bargraph').then(results => {
                    const {msg, data, httpCode} = results.data;
                    if (httpCode === 200) {
                        this.bugList1 = data.bugList;
                        this.bugList1.forEach(item => {
                            this.y1.push(item.toValue);
                            this.x1.push(item.key);
                        });
                        myChart1.hideLoading();
                        myChart1.setOption({
                            title: {
                                text: '项目缺陷数量统计'
                            },
                            tooltip: {},
                            legend: {
                                data: ['个数']
                            },

                            xAxis: {
                                data: this.x1
                            },
                            yAxis: [
                                {
                                    type: 'value',
                                    name: '缺陷数（个）'
                                }
                            ],

                            series: [
                                {
                                    //顶上小图标名称
                                    name: '缺陷数',
                                    type: 'bar',
                                    //barWidth: 20,
                                    data: this.y1
                                }
                            ]
                        });
                    } else if (httpCode === 400) {
                        this.setCache('issueManage');
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                });

                this.myChart2 = echarts.init(document.getElementById('main2'));
                this.myChart2.setOption({
                    title: {
                        text: '缺陷解决情况'
                    },
                    tooltip: {},
                    legend: {
                        data: ['个数']
                    },

                    xAxis: {
                        data: []
                    },
                    yAxis: [{}],
                    series: [
                        {
                            name: '缺陷数',
                            type: 'line',
                            data: []
                        }
                    ]
                });

                this.myChart2.showLoading();
                httpGet('/v1/authorization/bug/get/linechart', {id: null}).then(results => {
                    const {msg, data, httpCode} = results.data;
                    if (httpCode === 200) {
                        this.bugList2 = data.bugList;
                        var x2 = [];
                        var y2 = [];
                        this.bugList2.forEach(item => {
                            y2.push(item.value);
                            x2.push(item.key);
                        });
                        this.myChart2.hideLoading();
                        this.myChart2.setOption({
                            title: {
                                text: '缺陷解决情况'
                            },
                            tooltip: {},
                            legend: {
                                data: ['个数']
                            },

                            xAxis: {
                                data: x2
                            },
                            yAxis: [
                                {
                                    type: 'value',
                                    name: '缺陷数（个）'
                                }
                            ],

                            series: [
                                {
                                    //顶上小图标名称
                                    name: '缺陷数',
                                    type: 'line',
                                    data: y2,

                                    //平均值
                                    markLine: {
                                        data: [
                                            {
                                                type: 'average',
                                                name: '平均值'
                                            }
                                        ]
                                    }
                                }
                            ]
                        });
                    } else if (httpCode === 400) {
                        this.setCache('issueManage');
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                });

                this.myChart3 = echarts.init(document.getElementById('main3'));
                this.myChart3.setOption({
                    title: {
                        text: '缺陷解决情况',
                        subtext: '缺陷数（个）',
                        x: 'center'
                    },
                    series: [
                        {
                            name: '详情',
                            type: 'pie',
                            center: ['50%', '60%'],
                            data: []
                        }
                    ]
                });
                this.myChart3.showLoading();
                httpGet('/v1/authorization/bug/get/statuscondition', {id: null}).then(results => {
                    const {msg, data, httpCode} = results.data;
                    if (httpCode === 200) {
                        this.bugInfoList1 = data.bugInfoList;
                        var res = [];
                        var len = this.bugInfoList1.length;

                        while (len--) {
                            res.push({
                                name: this.Status[len],
                                value: this.bugInfoList1[len].value
                            });
                        }
                        this.myChart3.hideLoading();
                        this.myChart3.setOption({
                            title: {
                                text: '缺陷解决情况',
                                subtext: '缺陷数（个）',
                                x: 'center'
                            },
                            series: [
                                {
                                    name: '详情',
                                    type: 'pie',
                                    label: {
                                        normal: {
                                            show: true,
                                            formatter: '{b}: {c}({d}%)'
                                        }
                                    },

                                    center: ['50%', '60%'],
                                    data: res
                                }
                            ]
                        });
                    } else if (httpCode === 400) {
                        this.setCache('issueManage');
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                });

                this.myChart4 = echarts.init(document.getElementById('main4'));
                this.myChart4.setOption({
                    title: {
                        text: '不同等级缺陷数',
                        subtext: '缺陷数（个）',
                        x: 'center'
                    },
                    series: [
                        {
                            name: '详情',
                            type: 'pie',
                            //饼状图的大小
                            //radius : '55%',
                            center: ['50%', '60%'],
                            data: []
                        }
                    ]
                });
                this.getPie2(null);
            },

            getPie2: function (value) {
                this.myChart4.showLoading();
                httpGet('/v1/authorization/bug/get/levelcondition', {id: value}).then(results => {
                    const {msg, data, httpCode} = results.data;
                    if (httpCode === 200) {
                        this.bugInfoList2 = data.bugInfoList;
                        var res = [];
                        var len = this.bugInfoList2.length;

                        while (len--) {
                            res.push({
                                name: this.Levels[len],
                                value: this.bugInfoList2[len].value
                            });
                        }
                        this.myChart4.hideLoading();
                        this.myChart4.setOption({
                            title: {
                                text: '不同等级缺陷数',
                                subtext: '缺陷数（个）',
                                x: 'center'
                            },
                            series: [
                                {
                                    name: '详情',
                                    type: 'pie',
                                    label: {
                                        normal: {
                                            show: true,
                                            formatter: '{b}: {c}({d}%)'
                                        }
                                    },
                                    center: ['50%', '60%'],
                                    data: res
                                }
                            ]
                        });
                    } else if (httpCode === 400) {
                        this.setCache('issueManage');
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                });
            },

            getPie1: function (value) {
                this.myChart3.showLoading();
                httpGet('/v1/authorization/bug/get/statuscondition', {id: value}).then(results => {
                    const {msg, data, httpCode} = results.data;
                    if (httpCode === 200) {
                        this.bugInfoList1 = data.bugInfoList;
                        var res = [];
                        var len = this.bugInfoList1.length;

                        while (len--) {
                            res.push({
                                name: this.Status[len],
                                value: this.bugInfoList1[len].value
                            });
                        }
                        this.myChart3.hideLoading();
                        this.myChart3.setOption({
                            title: {
                                text: '缺陷解决情况',
                                subtext: '缺陷数（个）',
                                x: 'center'
                            },
                            series: [
                                {
                                    name: '详情',
                                    type: 'pie',
                                    label: {
                                        normal: {
                                            show: true,
                                            formatter: '{b}: {c}({d}%)'
                                        }
                                    },

                                    center: ['50%', '60%'],
                                    data: res
                                }
                            ]
                        });
                    } else if (httpCode === 400) {
                        this.setCache('issueManage');
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                });
            },

            getLine: function (value) {
                this.myChart2.showLoading();
                httpGet('/v1/authorization/bug/get/linechart', {id: value}).then(results => {
                    const {msg, data, httpCode} = results.data;
                    if (httpCode === 200) {
                        this.bugList2 = data.bugList;
                        var x2 = [];
                        var y2 = [];
                        this.bugList2.forEach(item => {
                            y2.push(item.value);
                            x2.push(item.key);
                        });
                        this.myChart2.hideLoading();
                        this.myChart2.setOption({
                            title: {
                                text: '缺陷解决情况'
                            },
                            tooltip: {},
                            legend: {
                                data: ['个数']
                            },

                            xAxis: {
                                data: x2
                            },
                            yAxis: [
                                {
                                    type: 'value',
                                    name: '缺陷数（个）'
                                }
                            ],

                            series: [
                                {
                                    //顶上小图标名称
                                    name: '缺陷数',
                                    type: 'line',
                                    data: y2,

                                    //平均值
                                    markLine: {
                                        data: [
                                            {
                                                type: 'average',
                                                name: '平均值'
                                            }
                                        ]
                                    }
                                }
                            ]
                        });
                    } else if (httpCode === 400) {
                        this.setCache('issueManage');
                    } else if (httpCode !== 401) {
                        errTips(msg);
                    }
                });
            }
        }
    };
</script>
<style lang="scss">
    .teamApplication {
        .box-card0 {
            padding: 20px 20px 20px 20px;
            margin: 50px 350px 50px 350px;
        }

        .title.el-input {
            width: 93%;
            float: right;
        }

        .title .el-input__inner {
            width: 100%;
            float: right;
        }

        .quill-editor {
            width: 95%;
            float: right;
            height: 200px;
            margin: 0px 0px 100px 0px;
        }

        .square1 {
            margin: 0 auto;
            width: 10px;
            height: 10px;
            background: red;
        }

        /* .card-header__2npG h4 {
          color: #8c8c8c;
          font-size: 14px;
          max-width: 300px;
          cursor: pointer;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
      } */
    }
</style>
