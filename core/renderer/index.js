// n1: oldVnode
// n2: newVnode
export function diff(n1, n2){
  console.log('diff:', n1, n2);
  // 1. tag
  if(n1.tag !== n2.tag){
    n1.el.replaceWith(document.createElement(n2.tag));
  }else{
    const el = (n2.el = n1.el);
    // 2. props
    const {props: newProps} = n2;
    const {props: oldProps} = n1;

    if(newProps && oldProps){
      Object.keys(newProps).forEach((key) => {
        const newVal = newProps[key];
        const oldVal = oldProps[key];
        if(newVal !== oldVal){
          n1.el.setAttribute(key, newVal);
        }
      })
    }

    if(oldProps){
      Object.keys(oldProps).forEach((key) => {
        if(!newProps[key]){
          n1.el.removeAttribute(key);
        }
      })
    }
  }

  // 3. children -> (这里只用暴力解法，优化的话可以看源码)
  //    1. newChildren -> string (oldChildren -> string oldChildren -> Array)
  //    2. newChildren -> Array (oldChildren -> string oldChildren -> Array)
  const { children: oldChildren } = n1
  const { children: newChildren } = n2
  if(typeof newChildren === 'string'){
    if(typeof oldChildren === 'string'){
      if(newChildren !== oldChildren){
        el.textContent = newChildren
      }
    } else if (Array.isArray(oldChildren)){
      el.textContent = newChildren
    }
  }else if(Array.isArray(newProps)){
    if(typeof oldChildren === 'string'){
      el.innerText = ``;
      mountElement(n2, el);
    }else if(Array.isArray(oldChildren)){
      const length = Math.min(newChildren, oldChildren);

      // 处理公共的
      for(let i=0; i < length; i++){
        const newVnode = newChildren[i];
        const oldVnode = oldChildren[i];
        diff(oldVnode, newVnode);
      }

      // 处理添加
      if(newChildren > length){
        // 创建节点
        for (let index = length; index < newChildren.length; index++) {
          const newVnode = newChildren[index];
          mountElement(newVnode);
        }
      }

      // 处理删除
      if(oldChildren.length > length){
        for (let index = length; index < oldChildren.length; index++) {
          const oldVnode = oldChildren[index];
          oldVnode.el.parent.removeChild(oldVnode.el);
          
        }
      }
    }
  }
}


// vnod -> dom
export function mountElement(vnode, container) {
  const { tag, props, children } = vnode;

  // tag
  const el = (vnode.el = document.createElement(tag));

  // props
  if(props){
    for (const key in props) {
      const val = props[key];
      el.setAttribute(key, val);
    }
  }

  // children
  if(typeof children === 'string'){
    // 1. 接收一个字符串类型 string
    const textNode = document.createTextNode(children);
    el.append(textNode);
  }else if(Array.isArray(children)){
    // 2. 可以接收一个数组
    children.forEach((v) => {
      mountElement(v, el);
    })
  }
  // 插入
  container.appendChild(el);
}