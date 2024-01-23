import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import slugify from 'slugify'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const port = 3005
app.use(cors())

app.use(express.static('admin'))
app.use(express.json())

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images')
  },
  filename: (req, file, cb) => {
    const sanitizedFileName = slugify(file.originalname, { lower: true })

    cb(null, sanitizedFileName)
  },
})

const upload = multer({ storage: storage })

app.post('/upload', upload.single('image'), (req, res) => {
  const imageName = req.file.filename
  const imageUrl = req.body.imageUrl

  const dbPath = path.join(__dirname, 'db.json')
  let dbData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'))

  dbData.images.push({ name: imageName, imageUrl: imageUrl })

  fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2))

  res.json({ success: true, message: 'Ảnh đã được upload' })
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
