<template>
  <div class="holygrail">
    <header>
      NoteWhat
    </header>
    <div class="holygrail-body">
      <main class="holygrail-content">
        <div class="editor">
          <codemirror :code="code" :options="editorOptions" @ready="onEditorReady" @change="onEditorCodeChange"></codemirror>
        </div>
        <div style="font-size: 13px">Key buffer:
          <span style="">{{keyBuffer}}</span>
        </div>
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
import { codemirror, CodeMirror } from 'vue-codemirror-electron'
import fs from 'fs'
import 'codemirror/lib/codemirror.css'
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
    onEditorReady(editor) {
      CodeMirror.on(editor, 'vim-keypress', (key) => {
        this.keyBuffer = `${this.keyBuffer}${key}`
      })
      CodeMirror.on(editor, 'vim-command-done', (/* e */) => {
        this.keyBuffer = ''
      })
      editor.save = () => {
        const content = editor.getValue().trim()
        console.log(content)
      }
      CodeMirror.Vim.defineMotion('quit', this.closeEditor)
      CodeMirror.Vim.mapCommand('ZQ', 'motion', 'quit')
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
      keyBuffer: '',
      code: sample,
      editorOptions: {
        tabSize: 4,
        mode: 'text/x-markdown',
        lineNumbers: true,
        line: true,
        keyMap: 'vim',
        foldGutter: true,
        styleSelectedText: true,
        highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true },
      },
    }
  },
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Source Sans Pro', sans-serif;
}

.editor {
  height: 96%;
}

.CodeMirror,
.CodeMirror-scroll {
  height: 92%;
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
