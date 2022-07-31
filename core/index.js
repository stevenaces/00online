import { effectWatch } from "./reactivity/index.js";
import { mountElement, diff } from './renderer/index.js'

export function createApp(rootComponent){
  return {
    mount(rootContainer) {
      const context = rootComponent.setup();

      let isMounted = false;
      let preSubTree;

      effectWatch(() => {
        // const element = rootComponent.render(context);
        if(!isMounted) {
          // init
          isMounted = true;
          rootContainer.innerHTML = ``;
          const subTree = rootComponent.render(context);
          preSubTree = subTree;
          console.log('subTree:', subTree);
          mountElement(subTree, rootContainer);
        }else{
          // diff 算法 newdom vs olddom
          // update
          const subTree = rootComponent.render(context);
          diff(preSubTree, subTree);
          preSubTree = subTree;
        }
        
        // rootContainer.append(element);
      })
    },
  }
}