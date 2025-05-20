'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { Id } from '../convex/_generated/dataModel';

interface Number {
  _id: string;
  name: string;
  site: string;
  category: string;
  phone: number;
  city: string;
  location_link: string;
  status: "none" | "called" | "no answer" | "later";
  note?: string;
}

const statusOptions: Number["status"][] = ["none", "called", "no answer", "later"];

export default function Home() {
  const [activeTab, setActiveTab] = useState<Number["status"]>(statusOptions[0]);
  const numbers = useQuery(api.data.getNumbersByStatus, { status: activeTab });
  const updateStatus = useMutation(api.data.updateNumberStatus);
  const [refetch, setRefetch] = useState(false);


  useEffect(() => {
    console.log('Numbers data:', numbers);
  }, [numbers]);

  useEffect(() => {
    if (refetch) {
      // Trigger a re-query by changing the activeTab back and forth
      setActiveTab(prev => (prev === statusOptions[0] ? statusOptions[0] : statusOptions[0]));
      setRefetch(false);
    }
  }, [refetch, statusOptions]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-2 py-4 sm:px-4">
      <h1 className="text-3xl font-extrabold mb-6 text-center tracking-tight text-gray-900">Cold Call Manager</h1>

      {/* Tabs */}
      <div className="flex w-full max-w-md overflow-x-auto mb-5 gap-2 pb-2 border-b border-gray-200 sticky top-0 bg-gray-50 z-10">
        {statusOptions.map((status) => (
          <button
            key={status}
            className={`flex-1 px-4 px-4 py-3 rounded-lg text-base font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 ${activeTab === status
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-200 text-gray-700 hover:bg-blue-100 active:bg-blue-200'} whitespace-nowrap`}
            onClick={() => setActiveTab(status)}
          >
            {status.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Data Display */}
      <div className="w-full max-w-md mx-auto">
        {numbers === undefined ? (
          <div className="flex justify-center items-center h-32">
            <span className="text-gray-400 text-lg">Loading...</span>
          </div>
        ) : numbers === null || numbers.length === 0 ? (
          <div className="flex justify-center items-center h-32">
            <span className="text-gray-400 text-lg">No data available for {activeTab} status.</span>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {numbers.map((number: Number) => (
              <div key={number._id} className="bg-white rounded-2xl shadow-lg p-5 flex flex-col gap-2 border border-gray-100">
                <div className="flex flex-col gap-1">
                  <h2 className="text-xl font-bold text-gray-800 mb-1">{number.name}</h2>
                  <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                    <span><strong>Category:</strong> {number.category}</span>
                    <span><strong>City:</strong> {number.city}</span>
                  </div>
                  <div className="flex flex-col gap-1 mt-2">
                    <span className="flex items-center"><strong>Site:</strong>&nbsp;{number.site ? <a href={number.site} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">{number.site}</a> : <span className="text-gray-400">N/A</span>}</span>
                    <span className="flex items-center"><strong>Location:</strong>&nbsp;<a href={number.location_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Map</a></span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-base"><strong>Phone:</strong> {number.phone}</span>
                    <button
                      onClick={async () => {
                        window.location.href = `tel:+${number.phone}`;
                        await updateStatus({ documentId: number._id as Id<"numbers">, status: "called" });
                        setRefetch(true);
                      }}
                      className="ml-2 px-4 py-2 rounded-lg bg-green-500 text-white text-base font-semibold shadow hover:bg-green-600 active:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                      Call
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2 text-sm items-center">
                    <span><strong>Status:</strong> <span className={`px-2 py-1 rounded-lg ${number.status === 'called' ? 'bg-green-100 text-green-700' : number.status === 'no answer' ? 'bg-red-100 text-red-700' : number.status === 'later' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-200 text-gray-700'}`}>{number.status}</span></span>
                    <select
                      className="ml-2 px-2 py-1 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={number.status}
                      onChange={async (e) => {
                        const newStatus = e.target.value as Number['status'];
                        if (newStatus !== number.status) {
                          await updateStatus({ documentId: number._id as Id<'numbers'>, status: newStatus });
                          setRefetch(true);
                        }
                      }}
                    >
                      {statusOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    {number.note && <span><strong>Note:</strong> <span className="italic text-gray-500">{number.note}</span></span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}