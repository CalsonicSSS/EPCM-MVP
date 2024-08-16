import PdfUploader from '@/components/PdfUploader';
import { ReactNode } from 'react';

export default function DashboardPage(): ReactNode {
  return (
    <div className='flex-1 flex h-full p-5'>
      <div className='w-[45%]  h-full'>
        <PdfUploader />
      </div>
      <div className='w-[55%] '>
        <p>This is the right side content.</p>
      </div>
    </div>
  );
}
