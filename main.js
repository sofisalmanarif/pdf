
import express from "express"
// import fs from "fs"
import cors from "cors";
import multer from "multer";

import { sendFildeData, uploadPdf, getPdfFiles, uploadJsonFiles, parsePdf } from './controllers/pdf.controllers.js';
import { upload } from './middlewares/multer.js';
const app = express()

app.use(cors({
    origin: "*",
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/files", express.static("./input"));


app.get("/",(req,res)=>{
    
    res.send("hello world")
})

app.get("/get-pdf-files",getPdfFiles)


  const storage2 = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './output')
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname )
    }
  })
  
  const uploadJson = multer({ storage: storage2 })
app.get("/data/:filename",sendFildeData)

// const FormData = require('form-data');

// app.post("/upload-pdf", upload.single("file"), async (req, res) => {
//     try {
//         console.log("Uploaded file:", req.file);
//          // Access the uploaded file information
//          console.log("filedata",req.body.filedata)
//         res.json({ success: true, file: req.file });
//     } catch (error) {
//         console.error("File upload error:", error);
//         res.status(500).json({ success: false, message: "File upload failed" });
//     }
// });

app.post("/upload-pdf", upload.single("file"), uploadPdf);


app.post("/upload-json", uploadJson.single("file"), uploadJsonFiles);


// import multer from 'multer';

// Use memory storage to keep files in memory as buffers
const upload1 = multer({ storage: multer.memoryStorage() });
app.post('/parse-pdf', upload.single('files'), parsePdf);


app.listen(3000,()=>{
    console.log("server is running on port 3000")
})
