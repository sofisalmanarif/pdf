import fs from 'fs/promises';
import { isUtf8 } from "buffer";
import express from "express"
// import fs from "fs"
import path from "path";
import cors from "cors";
import multer from "multer";
import axios from "axios";
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

app.get("/get-pdf-files",async (req,res)=>{
    try {
        const folderFiles = await fs.readdir("./input","utf-8")
        console.log(folderFiles)
        res.json({sucess:true,folderFiles})
    } catch (error) {
        console.log(error)
        res.json({sucess:false,error})
        
    }
})


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './input')
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname )
    }
  })
  
  const upload = multer({ storage: storage })

  const storage2 = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './output')
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname )
    }
  })
  
  const uploadJson = multer({ storage: storage2 })
app.get("/data/:filename",async (req,res)=>{
    try {
        const filename = req.params.filename
    let data =await fs.readFile(`./output/${filename}.json`,"utf-8")
    res.send(JSON.parse(data))
    console.log(filename,data)
    } catch (error) {
        console.log(error)
        res.status(404).send({message:"file not found"})
        
    }
})

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

app.post("/upload-pdf", upload.single("file"), async (req, res) => {
    // const outputDir = path.join(__dirname, 'output');
// fs.mkdir(outputDir, { recursive: true }).catch(console.error);
    try {
        console.log("Uploaded file:", req.file);
        console.log("filedata", req.body.filedata);

       

        
       

        // Write the JSON file
        await fs.writeFile(
            `./output/${req.file.filename}.json`,
            req.body.filedata,
            'utf8'
        );

        res.json({ 
            success: true, 
            file: req.file,
        });

    } catch (error) {
        console.error("File upload error:", error);
        res.status(500).json({ 
            success: false, 
            message: "File upload failed",
            error: error.message 
        });
    }
});


app.post("/upload-json", uploadJson.single("file"), (req, res) => {
    try {
        console.log("Uploaded file:", req.file); // Access the uploaded file information
        res.json({ success: true, file: req.file });
    } catch (error) {
        console.error("File upload error:", error);
        res.status(500).json({ success: false, message: "File upload failed" });
    }
});


app.listen(3000,()=>{
    console.log("server is running on port 3000")
})
