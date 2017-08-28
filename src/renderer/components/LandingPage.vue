<template>
  <div class="holygrail">
    <div class="holygrail-header">
      <nav class="holygrail-nav">
        <span class="brand">
          <span>NOTE</span><span class="sub">WHAT</span>
        </span>
      </nav>
      <nav class="holygrail-content">
        <div class="buttons">
          <i class="fa fa-plus"></i>
        </div>
        <div class="search">
          <i class="fa fa-search"></i>
          &nbsp;
          <input type="text">
        </div>
      </nav>
    </div>
    <div class="holygrail-body">
      <nav class="holygrail-nav">
        <div :class="menu.isActive ? 'active' : ''" :key="menu.id" v-for="menu in menus">
          <h1>{{menu.title}}</h1>
          <div class="content">
            {{menu.content}}
          </div>
        </div>
      </nav>

      <main class="holygrail-content">
        <div class="holygrail-editor">
          <div class="editor">
            <codemirror :code="code" :options="editorOptions" @ready="onEditorReady" @change="onEditorCodeChange"></codemirror>
          </div>
          <div v-if="keyBuffer" class="keybuffer-placeholder">
            Key buffer:
            <span style="">{{keyBuffer}}</span>
          </div>
        </div>
        <aside class="holygrail-preview">
          <div class="markdown-body" v-html="transpiled"></div>
        </aside>
      </main>

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
const sampleMenus = [{
  isActive: true,
  title: 'Roses are red Violets are blue',
  content: 'The next paragraph has the same phrases, but now they are separated by two spaces and a newline character:',
}, {
  isActive: false,
  title: 'Roses are red',
  content: 'Violets are blue',
}, {
  isActive: false,
  title: 'Oh, and one thing I cannot stand is the mangling of words with multiple underscores in them like perform_complicated_task or do_this_and_do_that_and_another_thing.',
  content: 'A bit of the GitHub spice',
}, {
  isActive: false,
  title: 'A bit of the GitHub spice',
  content: 'Violets are blue',
}, {
  isActive: false,
  title: 'In addition to the changes in the previous section, certain references are auto-linked:',
  content: 'SHA: be6a8cc1c1ecfe9489fb51e4869af15a13fc2cd2',
}, {
  isActive: false,
  title: 'User@SHA ref: mojombo@be6a8cc1c1ecfe9489fb51e4869af15a13fc2cd',
  content: 'User/Project@SHA: mojombo/god@be6a8cc1c1ecfe9489fb51e4869af15a13fc2cd2',
}, {
  isActive: false,
  title: '#Num: #1',
  content: 'User/#Num: mojombo#1',
}, {
  isActive: false,
  title: 'User/Project#Num: mojombo/god#1',
  content: 'These are dangerous goodies though, and we need to make sure email addresses don\'t get mangled:',
}, {
  isActive: false,
  title: 'Roses are red',
  content: 'Violets are blue',
}, {
  isActive: false,
  title: 'Oh, and one thing I cannot stand is the mangling of words with multiple underscores in them like perform_complicated_task or do_this_and_do_that_and_another_thing.',
  content: 'A bit of the GitHub spice',
}, {
  isActive: false,
  title: 'A bit of the GitHub spice',
  content: 'Violets are blue',
}, {
  isActive: false,
  title: 'In addition to the changes in the previous section, certain references are auto-linked:',
  content: 'SHA: be6a8cc1c1ecfe9489fb51e4869af15a13fc2cd2',
}, {
  isActive: false,
  title: 'User@SHA ref: mojombo@be6a8cc1c1ecfe9489fb51e4869af15a13fc2cd',
  content: 'User/Project@SHA: mojombo/god@be6a8cc1c1ecfe9489fb51e4869af15a13fc2cd2',
}, {
  isActive: false,
  title: '#Num: #1',
  content: 'User/#Num: mojombo#1',
}, {
  isActive: false,
  title: 'User/Project#Num: mojombo/god#1',
  content: 'These are dangerous goodies though, and we need to make sure email addresses don\'t get mangled:',
}]

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
      menus: sampleMenus,
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
@import url('https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');

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
  width: 100%; // max-width: 500px;
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

.holygrail-header {
  display: flex;
  flex: 1 0 3em;
  flex-direction: row;
  background: #f7f7f7;
  border-bottom: 1px solid #EFEFEF;

  .holygrail-content {
    flex: 1;
    display: flex;
    .buttons {
      padding: 1.0em;
      flex: 1,
    }
    .search {
      font-size: 1em;
      padding: 0.7em;
      flex: 1;
      text-align: right;
      input[type=text] {
        width: 20em;
        padding: 0.4em;
        font-size: 0.8em;
      }
    }
  }
  .holygrail-nav {
    flex: 0 0 20em;
    order: -1;
    padding: 1.1em;
    font-size: 0.80em;
    .brand {
      font-size: 1.3em;
      font-weight: bold;
      font-family: sans-serif;
      color: #595959;
      span.sub {
        color: #adadad;
      }
    }
  }
}

.holygrail-body {
  display: flex;
  flex: 1;

  .holygrail-content {
    flex: 1;
    display: flex;

    .holygrail-editor {
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

    .holygrail-preview {
      flex: 1;
      overflow: auto;
      padding: 10px;
      border-left: 1px solid #efefef;
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
}

@import './markdown.css';
</style>
