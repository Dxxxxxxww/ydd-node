const jwt = require('jsonwebtoken')
/**
 * @description 在原型链上查找属性，方法
 */
const findMembers = function (instance, {
    prefix,
    specifiedType,
    filter
}) {
    // 递归函数
    function _find(instance) {
        //基线条件（跳出递归）
        if (instance.__proto__ === null)
            return []

        let names = Reflect.ownKeys(instance)
        names = names.filter((name) => {
            // 过滤掉不满足条件的属性或方法名
            return _shouldKeep(name)
        })

        return [...names, ..._find(instance.__proto__)]
    }

    function _shouldKeep(value) {
        if (filter) {
            if (filter(value)) {
                return true
            }
        }
        if (prefix)
            if (value.startsWith(prefix))
                return true
        if (specifiedType)
            if (instance[value] instanceof specifiedType)
                return true
    }

    return _find(instance)
}
/**
 * @description 生成 token
 * @param {*} uid 用户id
 * @param {*} scope 作用域
 */
const generateToken = function(uid, scope){
    const secretKey = global.config.security.secretKey
    const expiresIn = global.config.security.expiresIn
    //sign 第一个参数：自定义信息
    //第二个参数：私有钥匙
    //第三个参数：可选配置项
    const token = jwt.sign({
        uid,
        scope
    },secretKey,{
        expiresIn
    })
    return token
}



module.exports = {
    findMembers,
    generateToken,
}



// const generateToken = function (uid, scope) {
//     const secretKey = global.config.security.secretKey
//     const expiresIn = global.config.security.expiresIn
//     const token = jwt.sign({
//         uid,
//         scope
//     }, secretKey, {
//         expiresIn: expiresIn
//     })
//     return token
// }