'use client';

import { useState, useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';

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

  useEffect(() => {
    console.log('Numbers data:', numbers);
  }, [numbers]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Cold Call Manager</h1>

      {/* Tabs */}
      <div className="flex overflow-x-auto mb-4">
        {statusOptions.map((status) => (
          <button
            key={status}
            className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === status
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} mr-2 whitespace-nowrap`}
            onClick={() => setActiveTab(status)}
          >
            {status.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Data Display */}
      <div>
        {numbers === undefined ? (
          <p>Loading...</p>
        ) : numbers === null || numbers.length === 0 ? (
          <p>No data available for {activeTab} status.</p>
        ) : (
          <div className="grid gap-4 grid-cols-1">
            {numbers.map((number: Number) => (
              <div key={number._id} className="bg-white rounded-md shadow-md p-4">
                <h2 className="text-lg font-semibold">{number.name}</h2>
                <p><strong>Site:</strong> {number.site ? <a href={number.site} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{number.site}</a> : number.site}</p>
                <p><strong>Category:</strong> {number.category}</p>
                <p>
                  <strong>Phone:</strong> {number.phone}
                  <button
                    onClick={() => {
                      window.location.href = `tel:+${number.phone}`;
                    }}
                    className="ml-2 px-2 py-1 rounded-md bg-green-500 text-white text-sm"
                  >
                    Call
                  </button>
                </p>
                <p><strong>City:</strong> {number.city}</p>
                <a href={number.location_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Location Link</a>
                <p><strong>Status:</strong> {number.status}</p>
                {number.note && <p><strong>Note:</strong> {number.note}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
