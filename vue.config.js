const CompressionPlugin = require("compression-webpack-plugin")

let publicPath = "/";
if(process.env.NODE_ENV==="production"){
    if(process.env.VUE_APP_CURRENTMODE === "test"){
        publicPath = "/cosine/dist";
    }else if(process.env.VUE_APP_CURRENTMODE === "production"){
        publicPath = "./"
    }
}
module.exports = {
    publicPath:  publicPath,
    productionSourceMap: false,
    configureWebpack:config=>{
        if(process.env.NODE_ENV==="production"){
            return {
                plugins:[
                    new CompressionPlugin({
                        test: /\.(js|css)(\?.*)?$/i,//需要压缩的文件正则
                        threshold: 5120,//文件大小大于这个值时启用压缩
                        deleteOriginalAssets: false//压缩后保留原文件
                    })
                ]
            }
        }
    }
}