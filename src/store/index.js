import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router'
import {
    errTips
} from "@/utils/tips.js"
import {
    httpGet,
    httpPut
} from "@/utils/http.js"

Vue.use(Vuex);
const store = new Vuex.Store({
    state: {
        count: 2,
        userToken: '',
        loginSuccess: '/desk',
        headActive: '',
        mobileToken: '',
        leftIndex: '',
        uploadIndex: false,
        userData: {},
        taskList: [],
        diaLog: false,
        noImg: require("@/assets/img/d/desk/default-user.png"),
        uploadResource: "",
        cache: [],
        allType: [],
        normalType: [],
        messageList: []
    },
    getters: {
        //获取正常状态下的项目类型
        getNormalType: state => {
            return state.normalType
        },
        //获取所有项目类型
        getAllType: state => {
            return state.allType
        },
        //获取组件缓存
        getInclude: state => {
            return state.cache
        },
        //获取弹窗状态
        getdiaLog: state => {
            return state.diaLog
        },
        //获取上传状态
        getuploadIndex: state => {
            return state.uploadIndex
        },
        //编辑任务的上传资源路径
        getuploadResource: state => {
            return state.uploadResource
        },
        //编辑任务任务列表
        gettaskList: state => {
            return state.taskList
        },
        //无头像使用的的图片
        getnoImg: state => {
            return state.noImg
        },
        //获取用户数据
        getuserData: state => {
            return state.userData
        },
        //获取导航栏头部标识做高亮
        getHeader: state => {
            return state.headActive
        },
        //获取左侧导航栏头部标识做高亮
        getleftIndex: state => {
            return state.leftIndex
        },
        //获取token
        getUser: state => {
            return state.userToken
        },
        getUrl: state => {
            return state.loginSuccess
        },
        //获取头部消息
        getMessageList: state => {
            return state.messageList
        }
    },
    mutations: {
        refreshCache(state, status) {
            state.cache = status
        },
        setCache(state, status) {
            let newList = [...state.cache]
            var index = newList.indexOf(status)
            index !== -1 && newList.splice(index, 1)
            const awaitDemo = async () => {
                state.cache = newList;
            };
            awaitDemo().then(() => {
                router.push({
                    name: status
                });
            });
        },
        setdiaLog(state, status) {
            state.diaLog = status
        },
        setOrder(state, status) {
            let {
                index1,
                index2
            } = status
            const swapArr = (arr, index1, index2) => {
                arr[index1] = arr.splice(index2, 1, arr[index1])[0];
            }
            swapArr(state.taskList, index1, index2)
        },
        setMobiletoken(state, status) {
            state.mobileToken = sessionStorage.setItem('mobileToken', status)
        },
        setImgurl(state, status) {
            state.headImg = status
        },
        setLeft(state, status) {
            state.leftIndex = status
        },
        setHeader(state, status) {
            state.headActive = status
        },
        setLogin(state, route_to = null) {
            let userToken = sessionStorage.getItem('userToken')
            let userData = sessionStorage.getItem('userData')
            userData && (state.userData = JSON.parse(userData))
            userToken && (state.userToken = JSON.parse(userToken))
            if (route_to !== null) {   //当用户通过点击新标签页时，会走这一分支
                router.push({path: route_to.path});
            }
        },
        setLogout(state) {
            state.userToken = sessionStorage.setItem('userToken', "")
            state.userData = sessionStorage.setItem('userData', "")
            state.mobileToken = sessionStorage.setItem('mobileToken', "")
            state.headImg = '';
        },
        settaskList(state, status) {
            if (status.length === 0) {
                state.uploadIndex = false;
            }
            state.taskList = status
            for (let i = 0; i < status.length; i++) {
                if (status[i].accomplishProgress !== 100) {
                    state.uploadIndex = false;
                    return false
                } else {
                    state.uploadIndex = true;
                }
            }
        },
        setResource(state, status) {
            state.uploadResource = status
        },
        setAllType(state, status) {
            state.allType = status
        },
        setNormalType(state, status) {
            state.normalType = status
        },
        setMessage(state, status) {
            state.messageList = status
        },
        intercept(state, status) {
            state.loginSuccess = status
        },
    },
    actions: {
        GETALLTYPE(context) {
            httpGet("/v1/public/bid/typeall/all").then(results => {
                const {
                    httpCode,
                    data
                } = results.data;
                if (httpCode === 200) {
                    let {
                        list
                    } = data;
                    context.commit("setAllType", list)
                }
            });
        },
        GETNORMALTYPE(context) {
            httpGet("/v1/public/bid/typeall/get").then(results => {
                const {
                    httpCode,
                    data
                } = results.data;
                if (httpCode === 200) {
                    let {
                        list
                    } = data;
                    let newData = list.map(o => {
                        return {
                            value: o.id,
                            label: o.type,
                            parentId: o.parentId,
                            typeIndex: false
                        };
                    });
                    let parentList = newData.filter(ele => ele["parentId"] === 0);
                    for (let index of parentList) {
                        index.children = [];
                        index.children = newData.filter(ele => ele["parentId"] === index.value);
                    }
                    context.commit("setNormalType", parentList)
                }
            });
        },
        GETMESSAGE(context) {
            let setTime = null
            clearInterval(setTime)
            const getMessage = () => {
                httpGet(`/v1/authorization/msg/msgs/0/5`).then(results => {
                    const {
                        msg,
                        httpCode,
                        data
                    } = results.data;
                    if (httpCode === 200) {
                        context.commit("setMessage", data)
                    } else if (httpCode !== 401) {
                        errTips(msg)
                    }
                });
            }
            getMessage()
            setTime = setInterval(() => {
                context.state.userToken ? getMessage() : clearInterval(setTime)
            }, 30000)

        },
        SETLOGOUT(context, data) {
            httpGet("/v1/public/coreuser/logout/" + context.state.userToken + "").then(results => {
                const {msg, httpCode} = results.data;
                if (httpCode === 200) {
                    router.push({name: data});
                    router.go(0);
                    context.commit("setLogout")
                } else if (httpCode !== 401) {
                    errTips(msg);
                }
            });
        },
        CHANGEMESSAGESTATE(context, obj) {
            httpPut("/v1/authorization/msg/msgstatus", {
                id: obj.id
            }).then(results => {
                const {
                    httpCode,
                    msg
                } = results.data;
                if (httpCode === 200) {
                    let newList = [...context.state.messageList]
                    newList.splice(obj.index, 1);
                    context.commit("setMessage", newList)
                } else if (httpCode !== 401) {
                    errTips(msg)
                }
            });
        }
    }
})
export default store
