import fs from 'fs'
import persist from './persist'

let docs

export function initiate() {
  docs = persist.readAll()
}

export function getDocList() {
  return Object.keys(docs).map(key => ({
    id: docs[key].id,
    name: docs[key].name,
    description: docs[key].description
  }))
}

export function getDocData(id) {
  return docs[`${id}`]
}

function getId() {
  let ids = Object.keys(docs)
  return Math.max(...ids) + 1
}

export function addDoc({name, description}) {
  let id = getId()
  let item = {
    id,
    name,
    description
  }

  return persist.addItem(item).then(() => {
    docs[id] = item
    return getDocList()
  })
}

export function updateDoc(data) {
  docs[data.id] = data
  return persist.updateItem(data)
}
