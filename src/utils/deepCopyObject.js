/**数组和对象的深拷贝**/
function deepCopyObject(obj){
    if(obj===null||typeof(obj)!== "object"){
        return obj;
    }
    let newObj = null;
    if(obj instanceof(Array)){ //注意要先判断是不是Array对因为是array也会是对象
        newObj = [];
    }else{
        newObj = {};
    }
    for(const key in obj){
        newObj[key] = deepCopyObject(obj[key]);
    }
    return newObj;
};
export default deepCopyObject;
