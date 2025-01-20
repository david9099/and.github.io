import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { pb } from '../lib/pocketbase';

export default function Agreement() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clientName, serviceProvided, mainCode, guestCode, created } = location.state || {};

  const handleSubmit = async () => {
    try {
      await pb.collection('agreements').create({
        clientName,
        mainCode,
        serviceProvided,
        created,
        signed: true
      });
      
      const result = window.confirm('Thank you!');
      if (result) {
        navigate('/');
      }
    } catch (error) {
      console.error('Error submitting agreement:', error);
      alert('Error submitting agreement. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">General Retainer Agreement</h1>
        
        <div className="prose max-w-none">
          <p className="mb-6">
            This Legal Services Retainer Agreement is made between Xinyu Zou, Barrister and Solicitor, 
            herein referred to as "Attorney," who is retained by "{clientName}", herein referred to as 
            "Clients," in the matter of the following services:
          </p>
          
          <p className="mb-6">"{serviceProvided}"</p>
          
          <p className="mb-6">With client code of "{guestCode}"</p>
          
          <p className="mb-6">{mainCode}</p>
          
          <p className="mb-6">
            All services will be conducted by Wilson Xinyu Zou or a member of his team in relation to 
            the above-noted matter. If there are other matters for which I may require legal representation, 
            I understand that a further retainer will be required.
          </p>
          
          <p className="mb-6">
            Subject to the Client's written instructions, the Client requests that the Attorney may take 
            any action that he deems necessary and appropriate to assist the Client in completing the 
            Retainer. The services shall commence on the date of retainer and end upon the completion 
            of the services performed or on closing, and upon either party terminating this agreement. 
            The Client acknowledges that no guarantee has been provided by the Attorney with respect to 
            the ultimate disposition of this matter.
          </p>
          
          <p className="mb-6">I have read this agreement carefully, understand, and agree with its terms.</p>
          
          <div className="mb-6">
            <p>The foregoing is agreed to by:</p>
            <p>Solicitor: Xinyu Zou</p>
            <p>Client: {clientName}</p>
            <p>Date: {format(new Date(created), 'PPP')}</p>
          </div>
        </div>
        
        <div className="mt-8">
          <button
            onClick={handleSubmit}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            I Agree to Submit This Agreement
          </button>
        </div>
      </div>
    </div>
  );
}