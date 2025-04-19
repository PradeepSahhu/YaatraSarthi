import { useState, useEffect } from "react";
import axios from "axios";

interface Hotel {
  id: number;
  name: string;
  location: string;
  price: number;
  rating: number;
  imageUrl: string;
}

const HotelBookingPage: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");

  useEffect(() => {
    if (selectedCountry) {
      fetchHotels(selectedCountry);
    }
  }, [selectedCountry]);

  const fetchHotels = async (country: string) => {
    try {
      const response = await axios.get<Hotel[]>(`/api/hotels?country=${country}`);
      setHotels(response.data);
    } catch (error) {
      console.error("Error fetching hotels:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Hotel Booking</h1>
      <select
        className="p-2 border rounded mb-4"
        value={selectedCountry}
        onChange={(e) => setSelectedCountry(e.target.value)}
      >
        <option value="">Select a country</option>
        <option value="USA">USA</option>
        <option value="India">India</option>
        <option value="UK">UK</option>
      </select>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {hotels.map((hotel) => (
          <div key={hotel.id} className="border rounded-lg p-4 shadow-lg">
            <img src={hotel.imageUrl} alt={hotel.name} className="w-full h-48 object-cover rounded" />
            <h2 className="text-lg font-semibold mt-2">{hotel.name}</h2>
            <p className="text-gray-600">{hotel.location}</p>
            <p className="text-blue-600 font-bold">${hotel.price}/night</p>
            <p className="text-yellow-500">⭐ {hotel.rating}</p>
            <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Book Now</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotelBookingPage;
