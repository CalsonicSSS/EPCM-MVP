'use client';

import { ExtractedDataTable } from '@/components/ExtractedDataTable';
import PdfUploader from '@/components/PdfUploader';
import { ExtractedPdfData } from '@/types/responses';
import { ReactNode, useState } from 'react';

export default function DashboardPage(): ReactNode {
  const [extractedPdfData, setExtractedPdfData] = useState<ExtractedPdfData | null>(null);

  console.log('extractedPdfData:', extractedPdfData);

  return (
    <div className='flex-1 flex h-full py-5 px-8'>
      <div className='w-[45%]  h-full'>
        <PdfUploader setExtractedPdfData={setExtractedPdfData} />
      </div>
      <div className='w-[55%] h-full overflow-hidden ml-10'>
        <ExtractedDataTable extractedPdfData={extractedPdfData} />
      </div>
    </div>
  );
}
