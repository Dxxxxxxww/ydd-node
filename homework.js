class A {
	constructor() {
		this.nameA = 'a'
	}
	validateA() {
		console.log('A')
	}
}

class B extends A {
	constructor() {
		super()
		this.nameB = 'b'
	}

	validateB() {
		console.log('B')
	}
}

class C extends B {
	constructor() {
		super()
		this.nameC = 'c'
	}

	validateC() {
		console.log('C')
	}
}

//老师版本
// function findMembers(instance, fieldPrefix, funcPrefix) {

//     // 递归函数
//     function _find(instance) {
//          //基线条件（跳出递归）
//         if (instance.__proto__ === null)
//             return []

//         let names = Reflect.ownKeys(instance)
//         names = names.filter((name)=>{
//             // 过滤掉不满足条件的属性或方法名
//             return _shouldKeep(name)
//         })

//         return [...names, ..._find(instance.__proto__)]
//     }

//     function _shouldKeep(value) {
//         if (value.startsWith(fieldPrefix) || value.startsWith(funcPrefix))
//             return true
//     }

//     return _find(instance)
// }

var c = new C()

// 编写一个函数findMembers 自己版本
function findMembers(instance, propPrefix, funcPrefix) {
	const members = []
	function _find(o) {
		//递归基线
		if (o.__proto__ == null) return 
		//使用 getOwnPropertyNames 而非 for in 直接循环是因为 for in 只能遍历自身及原型链上的可遍历属性
		//而方法不可遍历
		/*顺便复习
      Object.keys()：返回对象自身的所有可枚举的属性的键名。
      for...in循环：只遍历对象自身的和继承的可枚举的属性。
      getOwnPropertyNames: 只遍历自身上的属性，包括不可枚举。
    */
		const keys = Object.getOwnPropertyNames(o)
		for (const k of keys) {
			if (k.startsWith(propPrefix) || k.startsWith(funcPrefix)) {
				members.push(k)
			}
		}
		//尾递归优化
		return _find(o.__proto__)
	}
	_find(instance)
	return members
}
const members = findMembers(c, 'name', 'validate')
console.log(members)

// 原型链 查找
