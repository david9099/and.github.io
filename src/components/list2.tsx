import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { pb } from '../lib/pocketbase';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Reservation = {
  id: string;
  name: string;
  email: string;
  phone: string;
  special_requests: string;
  created: string;
};

// Constants for A4 pagination
const RECORDS_PER_PAGE = 10; // Adjusted for A4 size readability

export default function List2() {
  const [currentPage, setCurrentPage] = useState(1);

  const { data: reservations, isLoading } = useQuery<Reservation[]>({
    queryKey: ['recent-reservations'],
    queryFn: async () => {
      try {
        const records = await pb.collection('reservations').getList(1, 100, {
          sort: '-created',
        });
        return records.items;
      } catch (err) {
        console.error('Error fetching reservations:', err);
        throw new Error('Failed to fetch reservations');
      }
    },
  });

  if (isLoading) return <div className="text-center p-8">Loading...</div>;

  const totalPages = Math.ceil((reservations?.length || 0) / RECORDS_PER_PAGE);
  const startIndex = (currentPage - 1) * RECORDS_PER_PAGE;
  const currentRecords = reservations?.slice(startIndex, startIndex + RECORDS_PER_PAGE) || [];

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="max-w-[21cm] mx-auto p-6"> {/* A4 width */}
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Intake Records</h2>
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
        </div>

        <div className="min-h-[29.7cm] relative"> {/* A4 height */}
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property Details</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{record.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{record.phone}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{record.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 max-w-md break-words">{record.special_requests || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {format(new Date(record.created), 'PPp')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </button>
              
              <div className="flex items-center space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      currentPage === page
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}