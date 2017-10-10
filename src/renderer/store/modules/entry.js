import fs from 'fs'
import Promise from 'bluebird'
Promise.promisifyAll(fs)

const state = {
  entries: [],
  current: {},
}
const dirName = './notes'

const mutations = {
  SET_ENTRIES(state, { entries }) {
    state.entries = entries
  },
  ACTIVE_ENTRY(state, { entry }) {
    const copiedEntries = state.entries.map((obj) => {
      if (obj === entry) {
        state.current = {
          ...entry,
          isActive: true,
        }
        return state.current
      }
      return {
        ...obj,
        isActive: false,
      }
    })
    state.entries = copiedEntries
  },
  ADD_ENTRY(state, { entry }) {
    state.entries.unshift(entry)
  },
  SAVE_ENTRY(state, { prev, current }) {
    const copiedEntries = state.entries.map((obj) => {
      if (obj === prev) {
        return {
          ...current,
        }
      }
      return {
        ...obj,
      }
    })
    state.current = current
    state.entries = copiedEntries
  },
}

const checkExistDir = async (path) => {
  try {
    await fs.statAsync(path)
    return true
  } catch (e) {
    return false
  }
}

const readFileAsync = async (path, fileName) => {
  const content = await fs.readFileAsync(`${path}/${fileName}`, 'utf8')
  return {
    fileName,
    isActive: false,
    title: content.substring(0, 20),
    content,
  }
}

const actions = {
  async SET_ENTRIES({ commit }) {
    if (!await checkExistDir(dirName)) {
      fs.mkdirAsync(dirName, '0777').catch((err) => {
        console.log(err)
      })
      return
    }
    const files = await fs.readdirAsync(dirName).catch((err) => {
      console.log(err)
    })
    commit('SET_ENTRIES', {
      entries: await Promise.all(
        files
          .filter(file => file.match(/\.txt/g) !== null)
          .map(file => readFileAsync(dirName, file))),
    })
  },
  ADD_ENTRY({ commit }) {
    const newEntry = {
      isActive: false,
      title: 'New Title',
      content: '# New Title\n - Some Content\n - Some Content',
    }
    commit('ADD_ENTRY', { entry: newEntry })
    commit('ACTIVE_ENTRY', { entry: newEntry })
  },
  async SAVE_ENTRY({ commit }, { current, content }) {
    const sep = '_'
    const fileName = `${content.substring(0, 20).replace(/\s/g, sep) + sep + new Date().getTime()}.txt`
    const path = `${dirName}/${fileName}`
    fs.writeFileAsync(path, content)
    commit('SAVE_ENTRY', {
      prev: current,
      current: {
        isActive: true,
        fileName,
        title: content.substring(0, 20),
        content,
      },
    })
    fs.unlinkAsync(`${dirName}/${current.fileName}`)
  },
}

export default {
  state,
  mutations,
  actions,
}
