'use client';

import { useState } from 'react';
import FileUpload from './components/FileUpload';
import MultiSelect from './components/MultiSelect';

const Home: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<any>(null);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [augmentedData, setAugmentedData] = useState<any>(null);
  const [loading, setLoading] = useState(false); // loading state for UI feedback
  const [error, setError] = useState<string | null>(null); // error state for handling errors

  const handleFileUpload = (fileContent: any) => {
    setUploadedFile(fileContent);
    setError(null); // clear previous errors when a new file is uploaded
  };

  const handleSelectChange = (selectedOptions: string[]) => {
    setSelectedFields(selectedOptions);
    setError(null); // clear previous errors when new fields are selected
  };

  const handleAugmentData = async () => {
    if (!uploadedFile || selectedFields.length === 0) {
      setError('Please upload a file and select at least one field.');
      return;
    }

    setLoading(true); // show loading spinner
    setError(null); // clear previous errors

    try {
      const response = await fetch('/api/fetchDetails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          places: uploadedFile.features,
          selectedFields,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data from the API');
      }

      const data = await response.json();

      if (!data || data.length === 0) {
        throw new Error('No data was returned. Please check the Google API or input.');
      }

      setAugmentedData(data);
    } catch (err:any) {
      setError(err.message || 'An error occurred during augmentation.');
    } finally {
      setLoading(false); // hide loading spinner
    }
  };

  const handleDownload = () => {
    if (!augmentedData) return;

    const blob = new Blob([JSON.stringify(augmentedData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'augmented-geojson.json';
    a.click();
  };

  return (
    <div>
      <h1>GeoJSON Augmenter</h1>
      <FileUpload onFileUpload={handleFileUpload} />
      <MultiSelect onSelectChange={handleSelectChange} />
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error messages */}

      <button
        onClick={handleAugmentData}
        disabled={!uploadedFile || selectedFields.length === 0 || loading}
      >
        {loading ? 'Augmenting...' : 'Augment Data'} {/* Show loading text */}
      </button>

      {augmentedData && (
        <div>
          <h2>Download Augmented Data</h2>
          <button onClick={handleDownload}>Download JSON</button>
        </div>
      )}
    </div>
  );
};

export default Home;
