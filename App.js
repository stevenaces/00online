import { effectWatch, reactive} from './core/reactivity/index.js'
import { h } from './core/h.js'

// vue3
export default {
  // template -> render
  render(context) {
    // 构建 view = b

    /* 
    effectWatch(() => {
      // view 每次都要重新创建
      // 要计算出最小的更新点 引入 vdom
      // js --> diff

      // reset
      // document.body.innerText = ``;

      const div = document.createElement('div');
      div.innerText = context.state.count;

      // root
      document.body.appendChild(div);
    })
    */

    // const div = document.createElement('div');
    // div.innerText = context.state.count;

    // return div;

    // return h('div', {id: 'app-id', class: 'showTime'}, String(context.state.count));
    return h('div', { id: 'app-id' + context.state.count, class: 'showTime'}, [
      h('p', null, String(context.state.count)),
      h('p', null, 'haha'),
    ]);
  },

  setup() {
    // a = 响应式数据
    const state = reactive({
      count: 0,
    });

    window.state = state;
    return { state };
  }

}

// App.render(App.setup());