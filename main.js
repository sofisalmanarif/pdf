import { isUtf8 } from "buffer";
import express from "express"
import fs from "fs"
import path from "path";
import cors from "cors";
const app = express()

app.use(cors({
    origin: "*",
}))

app.use("/files", express.static("./input"));
app.get("/",(req,res)=>{
    
    res.send("hello world")
})

app.get("/get-pdf-files",(req,res)=>{
    try {
        const folderFiles = fs.readdirSync("./input","utf-8")
        console.log(folderFiles)
        res.json({sucess:true,folderFiles})
    } catch (error) {
        console.log(error)
        res.json({sucess:false,error})
        
    }
})


app.get("/data/:filename",(req,res)=>{
    try {
        const filename = req.params.filename
    let data = fs.readFileSync(`./output/${filename}.json`,"utf-8")
    res.send(JSON.parse(data))
    console.log(filename,data)
    } catch (error) {
        console.log(error)
        res.status(404).send({message:"file not found"})
        
    }
})

app.listen(3000,()=>{
    console.log("server is running on port 3000")
})
