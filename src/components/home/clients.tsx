'use client';

import React, { useState, useEffect } from 'react';

interface Client {
  _id?: string;
  name: string;
  logo: string;
  website?: string;
  description?: string;
  isActive: boolean;
  order: number;
}

const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients');
      const data = await response.json();
      if (data.success && data.data) {
        // Filter active clients and sort by order
        const activeClients = data.data
          .filter((client: Client) => client.isActive)
          .sort((a: Client, b: Client) => a.order - b.order);
        setClients(activeClients);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (clients.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by <span className="text-blue-600">Industry Leaders</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We are proud to work with leading companies across various industries
          </p>
        </div>

        {/* Clients Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8 items-center">
          {clients.map((client) => (
            <div
              key={client._id}
              className="group"
            >
              {client.website ? (
                <a
                  href={client.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                  title={client.name}
                >
                  <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                    <img
                      src={client.logo}
                      alt={client.name}
                      className="w-full h-16 object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                </a>
              ) : (
                <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="w-full h-16 object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Optional: Scrolling animation for many clients */}
        {clients.length > 6 && (
          <div className="mt-12 relative overflow-hidden">
            <div className="flex space-x-8 animate-scroll">
              {[...clients, ...clients].map((client, index) => (
                <div
                  key={`${client._id}-${index}`}
                  className="flex-shrink-0"
                >
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="h-12 w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 20s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default Clients;