import multer from 'multer'
import path from 'path'
import { Router, Request, Response, RequestHandler, NextFunction } from "express";

const storage = multer.diskStorage({
    destination(req:any, file:any, cb:any) {
      cb(null, 'src/uploads/')
    },
    filename(req:any, file:any, cb:any) {
      cb(
        null,
        `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
      )
    },
  })
  
function checkFileType(file:any, cb:any) {
    const filetypes = /jpg|jpeg|png/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)
  
    if (extname && mimetype) {
      return cb(null, true)
    } else {
      cb('Images only!')
    }
  }
  
const upload = multer({
    storage,
    fileFilter: function (req: any, file:any , cb:any) {
      checkFileType(file, cb)
    },
  })
  

export default class UploadController {
    private path: string = "/uploads"
    public router: Router = Router()

    constructor() {
        this.router.get(`${this.path}`, (req,res) => res.json(true))
        this.router.post(`${this.path}`, upload.single('image'), (request:any , response: any) => {
            return response.json({filePath: `http://localhost:4000/${request.file.path.replace('src/', "")}`})
        })
    }
}