import Vue from 'vue'
import Router from 'vue-router'
import index from '@/view/home/index/index'
import homePublic from '@/view/home/homePublic/homePublic'
import managerPublic from '@/view/review/reviewPublic/managerPublic'
import publisherPublic from '@/view/review/reviewPublic/publisherPublic'
import store from '@/store/index.js'
Vue.use(Router)
const vueRouter = new Router({
  routes: [{
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
		path:'/',
		name:'managerPublic',
		component:managerPublic,
		redirect:'index',//??
		children:[{
			path:'/managerIndex',
			name:'managerIndex',
			component:() => import('@/view/review/manager/managerIndex'),
			meta:{
				title:'首页',
			}
			
		},
		{
			path:'/managerNotAccept',
			name:'managerNotAccept',
			component:() => import('@/view/review/manager/notAccept'),
			meta:{
				title:'未接受',
			}
		},
		{
			path:'/managerRollback',
			name:'managerRollback',
			component:() => import('@/view/review/manager/rollback'),
			meta:{
				title:'打回中',
			}
		},
		{
			path:'/managerReview',
			name:'managerReview',
			component:() => import('@/view/review/manager/review'),
			meta:{
				title:'评审中',
			}
		},
		{
			path:'/managerComplete',
			name:'managerComplete',
			component:() => import('@/view/review/manager/complete'),
			meta:{
				title:'已完成',
			}
		},
		
		{
			path:'/managerDraft',
			name:'managerDraft',
			component:() => import('@/view/review/manager/draft'),
			meta:{
				title:'草稿箱',
			}
		}]
		
	},
    {
    	path:'/',
    	name:'publisherPublic',
    	component:publisherPublic,
    	redirect:'index',//??
    	children:[{
    		path:'/publisherIndex',
    		name:'publisherIndex',
    		component:() => import('@/view/review/publisher/publisherIndex'),
    		meta:{
    			title:'首页',
    		}
    		
    	},
    	{
    		path:'/publisherNotAccept',
    		name:'publisherNotAccept',
    		component:() => import('@/view/review/publisher/notAccept'),
    		meta:{
    			title:'未接受',
    		}
    	},
    	{
    		path:'/publisherRollback',
    		name:'publisherRollback',
    		component:() => import('@/view/review/publisher/rollback'),
    		meta:{
    			title:'打回中',
    		}
    	},
    	{
    		path:'/publisherReview',
    		name:'publisherReview',
    		component:() => import('@/view/review/publisher/review'),
    		meta:{
    			title:'评审中',
    		}
    	},
    	{
    		path:'/publisherComplete',
    		name:'publisherComplete',
    		component:() => import('@/view/review/publisher/complete'),
    		meta:{
    			title:'已完成',
    		}
    	},
    	{
    		path:'/publisherDraft',
    		name:'publisherDraft',
    		component:() => import('@/view/review/publisher/draft'),
    		meta:{
    			title:'草稿箱',
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
          redirect:'/toolset',
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
		  name: 'editOutlineDesign',
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
		  path: '/desk/viewDetailedDesign',
		  name: 'viewDetailedDesign',
		  component: () => import('@/view/desk/myTask/viewDetailedDesign'),
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
          name: 'issueManage',
          component: () => import('@/view/desk/issueManage/issueAdd'),
          meta: {
            title: "缺陷管理",
            routerIndex: "issueManage",
            keepAlive: true,
            deepth: 2,
            requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
          },
        },
        {
          path: '/desk/issueEditAppoint',
          name: 'issueManage',
          component: () => import('@/view/desk/issueManage/issueEditAppoint'),
          meta: {
            title: "缺陷管理",
            routerIndex: "issueManage",
            keepAlive: true,
            deepth: 2,
            requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
          },
        },
        {
          path: '/desk/issueEditCreator',
          name: 'issueManage',
          component: () => import('@/view/desk/issueManage/issueEditCreator'),
          meta: {
            title: "缺陷管理",
            routerIndex: "issueManage",
            keepAlive: true,
            deepth: 2,
            requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
          },
        },
        {
          path: '/desk/viewHistory',
          name: 'issueManage',
          component: () => import('@/view/desk/issueManage/viewHistory'),
          meta: {
            title: "缺陷管理",
            routerIndex: "issueManage",
            keepAlive: true,
            deepth: 2,
            requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
          },
        },
		{
		  path: '/desk/issueVisualization',
		  name: 'issueManage',
		  component: () => import('@/view/desk/issueManage/issueVisualization'),
		  meta: {
		    title: "缺陷管理",
		    routerIndex: "issueManage",
		    keepAlive: true,
		    deepth: 2,
		    requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
		  },
		},
		{
		  path: '/desk/documentOpinion',
		  name: 'issueManage',
		  component: () => import('@/view/desk/issueManage/documentOpinion'),
		  meta: {
		    title: "缺陷管理",
		    routerIndex: "issueManage",
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
		    routerIndex: "issueManage",
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
		    routerIndex: "issueManage",
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
		    routerIndex: "issueManage",
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
		    routerIndex: "issueManage",
		    keepAlive: true,
		    deepth: 2,
		    requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
		  },
		},
		{
		  path: '/desk/opinionAdd',
		  name: 'issueManage',
		  component: () => import('@/view/desk/issueManage/opinionAdd'),
		  meta: {
		    title: "缺陷管理",
		    routerIndex: "issueManage",
		    keepAlive: true,
		    deepth: 2,
		    requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
		  },
		},
		{
		  path: '/desk/opinionView',
		  name: 'issueManage',
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
})
vueRouter.beforeEach((to, from, next) => {
  // store.commit("login")
  document.title = to.meta.title
  if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
    if (sessionStorage.getItem('userToken')) { // 通过vuex state获取当前的token是否存在
      if (to.meta.phoneToken) {
        if (sessionStorage.getItem('mobileToken')) {
          next();
        } else {
          next({
            path: '/desk/yzPhone',
          })
        }
      } else if (store.state.userData.role == '1') {
        if (to.name == "changeCompany") {
          next({
            path: '/desk/personal',
          })
        } else {
          next()
        }
      } else if (store.state.userData.role == '2') {
        if (to.name == "changePersonal") {
          next({
            path: '/desk/changeCompany',
          })
        } else if (to.name == "introduction") {
          next({
            path: '/desk/changeCompany',
          })
        } else {
          next()
        }
      } else {
        next();
      }
    } else {
      store.commit('intercept', to.fullPath)
      next({
        path: '/login',
      })
    }
  } else {
    next();
  }
})
export default vueRouter