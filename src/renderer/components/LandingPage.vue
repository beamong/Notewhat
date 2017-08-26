<template>
  <div id="wrapper">
    <main>
      <div class="left-side">
        <codemirror :code="code" :options="editorOptions" @change="onEditorCodeChange"></codemirror>
      </div>

      <div class="right-side">
        <div v-html="transpiled"></div>
      </div>
    </main>
  </div>
</template>

<script>
import _ from 'lodash'
import marked from 'marked'
import { codemirror } from 'vue-codemirror-electron'
import 'codemirror/keymap/vim'

import SystemInformation from './LandingPage/SystemInformation'

export default {
  name: 'landing-page',
  components: { SystemInformation, codemirror },
  methods: {
    open(link) {
      this.$electron.shell.openExternal(link)
    },
    onEditorCodeChange(code) {
      this.codeChange(this, code)
    },
    codeChange: _.throttle((self, code) => {
      self.transpiled = marked(code)
    }, 1000),
  },
  data() {
    return {
      transpiled: '',
      code: '',
      editorOptions: {
        // codemirror options
        tabSize: 4,
        // mode: 'text/x-markdown',
        theme: 'base16-dark',
        lineNumbers: true,
        line: true,
        // sublime、emacs、vim三种键位模式，支持你的不同操作习惯
        // keyMap: 'sublime',
        keyMap: 'vim',
        // 按键映射，比如Ctrl键映射autocomplete，autocomplete是hint代码提示事件
        // extraKeys: { "Ctrl": "autocomplete" },
        // 代码折叠
        foldGutter: true,
        // gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        // 选中文本自动高亮，及高亮方式
        styleSelectedText: true,
        highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true },
        // more codemirror config... 
        // 如果有hint方面的配置，也应该出现在这里
      },
    }
  },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Source Sans Pro', sans-serif;
}

#wrapper {
  background: radial-gradient( ellipse at top left,
  rgba(255, 255, 255, 1) 40%,
  rgba(229, 229, 229, .9) 100%);
  height: 100vh;
  padding: 60px 80px;
  width: 100vw;
}

#logo {
  height: auto;
  margin-bottom: 20px;
  width: 420px;
}

main {
  display: flex;
  justify-content: space-between;
}

main>div {
  flex-basis: 50%;
}

.left-side {
  display: flex;
  flex-direction: column;
}

.welcome {
  color: #555;
  font-size: 23px;
  margin-bottom: 10px;
}

.title {
  color: #2c3e50;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 6px;
}

.title.alt {
  font-size: 18px;
  margin-bottom: 10px;
}

.doc p {
  color: black;
  margin-bottom: 10px;
}

.doc button {
  font-size: .8em;
  cursor: pointer;
  outline: none;
  padding: 0.75em 2em;
  border-radius: 2em;
  display: inline-block;
  color: #fff;
  background-color: #4fc08d;
  transition: all 0.15s ease;
  box-sizing: border-box;
  border: 1px solid #4fc08d;
}

.doc button.alt {
  color: #42b983;
  background-color: transparent;
}
</style>
