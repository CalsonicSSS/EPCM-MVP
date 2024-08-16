'use client';

import React, { ReactNode, useState } from 'react';
import { ExtractedPdfData, HighPotentialItem } from '@/types/responses';
import { CounterClockwiseClockIcon, CheckIcon } from '@radix-ui/react-icons';
import Modal from './Modal';

export function ExtractedDataTable({ extractedPdfData }: { extractedPdfData: ExtractedPdfData | null }): ReactNode {
  const [isDbSyncing, setIsDbSyncing] = useState(false);
  const [isBidIdentifying, setIsBidIdentifying] = useState(false);
  const [highPotentialItems, setHighPotentialItems] = useState<HighPotentialItem[]>([]);
  const [showModal, setShowModal] = useState(false);

  const formatFieldName = (name: string) => {
    return name.split(/(?=[A-Z])/).join(' ');
  };

  const handleDbSync = () => {
    setIsDbSyncing(true);
    setTimeout(() => {
      setIsDbSyncing(false);
    }, 3000);
  };

  const handleBidIdentifier = async () => {
    if (!extractedPdfData) return;

    setIsBidIdentifying(true);

    try {
      const response = await fetch('/api/identify-high-potential-bid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: extractedPdfData.items }),
      });

      if (!response.ok) {
        throw new Error('Failed to identify high potential items');
      }

      const result = await response.json();
      setHighPotentialItems(result.highPotentialItems);
      setShowModal(true);
    } catch (error) {
      console.error('Error identifying high potential items:', error);
    } finally {
      setIsBidIdentifying(false);
    }
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  if (!extractedPdfData) {
    return (
      <div className='flex items-center justify-center h-full'>
        <p className='text-gray-500 text-lg'>No PDF data extracted yet. Please upload and process a PDF.</p>
      </div>
    );
  }

  return (
    <div className='h-full overflow-auto'>
      <div className='bg-white shadow rounded-lg p-6 mb-6'>
        <h3 className='text-xl font-semibold mb-3'>Extracted PDF Information</h3>
        <dl className='grid grid-cols-2 gap-x-4 gap-y-2'>
          <dt className='font-medium text-gray-500'>Tender Description</dt>
          <dd className='text-gray-900'>{extractedPdfData.pdfInfo.tenderDescription}</dd>

          <dt className='font-medium text-gray-500'>Tender Number</dt>
          <dd className='text-gray-900'>{extractedPdfData.pdfInfo.tenderNumber}</dd>

          <dt className='font-medium text-gray-500'>Tender Currency</dt>
          <dd className='text-gray-900'>{extractedPdfData.pdfInfo.tenderCurrency}</dd>

          <dt className='font-medium text-gray-500'>Additional Currencies Allowed</dt>
          <dd className='text-gray-900'>{extractedPdfData.pdfInfo.additionalCurrenciesAllowed.join(', ')}</dd>

          <dt className='font-medium text-gray-500'>Timezone</dt>
          <dd className='text-gray-900'>{extractedPdfData.pdfInfo.timezone}</dd>

          <dt className='font-medium text-gray-500'>Offer Submission Period</dt>
          <dd className='text-gray-900'>{extractedPdfData.pdfInfo.offerSubmissionPeriod}</dd>

          <dt className='font-medium text-gray-500'>Opening Date</dt>
          <dd className='text-gray-900'>{extractedPdfData.pdfInfo.openingDate}</dd>
        </dl>
      </div>

      <div className='bg-white shadow rounded-lg p-6 flex-grow overflow-hidden flex flex-col'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-xl font-semibold'>Extracted Items</h3>
          <div>
            <button
              onClick={handleDbSync}
              disabled={isDbSyncing}
              type='button'
              className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300'
            >
              {isDbSyncing ? (
                <>
                  <svg className='animate-spin -ml-1 mr-3 h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                  </svg>
                  Syncing...
                </>
              ) : (
                <>
                  <CounterClockwiseClockIcon className='-ml-1 mr-2 h-5 w-5' aria-hidden='true' />
                  DB Sync
                </>
              )}
            </button>
            <button
              onClick={handleBidIdentifier}
              disabled={isBidIdentifying}
              type='button'
              className='ml-5 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300'
            >
              {isBidIdentifying ? (
                <>
                  <svg className='animate-spin -ml-1 mr-3 h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                  </svg>
                  Identifying...
                </>
              ) : (
                <>
                  <CheckIcon className='-ml-1 mr-2 h-5 w-5' aria-hidden='true' />
                  Bid Identifier
                </>
              )}
            </button>
          </div>
        </div>

        <div className='overflow-y-auto flex-grow'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                {Object.keys(extractedPdfData.items[0]).map((header) => (
                  <th key={header} className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50'>
                    {formatFieldName(header)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {extractedPdfData.items.map((item, index) => (
                <tr key={index}>
                  {Object.values(item).map((value, cellIndex) => (
                    <td key={cellIndex} className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h2 className='text-2xl font-bold mb-4'>High Potential Bidding Items</h2>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                {Object.keys(highPotentialItems[0] || {}).map((header) => (
                  <th key={header} className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    {formatFieldName(header)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {highPotentialItems.map((item, index) => (
                <tr key={index}>
                  {Object.values(item).map((value, cellIndex) => (
                    <td key={cellIndex} className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>
    </div>
  );
}
