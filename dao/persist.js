import fs from 'fs'

const rootPath = './db'

function readAll() {
  let docs = {}
  let fileList = []
  try {
    fileList = fs.readdirSync(rootPath, 'utf8')
  } catch (err) {
    console.log(err)
  }

  fileList.forEach(fileName => {
    try {
      let data = JSON.parse(fs.readFileSync(`${rootPath}/${fileName}`, 'utf8'))
      docs[data.id] = data
    } catch (err) {
      console.log(err)
    }
  })

  return docs
}

function addItem(item) {
  return new Promise((resolve, reject) => {
    let fid = fs.openSync(`${rootPath}/${item.id}.json`, 'wx') // wx - failes if path exist
    if (!fid) {
      reject(`id ${item.id} already exist`)
    }

    fs.write(fid, JSON.stringify(item), err => {
      fs.closeSync(fid)
      err ? reject(err) : resolve()
    })
  })
}

function updateItem(item) {
  return new Promise((resolve, reject) => {
    let fid = fs.openSync(`${rootPath}/${item.id}.json`, 'w')

    fs.write(fid, JSON.stringify(item), err => {
      fs.closeSync(fid)
      err ? reject(err) : resolve()
    })
  })
}

export default {
  readAll,
  addItem,
  updateItem
}
