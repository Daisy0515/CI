import Vue from 'vue'
import Router from 'vue-router'
import index from '@/view/home/index/index'
import homePublic from '@/view/home/homePublic/homePublic'
import managerPublic from '@/view/review/reviewPublic/managerPublic'
import publisherPublic from '@/view/review/reviewPublic/publisherPublic'
import expertPublic from '@/view/review/reviewPublic/expertPublic'
import editorPublic from '@/view/review/reviewPublic/editorPublic'
import store from '@/store/index.js'
import {errTips} from "@/utils/tips.js";


const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)
const vueRouter = new Router({
    routes: [
        {
            path: '/login',
            name: 'login',
            component: () => import('@/view/loginRegister/login/login'),
            meta: {
                title: '登录'
            }
        },
        {
            path: '/rules',
            name: 'rules',
            component: () => import('@/view/loginRegister/register/rules'),
            meta: {
                title: '用户守则'
            }
        },
        {
            path: '/git-1',
            name: 'git-1',
            component: () => import('@/view/git/git-1'),
            meta: {
                title: 'git使用'
            }
        },
        {
            path: '/git-2',
            name: 'git-2',
            component: () => import('@/view/git/git-2'),
            meta: {
                title: 'git使用'
            }
        },
        {
            path: '/selectRole',
            name: 'selectRole',
            component: () => import('@/view/loginRegister/register/selectRole'),
            meta: {
                title: '选择角色'
            }
        },
        {
            path: '/personalRegister',
            name: 'personalRegister',
            component: () => import('@/view/loginRegister/register/personalRegister'),
            meta: {
                title: '个人注册'
            }
        },
        {
            path: '/companyRegister',
            name: 'companyRegister',
            component: () => import('@/view/loginRegister/register/companyRegister'),
            meta: {
                title: '公司注册'
            }
        },
        {
            path: '/adminRegister',
            name: 'adminRegister',
            component: () => import('@/view/loginRegister/register/adminRegister'),
            meta: {
                title: '评审管理员注册',
                requireAuth: true,
            }
        },
        {
            path: '/expertRegister',
            name: 'expertRegister',
            component: () => import('@/view/loginRegister/register/expertRegister'),
            meta: {
                title: '评审专家注册',
                requireAuth: true,
            }
        },
        {
            path: '/forget',
            name: 'forget',
            component: () => import('@/view/loginRegister/forget/forget'),
            meta: {
                title: '忘记密码'
            }
        },
        {
            path: '/passSuccess/:isSuccess',
            name: 'passSuccess',
            component: () => import('@/view/loginRegister/forget/passSuccess'),
            meta: {
                title: '修改成功'
            }
        },
        {
            path: '/registerSuccess/:isSuccess',
            name: 'registerSuccess',
            component: () => import('@/view/loginRegister/register/registerSuccess'),
            meta: {
                title: '注册成功'
            }
        },
        {
            path: '/',
            name: 'managerPublic',
            component: managerPublic,
            redirect: 'index',//??
            children: [{
                path: '/managerIndex',
                name: 'managerIndex',
                component: () => import('@/view/review/manager/managerIndex'),
                meta: {
                    title: '首页',
                    requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                }

            },
                {
                    path: '/managerNotAccept',
                    name: 'managerNotAccept',
                    component: () => import('@/view/review/manager/notAccept'),
                    meta: {
                        title: '未接受',
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    }
                },
                {
                    path: '/managerRollback',
                    name: 'managerRollback',
                    component: () => import('@/view/review/manager/rollback'),
                    meta: {
                        title: '打回中',
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    }
                },
                {
                    path: '/managerReview',
                    name: 'managerReview',
                    component: () => import('@/view/review/manager/review'),
                    meta: {
                        title: '评审中',
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    }
                },
                {
                    path: '/managerComplete',
                    name: 'managerComplete',
                    component: () => import('@/view/review/manager/complete'),
                    meta: {
                        title: '已完成',
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    }
                },
                {
                    path: '/managerAboutTimeout',
                    name: 'managerAboutTimeout',
                    component: () => import('@/view/review/manager/aboutTimeout'),
                    meta: {
                        title: '即将超时',
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    }
                },
                {
                    path: '/managerAlreadyTimeout',
                    name: 'managerAlreadyTimeout',
                    component: () => import('@/view/review/manager/alreadyTimeout'),
                    meta: {
                        title: '已经超时',
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    }
                },
                {
                    path: '/managerDraft',
                    name: 'managerDraft',
                    component: () => import('@/view/review/manager/draft'),
                    meta: {
                        title: '草稿箱',
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    }
                }]

        },
        {
            path: '/',
            name: 'publisherPublic',
            component: publisherPublic,
            redirect: 'index',//??
            children: [{
                path: '/publisherIndex',
                name: 'publisherIndex',
                component: () => import('@/view/review/publisher/publisherIndex'),
                meta: {
                    title: '首页',
                    requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                }

            },
                {
                    path: '/submitReview',
                    name: 'submitReview',
                    component: () => import('@/view/review/publisher/submitReview'),
                    meta: {
                        title: '发起第三方评审',
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    }
                },
                {
                    path: '/viewReview',
                    name: 'viewReview',
                    component: () => import('@/view/review/publisher/viewReview'),
                    meta: {
                        title: '查看第三方评审',
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    }
                },
                {
                    path: '/publisherNotAccept',
                    name: 'publisherNotAccept',
                    component: () => import('@/view/review/publisher/notAccept'),
                    meta: {
                        title: '未接受',
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    }
                },
                {
                    path: '/publisherRollback',
                    name: 'publisherRollback',
                    component: () => import('@/view/review/publisher/rollback'),
                    meta: {
                        title: '打回中',
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    }
                },
                {
                    path: '/publisherReview',
                    name: 'publisherReview',
                    component: () => import('@/view/review/publisher/review'),
                    meta: {
                        title: '评审中',
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    }
                },
                {
                    path: '/publisherComplete',
                    name: 'publisherComplete',
                    component: () => import('@/view/review/publisher/complete'),
                    meta: {
                        title: '已完成',
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    }
                },
                {
                    path: '/publisherAboutTimeout',
                    name: 'publisherAboutTimeout',
                    component: () => import('@/view/review/publisher/aboutTimeout'),
                    meta: {
                        title: '即将超时',
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    }
                },
                {
                    path: '/publisherAreadyTimeout',
                    name: 'publisherAreadyTimeout',
                    component: () => import('@/view/review/publisher/alreadyTimeout'),
                    meta: {
                        title: '已经超时',
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    }
                },
            ]

        },
        {
            path: '/',
            name: 'expertPublic',
            component: expertPublic,
            redirect: 'index',//??
            children: [{
                path: '/expertIndex',
                name: 'expertIndex',
                component: () => import('@/view/review/expert/expertIndex'),
                meta: {
                    title: '首页',
                    requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    hasExpertRole: true,   //添加该字段，表示进入这个路由是需要评审专家权限
                }

            },
                {
                    path: '/expertAboutTimeOut',
                    name: 'expertAboutTimeOut',
                    component: () => import('@/view/review/expert/expertAboutTimeOut'),
                    meta: {
                        title: '即将超时',
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                        hasExpertRole: true,   //添加该字段，表示进入这个路由是需要评审专家权限
                    }
                },
                {
                    path: '/expertAlreadyTimeOut',
                    name: 'expertAlreadyTimeOut',
                    component: () => import('@/view/review/expert/expertAlreadyTimeOut'),
                    meta: {
                        title: '已经超时',
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                        hasExpertRole: true,   //添加该字段，表示进入这个路由是需要评审专家权限
                    }
                },
                {
                    path: '/expertComplete',
                    name: 'expertComplete',
                    component: () => import('@/view/review/expert/expertComplete'),
                    meta: {
                        title: '已完成',
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                        hasExpertRole: true,   //添加该字段，表示进入这个路由是需要评审专家权限
                    }
                },
                {
                    path: '/expertStopped',
                    name: 'expertStopped',
                    component: () => import('@/view/review/expert/expertStopped'),
                    meta: {
                        title: '已中止',
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                        hasExpertRole: true,   //添加该字段，表示进入这个路由是需要评审专家权限
                    }
                },
                {
                    path: '/expertRejected',
                    name: 'expertRejected',
                    component: () => import('@/view/review/expert/expertRejected'),
                    meta: {
                        title: '已拒绝',
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                        hasExpertRole: true,   //添加该字段，表示进入这个路由是需要评审专家权限
                    }
                },
                {
                    path: '/expertInformation',
                    name: 'expertInformation',
                    component: () => import('@/view/review/expert/expertInformation'),
                    meta: {
                        title: '信息维护',
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                        hasExpertRole: true,   //添加该字段，表示进入这个路由是需要评审专家权限
                    },
                },
                {
                    path: '/expertReview',
                    name: 'expertReview',
                    component: () => import('@/view/review/expert/expertReview'),
                    meta: {
                        title: '评审中',
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                        hasExpertRole: true,   //添加该字段，表示进入这个路由是需要评审专家权限
                    }
                },
                {
                    path: '/expertTodo',
                    name: 'expertTodo',
                    component: () => import('@/view/review/expert/expertTodo'),
                    meta: {
                        title: '待处理',
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                        hasExpertRole: true,   //添加该字段，表示进入这个路由是需要评审专家权限
                    }
                },
                {
                    path: '/expertDetail',
                    name: 'expertDetail',
                    component: () => import('@/view/review/expert/expertDetail'),
                    meta: {
                        title: '信息维护',
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                        hasExpertRole: true,   //添加该字段，表示进入这个路由是需要评审专家权限
                    }
                },
                {
                    path: '/expertTotal',
                    name: 'expertTotal',
                    component: () => import('@/view/review/expert/expertTotal'),
                    meta: {
                        title: '信息维护',
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                        hasExpertRole: true,   //添加该字段，表示进入这个路由是需要评审专家权限
                    }
                },
            ]

        },
        {
            path: '/',
            name: 'editorPublic',
            component: editorPublic,
            redirect: 'index',//??
            children: [{
                path: '/editorIndex',
                name: 'editorIndex',
                component: () => import('@/view/review/editor/editorIndex'),
                meta: {
                    title: '首页',
                    requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    hasEditorRole: true,   //添加该字段，表示进入这个路由是需要评审管理员权限
                }

            },
                {
                    path: '/submissionSearch',
                    name: 'editorSubmissionSearch',
                    component: () => import('@/view/review/editor/submissionSearch'),
                    meta: {
                        title: '评审任务搜索',
                        //requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                        hasEditorRole: true,   //添加该字段，表示进入这个路由是需要评审管理员权限
                    }

                },
                {
                    path: '/expertSearch',
                    name: 'editorExpertSearch',
                    component: () => import('@/view/review/editor/expertSearch'),
                    meta: {
                        title: '评审专家搜索',
                        //requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                        hasEditorRole: true,   //添加该字段，表示进入这个路由是需要评审管理员权限
                    }

                },
                {
                    path: '/reviewStatistic/expertAccomplishCount/:expertAccomplishCount',
                    name: 'editorReviewStatistic',
                    component: () => import('@/view/review/editor/reviewStatistic'),
                    props: true,
                    meta: {
                        title: '评审统计',
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                        hasEditorRole: true,   //添加该字段，表示进入这个路由是需要评审管理员权限
                    }
                },
                {
                    path: '/reviewTodo',
                    name: 'editorReviewTodo',
                    component: () => import('@/view/review/editor/reviewTodo'),
                    props: (route) => ({
                        status: route.query.status,
                        expertAccomplishCount: route.query.expertAccomplishCount,
                        statusExplain: route.query.statusExplain
                    }),
                    meta: {
                        title: '待处理',
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                        hasEditorRole: true,   //添加该字段，表示进入这个路由是需要评审管理员权限
                    }
                },
                {
                    path: '/inviteExpert',
                    name: 'editorInviteExpert',
                    component: () => import('@/view/review/editor/inviteExpert'),
                    meta: {
                        title: '邀请评审专家',
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                        hasEditorRole: true,   //添加该字段，表示进入这个路由是需要评审管理员权限
                    }

                },
                {
                    path: '/sendEmail',
                    name: 'editorSendEmail',
                    component: () => import('@/view/review/editor/sendEmail'),
                    meta: {
                        title: '发送邮件',
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                        hasEditorRole: true,   //添加该字段，表示进入这个路由是需要评审管理员权限
                    }

                },
                {
                    path: '/editorComplete',
                    name: 'editorComplete',
                    component: () => import('@/view/review/editor/editorComplete'),
                    meta: {
                        title: '已完成',
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                        hasEditorRole: true,   //添加该字段，表示进入这个路由是需要评审管理员权限
                    }
                },
                {
                    path: '/editorTodo',
                    name: 'editorTodo',
                    component: () => import('@/view/review/editor/editorTodo'),
                    meta: {
                        title: '待处理任务',
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                        hasEditorRole: true,   //添加该字段，表示进入这个路由是需要评审管理员权限
                    }
                },
                {
                    path: 'editorOpinionAndDecision/id/:id/identification/:identification',
                    name: 'editorOpinionAndDecision',
                    component: () => import('@/view/review/editor/editorOpinionAndDecision'),
                    props: true,
                    meta: {
                        title: '意见与决定',
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                        hasEditorRole: true,   //添加该字段，表示进入这个路由是需要评审管理员权限
                    }
                },
                {
                    path: '/editorManager',
                    name: 'editorManager',
                    component: () => import('@/view/review/editor/editorManager'),
                    meta: {
                        title: '评审管理',
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                        hasEditorRole: true,   //添加该字段，表示进入这个路由是需要评审管理员权限
                    }
                },
                {
                    path: '/editorReminderEmail',
                    name: 'editorReminderEmail',
                    component: () => import('@/view/review/editor/reminderMail/editorReminderEmail'),
                    meta: {
                        title: '发送提醒邮件',
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                        hasEditorRole: true,   //添加该字段，表示进入这个路由是需要评审管理员权限
                    }
                },
                {
                    path: '/editorMailTemplates',
                    name: 'editorMailTemplates',
                    component: () => import('@/view/review/editor/reminderMail/mailTemplates'),
                    meta: {
                        title: '邮件模板',
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                        hasEditorRole: true,   //添加该字段，表示进入这个路由是需要评审管理员权限
                    }
                },
                {
                    path: '/editorReviewerReminder',
                    name: 'editorReviewerReminder',
                    component: () => import('@/view/review/editor/reminderMail/reviewerReminder'),
                    meta: {
                        title: '评审专家提醒',
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                        hasEditorRole: true,   //添加该字段，表示进入这个路由是需要评审管理员权限
                    }
                },
                {
                    path: '/editorReviewerReminderSearchResult/searchData/:searchData',
                    name: 'editorReviewerReminderSearchResult',
                    component: () => import('@/view/review/editor/reminderMail/reviewerReminderSearchResult'),
                    props: true,
                    meta: {
                        title: '评审专家搜索结果',
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                        hasEditorRole: true,   //添加该字段，表示进入这个路由是需要评审管理员权限
                    }
                },
                {
                    path: '/editorReviewInviteNoResponse',
                    name: 'editorReviewInviteNoResponse',
                    component: () => import('@/view/review/editor/reminderMail/reviewInviteNoResponse'),
                    meta: {
                        title: '评审专家邀请未回复',
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                        hasEditorRole: true,   //添加该字段，表示进入这个路由是需要评审管理员权限
                    }
                },
                {
                    path: '/editorUniversalMail',
                    name: 'editorUniversalMail',
                    component: () => import('@/view/review/editor/reminderMail/universalMail'),
                    meta: {
                        title: '通用邮件',
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                        hasEditorRole: true,   //添加该字段，表示进入这个路由是需要评审管理员权限
                    }
                },
                {
                    path: '/editorCustomizeAndSendEmail/expertIdList/:expertIdList',
                    name: 'editorCustomizeAndSendEmail',
                    component: () => import('@/view/review/editor/reminderMail/customizeAndSendEmail'),
                    props: true,
                    meta: {
                        title: '定制与发送邮件',
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                        hasEditorRole: true,   //添加该字段，表示进入这个路由是需要评审管理员权限
                    }
                },
                {
                    path: '/editorReviewTemplateConfig',
                    name: 'editorReviewTemplateConfig',
                    component: () => import('@/view/review/editor/reviewTemplate/reviewTemplateConfig'),
                    props: (route) => ({templateId: route.query.templateId}),
                    meta: {
                        title: '评审模板配置',
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                        hasEditorRole: true,   //添加该字段，表示进入这个路由是需要评审管理员权限
                    }
                },
                {
                    path: '/editorReviewTemplates',
                    name: 'editorReviewTemplates',
                    component: () => import('@/view/review/editor/reviewTemplate/reviewTemplates'),
                    meta: {
                        title: '已有评审模板',
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                        hasEditorRole: true,   //添加该字段，表示进入这个路由是需要评审管理员权限
                    }
                },
                {
                    path: '/editorReviewTemplateDetail',//实际进入这个页面需要传入模板id,templateId和模板是否被使用的isEmploy
                    name: 'editorReviewTemplateDetail',
                    component: () => import('@/view/review/editor/reviewTemplate/reviewTemplateDetail'),
                    props: true,//将id,isEmploy视为组件的属性
                    meta: {
                        title: '评审模板详情',
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                        hasEditorRole: true,   //添加该字段，表示进入这个路由是需要评审管理员权限
                    }
                }, {
                    path: '/registerNewUser',
                    name: 'editorRegisterNewUser',
                    component: () => import('@/view/review/editor/registerNewUser'),
                    meta: {
                        title: '注册新用户',
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                        hasEditorRole: true,   //添加该字段，表示进入这个路由是需要评审管理员权限
                    }
                },

            ]
        },
        {
            path: '/',
            name: 'homePublic',
            component: homePublic,
            redirect: '/index',
            children: [{
                path: '/publishTask',
                name: 'publishTask',
                component: () => import('@/view/home/publishTask/publishTask'),
                meta: {
                    title: '发布需求',
                    requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                }
            },
                {
                    path: '/knowledgeView',
                    name: 'knowledgeView',
                    component: () => import('@/view/home/service/knowledgeView'),
                    meta: {
                        title: "知识明细",
                        routerIndex: "knowledgeView"
                    },
                },
                {
                    path: '/moreToolset',
                    name: 'moreToolset',
                    component: () => import('@/view/home/service/moreToolset'),
                    meta: {
                        title: "更多",
                        routerIndex: "moreToolset"
                    },
                },
                {
                    path: '/service',
                    name: 'service',
                    redirect: '/toolset',
                    meta: {
                        title: "服务共享",
                        routerIndex: "information"
                    },
                    component: () => import('@/view/home/service/service'),
                    children: [{
                        path: '/toolset',
                        name: 'toolset',
                        component: () => import('@/view/home/service/toolset'),
                        meta: {
                            title: "工具集",
                            routerIndex: "toolset"
                        },
                    },
                        {
                            path: '/knowledgePlaza',
                            name: 'knowledgePlaza',
                            component: () => import('@/view/home/service/knowledgePlaza'),
                            meta: {
                                title: "知识广场",
                                routerIndex: "knowledgePlaza"
                            },
                        }
                    ]
                },
                {
                    path: '/toolsetView',
                    name: 'toolsetView',
                    component: () => import('@/view/home/service/toolsetView'),
                    meta: {
                        title: '工具明细',
                    }
                },
                {
                    path: '/index',
                    name: 'index',
                    component: index,
                    meta: {
                        title: '首页',
                    }
                },
                {
                    path: '/roleSelection',
                    name: 'roleSelection',
                    component: () => import('@/view/home/tenderingBidding/roleSelection'),
                    meta: {
                        title: '选择角色',
                    }
                },
                {
                    path: '/releaseProcess',
                    name: 'releaseProcess',
                    component: () => import('@/view/home/tenderingBidding/releaseProcess'),
                    meta: {
                        title: '项目发布角色',
                    }
                },
                {
                    path: '/managerProcess',
                    name: 'managerProcess',
                    component: () => import('@/view/home/tenderingBidding/managerProcess'),
                    meta: {
                        title: '项目经理角色',
                    }
                },
                {
                    path: '/memberProcess',
                    name: 'memberProcess',
                    component: () => import('@/view/home/tenderingBidding/memberProcess'),
                    meta: {
                        title: '项目成员角色',
                    }
                },
                {
                    path: '/applicationView',
                    name: 'applicationView',
                    component: () => import('@/view/home/biddingSquare/applicationView'),
                    meta: {
                        title: '申请查看',
                    }
                },
                {
                    path: '/participationBidding',
                    name: 'participationBidding',
                    component: () => import('@/view/home/biddingSquare/participationBidding'),
                    meta: {
                        title: '参与竞标',
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: '/classicCase',
                    name: 'classicCase',
                    component: () => import('@/view/home/classicCase/classicCase'),
                    meta: {
                        title: '经典案例',
                    }
                },
                {
                    path: '/caseDetails',
                    name: 'caseDetails',
                    component: () => import('@/view/home/classicCase/caseDetails'),
                    meta: {
                        title: '案例明细',
                    }
                },
                {
                    path: '/biddingSquare',
                    name: 'biddingSquare',
                    component: () => import('@/view/home/biddingSquare/biddingSquare'),
                    meta: {
                        title: '招标广场',
                    }
                },
                {
                    path: '/personalBid',
                    name: 'personalBid',
                    component: () => import('@/view/home/biddingSquare/personalBid'),
                    meta: {
                        title: '个人信息',
                    }
                },
                {
                    path: '/teamSquare',
                    name: 'teamSquare',
                    component: () => import('@/view/home/teamSquare/teamSquare'),
                    meta: {
                        title: '团队广场',
                    }
                },
                {
                    path: '/applicationAccession',
                    name: 'applicationAccession',
                    component: () => import('@/view/home/teamSquare/applicationAccession'),
                    meta: {
                        title: '申请加入',
                    }
                },
                {
                    path: '/feature',
                    name: 'feature',
                    component: () => import('@/view/home/feature/feature'),
                    meta: {
                        title: '关于我们',
                    }
                },
                {
                    path: '/testEmploy',
                    name: 'testEmploy',
                    component: () => import('@/view/home/testEmploySquare/testEmploySquare'),
                    meta: {
                        title: "内测招募",
                    },
                },
                {
                    path: '/testPublish',
                    name: 'testPublish',
                    component: () => import('@/view/home/testEmploySquare/testPublish'),
                    meta: {
                        title: "内测招募",
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: '/testView',
                    name: 'testView',
                    component: () => import('@/view/home/testEmploySquare/testView'),
                    meta: {
                        title: "内测招募",
                    },
                },
                {
                    path: '/competitionSquare',
                    name: 'competitionSquare',
                    component: () => import('@/view/home/competition/competitionSquare'),
                    meta: {
                        title: "竞赛广场",
                    },
                },
                {
                    path: '/competitionView',
                    name: 'competitionView',
                    component: () => import('@/view/home/competition/competitionView'),
                    meta: {
                        title: "竞赛详情",
                    },
                },
                {
                    path: '/joinCompetition',
                    name: 'joinCompetition',
                    component: () => import('@/view/home/competition/joinCompetition'),
                    meta: {
                        title: "参与竞赛",
                    },
                },
            ]
        },
        {
            path: '/desk',
            name: 'desk',
            component: () => import('@/view/desk/desk'),
            meta: {
                requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
            },
            redirect: '/desk/project',
            children: [
                {
                    path: '/desk/project',
                    name: 'project',
                    component: () => import('@/view/desk/project/project'),
                    meta: {
                        title: "工作台",
                        routerIndex: "project",
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: '/desk/myBid',
                    name: 'myBid',
                    component: () => import('@/view/desk/myBid/myBid'),
                    meta: {
                        title: "我的投标",
                        routerIndex: "myBid",
                        keepAlive: true,
                        deepth: 2,
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: '/desk/projectManagement',
                    name: 'projectManagement',
                    redirect: 'projectManageList',
                    meta: {
                        title: "项目管理",
                        routerIndex: "projectManagement",
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                    component: () => import('@/view/desk/projectManagement/index'),
                    children: [
                        {
                            path: '/desk/projectManageList',
                            name: 'projectManageList',
                            component: () => import('@/view/desk/projectManagement/projectManageList'),
                            meta: {
                                title: "项目管理列表",
                                routerIndex: "projectManagement", //children的routerIndex与父路由的routerIndex要一致，在common/header/deskHeader中保持被选择导航项的样式
                                requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                            },
                        },
                        {
                            path: '/desk/projectManageContent',
                            name: 'projectManageContent',
                            redirect: '/desk/projectProgress',
                            component: () => import('@/view/desk/projectManagement/projectManageContent'),
                            meta: {
                                title: "项目管理内容",
                                routerIndex: "projectManagement",//children的routerIndex与父路由的routerIndex要一致，在common/header/deskHeader中保持被选择导航项的样式
                                requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                            },
                            children: [
                                {
                                    path: '/desk/projectProgress',
                                    name: 'projectProgress',
                                    component: () => import('@/view/desk/projectManagement/projectManageContent/projectProgress'),
                                    meta: {
                                        title: "项目进度",
                                        routerIndex: "projectManagement", //children的routerIndex与父路由的routerIndex要一致，在common/header/deskHeader中保持被选择导航项的样式
                                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                                    },
                                 },
                                {
                                    path: '/desk/taskManage',
                                    name: 'taskManage',
                                    component: () => import('@/view/desk/projectManagement/projectManageContent/taskManage'),
                                    meta: {
                                        title: "任务管理",
                                        routerIndex: "projectManagement", //children的routerIndex与父路由的routerIndex要一致，在common/header/deskHeader中保持被选择导航项的样式
                                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                                    },
                                },
                                {
                                    path: '/desk/myTaskManage',
                                    name: 'myTaskManage',
                                    component: () => import('@/view/desk/projectManagement/projectManageContent/myTaskManage'),
                                    meta: {
                                        title: "我的任务",
                                        routerIndex: "projectManagement", //children的routerIndex与父路由的routerIndex要一致，在common/header/deskHeader中保持被选择导航项的样式
                                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                                    },
                                },
                                {
                                    path: '/desk/projectFile',
                                    name: 'projectFile',
                                    component: () => import('@/view/desk/projectManagement/projectManageContent/projectFile'),
                                    meta: {
                                        title: "项目文件",
                                        routerIndex: "projectManagement", //children的routerIndex与父路由的routerIndex要一致，在common/header/deskHeader中保持被选择导航项的样式
                                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                                    },
                                },
                                {
                                    path: '/desk/projectMembers',
                                    name: 'projectMembers',
                                    component: () => import('@/view/desk/projectManagement/projectManageContent/projectMembers'),
                                    meta: {
                                        title: "项目成员",
                                        routerIndex: "projectManagement", //children的routerIndex与父路由的routerIndex要一致，在common/header/deskHeader中保持被选择导航项的样式
                                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                                    },
                                },
                                {
                                    path: '/desk/gitSubmitInfo',
                                    name: 'gitSubmitInfo',
                                    component: () => import('@/view/desk/projectManagement/projectManageContent/gitSubmitInfo'),
                                    meta: {
                                        title: "git提交信息",
                                        routerIndex: "projectManagement", //children的routerIndex与父路由的routerIndex要一致，在common/header/deskHeader中保持被选择导航项的样式
                                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                                    },
                                },
                                {
                                    path: '/desk/notification',
                                    name: 'notification',
                                    component: () => import('@/view/desk/projectManagement/projectManageContent/notification'),
                                    meta: {
                                        title: "通知",
                                        routerIndex: "projectManagement", //children的routerIndex与父路由的routerIndex要一致，在common/header/deskHeader中保持被选择导航项的样式
                                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                                    },
                                },

                            ]
                        },
                    ]
                },
                {
                    path: '/desk/myTask',
                    name: 'myTask',
                    component: () => import('@/view/desk/myTask/myTask'),
                    meta: {
                        title: "我的任务",
                        routerIndex: "myTask",
                        keepAlive: true,
                        deepth: 2,
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: '/desk/needDesign',
                    name: 'needDesign',
                    component: () => import('@/view/desk/myTask/needDesign'),
                    meta: {
                        title: "我的任务",
                        routerIndex: "myTask",
                        keepAlive: true,
                        deepth: 2,
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: '/desk/viewNeedDesign',
                    name: 'viewNeedDesign',
                    component: () => import('@/view/desk/myTask/viewNeedDesign'),
                    meta: {
                        title: "我的任务",
                        routerIndex: "myTask",
                        keepAlive: true,
                        deepth: 2,
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },

                {
                    path: '/desk/outlineDesign',
                    name: 'outlineDesign',
                    component: () => import('@/view/desk/myTask/outlineDesign'),
                    meta: {
                        title: "我的任务",
                        routerIndex: "myTask",
                        keepAlive: true,
                        deepth: 2,
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: '/desk/viewOutlineDesign',
                    name: 'viewOutlineDesign',
                    component: () => import('@/view/desk/myTask/viewOutlineDesign'),
                    meta: {
                        title: "我的任务",
                        routerIndex: "myTask",
                        keepAlive: true,
                        deepth: 2,
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: '/desk/detailedDesign',
                    name: 'detailedDesign',
                    component: () => import('@/view/desk/myTask/detailedDesign'),
                    meta: {
                        title: "我的任务",
                        routerIndex: "myTask",
                        keepAlive: true,
                        deepth: 2,
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: '/desk/kanBan',
                    name: 'kanBan',
                    component: () => import('@/view/desk/myTask/kanBan'),
                    meta: {
                        title: "我的任务",
                        routerIndex: "myTask",
                        keepAlive: true,
                        deepth: 2,
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },

                {
                    path: '/desk/resourceManagement',
                    name: 'resourceManagement',
                    component: () => import('@/view/desk/myTask/resourceManagement'),
                    meta: {
                        title: "我的任务",
                        routerIndex: "myTask",
                        deepth: 1,
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: '/desk/viewTask',
                    name: 'viewTask',
                    component: () => import('@/view/desk/myTask/viewTask'),
                    meta: {
                        title: "我的任务",
                        routerIndex: "myTask",
                        deepth: 1,
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: '/desk/bidView',
                    name: 'bidView',
                    component: () => import('@/view/desk/myBid/bidView'),
                    meta: {
                        title: "我的投标",
                        routerIndex: "myBid",
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: '/desk/personalProfile',
                    name: 'personalProfile',
                    component: () => import('@/view/desk/myBid/personalProfile'),
                    meta: {
                        title: "我的投标",
                        routerIndex: "myBid",
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: '/desk/editorialTeam',
                    name: 'editorialTeam',
                    component: () => import('@/view/desk/myBid/editorialTeam'),
                    meta: {
                        routerIndex: "myBid",
                        title: "我的投标",
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: '/desk/projectDeliver',
                    name: 'projectDeliver',
                    component: () => import('@/view/desk/myBid/projectDeliver'),
                    meta: {
                        routerIndex: "myBid",
                        title: "我的投标",
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    routerIndex: "myBid",
                    path: '/desk/bidScoring',
                    name: 'bidScoring',
                    component: () => import('@/view/desk/myBid/bidScoring'),
                    meta: {
                        title: "我的投标",
                        routerIndex: "myBid",
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: '/desk/taskIndex',
                    name: 'taskIndex',
                    component: () => import('@/view/desk/myBid/editorialTasks/taskIndex'),
                    redirect: '/desk/taskHome',
                    meta: {
                        title: "我的投标",
                        routerIndex: "myBid",
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                    children: [{
                        path: '/desk/taskHome',
                        name: 'taskHome',
                        component: () => import('@/view/desk/myBid/editorialTasks/taskHome'),
                        meta: {
                            title: "我的投标",
                            routerIndex: "myBid",
                            requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                        },
                    },
                        {
                            path: '/desk/taskGantt',
                            name: 'taskGantt',
                            component: () => import('@/view/desk/myBid/editorialTasks/taskGantt'),
                            meta: {
                                title: "我的投标",
                                routerIndex: "myBid",
                                requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                            },
                        },
                        {
                            path: '/desk/submitHistory',
                            name: 'submitHistory',
                            component: () => import('@/view/desk/myBid/editorialTasks/submitHistory'),
                            meta: {
                                title: "我的投标",
                                routerIndex: "myBid",
                                requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                            },
                        }
                    ]
                },
                {
                    path: '/desk/information',
                    name: 'information',
                    redirect: '/desk/changePersonal',
                    meta: {
                        title: "用户信息",
                        routerIndex: "information",
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                    component: () => import('@/view/desk/information/index'),
                    children: [{
                        path: '/desk/changePersonal',
                        name: 'changePersonal',
                        component: () => import('@/view/desk/information/changePersonal'),
                        meta: {
                            title: "用户信息",
                            routerIndex: "information",
                            requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                        },
                    },
                        {
                            path: '/desk/yzEmail',
                            name: 'yzEmail',
                            component: () => import('@/view/desk/information/yzEmail'),
                            meta: {
                                title: "用户信息",
                                routerIndex: "information",
                                requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                            },
                        },
                        {
                            path: '/desk/newEmail',
                            name: 'newEmail',
                            component: () => import('@/view/desk/information/newEmail'),
                            meta: {
                                title: "用户信息",
                                routerIndex: "information",
                                requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
                            },
                        },
                        {
                            path: '/desk/yzEmailSuccess',
                            name: 'yzEmailSuccess',
                            component: () => import('@/view/desk/information/yzEmailSuccess'),
                            meta: {
                                title: "用户信息",
                                routerIndex: "information",
                                requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                            },
                        },
                        {
                            path: '/desk/changePassword',
                            name: 'changePassword',
                            component: () => import('@/view/desk/information/changePassword'),
                            meta: {
                                title: "用户信息",
                                routerIndex: "information",
                                requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                            },
                        },
                        {
                            path: '/desk/introduction',
                            name: 'introduction',
                            component: () => import('@/view/desk/information/introduction'),
                            meta: {
                                title: "用户信息",
                                routerIndex: "information",
                                requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                            },
                        },
                        {
                            path: '/desk/changeCompany',
                            name: 'changeCompany',
                            component: () => import('@/view/desk/information/changeCompany'),
                            meta: {
                                title: "用户信息",
                                routerIndex: "information",
                                requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                            },
                        },
                        {
                            path: '/desk/yzPhone',
                            name: 'yzPhone',
                            component: () => import('@/view/desk/information/yzPhone'),
                            meta: {
                                title: "用户信息",
                                routerIndex: "information",
                                requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                            },
                        },
                        {
                            path: '/desk/newPhone',
                            name: 'newPhone',
                            component: () => import('@/view/desk/information/newPhone'),
                            meta: {
                                title: "用户信息",
                                routerIndex: "information",
                                requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                                phoneToken: true
                            },
                        },
                        {
                            path: '/desk/phoneSuccess',
                            name: 'phoneSuccess',
                            component: () => import('@/view/desk/information/phoneSuccess'),
                            meta: {
                                title: "用户信息",
                                routerIndex: "information",
                                requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                                phoneToken: true
                            },
                        },
                    ]
                },
                {
                    path: '/desk/myMessage',
                    name: 'myMessage',
                    component: () => import('@/view/desk/myMessage/myMessage'),
                    meta: {
                        title: "我的消息",
                        routerIndex: "myMessage",
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: '/desk/myComments',
                    name: 'myComments',
                    component: () => import('@/view/desk/myComments/myComments'),
                    meta: {
                        title: "我的评论",
                        routerIndex: "myComments",
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: '/desk/myCollection',
                    name: 'myCollection',
                    component: () => import('@/view/desk/myCollection/myCollection'),
                    meta: {
                        title: "我的收藏",
                        routerIndex: "myCollection",
                        keepAlive: true,
                        deepth: 2,
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: '/desk/issueManage',
                    name: 'issueManage',
                    component: () => import('@/view/desk/issueManage/issueManage'),
                    meta: {
                        title: "缺陷管理",
                        routerIndex: "issueManage",
                        keepAlive: true,
                        deepth: 2,
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: '/desk/issueAdd',
                    name: 'issueAdd',
                    component: () => import('@/view/desk/issueManage/issueAdd'),
                    meta: {
                        title: "缺陷管理",
                        routerIndex: "issueAdd",
                        keepAlive: true,
                        deepth: 2,
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: '/desk/issueEditAppoint',
                    name: 'issueEditAppoint',
                    component: () => import('@/view/desk/issueManage/issueEditAppoint'),
                    meta: {
                        title: "缺陷管理",
                        routerIndex: "issueEditAppoint",
                        keepAlive: true,
                        deepth: 2,
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: '/desk/issueEditCreator',
                    name: 'issueEditCreator',
                    component: () => import('@/view/desk/issueManage/issueEditCreator'),
                    meta: {
                        title: "缺陷管理",
                        routerIndex: "issueEditCreator",
                        keepAlive: true,
                        deepth: 2,
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: '/desk/viewHistory',
                    name: 'viewHistory',
                    component: () => import('@/view/desk/issueManage/viewHistory'),
                    meta: {
                        title: "缺陷管理",
                        routerIndex: "viewHistory",
                        keepAlive: true,
                        deepth: 2,
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: '/desk/issueVisualization',
                    name: 'issueVisualization',
                    component: () => import('@/view/desk/issueManage/issueVisualization'),
                    meta: {
                        title: "缺陷管理",
                        routerIndex: "issueVisualization",
                        keepAlive: true,
                        deepth: 2,
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: '/desk/documentOpinion',
                    name: 'documentOpinion',
                    component: () => import('@/view/desk/issueManage/documentOpinion'),
                    meta: {
                        title: "缺陷管理",
                        routerIndex: "documentOpinion",
                        keepAlive: true,
                        deepth: 2,
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: '/desk/editNeedDesign',
                    name: 'editNeedDesign',
                    component: () => import('@/view/desk/myTask/editNeedDesign'),
                    meta: {
                        title: "缺陷管理",
                        routerIndex: "editNeedDesign",
                        keepAlive: true,
                        deepth: 2,
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: '/desk/editOutlineDesign',
                    name: 'editOutlineDesign',
                    component: () => import('@/view/desk/myTask/editOutlineDesign'),
                    meta: {
                        title: "缺陷管理",
                        routerIndex: "editOutlineDesign",
                        keepAlive: true,
                        deepth: 2,
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: '/desk/editDetailedDesign',
                    name: 'editDetailedDesign',
                    component: () => import('@/view/desk/myTask/editDetailedDesign'),
                    meta: {
                        title: "缺陷管理",
                        routerIndex: "editDetailedDesign",
                        keepAlive: true,
                        deepth: 2,
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: '/desk/opinionSum',
                    name: 'opinionSum',
                    component: () => import('@/view/desk/issueManage/opinionSum'),
                    meta: {
                        title: "缺陷管理",
                        routerIndex: "opinionSum",
                        keepAlive: true,
                        deepth: 2,
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: '/desk/opinionAdd',
                    name: 'opinionAdd',
                    component: () => import('@/view/desk/issueManage/opinionAdd'),
                    meta: {
                        title: "缺陷管理",
                        routerIndex: "opinionAdd",
                        keepAlive: true,
                        deepth: 2,
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: '/desk/opinionView',
                    name: 'opinionView',
                    component: () => import('@/view/desk/issueManage/opinionView'),
                    meta: {
                        title: "缺陷管理",
                        routerIndex: "issueManage",
                        keepAlive: true,
                        deepth: 2,
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: '/desk/myTest',
                    name: 'myTest',
                    component: () => import('@/view/desk/testEmploy/myTest'),
                    meta: {
                        title: "内测管理",
                        routerIndex: "myTest",
                        keepAlive: true,
                        deepth: 2,
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: '/desk/myTestTask',
                    name: 'myTestTask',
                    component: () => import('@/view/desk/testEmploy/myTestTask'),
                    meta: {
                        title: "内测管理",
                        routerIndex: "myTest",
                        keepAlive: true,
                        deepth: 2,
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },

                {
                    path: '/desk/myTestView',
                    name: 'myTestView',
                    component: () => import('@/view/desk/testEmploy/myTestView'),
                    meta: {
                        title: "内测管理",
                        routerIndex: "myTest",
                        keepAlive: true,
                        deepth: 2,
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: '/desk/myTestView&Edit',
                    name: 'myTestView&Edit',
                    component: () => import('@/view/desk/testEmploy/myTestView&Edit'),
                    meta: {
                        title: "内测管理",
                        routerIndex: "myTest",
                        keepAlive: true,
                        deepth: 2,
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: '/desk/testIssueSum',
                    name: 'testIssueSum',
                    component: () => import('@/view/desk/testEmploy/testIssueSum'),
                    meta: {
                        title: "内测管理",
                        routerIndex: "myTest",
                        keepAlive: true,
                        deepth: 2,
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: '/desk/editTest',
                    name: 'editTest',
                    component: () => import('@/view/desk/testEmploy/editTest'),
                    meta: {
                        title: "内测管理",
                        routerIndex: "myTest",
                        keepAlive: true,
                        deepth: 2,
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },

                {
                    path: '/desk/historyView',
                    name: 'historyView',
                    component: () => import('@/view/desk/testEmploy/historyView'),
                    meta: {
                        title: "内测管理",
                        routerIndex: "myTest",
                        keepAlive: true,
                        deepth: 2,
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },

                // {
                //   path: '/desk/testEmploy',
                //   name: 'testEmploy',
                //   component: () => import('@/view/desk/testEmploy/testEmploySquare'),
                //   meta: {
                //     title: "内测招募",
                //     routerIndex: "testEmploy",
                //     keepAlive: true,
                //     deepth: 2,
                //     requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                //   },
                // },

                // {
                //   path: '/desk/testPublish',
                //   name: 'testEmploy',
                //   component: () => import('@/view/desk/testEmploy/testPublish'),
                //   meta: {
                //     title: "内测招募",
                //     routerIndex: "testEmploy",
                //     keepAlive: true,
                //     deepth: 2,
                //     requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                //   },
                // },
                // {
                //   path: '/desk/testView',
                //   name: 'testEmploy',
                //   component: () => import('@/view/desk/testEmploy/testView'),
                //   meta: {
                //     title: "内测招募",
                //     routerIndex: "testEmploy",
                //     keepAlive: true,
                //     deepth: 2,
                //     requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                //   },
                // },


                {
                    path: '/desk/addTestIssue',
                    name: 'addTestIssue',
                    component: () => import('@/view/desk/testEmploy/addTestIssue'),
                    meta: {
                        title: "内测管理",
                        routerIndex: "myTest",
                        keepAlive: true,
                        deepth: 2,
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },


                {
                    path: '/desk/demandendView',
                    name: 'demandendView',
                    component: () => import('@/view/desk/myDemand/demandendView'),
                    meta: {
                        title: "我的需求",
                        routerIndex: "myDemand",
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: '/desk/teamDetails',
                    name: 'teamDetails',
                    component: () => import('@/view/desk/myDemand/teamDetails'),
                    meta: {
                        title: "我的需求",
                        routerIndex: "myDemand",
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: '/desk/selectInformation',
                    name: 'selectInformation',
                    component: () => import('@/view/desk/myDemand/selectInformation'),
                    meta: {
                        title: "我的需求",
                        routerIndex: "myDemand",
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: '/desk/endInformation',
                    name: 'endInformation',
                    component: () => import('@/view/desk/myDemand/endInformation'),
                    meta: {
                        title: "我的需求",
                        routerIndex: "myDemand",
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: '/desk/demandEnd',
                    name: 'demandEnd',
                    component: () => import('@/view/desk/myDemand/demandEnd'),
                    meta: {
                        title: "我的需求",
                        routerIndex: "myDemand",
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: '/desk/demandView',
                    name: 'demandView',
                    component: () => import('@/view/desk/myDemand/demandView'),
                    meta: {
                        title: "我的需求",
                        routerIndex: "myDemand",
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: '/desk/demandScoring',
                    name: 'demandScoring',
                    component: () => import('@/view/desk/myDemand/demandScoring'),
                    meta: {
                        title: "我的需求",
                        routerIndex: "myDemand",
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: '/desk/teamProgress',
                    name: 'teamProgress',
                    component: () => import('@/view/desk/myDemand/teamProgress'),
                    meta: {
                        title: "我的需求",
                        routerIndex: "myDemand",
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: '/desk/teamList',
                    name: 'teamList',
                    component: () => import('@/view/desk/myDemand/teamList'),
                    meta: {
                        title: "我的需求",
                        routerIndex: "myDemand",
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: '/desk/caseSelect',
                    name: 'caseSelect',
                    component: () => import('@/view/desk/myDemand/caseSelect'),
                    meta: {
                        title: "我的需求",
                        routerIndex: "myDemand",
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: '/desk/teamSelect',
                    name: 'teamSelect',
                    component: () => import('@/view/desk/myDemand/teamSelect'),
                    meta: {
                        title: "我的需求",
                        routerIndex: "myDemand",
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: '/desk/overCompetition',
                    name: 'overCompetition',
                    component: () => import('@/view/desk/myDemand/overCompetition'),
                    meta: {
                        title: "我的需求",
                        routerIndex: "myDemand",
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: '/desk/myDemand',
                    name: 'myDemand',
                    component: () => import('@/view/desk/myDemand/myDemand'),
                    meta: {
                        title: "我的需求",
                        routerIndex: "myDemand",
                        keepAlive: true,
                        deepth: 2,
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: '/desk/schedule',
                    name: 'schedule',
                    component: () => import('@/view/desk/myDemand/schedule'),
                    meta: {
                        title: "我的需求",
                        routerIndex: "myDemand",
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: '/desk/resource',
                    name: 'resource',
                    component: () => import('@/view/desk/myDemand/resource'),
                    meta: {
                        title: "我的需求",
                        routerIndex: "myDemand",
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: '/desk/viewDelivery',
                    name: 'viewDelivery',
                    component: () => import('@/view/desk/myDemand/viewDelivery'),
                    meta: {
                        title: "我的需求",
                        routerIndex: "myDemand",
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: '/desk/download',
                    name: 'download',
                    component: () => import('@/view/desk/myDemand/download'),
                    meta: {
                        title: "我的需求",
                        routerIndex: "myDemand",
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: '/desk/demandPublish',
                    name: 'demandPublish',
                    component: () => import('@/view/desk/myDemand/demandPublish'),
                    meta: {
                        title: "我的需求",
                        routerIndex: "myDemand",
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: '/desk/teamApplication',
                    name: 'teamApplication',
                    component: () => import('@/view/desk/teamApplication/teamApplication'),
                    meta: {
                        title: "团队申请",
                        routerIndex: "teamApplication",
                        keepAlive: true,
                        deepth: 2,
                        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
                    },
                }
            ]
        }
    ],
});
/**为新开启的标签页/窗口复制原来的sessionStorage并通过setLogin函数恢复store*/
const shareSessionStorage = function (to) {
    if (!sessionStorage.length) {// 这个调用能触发目标事件，从而达到共享数据的目的
        localStorage.setItem('getSessionStorage', Date.now() + '');//Date.now()+''没有特殊的意义，就是随便存的1个值
    }
    // 该事件是核心
    window.addEventListener('storage', function (event) {
        if (event.key === 'getSessionStorage') { // 已存在的标签页会收到这个事件
            localStorage.setItem('sessionStorage', JSON.stringify(sessionStorage));
            localStorage.removeItem('sessionStorage');

        } else if (event.key === 'sessionStorage' && !sessionStorage.length) { // 新开启的标签页会收到这个事件
            let data = JSON.parse(event.newValue);
            for (let key in data) {
                sessionStorage.setItem(key, data[key]);
            }
            store.commit('setLogin', to);
        }
    });
};
/**根据rolename判断permissionList里是否有rolename所对应的权限*/
const hasPermission = function (permissionList, roleName) {
    for (let item of permissionList) {
        if (item.name.indexOf(roleName) !== -1) {
            return true;
        }
    }
    return false
}

/**拦截评审系统中非法的访问,用户没有评审管理员和专家的角色时候是不允许访问相关页面的*/
const filterInvalidRequestForReview = function (to, from, next) {
    const permissionList = JSON.parse(sessionStorage.getItem("reviewPermissionList"));//用户拥有的评审权限
    if (to.meta.hasEditorRole === true) {
        if (hasPermission(permissionList, "管理员")) {
            next();
        } else {
            errTips("您没有评审管理员角色！");
            next({
                path: from.fullPath
            });
        }
    } else if (to.meta.hasExpertRole === true) {
        if (hasPermission(permissionList, "专家")) {
            next();
        } else {
            errTips("您没有评审专家角色！");
            next({
                path: from.fullPath
            });
        }
    } else {
        next();
    }
}
vueRouter.beforeEach((to, from, next) => {
    // shareSessionStorage(to);
    document.title = to.meta.title;
    if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
        if (sessionStorage.getItem('userToken')) { // 通过vuex state获取当前的token是否存在

            if (to.meta.phoneToken) {
                if (sessionStorage.getItem('mobileToken')) {
                    // next();
                } else {
                    next({
                        path: '/desk/yzPhone',
                    })
                }
            } else if (store.state.userData.role === '1') {
                if (to.name === "changeCompany") {
                    next({
                        path: '/desk/personal',
                    })
                } //else {
                //     next()
                // }
            } else if (store.state.userData.role === '2') {
                if (to.name === "changePersonal") {
                    next({
                        path: '/desk/changeCompany',
                    })
                } else if (to.name === "introduction") {
                    next({
                        path: '/desk/changeCompany',
                    })
                }// else {
                //     next();
                // }
            } //else {
            //     next();
            // }

            //上面注释里的next()函数的调用改在了filterInvalidRequestForReview函数里。
            filterInvalidRequestForReview(to, from, next);
        } else {
            store.commit('intercept', to.fullPath);
            next({
                path: '/login',
            })
        }

    } else {
        next();
    }
})
/*解决导航栏重复点击出现的报错 Avoided redundant navigation to current location*/
// const originalPush = vueRouter.prototype.push;
// vueRouter.prototype.push = function push(location){
// 	return originalPush.call(this, location).catch(err => err)
// }
export default vueRouter
