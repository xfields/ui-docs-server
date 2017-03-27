import * as dao from '../dao'
import * as Log from '../utils/logger'

export function getDocList(ctx, next) {
  Log.logVisit(ctx, 'getDocList')
  ctx.body = dao.getDocList()
  return next()
}

export function addDoc(ctx, next) {
  Log.logVisit(ctx, 'addDoc')
  const {name, description} = ctx.request.body
  if (name === undefined) {
    ctx.throw(400, 'name不能为空')
    return next()
  } else if (description === undefined) {
    ctx.throw(400, 'description不能为空')
    return next()
  } else {
    return dao.addDoc({name, description}).then(res => {
      ctx.body = res
    }).catch(err => {
      console.log(err)
      ctx.throw(500, '新增失败，服务器内部错误')
    }).then(() => {
      return next()
    })
  }
}

export function getDoc(ctx, next) {
  Log.logVisit(ctx, 'getDoc')
  let data = dao.getDocData(ctx.params.docId)
  if (!data) {
    ctx.throw(404, `id: ${ctx.params.docId} not found`)
    return next()
  }
  ctx.body = data
  return next()
}

function validate(data, key, value) {
  if (!key || !value) {
    return 'key or value of color can not be empty'
  }

  if (data.colors && data.colors.some(item => item.key === key)) {
    return `key ${key} already exist`
  }

  // todo 颜色值校验
}

export function addColorItem(ctx, next) {
  Log.logVisit(ctx, 'addColorItem')
  let docId = ctx.params.docId
  let data = dao.getDocData(docId)
  if (!data) {
    ctx.throw(404, `id: ${docId} not found`)
    return next()
  }

  const {key, value} = ctx.request.body
  let error = validate(data, key, value)
  if (error) {
    ctx.throw(400, error)
    return next()
  }

  if (!data.colors) {
    data.colors = []
  }

  data.colors.push({ key, value })

  return dao.updateDoc(data)
  .then(() =>
    ctx.body = data
  ).catch(err =>
    ctx.throw(500, '服务器内部错误')
  ).then(() =>
    next()
  )
}

export function deleteColorItem(ctx, next) {
  Log.logVisit(ctx, 'deleteColorItem')
  const {docId, colorId} = ctx.params
  let data = dao.getDocData(docId)
  if (!data) {
    ctx.throw(404, `id: ${docId} not found`)
    return next()
  }

  const {colors} = data
  if (!colors || !colors[colorId]) {
    ctx.throw(404, `color id: ${colorId} to deleted not exist`)
    return next()
  }

  data.colors.splice(colorId, 1)

  return dao.updateDoc(data)
  .then(() =>
    ctx.body = data
  ).catch(err =>
    ctx.throw(500, '服务器内部错误')
  ).then(() =>
    next()
  )
}

export function editColorItem(ctx, next) {
  Log.logVisit(ctx, 'editColorItem')
  const {docId, colorId} = ctx.params
  let data = dao.getDocData(docId)
  if (!data) {
    ctx.throw(404, `id: ${docId} not found`)
    return next()
  }

  const {colors} = data
  if (!colors || !colors[colorId]) {
    ctx.throw(404, `color id: ${colorId} to edit not exist`)
    return next()
  }

  let old = colors[colorId]
  const {key, value} = ctx.request.body

  data.colors.splice(colorId, 1, {
    ...old,
    key: key || old.key,
    value: value || old.value
  })

  return dao.updateDoc(data)
  .then(() =>
    ctx.body = data
  ).catch(err =>
    ctx.throw(500, '服务器内部错误')
  ).then(() =>
    next()
  )
}

export function addFontItem(ctx, next) {
  Log.logVisit(ctx, 'addFontItem')
  let docId = ctx.params.docId
  let data = dao.getDocData(docId)
  if (!data) {
    ctx.throw(404, `id: ${docId} not found`)
    return next()
  }

  const {key, value, bold = 0} = ctx.request.body
  let error = validate(data, key, value)
  if (error) {
    ctx.throw(400, error)
    return next()
  }

  if (!data['font-size']) {
    data['font-size'] = []
  }

  data['font-size'].push({
    key,
    value,
    bold: 0 + bold
  })

  return dao.updateDoc(data)
  .then(() =>
    ctx.body = data
  ).catch(err =>
    ctx.throw(500, '服务器内部错误')
  ).then(() =>
    next()
  )
}

export function deleteFontItem(ctx, next) {
  Log.logVisit(ctx, 'deleteFontItem')
  const {docId, fontId} = ctx.params
  let data = dao.getDocData(docId)
  if (!data) {
    ctx.throw(404, `id: ${docId} not found`)
    return next()
  }

  const fonts = data['font-size']
  if (!fonts || !fonts[fontId]) {
    ctx.throw(404, `id: ${fontId} to deleted not exist`)
    return next()
  }

  fonts.splice(fontId, 1)

  return dao.updateDoc(data)
  .then(() =>
    ctx.body = data
  ).catch(err =>
    ctx.throw(500, '服务器内部错误')
  ).then(() =>
    next()
  )
}

export function editFontItem(ctx, next) {
  Log.logVisit(ctx, 'editFontItem')
  const {docId, fontId} = ctx.params
  let data = dao.getDocData(docId)
  if (!data) {
    ctx.throw(404, `id: ${docId} not found`)
    return next()
  }

  const fonts = data['font-size']
  if (!fonts || !fonts[fontId]) {
    ctx.throw(404, `id: ${fontId} to edit not exist`)
    return next()
  }

  let old = fonts[fontId]
  const {key, value, bold} = ctx.request.body

  data['font-size'].splice(fontId, 1, {
    ...old,
    key: key || old.key,
    value: value || old.value,
    bold: bold === undefined ? (old.bold || 0) : (0 + bold)
  })

  return dao.updateDoc(data)
  .then(() =>
    ctx.body = data
  ).catch(err =>
    ctx.throw(500, '服务器内部错误')
  ).then(() =>
    next()
  )
}
