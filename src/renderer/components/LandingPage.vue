<template>
  <div class="container">
    <div class="container-header">
      <nav class="header-brand">
        <span class="brand">
          <span>NOTE</span>
          <span class="sub">WHAT</span>
        </span>
      </nav>
      <nav class="header-content">
        <button class="buttons" @click="addEntry">
          <i class="fa fa-plus"></i>
        </button>
        <button class="buttons" @click="saveEntry">
          <i class="fa fa-save"></i>
        </button>
        <div class="search">
          <i class="fa fa-search"></i>
          &nbsp;
          <input type="text">
        </div>
      </nav>
    </div>
    <div class="container-body">
      <nav class="list">
        <div :class="entry.isActive ? 'active' : ''" :key="entry.id" v-for="entry in entries" @click="clickEntry(entry)">
          <h1>{{entry.title}}</h1>
          <div class="content">
            {{entry.content}}
          </div>
        </div>
      </nav>
      <div class="note">
        <codemirror v-model="content" :options="editorOptions" @ready="onEditorReady" @change="onEditorCodeChange"></codemirror>
        <!-- <div v-if="keyBuffer" class="keybuffer-placeholder">
                    Key buffer:
                    <span>{{keyBuffer}}</span>
                  </div> -->
      </div>
      <div class="markdown">
        <div class="markdown-body" v-html="transpiled"></div>
      </div>
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

import store from '../store'

const sample = fs.readFileSync('./static/sample.md').toString()

export default {
  name: 'landing-page',
  components: { codemirror },
  beforeRouteEnter(to, from, next) {
    store.dispatch('SET_ENTRIES')
    next()
  },
  created() {
    this.codeChange(this, this.content)
  },
  computed: {
    entries() {
      return this.$store.state.entry.entries
    },
    current() {
      return this.$store.state.entry.current
    },
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
        const content = editor.getValue().trim() // eslint-disable-line
      }
    },
    onEditorCodeChange(content) {
      this.codeChange(this, content)
    },
    codeChange: _.throttle((self, content) => {
      self.transpiled = marked(content)
    }, 1000),
    clickEntry(entry) {
      this.content = entry.content
      store.commit('ACTIVE_ENTRY', {
        entry,
      })
    },
    addEntry() {
      store.dispatch('ADD_ENTRY')
      this.content = this.$store.state.entry.entries[0].content
    },
    saveEntry() {
      store.dispatch('SAVE_ENTRY', {
        current: this.current,
        content: this.content,
      })
    },
  },
  data() {
    return {
      transpiled: '',
      keyBuffer: '',
      content: sample,
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
  height: 100%;
}

.CodeMirror,
.CodeMirror-scroll {
  // width: 100%; // max-width: 500px;
  height: inherit;
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

.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  .container-header {
    display: flex;
    flex: 0 0 3em;
    .header-brand {
      flex: 0 0 20em;
      order: -1;
      padding: 1.1em;
      font-size: 0.80em;
      .brand {
        font-size: 1.3em;
        font-weight: bold;
        font-family: sans-serif;
        color: #595959;
        span {
          vertical-align: middle;
        }
        >.sub {
          color: #adadad;
        }
      }
    }
    .header-content {
      flex: 1;
      display: flex;
      .buttons {
        padding: 1.0em;
        border: none;
        background-color: transparent;
        outline: none;
        cursor: pointer;
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
  }
  .container-body {
    display: flex;
    flex: 1;
    border-top: 1px solid #eee;
    overflow: auto;
    .list {
      flex: 0 0 20em;
      overflow: auto;
      font-size: 0.80em;
      >div {
        width: 20em;
        border-bottom: 1px solid #EFEFEF;
        color: #626f73;
        padding: 10px;
        cursor: pointer;
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
      }
    }
    .note {
      flex: 1;
      border-left: 1px solid #eee;
      overflow: auto;
      // .keybuffer-placeholder {
      //   position: absolute;
      //   right: 0;
      //   bottom: 0;
      //   font-size: 13px
      // }
    }
    .markdown {
      flex: 1;
      overflow: auto;
      padding: 10px;
      border-left: 1px solid #efefef;
    }
  }
}

@import './markdown.css';
</style>

