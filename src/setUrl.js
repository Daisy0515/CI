let api = ""; // 访问后台接口的根地址
let oauthHomePageUrl = ""; //第三方授权跳转地址的根地址,需要与第三方平台同步,例如:github中设置的是"http://localhost:8080",那么项目里也要设置成"http://localhost:8080"
let weiboOauthUrl = ""; //weibo地址的本地连接不允许使用localhost，所以有点特殊，单独设置
let publicPath = "";    //针对vue router使用的history模式进行的设置，与vue.config.js里的publicPath中的路径一致
if (process.env.NODE_ENV === 'development') {//使用npm run serve 在本地运行项目
    api = "http://120.79.19.115:8083/cosine-core-web-api/";
    // api = "http://localhost:8086/cosine-core-web-api/" //本地测试环境
    oauthHomePageUrl = "http://localhost:8080/";
    weiboOauthUrl = "http://127.0.0.1:8080/"; //weibo的地址设置有点特殊，不允许使用locahost
    publicPath = "/";
} else if (process.env.NODE_ENV === 'production') {
    if (process.env.VUE_APP_CURRENTMODE === "test") {//使用npm run test 打包项目 对应测试环境
        api = "http://120.79.19.115:8083/cosine-core-web-api/";
        oauthHomePageUrl = "http://120.79.19.115:8083/cosine/dist/";
        weiboOauthUrl = oauthHomePageUrl;
        publicPath = "/cosine/dist/";
    } else if (process.env.VUE_APP_CURRENTMODE === "production") {//使用npm run build 打包项目 对应正式环境
        api = "http://8.129.186.75:8083/cosine-core-web-api/";
        oauthHomePageUrl = "http://www.cosinehub.cn/";
        weiboOauthUrl = oauthHomePageUrl;
        publicPath = "./";
    }
}
export {api, oauthHomePageUrl, weiboOauthUrl, publicPath};