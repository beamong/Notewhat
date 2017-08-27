<template>
  <div class="holygrail">
    <header>
      NoteWhat
    </header>
    <div class="holygrail-body">
      <main class="holygrail-content">
        <codemirror :code="code" :options="editorOptions" @change="onEditorCodeChange"></codemirror>
      </main>

      <nav class="holygrail-nav">
        nav
      </nav>

      <aside class="holygrail-ads">
        <div v-html="transpiled"></div>
      </aside>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import marked from 'marked'
import { codemirror } from 'vue-codemirror-electron'
import fs from 'fs'
import 'codemirror/keymap/vim'

import SystemInformation from './LandingPage/SystemInformation'

const sample = fs.readFileSync(`${__dirname}/sample.md`).toString()

export default {
  name: 'landing-page',
  components: { SystemInformation, codemirror },
  created() {
    this.codeChange(this, this.code)
  },
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
      code: sample,
      editorOptions: {
        // codemirror options
        tabSize: 4,
        mode: 'text/x-markdown',
        // theme: 'base16-dark',
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

.CodeMirror,
.CodeMirror-scroll {
  height: 100%;
  max-width: 500px;
}

.holygrail {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

.holygrail-body {
  display: flex;
  flex: 1;
}

.holygrail-content {
  flex: 1;
}

.holygrail-nav {
  /* 12em은 열의 너비입니다. */
  flex: 0 0 12em;
  overflow: auto;
}

.holygrail-ads {
  flex: 1;
  background-color: pink;
  overflow: auto;
}

.holygrail-nav {
  /* 좌측에 네비게이션을 놓습니다. */
  order: -1;
}
</style>
