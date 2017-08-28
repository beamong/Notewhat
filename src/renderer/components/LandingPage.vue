<template>
  <div class="holygrail">
    <!-- <header>
            NoteWhat
          </header> -->
    <div class="holygrail-body">
      <main class="holygrail-content">
        <div class="editor">
          <codemirror :code="code" :options="editorOptions" @ready="onEditorReady" @change="onEditorCodeChange"></codemirror>
        </div>
        <div v-if="keyBuffer" class="keybuffer-placeholder">
          Key buffer:
          <span style="">{{keyBuffer}}</span>
        </div>
      </main>

      <nav class="holygrail-nav">
        <div>
          <h1>View the source of this content.</h1>
          <div class="content">
            Let's get the whole "linebreak" thing out of the way. The next paragraph contains two phrases separated by a single newline character:
          </div>
        </div>
        <div class="active">
          <h1>Roses are red Violets are blue</h1>
          <div class="content">
            The next paragraph has the same phrases, but now they are separated by two spaces and a newline character:
          </div>
        </div>
        <div>
          <h1>Roses are red</h1>
          <div class="content">
            Violets are blue
          </div>
        </div>
        <div>
          <h1>Oh, and one thing I cannot stand is the mangling of words with multiple underscores in them like perform_complicated_task or do_this_and_do_that_and_another_thing.</h1>
          <div class="content">
            A bit of the GitHub spice
          </div>
        </div>
        <div>
          <h1>In addition to the changes in the previous section, certain references are auto-linked:</h1>
          <div class="content">
            SHA: be6a8cc1c1ecfe9489fb51e4869af15a13fc2cd2
          </div>
        </div>
        <div>
          <h1>User@SHA ref: mojombo@be6a8cc1c1ecfe9489fb51e4869af15a13fc2cd2</h1>
          <div class="content">
            User/Project@SHA: mojombo/god@be6a8cc1c1ecfe9489fb51e4869af15a13fc2cd2
          </div>
        </div>
        <div>
          <h1>#Num: #1</h1>
          <div class="content">
            User/#Num: mojombo#1
          </div>
        </div>
        <div>
          <h1>User/Project#Num: mojombo/god#1</h1>
          <div class="content">
            These are dangerous goodies though, and we need to make sure email addresses don't get mangled:
          </div>
        </div>
        <div>
          <h1>한글제목</h1>
          <div class="content">
            no more content
          </div>
        </div>
        <div>
          <h1>View the source of this content.</h1>
          <div class="content">
            Let's get the whole "linebreak" thing out of the way. The next paragraph contains two phrases separated by a single newline character:
          </div>
        </div>
        <div>
          <h1>Roses are red Violets are blue</h1>
          <div class="content">
            The next paragraph has the same phrases, but now they are separated by two spaces and a newline character:
          </div>
        </div>
        <div>
          <h1>Roses are red</h1>
          <div class="content">
            Violets are blue
          </div>
        </div>
        <div>
          <h1>Oh, and one thing I cannot stand is the mangling of words with multiple underscores in them like perform_complicated_task or do_this_and_do_that_and_another_thing.</h1>
          <div class="content">
            A bit of the GitHub spice
          </div>
        </div>
        <div>
          <h1>In addition to the changes in the previous section, certain references are auto-linked:</h1>
          <div class="content">
            SHA: be6a8cc1c1ecfe9489fb51e4869af15a13fc2cd2
          </div>
        </div>
        <div>
          <h1>User@SHA ref: mojombo@be6a8cc1c1ecfe9489fb51e4869af15a13fc2cd2</h1>
          <div class="content">
            User/Project@SHA: mojombo/god@be6a8cc1c1ecfe9489fb51e4869af15a13fc2cd2
          </div>
        </div>
        <div>
          <h1>#Num: #1</h1>
          <div class="content">
            User/#Num: mojombo#1
          </div>
        </div>
        <div>
          <h1>User/Project#Num: mojombo/god#1</h1>
          <div class="content">
            These are dangerous goodies though, and we need to make sure email addresses don't get mangled:
          </div>
        </div>
        <div>
          <h1>한글제목</h1>
          <div class="content">
            no more content
          </div>
        </div>
      </nav>

      <aside class="holygrail-preview">
        <div class="markdown-body" v-html="transpiled"></div>
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
import 'codemirror/addon/dialog/dialog.css'
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
      // CodeMirror.Vim.defineMotion('quit', this.closeEditor)
      // CodeMirror.Vim.mapCommand('ZQ', 'motion', 'quit')
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
        // theme: 'elegant',
        keyMap: 'vim',
        lineWrapping: true,
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
@import url('https://fonts.googleapis.com/css?family=Droid+Sans+Mono');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Source Sans Pro', sans-serif;
}

.editor {
  height: 100%;
}

.CodeMirror,
.CodeMirror-scroll {
  height: 100%;
  width: 100%;
  // max-width: 500px;
  opacity: 0.9;
}

.CodeMirror pre {
  font-family: 'Droid Sans Mono', serif;
  font-size: 0.7em;
}

.CodeMirror-gutters {
  border-right: 1px solid #EFEFEF;
  background-color: #fff;
  white-space: nowrap;
  padding-right: 5px;
}

.CodeMirror-linenumber {
  font-size: 0.9em;
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
  position: relative;
  border-left: 1px solid #EFEFEF;
  .keybuffer-placeholder {
    position: absolute;
    right: 0;
    bottom: 0;
    font-size: 13px
  }
}

.holygrail-nav {
  /* 12em is width of the column */
  order: -1;
  flex: 0 0 20em;
  overflow: auto; // background: #f1f6f8;
  font-size: 0.80em;
  >div {
    width: 20em;
    border-bottom: 1px solid #EFEFEF;
    color: #626f73;
    padding: 10px;
    &.active {
      background: #fce28d;
    }
    h1,
    .content {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    h1 {
      font-size: 1em;
      margin-bottom: 5px;
      color: #525f63;
      font-weight: bold;
    }
    .content {}
  }
}

.holygrail-preview {
  flex: 1;
  overflow: auto;
  padding: 10px;
  border-left: 1px solid #efefef;
}

@import './markdown.css';
</style>
