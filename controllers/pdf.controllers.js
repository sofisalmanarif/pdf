import fs from 'fs/promises';
import fetch from 'node-fetch';
import FormData from 'form-data';


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
      const { strategy, coordinates } = req.body;
  
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
  
      if (!strategy || !coordinates) {
        return res.status(400).json({ error: 'Missing strategy or coordinates' });
      }
  
      console.log(strategy, coordinates, req.file);
  
      // Prepare the FormData
    //   const fileStream = await fs.createReadStream(req.file.path);
      const formData = new FormData();
      formData.append('strategy', strategy); // Add strategy
      formData.append('coordinates', coordinates); // Serialize coordinates if needed
      formData.append('files', req.file.buffer); // Add file
      
      console.log(formData)
      // Send the request to Unstructured API
      const response = await fetch('https://api.unstructuredapp.io/general/v0/general', {
        method: 'POST',
        headers: {
          'unstructured-api-key': 'FauAsZ3loP6hpfBQZwPvN8U5kY4pW2', // Add your API key
          ...formData.getHeaders(), // Automatically sets Content-Type with boundary
        },
        body: {
            'coordinates':true,
            'strategy':"hi_res",
            'files':req.file.buffer
        },
      });
  
      // Parse the response
      const data = await response.json();
  
      // Handle API errors
      if (!response.ok) {
        console.error('Unstructured API Error:', data);
        return res.status(response.status).json({ error: data });
      }
  
      // Send the response to the client
      res.json(data);
    } catch (error) {
      console.error('Error processing PDF:', error);
      res.status(500).json({ error: 'Failed to process PDF' });
    }
  };