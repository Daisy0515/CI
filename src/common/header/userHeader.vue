<template>
  <div class="header_three">
    <nav class="c-header c-header--solid">
      <div class="o-container">
        <div class="c-header__row">
          <div class="c-header__logowrap">
            <router-link :to="indexUrl">
              <a id="topnav-gurulogo" v-bind:href="indexUrl" style="display:block">
                <title id="logo-title">{{title}}</title>
                <img :src="logoUrl">
              </a>
            </router-link>
          </div>
          <ul class="c-header__navigation">
            <li class="c-header__navigation__item" v-for="item in items" :key="item.title">
              <router-link :to="item.url">
                <a v-bind:href="item.url" v-bind:title="title">{{item.title}}</a>
              </router-link>
            </li>
          </ul>
          <div class="c-header__options">
            <router-link :to="loginUrl" class="login_two">
              登入
            </router-link>
            <router-link :to="registerUrl" class="register_two">
              注册
            </router-link>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>
<script>
export default {
  name: "myheader",
  data: function() {
    return {
      title: "群智化平台",
      logoUrl: require("@/assets/img/homepage/logo.png"),
      indexUrl: "index",
      items: [
        {
          title: "招标投标",
          url: "roleSelection"
        },
        {
          title: "经典案例",
          url: "classicCase"
        },
        {
          title: "服务共享",
          url: "toolset"
        },
        {
          title: "联系我们",
          url: "feature"
        }
      ],
      loginUrl: "login",
      registerUrl: "selectRole"
    };
  },
  methods: {}
};
</script>
<style lang="scss">
.header_three {
  a {
    color: white;
    font-weight: 400;
    font-size: 14px;
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
    padding: 0;
    width: 100%;
    z-index: 100;
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

  .c-header--fixed,
  .c-header--solid {
    background: #4c83c3;
  }

  .c-header__logo {
    width: 130px;
    height: 30px;
    fill: #333;
  }

  .c-header__options {
	width: 150px;
	margin-left: auto;
	float: right;
  }

  .c-header__options__signin {
    display: inline-block;
  }

  .c-header__navigation {
		width: 650px;
		float: left;
		text-align: center;
  }
  .c-header__navigation__item {
    font-size: 14px;
    display: inline-block;
    padding: 0 16px 0 16px;
    font-weight: 600;
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