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

// export const parsePdf = async (req, res) => {
//     try {
//       const { strategy, coordinates } = req.body;
  
//       if (!req.file) {
//         return res.status(400).json({ error: 'No file uploaded' });
//       }
  
//       if (!strategy || !coordinates) {
//         return res.status(400).json({ error: 'Missing strategy or coordinates' });
//       }
  
  
//       // Prepare the FormData
//     //   const fileStream = await fs.createReadStream(req.file.path);
//       const formData = new FormData();
//       formData.append('strategy', strategy); // Add strategy
//       formData.append('coordinates', coordinates); // Serialize coordinates if needed

//       const raw =  readFileSync("./../input/DBMS_Notes.pdf")
//       formData.append('files', raw, { 
//         filename: 'DBMS_Notes.pdf', 
//         contentType: 'application/pdf' 
//     });
//       console.log(formData)
//       // Send the request to Unstructured API
//       const response = await fetch('https://api.unstructuredapp.io/general/v0/general', {
//         method: 'POST',
//         ...formData.getHeaders(),
//        formData,
//       });
  
//       // Parse the response
//       const data = await response.json();
  
//       // Handle API errors
//       if (!response.ok) {
//         console.error('Unstructured API Error:', data);
//         return res.status(response.status).json({ error: data });
//       }
  
//       // Send the response to the client
//       res.json(data);
//     } catch (error) {
//       console.error('Error processing PDF:', error);
//       res.status(500).json({ error: 'Failed to process PDF' });
//     }
//   };




export const parsePdf = async (req, res) => {
    try {
        const { strategy, coordinates } = req.body;

        // Validate input
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        if (!strategy || !coordinates) {
            return res.status(400).json({ error: 'Missing strategy or coordinates' });
        }

        // Prepare FormData
        const formData = new FormData();
        formData.append('strategy', strategy); // Add strategy
        formData.append('coordinates', coordinates); // Add coordinates

        // Append the uploaded file
        const raw = readFileSync(req.file.path); // Path to the uploaded file
        formData.append('files', raw, { 
            filename: req.file.originalname, // Use the original filename
            contentType: req.file.mimetype, // Use the uploaded file's MIME type
        });

        
        // Send the request to the API
        const response = await fetch('https://api.unstructuredapp.io/general/v0/general', {
            method: 'POST',
            headers: {
                'unstructured-api-key': 'FauAsZ3loP6hpfBQZwPvN8U5kY4pW2', // Replace with your API key
                ...formData.getHeaders(), // Add FormData headers
            },
            body: formData, // Set the FormData object as the body
        });

        // Parse the API response
        const data = await response.json();

        // Handle API errors
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

        // Send the response to the client
        res.json({success:true ,data});
    } catch (error) {
        console.error('Error processing PDF:', error);
        res.status(500).json({ error: 'Failed to process PDF' });
    }
};
