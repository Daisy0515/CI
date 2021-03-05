
let publicPath = "/";
if(process.env.NODE_ENV==="production"){
    if(process.env.VUE_APP_CURRENTMODE === "test"){
        publicPath = "/cosine/dist";
    }else if(process.env.VUE_APP_CURRENTMODE === "production"){
        publicPath = "./"
    }
}
module.exports = {
    publicPath:  publicPath
}