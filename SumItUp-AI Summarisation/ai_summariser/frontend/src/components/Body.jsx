import React, { useState } from 'react'
import pdfToText from 'react-pdftotext'
import html2pdf from 'html2pdf.js';
import ReactMarkdown from 'react-markdown';
import { marked } from 'marked';

const Body = () => {
  const [fileName,setFileName] = useState('');
  const [file,setFile] = useState(null);
  const [fileText,setFileText] = useState('');
  const [selectedOption,setSelectedOption] = useState("");
  const [summary,setSummary] = useState("");
  const [opFileName,setOpFileName] = useState("");

  const handleRadioChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if(selectedFile){
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setOpFileName(selectedFile.name.replace(/\.pdf$/i, ''));
    }
  };
  
  const handleCopy = async() => {
    try {
      if(summary==="") return;
      await navigator.clipboard.writeText(summary);
      alert("Copied to clipboard");
    }catch(err){
      console.error("Coudnt copy to clipboard.");
    }
  };

  const handleDownload = () => {
    if(summary===""){
      alert("No summary found");
      return;
    }
    const htmlContent = marked(summary); // Convert Markdown to HTML
    const opt = {
      margin:       1,
      filename:     `${opFileName}.pdf`,
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Create a temporary container for rendering HTML
    const element = document.createElement('div');
    element.innerHTML = htmlContent;
    document.body.appendChild(element);

    html2pdf().set(opt).from(element).save().then(() => {
      document.body.removeChild(element); // clean up
    });
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    if(!file || !selectedOption){
      alert("Please select a file and summary type");
      return;
    }
    try{
      const text = await pdfToText(file);
      setFileText(text);
      setOpFileName(fileName.replace(/\.pdf$/i, ''));
      const response = await fetch("http://localhost:5000/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text:text,
          summary_type:selectedOption,  
        }),
      });
      const data = await response.json();
      setSummary(data.summary);
    }
    catch(err){
      console.error(err);
    }
  };
  return (
    <div className='flex flex-col items-center justify-center gap-5 w-full h-[85%] font-redhat bg-bcol '>
      
        <div className='flex flex-col xl:flex-row gap-2 justify-around xl:justify-center items-center bg-ycol rounded-2xl h-[17%] xl:h-[15%] w-[85%] p-3'>
          <div className='flex justify-center items-center bg-white w-[85%] xl:w-[55%] h-[50%] xl:h-[80%] rounded-xl p-3 overflow-x-hidden overflow-y-hidden'>
            <input type="file" 
              id="fileInput"
              accept="application/pdf"
              onChange={handleFileChange}
              style={{display:'none'}}
              />
              <label htmlFor="fileInput" className='font-semibold  cursor-pointer'>
                { fileName ? fileName : "Click here to Upload a PDF" }
              </label>
          </div>
          <div className='flex flex-row w-[80%] xl:w-[35%] h-[50%] xl:h-[80%] justify-around items-center gap-2'>
            <div className='flex flex-col justify-center bg-white w-[40%] xl:w-[40%] h-full rounded-xl pl-3'>
              <label>
                <input
                  type="radio"
                  value="Short"
                  checked={selectedOption === "Short"}
                  onChange={handleRadioChange}
                />
                <span className="ml-2 text-l">Short</span>
              </label>
              <label> 
                <input
                  type="radio"
                  value="Detailed"
                  checked={selectedOption === "Detailed"}
                  onChange={handleRadioChange}
                />
                <span className="ml-2">Detailed</span>
              </label>
            </div>
            <button className='bg-white w-[40%] h-full rounded-xl font-bold text-xl justify-center items-center hover:bg-bcol hover:text-white'
            onClick={handleSubmit}>
              Submit
            </button>
          </div>
          


      </div>
      <div className='flex flex-col bg-white h-[75%] w-[85%] rounded-2xl border-blue-500'>
          <div className='flex justify-between px-6 bg-white h-[12%] w-full rounded-t-2xl'>
            <div  className='flex justify-center items-center'>
                <input type="text" value={opFileName} placeholder={opFileName} className='outline-none focus:outline-none' onChange={(e) => setOpFileName(e.target.value)}/>
            </div>
            <div className='flex justify-center items-center gap-4'>
              <button><img src="public\copy.png" alt="" className='max-h-8' onClick={handleCopy}/></button>
              <button><img src="public\download.png" alt="" className='max-h-8' onClick={handleDownload}/></button>
            </div>
            
          </div>
          <div  className='prose prose-lg max-w-none  bg-ycol h-[88%] w-full rounded-b-2xl overflow-y-auto p-8'>
              <ReactMarkdown>{summary ? summary : ""}</ReactMarkdown>
          </div>
      </div>
    </div>
  )
}

export default Body
