// //本地环境
// let api = "http://120.79.19.115:8083/cosine-core-web-api/"; // 访问后台接口的根地址
// let api = "http://localhost:8087/cosine-core-web-api/" //本地测试环境
// let oauthHomePageUrl = "http://localhost:8080/"; //第三方授权跳转地址的根地址,需要与第三方平台同步,例如:github中设置的是"http://localhost:8080",那么项目里也要设置成"http://localhost:8080"
// let weiboOauthUrl = "http://127.0.0.1:8080/"; //weibo地址的本地连接不允许使用localhost，所以有点特殊，单独设置
// let publicPath = "/";    //针对vue router使用的history模式进行的设置，与vue.config.js里的publicPath中的路径一致

// //测试环境
// let api = "http://120.79.19.115:8083/cosine-core-web-api/"; // 访问后台接口的根地址
// let oauthHomePageUrl = "http://120.79.19.115:8083/cosine/dist/"; //第三方授权跳转地址的根地址,需要与第三方平台同步,例如:github中设置的是"http://localhost:8080",那么项目里也要设置成"http://localhost:8080"
// let weiboOauthUrl = oauthHomePageUrl; //weibo地址的本地连接不允许使用localhost，所以有点特殊，单独设置
// let publicPath = "/cosine/dist/";    //针对vue router使用的history模式进行的设置，与vue.config.js里的publicPath中的路径一致

//正式环境
let api = "/cosine-core-web-api/"; // 访问后台接口的根地址
let oauthHomePageUrl = "https://www.cosinehub.cn/"; //第三方授权跳转地址的根地址,需要与第三方平台同步,例如:github中设置的是"http://localhost:8080",那么项目里也要设置成"http://localhost:8080"
let weiboOauthUrl = oauthHomePageUrl; //weibo地址的本地连接不允许使用localhost，所以有点特殊，单独设置
let publicPath = "/";    //针对vue router使用的history模式进行的设置，与vue.config.js里的publicPath中的路径一致


export {api, oauthHomePageUrl, weiboOauthUrl, publicPath};