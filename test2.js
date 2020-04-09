// js 序列化
const obj = {
  name: 'dxx',
  age: 24,
  // 每一个对象如果定义了 toJSON 方法的话，JSON.stringify 序列化的对象就会变成 toJSON 方法返回结果
  toJSON() {
    return {
      name1: 'dxw'
    }
  }
}
console.log(JSON.stringify(obj))
