import multer from "multer"
import path from "path"
import fs from "fs"

const uploadDir = path.join(__dirname, "../uploads")

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, {recursive: true})
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    },
})

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
    const allowedTypes = /jpeg|jpg|png|gif/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (extname && mimetype) {
        return cb(null, true)
    }
    cb(new Error("Only image files are allowed!"))
}

const upload = multer({
    storage,
    fileFilter,
    limits: {fileSize: 2 * 1024 * 1024},
}).array("images", 4)

export default upload
