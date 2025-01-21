import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { pb } from '../lib/pocketbase';

export default function Agreement() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showMessage, setShowMessage] = useState<{ type: 'success' | 'error', show: boolean }>({ type: 'success', show: false });
  const { clientName, serviceProvided, mainCode, guestCode, created } = location.state || {};

  const handleSubmit = async () => {
    if (isSubmitted) return;

    try {
      // Check for duplicate client name
      const existingAgreement = await pb.collection('agreements').getFirstListItem(`clientName="${clientName}"`).catch(() => null);
      
      if (existingAgreement) {
        setShowMessage({ type: 'error', show: true });
        setTimeout(() => {
          setShowMessage({ type: 'error', show: false });
        }, 5000);
        return;
      }

      // If no duplicate, proceed with submission
      await pb.collection('agreements').create({
        clientName,
        mainCode,
        serviceProvided,
        created,
        signed: true
      });
      
      setIsSubmitted(true);
      setShowMessage({ type: 'success', show: true });
      setTimeout(() => {
        setShowMessage({ type: 'success', show: false });
        navigate('/');
      }, 5000);
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
          
          <p className="mb-6">
            (All Fees need to plus tax and disbursement). The legal fee does not cover any third-party costs. 
            Additional fees will apply if extra services are required during the transaction.
          </p>
          
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
            disabled={isSubmitted}
            className={`w-full py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isSubmitted 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500'
            }`}
          >
            {isSubmitted ? 'Agreement Submitted' : 'I Agree to Submit This Agreement'}
          </button>
        </div>

        {showMessage.show && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="bg-white rounded-lg p-8 z-10 shadow-xl max-w-md w-full mx-4">
              <p className="text-2xl text-center font-bold text-red-600">
                {showMessage.type === 'success' 
                  ? 'Your submission was successful! Thank you!' 
                  : 'Error! Duplicate value entered.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}