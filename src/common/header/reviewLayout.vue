<template>
  <div class="header_two">
    <nav class="c-header c-header--solid">
      <div class="o-container deskHeader clearfix">
        <div class="c-header__row">
          <div class="c-header__logowrap">
            <router-link :to="indexUrl">
              <div id="topnav-gurulogo" v-bind:href="indexUrl" style="display:block">
                <title id="logo-title">{{title}}</title>
                <img :src="logoUrl">
              </div>
            </router-link>
          </div>
          <!-- <ul class="c-header__navigation clearfix">
            <li class="c-header__navigation__item" v-for="item in items" :key="item.title">
              <router-link
                ondragstart="return false"
                @click.native="setHeader(item.url)"
                :class="getHeader===item.url?'header_active':''"
                :to="item.url"
              >{{item.title}}</router-link>
            </li>
          </ul> -->
          <HeadUser/>
        </div>
      </div>
	  
    </nav>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import HeadUser from "@/common/headUser/headUser";
export default {
  components: {
    HeadUser
  },
  props: ["imageUrl"],
  name: "myheader",
  data: function() {
    return {
      title: "群智化平台",
      logoUrl: require("@/assets/img/homepage/logo.png"),
      indexUrl: "/index",
      headActive: "工作台",
      items: [
        {
          title: "工作台",
          url: "project"
        },
        {
          title: "我的需求",
          url: "myDemand"
        },
        {
          title: "我的投标",
          url: "myBid"
        },
        {
          title: "我的任务",
          url: "myTask"
        },
        {
          title: "团队申请",
          url: "teamApplication"
        },

        
      ],
      loginUrl: "login",
      registerUrl: "selectRole"
    };
  },
  created: function() {
    let routerName = this.$router.currentRoute.meta.routerIndex;
    this.setHeader(routerName);
  },
  watch: {
    $route() {
      let routerName = this.$router.currentRoute.meta.routerIndex;
      this.setHeader(routerName);
    }
  },
  computed: {
    ...mapGetters(["getHeader"])
  },
  methods: {
    tiaoDesk() {
      this.setHeader("project");
    },
    ...mapMutations(["setHeader"])
  }
};
</script>
<style lang="scss">
.useCard_two {
  .Userremind {
    margin: -12px;
    a {
      color: black;
    }
    .UserremindItem {
      padding: 10px 15px 10px 15px;
      cursor: pointer;
      &:hover {
        background: #e8e8e8;
      }
    }
  }
}
.header_two {
  .userImg {
    float: right;
    width: 65px;
    .icon-xiaoxi {
      cursor: pointer;
      font-size: 26px;
      color: white;
      transition: all 0.4s;
      float: left;
      margin-top: 4px;
      &:hover {
        color: rgba(0, 0, 0, 0.74);
      }
    }
    img {
      margin-top: 3px;
      &:hover {
        cursor: pointer;
      }
    }
  }
  a {
    color: white;
    font-weight: 400;
    width: 100px;
    font-size: 14px;
    &:hover {
      border-bottom: 1.9px solid white;
      padding-bottom: 10px;
    }
  }
  .login_two {
    border: 1px solid #fff;
    padding: 5px 13px 5px 13px;
    margin-right: 10px;
    border-radius: 3px;
    &:hover {
      background: #426ea1;
    }
  }
  .register_two {
    background: white;
    color: black;
    padding: 5px 13px 5px 13px;
    border: 1px solid #fff;
    border-radius: 3px;
    &:hover {
      background: #e8e8e8;
    }
  }
  .c-header {
    -webkit-box-shadow: 0 1px 0 rgba(255, 255, 255, 0.2);
    box-shadow: 0 1px 0 rgba(255, 255, 255, 0.2);
    width: 100%;
    z-index: 100;
  }
  .c-header--fixed,
  .c-header--solid {
    background: #4478b4;
  }
  .c-header__row {
    height: 70px;
    padding-top: 20px;
    box-sizing: border-box;
  }
  .c-header__logowrap {
    border: 0;
    height: 30px;
    width: 130px;
    outline: 0;
    margin-right: auto;
    float: left;
  }
  .c-header__logo {
    width: 130px;
    height: 30px;
    fill: #333;
  }
  .c-header__options {
    float: right;
    width: 65px;
    img {
      width: 27px;
      height: 27px;
      border-radius: 50%;
      margin-left: 10px;
    }
  }
  .c-header__options__signin {
    display: inline-block;
  }
  .c-header__navigation {
    width: 940px;
    float: left;
    text-align: center;
    list-style: none;
  }
  .c-header__navigation__item {
    padding: 0 15px 0 15px;
    display: inline-block;
    vertical-align: middle;
    height: 100%;
    font-size: 14px;
    font-weight: 600;
  }
  .header_active {
    border-bottom: 1.9px solid white;
    padding-bottom: 10px;
    // background: #0760c5;
  }
  .c-header--transparent:not(.c-header--fixed) {
    position: absolute;
  }
  .c-header--transparent:not(.c-header--fixed) .c-header__navigation__item a {
    color: #fff;
    text-shadow: 0 0 1px rgba(0, 0, 0, 0.9);
  }
  .c-header--transparent:not(.c-header--fixed) .c-header__options__join {
    border-color: #fff;
    background-color: #fff;
    color: #444;
    font-weight: 400;
  }
  .c-header--transparent:not(.c-header--fixed) .c-header__options__join:hover {
    background-color: #4c83c3;
    border-color: #4c83c3;
    color: #fff;
  }
  .c-header--transparent:not(.c-header--fixed) .c-header__options__signin {
    background-color: transparent;
    border: 1px solid #fff;
    color: #fff;
  }
  .c-header--transparent:not(.c-header--fixed)
    .c-header__options__signin:hover {
    background-color: #fff;
    color: #444;
  }
  .c-header--breadcrumbs .c-header__logowrap {
    margin-right: 2rem;
  }
  .c-header--breadcrumbs .c-header__breadcrumb,
  .c-header--breadcrumbs .c-header__breadcrumb a {
    font-size: 14px;
    font-size: 0.875rem;
    color: #fff;
    text-shadow: 0 0 1px rgba(0, 0, 0, 0.9);
  }
  .c-header--breadcrumbs .mobileBreadcrumb {
    display: block;
  }
  .c-header--breadcrumbs .fullscreenBreadcrumb {
    display: none;
  }
}
</style>