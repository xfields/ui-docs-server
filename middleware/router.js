import KoaRouter from 'koa-router'
const router = new KoaRouter()
import * as docService from '../service/doc'

router.get('/api/docs', docService.getDocList)

router.post('/api/docs', docService.addDoc)

router.get('/api/docs/:docId', docService.getDoc)

router.post('/api/docs/:docId/color', docService.addColorItem)
router.patch('/api/docs/:docId/color/:colorId', docService.editColorItem)
router.delete('/api/docs/:docId/color/:colorId', docService.deleteColorItem)

router.post('/api/docs/:docId/font', docService.addFontItem)
router.patch('/api/docs/:docId/font/:fontId', docService.editFontItem)
router.delete('/api/docs/:docId/font/:fontId', docService.deleteFontItem)

export default router
