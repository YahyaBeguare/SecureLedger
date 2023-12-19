import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

const FileUpload = ({getContent, getName, getCommit}) => {
  
  
  const [fileContent, setFileContent] = useState(null);
  const [fileName, setFileName] = useState('');
  const[commit, setCommit]= useState('');


  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];

    // Read file content
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      getContent(content);
      setFileContent(content);
    };
    reader.readAsText(file);

    // Set file name
    getName(file.name);
    setFileName(file.name);

  };

  const handleCommit=(e)=>{
      let inputValue= e.target.value ;
      setCommit(inputValue);
      getCommit(inputValue);
  }
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
/*
  console.log("Here's the file content:", fileContent);
  console.log("Here's the file name:", fileName);
*/
  return (
    <div>
      <div {...getRootProps()} style={dropzoneStyle}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the file here...</p>
        ) : (
          <p>Drag 'n' drop a file here, or click to select a file</p>
        )}
      </div>
      <div>
        <input  type='text' value={commit} onChange={handleCommit}  placeholder='write your commit..' >
        </input>
      </div>

      {fileContent && (
        <div>
          <h3>File Content:</h3>
          <pre>{fileContent}</pre>
        </div>
      )}

      {fileName && (
        <div>
          <h3>File Name:</h3>
          <p>{fileName}</p>
        </div>
      )}
    </div>
  );
};

const dropzoneStyle = {
  border: '2px dashed #cccccc',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
};

export default FileUpload;
