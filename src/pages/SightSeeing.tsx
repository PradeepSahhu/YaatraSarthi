import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

// Define type for destination properties
interface Destination {
  CityName: string;
  description: string;
  ImageList: string[];
  country: string;
  bestTime: string;
  SightseeingName: string;
  TourDescription: string;
  BasePrice: number; // Changed from Price.BasePrice structure
}

// Destination plate component
const DestinationPlate: React.FC<{ destination: Destination }> = ({ destination }) => (
  <div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 mb-8 rounded-xl overflow-hidden shadow-lg transform transition duration-300 ease-in-out hover:scale-105">
    <img
      src={destination.ImageList[0]}
      alt={destination.CityName}
      className="w-full h-56 object-cover"
    />
    <div className="p-4 bg-gray-900 text-white">
      <h3 className="text-lg font-bold">{destination.CityName}</h3>
      <p className="text-gray-400 mt-2 text-sm">{destination.SightseeingName}</p>
      <div className="mt-4">
        <div className="flex items-center text-sm text-gray-300">
          <MapPin className="mr-2" size={16} />
          <span>{destination.country}</span>
        </div>
        <p className="mt-2">Best Time to Visit: <span className="font-semibold">{destination.bestTime}</span></p>
        <p className="mt-1">Price: <span className="font-semibold">{destination.BasePrice} INR</span></p>
      </div>
      <div className="flex justify-end mx-6 py-4">
        <button className="text-blue-500">Read More</button>
      </div>
    </div>
  </div>
);

// Section to display all destinations
const PlacesSection: React.FC<{ destinations: Destination[] }> = ({ destinations }) => (
  <section className="py-16 bg-gray-900">
    <div className="max-w-7xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-center text-blue-400 mb-8">Explore Amazing Destinations</h2>
      <div className="flex flex-wrap justify-center">
        {destinations.map((destination, index) => (
          <div key={index} className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 p-4">
            <DestinationPlate destination={destination} />
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Loading Spinner
const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center py-16">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-400 border-solid"></div>
  </div>
);

// Footer Component
const Footer: React.FC = () => (
  <footer className="bg-gray-800 text-white py-8 text-center">
    <p>&copy; 2025 Travel Destinations. All rights reserved.</p>
  </footer>
);

// Main SightSeeing component
const SightSeeing: React.FC = () => {
  // State to store fetched sightseeing data
  const [sightSeeingData, setSightSeeingData] = useState<Destination[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API when the component mounts
  useEffect(() => {
    const getSightSeeingData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/sightSeeing/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ countryName: "France" }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        setSightSeeingData(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getSightSeeingData();
  }, []);

  return (
    <div className="bg-gray-800 text-white">
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-center text-red-500 py-16">{`Error: ${error}`}</div>
      ) : (
        <PlacesSection destinations={sightSeeingData} />
      )}
      <Footer />
    </div>
  );
}

export default SightSeeing;