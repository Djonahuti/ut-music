import type { NextApiRequest, NextApiResponse } from "next"
import fs from "fs"
import path from "path"
import formidable from "formidable"

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const uploadDir = path.join(process.cwd(), "public", "audio")
  const form = new formidable.IncomingForm({
    uploadDir,
    keepExtensions: true,
  })

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }

  form.parse(req, (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Upload failed" })
    const fileData = files.file
    const file = Array.isArray(fileData) ? fileData[0] : fileData
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" })
    }
    const fileName = path.basename(file.filepath)
    res.status(200).json({ fileName })
  })
}