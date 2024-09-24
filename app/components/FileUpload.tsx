import { useState } from 'react';

interface FileUploadProps {
  onFileUpload: (fileContent: any) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [fileName, setFileName] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = JSON.parse(e.target?.result as string);
        onFileUpload(content);
        setFileName(file.name);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div>
      <input type="file" accept=".json" onChange={handleFileChange} />
      {fileName && <p>File Uploaded: {fileName}</p>}
    </div>
  );
};

export default FileUpload;
