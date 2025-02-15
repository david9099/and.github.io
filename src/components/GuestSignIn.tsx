import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pb } from '../lib/pocketbase';

export default function GuestSignIn() {
  const [guestCode, setGuestCode] = useState('');
  const [clientName, setClientName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const record = await pb.collection('company_records').getFirstListItem(`mainCode="${guestCode}"`);
      
      if (record) {
        // Normalize both names by removing spaces, commas and converting to lowercase
        const normalizedRecordName = record.clientName.toLowerCase().replace(/[\s,]/g, '');
        const normalizedInputName = clientName.toLowerCase().replace(/[\s,]/g, '');
        
        if (normalizedRecordName === normalizedInputName) {
          navigate('/agreement', { 
            state: { 
              clientName: record.clientName, // Use the original record name for consistency
              serviceProvided: record.serviceProvided,
              guestCode: guestCode,
              created: new Date().toISOString()
            }
          });
        } else {
          setError('Client name does not match our records');
          setTimeout(() => setError(''), 3000);
        }
      } else {
        setError('Invalid guest code');
        setTimeout(() => {
          navigate('/code-error');
        }, 1500);
      }
    } catch (error) {
      setError('Invalid guest code');
      setTimeout(() => {
        navigate('/code-error');
      }, 1500);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Guest Sign In</h2>
        
        <div className="mb-8">
          <p className="text-gray-600 mb-4">Please enter your guest code and client name to access the agreement.</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="guestCode" className="block text-sm font-medium text-gray-700">
                Guest Code
              </label>
              <input
                type="text"
                id="guestCode"
                value={guestCode}
                onChange={(e) => setGuestCode(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
                placeholder="Enter your guest code"
                required
              />
            </div>

            <div>
              <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">
                Client Name
              </label>
              <input
                type="text"
                id="clientName"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
                placeholder="Enter your client name"
                required
              />
            </div>
            
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}