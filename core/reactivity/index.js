/**
 * 1. ref
 */
let currentEffect;
class Dep {
  constructor(value){
    this.effects = new Set();
    this._value = value;
  }

  get value(){
    this.depend()
    return this._value;
  }

  set value(newValue){
    this._value = newValue;
    this.notice();
  }

  // 1. 收集依赖
  depend(){
    if(currentEffect){
      this.effects.add(currentEffect);
    }
  }

  // 2. 更新依赖
  notice(){
    // 触发我们之前收集来的依赖
    this.effects.forEach( effect => {
      effect();
    })
  }
}

export function effectWatch(effect) {
  currentEffect = effect;   // 保存依赖
  effect()    // 在执行这里的时候，就已经收集依赖了
  currentEffect = null;
}

// const a = new Dep(10)
// let b;

// effectWatch(() => {
//   b = a.value + 10;
//   console.log('b:', b);
// })

// // 值发生变化
// a.value = 20;
// a.notice()

/**
 * 2. reactive
 */

const targetMap = new Map();

function getDep(target, key){
  
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Dep();
    depsMap.set(key, dep);
  }
  return dep;
}

export function reactive(raw){
  return new Proxy(raw, {
    get(target, key){
      // key -> dep 收集依赖到哪里？

      const dep = getDep(target, key);

      dep.depend();

      return Reflect.get(target, key)
    },

    set(target, key, value){
      // 触发依赖

      // 获取依赖
      const dep = getDep(target, key);

      const result = Reflect.set(target, key, value);
       
      dep.notice();

      return result;
    }
  })
}

// const user = reactive({
//   age: 19,
// })
// let double;

// console.log(user.age);
// effectWatch(() => {
//   console.log('---reactive---');
//   double = user.age;
//   console.log('double', double)
// })

// // 值改变
// user.age = 20