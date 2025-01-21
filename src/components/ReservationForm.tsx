import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { pb } from '../lib/pocketbase';

type ReservationFormData = {
  name: string;
  email: string;
  phone: string;
  special_requests?: string;
};

export default function ReservationForm() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ReservationFormData>();
  const [showThankYou, setShowThankYou] = useState(false);

  const onSubmit = async (data: ReservationFormData) => {
    try {
      const formData = {
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        special_requests: data.special_requests?.trim() || ''
      };

      await pb.collection('reservations').create(formData);
      reset();
      setShowThankYou(true);
      setTimeout(() => {
        setShowThankYou(false);
      }, 5000);
    } catch (error) {
      console.error('Form submission error:', error);
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      } else {
        alert('Error submitting form. Please try again.');
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Please fill the following</h1>
        <p className="text-orange-600 mb-6 italic">We keep your information confidential and will not disclose it to anyone without your consent.</p>
        
        {showThankYou && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="bg-white rounded-lg p-8 z-10 shadow-xl max-w-md w-full mx-4">
              <p className="text-4xl text-center font-bold text-red-600">
                You have submitted information. Thank you!
              </p>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name <span className="text-gray-500 text-sm">(Last name, First name)</span>
            </label>
            <input
              id="name"
              type="text"
              {...register('name', { required: 'Name is required' })}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              id="phone"
              type="tel"
              {...register('phone', { 
                required: 'Phone is required',
                pattern: {
                  value: /^[0-9-+\s()]*$/,
                  message: 'Invalid phone number'
                }
              })}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
          </div>

          <div>
            <label htmlFor="special_requests" className="block text-sm font-medium text-gray-700">Transaction / Property address</label>
            <textarea
              id="special_requests"
              {...register('special_requests')}
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
}