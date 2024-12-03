import fs from 'fs/promises';
import fetch from 'node-fetch';
import FormData from 'form-data';
import { appendFile, readFileSync } from 'fs';


export const sendFildeData =async (req,res)=>{
    try {
        const filename = req.params.filename
    let data =await fs.readFile(`./output/${filename}.json`,"utf-8")
    res.send(JSON.parse(data))
    console.log(filename,data)
    } catch (error) {
        console.log(error)
        res.status(404).send({message:"file not found"})
        
    }
}


export const uploadPdf =async (req, res) => {
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
}

export const uploadJsonFiles =(req, res) => {
    try {
        console.log("Uploaded file:", req.file); // Access the uploaded file information
        res.json({ success: true, file: req.file });
    } catch (error) {
        console.error("File upload error:", error);
        res.status(500).json({ success: false, message: "File upload failed" });
    }
}
export const getPdfFiles =async (req,res)=>{
    try {
        const folderFiles = await fs.readdir("./input","utf-8")
        console.log(folderFiles)
        res.json({sucess:true,folderFiles})
    } catch (error) {
        console.log(error)
        res.json({sucess:false,error})
        
    }
}

export const parsePdf = async (req, res) => {
    try {
        const { strategy, coordinates,chunking_strategy } = req.body;

        console.log(strategy, coordinates,chunking_strategy)

        // Validate input
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        if (!strategy || !coordinates ) {
            return res.status(400).json({ error: 'Missing strategy or coordinates' });
        }

        // Prepare FormData
        const formData = new FormData();
        formData.append('strategy', strategy); 
        formData.append('coordinates', coordinates);
        formData.append('chunking strategy', chunking_strategy);
        // Append the uploaded file
        const raw = readFileSync(req.file.path); 
        formData.append('files', raw, { 
            filename: req.file.originalname, 
            contentType: req.file.mimetype, 
        });

        
        // Send the request to the API
        const response = await fetch('https://api.unstructuredapp.io/general/v0/general', {
            method: 'POST',
            headers: {
                'unstructured-api-key': 'FauAsZ3loP6hpfBQZwPvN8U5kY4pW2', 
                ...formData.getHeaders(), // Add FormData headers
            },
            body: formData, 
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Unstructured API Error:', data);
            return res.status(response.status).json({ error: data });
        }
        const fileData = JSON.stringify(data)
        await fs.writeFile(
            `./output/${req.file.filename}.json`,
            fileData,
            'utf8'
        );

        res.json({success:true,message:"File Uploaded Successfully" ,data});
    } catch (error) {
        console.error('Error processing PDF:', error);
        res.status(500).json({ error: 'Failed to process PDF' });
    }
};
