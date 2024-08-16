'use client';

import { FileDetails } from '@/types/statesAndConstants';
import React, { ChangeEvent, DragEvent, ReactNode, useRef, useState } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { FileIcon } from '@radix-ui/react-icons';

export default function PdfUploader(): ReactNode {
  const [uploadedPdf, setUploadedPdf] = useState<File | null>(null);
  const [readedPdf, setReadedPdf] = useState<string | null>(null);
  const [fileDetails, setFileDetails] = useState<FileDetails | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setUploadedPdf(selectedFile);
      let reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === 'string') {
          setReadedPdf(e.target.result);
        } else {
          // Handle the case where e.target.result is null or not a string
          setReadedPdf(null);
        }
      };

      setFileDetails({
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
      });
    } else {
      alert('Please select a PDF file.');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setUploadedPdf(droppedFile);
      let reader = new FileReader();
      reader.readAsDataURL(droppedFile);
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === 'string') {
          setReadedPdf(e.target.result);
        } else {
          // Handle the case where e.target.result is null or not a string
          setReadedPdf(null);
        }
      };
      setFileDetails({
        name: droppedFile.name,
        size: droppedFile.size,
        type: droppedFile.type,
      });
    } else {
      alert('Please drop a PDF file.');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const newplugin = defaultLayoutPlugin();

  return (
    <div className='w-full h-full flex flex-col'>
      {/* handle pdf file upload */}
      <div className='border-2 border-line border-gray-300 rounded-xl px-5 py-3 mb-5'>
        {uploadedPdf && fileDetails && readedPdf ? (
          <div className='flex justify-between items-center'>
            <div>
              <p className='text-green-600 font-semibold'>File uploaded:</p>
              <p>Name: {fileDetails.name}</p>
              <div className='flex justify-center'>
                <p>Size: {(fileDetails.size / 1024 / 1024).toFixed(2)} MB</p>
                <p className='ml-3'>Type: {fileDetails.type}</p>
              </div>
            </div>
            <div className='flex flex-col'>
              <button
                onClick={() => fileInputRef.current?.click()}
                type='button'
                className='mb-3 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              >
                <FileIcon className='-ml-1 mr-2 h-5 w-5' aria-hidden='true' />
                {/* this input tag has default styling (choose file + button), we use className='hidden' to hide this tag entirely and use ref to link this input with button through click action*/}
                <input type='file' accept='.pdf' onChange={handleFileChange} ref={fileInputRef} className='hidden' />
                Upload Another PDF
              </button>
              <button
                onClick={() => {}}
                type='button'
                className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              >
                <FileIcon className='-ml-1 mr-2 h-5 w-5' aria-hidden='true' />
                {/* this input tag has default styling (choose file + button), we use className='hidden' to hide this tag entirely and use ref to link this input with button through click action*/}
                Process Current PDF
              </button>
            </div>
          </div>
        ) : (
          <p className='text-green-600 font-semibold'>No File Details</p>
        )}
      </div>
      {/* ------------------------------------------------------------------------------------------------ */}
      {/* handle pdf rendering / viewing */}
      <div className='flex-1 overflow-hidden'>
        {readedPdf ? (
          <Worker workerUrl='https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js'>
            <div style={{ height: '100%' }}>
              <Viewer fileUrl={readedPdf} plugins={[newplugin]} />
            </div>
          </Worker>
        ) : (
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className='flex items-center justify-center h-full bg-gray-150 rounded-lg border-2 border-dashed border-gray-300 text-center cursor-pointer'
          >
            <input type='file' accept='.pdf' onChange={handleFileChange} ref={fileInputRef} className='hidden' />
            <div className='text-center'>
              <FileIcon className='mx-auto h-12 w-12 text-gray-400' />
              <h3 className='mt-2 text-sm font-semibold text-gray-900'>No PDF uploaded</h3>
              <p className='mt-1 text-sm text-gray-500'>Drag and drop a PDF file here, or click to select one</p>
              <div className='mt-6'>
                <button
                  type='button'
                  className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                >
                  <FileIcon className='-ml-1 mr-2 h-5 w-5' aria-hidden='true' />
                  Upload PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
