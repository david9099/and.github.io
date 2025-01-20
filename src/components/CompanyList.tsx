import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { pb } from '../lib/pocketbase';
import { useNavigate } from 'react-router-dom';

type CompanyRecord = {
  id: string;
  mainCode: string;
  clientName: string;
  created: string;
};

type Agreement = {
  id: string;
  clientName: string;
  created: string;
};

type Reservation = {
  id: string;
  name: string;
  email: string;
  phone: string;
  special_requests: string;
  created: string;
};

export default function CompanyList() {
  const navigate = useNavigate();

  const { data: companyRecords, isLoading: isLoadingCompany } = useQuery<CompanyRecord[]>({
    queryKey: ['company-records'],
    queryFn: async () => {
      const records = await pb.collection('company_records').getList(1, 5, {
        sort: '-created',
      });
      return records.items;
    },
  });

  const { data: agreements, isLoading: isLoadingAgreements } = useQuery<Agreement[]>({
    queryKey: ['agreements'],
    queryFn: async () => {
      const records = await pb.collection('agreements').getList(1, 100, {
        sort: '-created',
      });
      return records.items;
    },
  });

  const { data: reservations, isLoading: isLoadingReservations } = useQuery<Reservation[]>({
    queryKey: ['reservations'],
    queryFn: async () => {
      const records = await pb.collection('reservations').getList(1, 5, {
        sort: '-created',
      });
      return records.items;
    },
  });

  if (isLoadingCompany || isLoadingReservations || isLoadingAgreements) {
    return <div className="text-center p-8">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Records List</h1>
        <button
          onClick={() => navigate('/company-input2')}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          Back
        </button>
      </div>

      {/* Company Input2 Records */}
      <div className="bg-white shadow-xl rounded-lg overflow-hidden mb-8">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Retainer Record</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Main Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">signedDate</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {companyRecords?.map((record) => {
                const matchingAgreement = agreements?.find(
                  agreement => agreement.clientName === record.clientName
                );
                
                return (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.mainCode}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.clientName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(record.created), 'PPp')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {matchingAgreement ? format(new Date(matchingAgreement.created), 'PPp') : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* First Page Records */}
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Intake Record</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/6">Transaction / Property Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Created</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reservations?.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-md break-words">{record.special_requests || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(record.created), 'PPp')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}