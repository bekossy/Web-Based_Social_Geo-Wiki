import multer from "multer"
import path from "path"
import fs from "fs"

const uploadDir = path.join(__dirname, "../uploads")

// Ensure 'uploads' directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, {recursive: true})
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir) // Save files in 'uploads/' directory
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

// Allow multiple images (max 4)
const upload = multer({
    storage,
    fileFilter,
    limits: {fileSize: 2 * 1024 * 1024}, // 2MB max per file
}).array("images", 4) // Accept up to 4 images

export default upload
