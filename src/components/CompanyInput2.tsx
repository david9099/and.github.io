import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { pb } from '../lib/pocketbase';
import { useQuery } from '@tanstack/react-query';

type CompanyFormData = {
  mainCode: string;
  clientName: string;
  serviceProvided: string;
};

export default function CompanyInput2() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginCode, setLoginCode] = useState('');
  const [error, setError] = useState('');
  const [showDuplicateError, setShowDuplicateError] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CompanyFormData>();

  const { data: previousCode } = useQuery({
    queryKey: ['previous-code'],
    queryFn: async () => {
      const records = await pb.collection('company_records').getList(1, 1, {
        sort: '-created',
        fields: 'mainCode'
      });
      return records.items[0]?.mainCode;
    },
    enabled: isLoggedIn
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginCode === '3362') {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Invalid login code');
    }
  };

  const onSubmit = async (data: CompanyFormData) => {
    try {
      // Check for duplicate main code
      const existingRecord = await pb.collection('company_records').getFirstListItem(`mainCode="${data.mainCode}"`).catch(() => null);
      
      if (existingRecord) {
        setShowDuplicateError(true);
        setTimeout(() => {
          setShowDuplicateError(false);
        }, 5000);
        return;
      }

      await pb.collection('company_records').create(data);
      const result = window.confirm('Thank you!');
      if (result) {
        navigate('/guest-signin');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Error submitting record');
    }
  };

  const handleListClick = () => {
    navigate('/list');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Company Input2
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="login-code" className="sr-only">Login Code</label>
              <input
                id="login-code"
                type="password"
                value={loginCode}
                onChange={(e) => setLoginCode(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter login code"
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Company Input Form</h2>
        
        {previousCode && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Previous Main Code:</h3>
            <p className="text-gray-600">{previousCode}</p>
          </div>
        )}

        {showDuplicateError && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="bg-white rounded-lg p-8 z-10 shadow-xl max-w-md w-full mx-4">
              <p className="text-2xl text-center font-bold text-red-600">
                Error! Duplicate value entered.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="mainCode" className="block text-sm font-medium text-gray-700">
              Main Code
            </label>
            <input
              type="text"
              {...register('mainCode', { required: 'Main code is required' })}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
            />
            {errors.mainCode && (
              <p className="mt-1 text-sm text-red-600">{errors.mainCode.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">
              Client Name
            </label>
            <input
              type="text"
              {...register('clientName', { required: 'Client name is required' })}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
            />
            {errors.clientName && (
              <p className="mt-1 text-sm text-red-600">{errors.clientName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="serviceProvided" className="block text-sm font-medium text-gray-700">
              Service Provided
            </label>
            <input
              type="text"
              {...register('serviceProvided', { required: 'Service provided is required' })}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
            />
            {errors.serviceProvided && (
              <p className="mt-1 text-sm text-red-600">{errors.serviceProvided.message}</p>
            )}
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
            
            <button
              type="button"
              onClick={handleListClick}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              View List
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}