'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';

export default function DataFiles() {
  const [csvFiles, setCsvFiles] = useState<string[]>([]);

  useEffect(() => {
    const fetchCsvFiles = async () => {
      try {
        const response = await fetch('/api/data');
        const files = await response.json();
        setCsvFiles(files);
      } catch (error) {
        console.error('Error fetching CSV files:', error);
      }
    };
    fetchCsvFiles();
  }, []);

  return (
    <div className="flex flex-col gap-2">
      {csvFiles.map((file, index) => (
        <Button key={index} variant="outline">
          {file}
        </Button>
      ))}
    </div>
  );
}
