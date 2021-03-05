
let publicPath = "/";
if(process.env.NODE_ENV==="test"){
    publicPath = "/cosine/dist";
}else if(process.env.NODE_ENV==="production"){
    publicPath = "./"
}
module.exports = {
    publicPath:  publicPath
}