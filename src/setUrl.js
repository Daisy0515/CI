let api = ""; // 访问后台接口的根地址
let oauthHomePageUrl = ""; //第三方授权跳转地址的根地址,需要与第三方平台同步,例如:github中设置的是"http://localhost:8080",那么项目里也要设置成"http://localhost:8080"
let weiboOauthUrl = "";
switch(process.env.NODE_ENV){
    case 'development':  //使用npm run serve 在本地运行项目
        api = "http://120.79.19.115:8083/cosine-core-web-api/";
        // api = "http://localhost:8086/cosine-core-web-api/" //本地测试环境
        oauthHomePageUrl = "http://localhost:8080";
        weiboOauthUrl = "http://127.0.0.1:8080/"; //weibo的地址设置有点特殊，不允许使用locahost
        break;
    case 'test': //使用npm run test 打包项目 对应测试环境
        api = "http://120.79.19.115:8083/cosine-core-web-api/";
        oauthHomePageUrl = "http://120.79.19.115:8083/cosine/dist/";
        weiboOauthUrl = oauthHomePageUrl;
        break;
    case 'production': //使用npm run build 打包项目 对应正式环境
        api = "http://8.129.186.75:8083/cosine-core-web-api/";
        oauthHomePageUrl = "http://www.cosinehub.cn/";
        weiboOauthUrl = oauthHomePageUrl;
        break;
}
export  {api, oauthHomePageUrl,weiboOauthUrl};