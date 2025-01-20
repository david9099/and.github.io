import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Calendar, Mail, Phone } from 'lucide-react';
import { pb } from '../lib/pocketbase';
import { useNavigate } from 'react-router-dom';

type Reservation = {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string | null;
  special_requests: string;
  created: string;
};

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Check if admin is logged in
  React.useEffect(() => {
    if (!pb.authStore.isValid) {
      navigate('/admin');
    }
  }, [navigate]);

  const { data: reservations, isLoading, error } = useQuery<Reservation[]>({
    queryKey: ['reservations'],
    queryFn: async () => {
      try {
        const records = await pb.collection('reservations').getList(1, 10, {
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
  if (error) return <div className="text-center p-8 text-red-600">Error loading reservations</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reservation Dashboard</h1>
        <button
          onClick={() => {
            pb.authStore.clear();
            navigate('/admin');
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
      
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800">Recent Reservations</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {reservations?.map((reservation) => (
            <div key={reservation.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">{reservation.name}</h3>
                <span className="text-sm text-gray-500">
                  Submitted: {format(new Date(reservation.created), 'PPp')}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reservation.date && (
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>{format(new Date(reservation.date), 'PP')}</span>
                  </div>
                )}
                
                <div className="flex items-center text-gray-600">
                  <Mail className="h-5 w-5 mr-2" />
                  <a href={`mailto:${reservation.email}`} className="hover:text-indigo-600">
                    {reservation.email}
                  </a>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Phone className="h-5 w-5 mr-2" />
                  <a href={`tel:${reservation.phone}`} className="hover:text-indigo-600">
                    {reservation.phone}
                  </a>
                </div>
              </div>
              
              {reservation.special_requests && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    <strong>Special Requests:</strong> {reservation.special_requests}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}