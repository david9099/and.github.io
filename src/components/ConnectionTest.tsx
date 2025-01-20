import React, { useEffect, useState } from 'react';
import { pb } from '../lib/pocketbase';

export default function ConnectionTest() {
  const [status, setStatus] = useState<{
    connected: boolean;
    authenticated: boolean;
    collections: string[];
    error?: string;
  }>({
    connected: false,
    authenticated: false,
    collections: [],
  });

  useEffect(() => {
    async function testConnection() {
      try {
        // Test basic connection
        await pb.health.check();
        setStatus(prev => ({ ...prev, connected: true }));
        
        try {
          // Try to authenticate as admin
          await pb.admins.authWithPassword('admin@admin.com', 'admin123');
          
          // Get collections list
          const collections = await pb.collections.getList();
          const collectionNames = collections.items.map(col => col.name);

          setStatus({
            connected: true,
            authenticated: true,
            collections: collectionNames,
          });
        } catch (authError) {
          console.error('Auth error:', authError);
          setStatus(prev => ({
            ...prev,
            authenticated: false,
            error: 'Authentication failed. Please ensure admin account exists with email: admin@admin.com and password: admin123'
          }));
        }
      } catch (error) {
        console.error('Connection error:', error);
        setStatus({
          connected: false,
          authenticated: false,
          collections: [],
          error: error instanceof Error ? error.message : 'Unknown error occurred'
        });
      } finally {
        // Clear admin authentication after test
        pb.authStore.clear();
      }
    }

    testConnection();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-4">PocketBase Connection Test</h2>
        
        <div className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center">
            <span className="font-medium mr-2">Connection Status:</span>
            {status.connected ? (
              <span className="text-green-600 flex items-center">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Connected
              </span>
            ) : (
              <span className="text-red-600 flex items-center">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Not Connected
              </span>
            )}
          </div>

          {/* Authentication Status */}
          <div className="flex items-center">
            <span className="font-medium mr-2">Authentication Status:</span>
            {status.authenticated ? (
              <span className="text-green-600 flex items-center">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Authenticated
              </span>
            ) : (
              <span className="text-red-600 flex items-center">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Not Authenticated
              </span>
            )}
          </div>

          {status.error && (
            <div className="text-red-600 bg-red-50 p-4 rounded-md">
              <p className="font-medium">Error:</p>
              <p>{status.error}</p>
            </div>
          )}

          {status.connected && (
            <div className="mt-4">
              <p className="font-medium mb-2">Available Collections:</p>
              {status.collections.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1">
                  {status.collections.map(collection => (
                    <li key={collection} className="text-gray-700">{collection}</li>
                  ))}
                </ul>
              ) : (
                <div className="bg-yellow-50 p-4 rounded-md">
                  <p className="text-yellow-800 font-medium">No collections found. Please create the following:</p>
                  <div className="mt-2">
                    <p className="font-medium">1. Create "reservations" collection with fields:</p>
                    <ul className="list-disc ml-5 mt-1 space-y-1 text-yellow-700">
                      <li>name (text, required)</li>
                      <li>email (text, required)</li>
                      <li>phone (text, required)</li>
                      <li>date (date)</li>
                      <li>special_requests (text)</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}