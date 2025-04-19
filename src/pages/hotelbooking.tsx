import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, Search, Users, MapPin, Star, Heart, Coffee, Wifi, Bed, Tv, Dumbbell, Waves, Mountain, X, ChevronLeft, ChevronRight, Utensils, Check, AlertTriangle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { format, addDays, differenceInDays } from 'date-fns';
import { Alert, AlertDescription } from "@/components/ui/alert";


const HotelBookingPage = () => {
  const navigate = useNavigate();

  // First, define proper types for your data
  interface Room {
    type: string;
    price: number;
    capacity: number;
  }

  interface Hotel {
    id: number;
    name: string;
    location: string;
    description: string;
    images: string[];
    amenities: string[];
    rooms: Room[];
    rating: number;
    price: number;
    originalPrice?: number;
    reviews: number;
    discount?: string;
  }
  
  // State management
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [_, setHoveredHotel] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [selectedRoomType, setSelectedRoomType] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState("recommended");
  const [searchParams, setSearchParams] = useState({
    destination: '',
    checkIn: format(new Date(), 'yyyy-MM-dd'),
    checkOut: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    guests: 2,
    minPrice: 0,
    maxPrice: 1000,
    amenities: [] as string[]
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bookingDetails, setBookingDetails] = useState({
    name: '',
    email: '',
    phone: '',
    specialRequests: ''
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingInProgress, setBookingInProgress] = useState(false);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('hotelFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem('hotelFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Dummy data for hotels
  const hotels = [
    {
      id: 1,
      name: "Mountain View Resort",
      rating: 4.8,
      price: 250,
      originalPrice: 295,
      location: "Swiss Alps",
      images: [
        "/api/placeholder/800/500?mountain",
        "/api/placeholder/800/500?resort",
        "/api/placeholder/800/500?alps"
      ],
      amenities: ["Spa", "Pool", "Restaurant", "Free WiFi", "Gym"],
      reviews: 128,
      discount: "15% OFF",
      description: "Luxurious resort with breathtaking mountain views. Perfect for relaxation and adventure seekers alike. Nestled in the picturesque Swiss Alps, our resort offers state-of-the-art facilities including a full-service spa, heated indoor and outdoor pools, and gourmet dining options featuring local cuisine. Each room is thoughtfully designed with Alpine-inspired décor and modern amenities to ensure a comfortable stay.",
      rooms: [
        { type: "Deluxe Room", price: 250, capacity: 2 },
        { type: "Suite", price: 400, capacity: 4 },
        { type: "Presidential Suite", price: 650, capacity: 4 }
      ]
    },
    {
      id: 2,
      name: "Coastal Paradise Hotel",
      rating: 4.6,
      price: 180,
      originalPrice: 225,
      location: "Maldives",
      images: [
        "/api/placeholder/800/500?beach",
        "/api/placeholder/800/500?ocean",
        "/api/placeholder/800/500?maldives"
      ],
      amenities: ["Private Beach", "Bar", "Gym", "Spa", "Water Sports"],
      reviews: 96,
      discount: "20% OFF",
      description: "Beachfront property with crystal clear waters and white sandy beaches. Ideal for romantic getaways. Our overwater villas and beach bungalows offer unmatched privacy and direct access to the Indian Ocean. Enjoy complimentary water sports, sunset cruises, and world-class dining under the stars. Our resort is committed to sustainable tourism practices while providing the ultimate luxury experience.",
      rooms: [
        { type: "Beach Bungalow", price: 180, capacity: 2 },
        { type: "Overwater Villa", price: 350, capacity: 2 },
        { type: "Family Suite", price: 480, capacity: 4 }
      ]
    },
    {
      id: 3,
      name: "Urban Luxury Hotel",
      rating: 4.7,
      price: 320,
      originalPrice: 350,
      location: "New York",
      images: [
        "/api/placeholder/800/500?nyc",
        "/api/placeholder/800/500?skyline",
        "/api/placeholder/800/500?penthouse"
      ],
      amenities: ["Rooftop Bar", "Concierge", "Business Center", "Spa", "24/7 Room Service"],
      reviews: 215,
      discount: "10% OFF",
      description: "Modern luxury in the heart of Manhattan with stunning skyline views and premium services. Located just steps away from iconic attractions, shopping districts, and culinary hotspots. Our hotel features a Michelin-starred restaurant, exclusive rooftop lounge, and luxurious spa treatments. Business travelers will appreciate our fully-equipped meeting rooms and 24/7 business center with complementary high-speed internet.",
      rooms: [
        { type: "Standard Room", price: 320, capacity: 2 },
        { type: "Executive Suite", price: 500, capacity: 2 },
        { type: "Penthouse", price: 1200, capacity: 4 }
      ]
    },
    {
      id: 4,
      name: "Desert Oasis Resort",
      rating: 4.9,
      price: 420,
      originalPrice: 480,
      location: "Dubai",
      images: [
        "/api/placeholder/800/500?desert",
        "/api/placeholder/800/500?pool",
        "/api/placeholder/800/500?luxuryresort"
      ],
      amenities: ["Infinity Pool", "Desert Safari", "Restaurant", "Spa", "Free WiFi"],
      reviews: 143,
      discount: "12% OFF",
      description: "Escape to a luxurious desert retreat combining Arabian hospitality with modern luxury. Our resort offers breathtaking views of the Dubai desert landscape with exceptional amenities. Experience authentic Middle Eastern cuisine, traditional spa treatments, and exciting desert adventures. Our infinity pool creates the perfect mirage against the endless sand dunes.",
      rooms: [
        { type: "Luxury Room", price: 420, capacity: 2 },
        { type: "Royal Suite", price: 680, capacity: 2 },
        { type: "Desert Villa", price: 950, capacity: 4 }
      ]
    }
  ];

  // Available amenities for filtering
  const allAmenities = [
    "Pool", "Spa", "Gym", "Restaurant", "Free WiFi", 
    "Bar", "Beach", "Water Sports", "Business Center", "24/7 Room Service",
    "Infinity Pool", "Desert Safari", "Rooftop Bar", "Concierge", "Private Beach"
  ];

  // Filter hotels based on search parameters
  const filteredHotels = hotels.filter(hotel => {
    // Destination filter
    if (searchParams.destination && 
        !hotel.location.toLowerCase().includes(searchParams.destination.toLowerCase()) &&
        !hotel.name.toLowerCase().includes(searchParams.destination.toLowerCase())) {
      return false;
    }
    
    // Price filter
    if (hotel.price < searchParams.minPrice || hotel.price > searchParams.maxPrice) {
      return false;
    }
    
    // Amenities filter
    if (searchParams.amenities.length > 0 && 
        !searchParams.amenities.every(amenity => hotel.amenities.includes(amenity))) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    // Sort based on selected option
    switch (sortOption) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      default: // recommended
        // Complex sorting algorithm that considers rating, price, and reviews
        return (b.rating * 10 + b.reviews/100) - (a.rating * 10 + a.reviews/100);
    }
  });

  // Toggle favorite status
  const toggleFavorite = (hotelId: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent triggering the card click
    
    if (favorites.includes(hotelId)) {
      setFavorites(favorites.filter(id => id !== hotelId));
    } else {
      setFavorites([...favorites, hotelId]);
    }
  };

  // Handle booking form input changes
  const handleBookingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBookingDetails(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  

  // Calculate total nights
  const calculateNights = () => {
    const checkIn = new Date(searchParams.checkIn);
    const checkOut = new Date(searchParams.checkOut);
    return Math.max(1, differenceInDays(checkOut, checkIn));
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    if (!selectedHotel || !selectedRoomType) return 0;
    
    const room = selectedHotel.rooms.find(r => r.type === selectedRoomType);
    if (!room) return 0;
    
    const nights = calculateNights();
    const roomPrice = room.price * nights;
    const taxes = roomPrice * 0.12;
    
    return roomPrice + taxes;
  };

  // Navigate hotel images
  const nextImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (selectedHotel) {
      setCurrentImageIndex(prev => 
        prev === selectedHotel.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (selectedHotel) {
      setCurrentImageIndex(prev => 
        prev === 0 ? selectedHotel.images.length - 1 : prev - 1
      );
    }
  };

  // Open hotel details modal
  const openHotelDetails = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setCurrentImageIndex(0);
    setSelectedRoomType(hotel.rooms[0].type); // Default to first room
  };

  // Handle booking submission
  const handleBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form
    if (!bookingDetails.name || !bookingDetails.email || !bookingDetails.phone) {
      setValidationError("Please fill in all required fields");
      return;
    }
    
    if (!selectedRoomType) {
      setValidationError("Please select a room type");
      return;
    }
    
    setBookingInProgress(true);
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a random booking ID
      const bookingId = `BK-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
      
      if (selectedHotel && selectedRoomType) {
        const selectedRoom = selectedHotel.rooms.find(room => room.type === selectedRoomType);
        
        if (selectedRoom) {
          const bookingData = {
            id: bookingId,
            hotel: selectedHotel,
            roomType: selectedRoomType,
            roomPrice: selectedRoom.price,
            dates: {
              checkIn: searchParams.checkIn,
              checkOut: searchParams.checkOut,
              nights: calculateNights()
            },
            guests: searchParams.guests,
            totalPrice: calculateTotalPrice(),
            guestInfo: bookingDetails,
            createdAt: new Date().toISOString()
          };
          
          // Show success message
          setBookingSuccess(true);
          
          // Close modal after delay and navigate
          setTimeout(() => {
            setSelectedHotel(null);
            setBookingSuccess(false);
            setIsLoading(false);
            
            // In a real app, navigate to confirmation page
            navigate('/BookingConfirmation', { state: { bookingData } });
          }, 2000);
        }
      }
      
    } catch (error) {
      console.error('Booking error:', error);
      setValidationError("An error occurred while processing your booking. Please try again.");
      setIsLoading(false);
    }
  };

  // Reset search parameters
  const resetFilters = () => {
    setSearchParams({
      destination: '',
      checkIn: format(new Date(), 'yyyy-MM-dd'),
      checkOut: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
      guests: 2,
      minPrice: 0,
      maxPrice: 1000,
      amenities: []
    });
  };

  // Handle check-in date change
  const handleCheckInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCheckIn = e.target.value;
    setSearchParams(prev => {
      // Ensure check-out is at least one day after check-in
      const checkInDate = new Date(newCheckIn);
      const checkOutDate = new Date(prev.checkOut);
      
      if (checkInDate >= checkOutDate) {
        return {
          ...prev,
          checkIn: newCheckIn,
          checkOut: format(addDays(new Date(newCheckIn), 1), 'yyyy-MM-dd')
        };
      }
      
      return {
        ...prev,
        checkIn: newCheckIn
      };
    });
  };

  // Handle check-out date change
  const handleCheckOutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCheckOut = e.target.value;
    setSearchParams(prev => ({
      ...prev,
      checkOut: newCheckOut
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header with Animated Background */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 text-white p-8 mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-green-600/20" />
        <h1 className="text-4xl font-bold mb-4 relative z-10">Find Your Perfect Stay</h1>
        <p className="text-blue-100 max-w-xl relative z-10">
          Discover handpicked hotels with exclusive deals and AI-powered recommendations
        </p>
      </div>

      {/* Enhanced Search Section */}
      <Card className="mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="group relative">
              <div className="absolute inset-0 bg-orange-100 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity" />
              <div className="flex items-center gap-3 border-2 border-orange-200 rounded-lg p-4 hover:border-orange-400 transition-colors">
                <MapPin className="text-orange-500" />
                <Input 
                  placeholder="City, destination, or hotel name" 
                  className="border-0 bg-transparent focus:ring-0"
                  value={searchParams.destination}
                  onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
                />
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute inset-0 bg-green-100 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity" />
              <div className="flex flex-col gap-1 border-2 border-green-200 rounded-lg p-4 hover:border-green-400 transition-colors">
                <label className="text-xs text-gray-500">Check-in</label>
                <div className="flex items-center gap-3">
                  <Calendar className="text-green-500" />
                  <Input 
                    type="date" 
                    className="border-0 bg-transparent focus:ring-0 p-0"
                    value={searchParams.checkIn}
                    onChange={handleCheckInChange}
                    min={format(new Date(), 'yyyy-MM-dd')}
                  />
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-blue-100 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity" />
              <div className="flex flex-col gap-1 border-2 border-blue-200 rounded-lg p-4 hover:border-blue-400 transition-colors">
                <label className="text-xs text-gray-500">Check-out</label>
                <div className="flex items-center gap-3">
                  <Calendar className="text-blue-500" />
                  <Input 
                    type="date" 
                    className="border-0 bg-transparent focus:ring-0 p-0"
                    value={searchParams.checkOut}
                    onChange={handleCheckOutChange}
                    min={format(addDays(new Date(searchParams.checkIn), 1), 'yyyy-MM-dd')}
                  />
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-purple-100 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity" />
              <div className="flex items-center gap-3 border-2 border-purple-200 rounded-lg p-4 hover:border-purple-400 transition-colors">
                <Users className="text-purple-500" />
                <Input 
                  type="number" 
                  placeholder="Guests" 
                  className="border-0 bg-transparent focus:ring-0"
                  value={searchParams.guests}
                  onChange={(e) => setSearchParams({...searchParams, guests: Math.max(1, Math.min(10, parseInt(e.target.value) || 1))})}
                  min="1"
                  max="10"
                />
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Advanced Filters</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetFilters}
                className="text-gray-500 hover:text-gray-700"
              >
                Reset Filters
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range (${searchParams.minPrice} - ${searchParams.maxPrice})</label>
                <div className="px-2">
                  <Slider
                    value={[searchParams.minPrice, searchParams.maxPrice]}
                    min={0}
                    max={1000}
                    step={10}
                    onValueChange={(value) => setSearchParams({
                      ...searchParams,
                      minPrice: value[0],
                      maxPrice: value[1]
                    })}
                    className="my-6"
                  />
                </div>
                <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
                  <span>$0</span>
                  <span>$500</span>
                  <span>$1000</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                <Select
                  onValueChange={(value) => {
                    if (!searchParams.amenities.includes(value)) {
                      setSearchParams({
                        ...searchParams,
                        amenities: [...searchParams.amenities, value]
                      });
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select amenities" />
                  </SelectTrigger>
                  <SelectContent>
                    {allAmenities.map(amenity => (
                      <SelectItem key={amenity} value={amenity}>
                        {amenity}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2 mt-2">
                  {searchParams.amenities.map(amenity => (
                    <Badge 
                      key={amenity} 
                      variant="secondary"
                      className="flex items-center gap-1 cursor-pointer"
                      onClick={() => setSearchParams({
                        ...searchParams,
                        amenities: searchParams.amenities.filter(a => a !== amenity)
                      })}
                    >
                      {amenity}
                      <X className="h-3 w-3" />
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex items-end">
                <Button 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 w-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 h-12"
                >
                  <Search className="mr-2 h-5 w-5" /> Search Hotels
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          {filteredHotels.length} {filteredHotels.length === 1 ? 'Hotel' : 'Hotels'} Found
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Recommended" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">Recommended</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredHotels.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <AlertTriangle className="w-16 h-16 text-orange-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Hotels Found</h3>
          <p className="text-gray-600 max-w-md mb-6">
            We couldn't find any hotels matching your current filters. Try adjusting your search criteria.
          </p>
          <Button onClick={resetFilters}>Reset Filters</Button>
        </div>
      )}

      {/* Hotel Listings with Animation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredHotels.map(hotel => (
          <Card 
            key={hotel.id} 
            className="group transform hover:scale-[1.02] transition-all duration-300 hover:shadow-xl cursor-pointer"
            onMouseEnter={() => setHoveredHotel(hotel.id)}
            onMouseLeave={() => setHoveredHotel(null)}
            onClick={() => openHotelDetails(hotel)}
          >
            <div className="relative">
              <img 
                src={hotel.images[0]} 
                alt={hotel.name} 
                className="w-full h-64 object-cover rounded-t-lg"
              />
              <div className="absolute top-4 right-4">
                <button
                  className="bg-white/30 hover:bg-white/50 p-2 rounded-full backdrop-blur-sm transition-colors"
                  onClick={(e) => toggleFavorite(hotel.id, e)}
                  aria-label={favorites.includes(hotel.id) ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart 
                    className={`h-5 w-5 transition-colors duration-300 ${
                      favorites.includes(hotel.id) ? 'text-red-500 fill-red-500' : 'text-white'
                    }`}
                  />
                </button>
              </div>
              {hotel.discount && (
                <Badge className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1">
                  {hotel.discount}
                </Badge>
              )}
            </div>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{hotel.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${
                          i < Math.floor(hotel.rating) ? 'text-orange-400 fill-orange-400' : 'text-gray-300'
                        }`} />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({hotel.reviews} reviews)</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="text-sm">{hotel.location}</span>
              </div>

              <div className="flex gap-2 mb-4 flex-wrap">
                {hotel.amenities.slice(0, 3).map((amenity, index) => (
                  <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700">
                    {amenity}
                  </Badge>
                ))}
                {hotel.amenities.length > 3 && (
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                    +{hotel.amenities.length - 3} more
                  </Badge>
                )}
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div>
                  <span className="text-2xl font-bold text-green-600">${hotel.price}</span>
                  <span className="text-sm text-gray-500">/night</span>
                  {hotel.originalPrice && (
                    <span className="ml-2 text-sm text-gray-400 line-through">${hotel.originalPrice}</span>
                  )}
                </div>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    openHotelDetails(hotel);
                  }}
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

    

      {/* Hotel Details Modal */}
      {selectedHotel && (
        <Dialog open={!!selectedHotel} onOpenChange={(open) => !open && setSelectedHotel(null)}>
          <DialogContent className="max-w-4xl overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedHotel.name}</DialogTitle>
              <DialogDescription className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {selectedHotel.location}
              </DialogDescription>
            </DialogHeader>

            {/* Image Gallery */}
            <div className="relative mt-4 rounded-lg overflow-hidden">
              <img 
                src={selectedHotel.images[currentImageIndex]} 
                alt={selectedHotel.name} 
                className="w-full h-96 object-cover"
              />
              <button 
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
                onClick={prevImage}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button 
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
                onClick={nextImage}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {selectedHotel.images.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full ${currentImageIndex === index ? 'bg-white' : 'bg-white/50'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                  />
                ))}
              </div>
            </div>

{/* Image Thumbnails */}
<div className="flex gap-2 mt-2 overflow-x-auto pb-2">
              {selectedHotel.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${selectedHotel.name} ${index + 1}`}
                  className={`w-20 h-16 object-cover rounded cursor-pointer ${currentImageIndex === index ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
              <div className="md:col-span-2">
                <h3 className="text-xl font-semibold mb-4">About This Hotel</h3>
                <p className="text-gray-700 mb-6">{selectedHotel.description}</p>

                <h3 className="text-xl font-semibold mb-4">Amenities</h3>
                <div className="grid grid-cols-2 gap-4">
                  {selectedHotel.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {amenity === "Pool" && <Waves className="h-5 w-5 text-blue-500" />}
                      {amenity === "Infinity Pool" && <Waves className="h-5 w-5 text-blue-500" />}
                      {amenity === "Spa" && <Coffee className="h-5 w-5 text-purple-500" />}
                      {amenity === "Gym" && <Dumbbell className="h-5 w-5 text-red-500" />}
                      {amenity === "Restaurant" && <Utensils className="h-5 w-5 text-green-500" />}
                      {amenity === "Free WiFi" && <Wifi className="h-5 w-5 text-orange-500" />}
                      {amenity === "Bar" && <Coffee className="h-5 w-5 text-amber-500" />}
                      {amenity === "Beach" && <Waves className="h-5 w-5 text-blue-400" />}
                      {amenity === "Private Beach" && <Waves className="h-5 w-5 text-blue-400" />}
                      {amenity === "Water Sports" && <Waves className="h-5 w-5 text-blue-300" />}
                      {amenity === "Business Center" && <Tv className="h-5 w-5 text-gray-500" />}
                      {amenity === "24/7 Room Service" && <Bed className="h-5 w-5 text-indigo-500" />}
                      {amenity === "Rooftop Bar" && <Coffee className="h-5 w-5 text-pink-500" />}
                      {amenity === "Concierge" && <Users className="h-5 w-5 text-green-500" />}
                      {amenity === "Desert Safari" && <Mountain className="h-5 w-5 text-amber-600" />}
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>

                <h3 className="text-xl font-semibold mt-8 mb-4">Available Room Types</h3>
                <div className="space-y-4">
                  {selectedHotel.rooms.map((room, index) => (
                    <div 
                      key={index}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedRoomType === room.type ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => setSelectedRoomType(room.type)}
                    >
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-semibold">{room.type}</h4>
                          <p className="text-sm text-gray-600">Up to {room.capacity} guests</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">${room.price}</p>
                          <p className="text-xs text-gray-500">per night</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Card className="border border-gray-200 sticky top-6">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Your Booking</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                        <p className="font-medium">{format(new Date(searchParams.checkIn), 'MMM dd, yyyy')}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                        <p className="font-medium">{format(new Date(searchParams.checkOut), 'MMM dd, yyyy')}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                        <p className="font-medium">{searchParams.guests} {searchParams.guests === 1 ? 'guest' : 'guests'}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nights</label>
                        <p className="font-medium">{calculateNights()}</p>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Selected Room</label>
                        <p className="font-medium">
                          {selectedRoomType || "Please select a room type"}
                        </p>
                      </div>
                      
                      <div className="pt-4 border-t">
                      {selectedRoomType && (() => {
  const selectedRoom = selectedHotel?.rooms?.find(r => r.type === selectedRoomType);
  const price = selectedRoom?.price ?? 0;
  const nights = calculateNights();
  const subtotal = price * nights;
  const tax = subtotal * 0.12;
  const total = subtotal + tax;

  return (
    <>
      <div className="flex justify-between mb-2">
        <span>
          ${price} x {nights} nights
        </span>
        <span>
          ${subtotal}
        </span>
      </div>
      <div className="flex justify-between mb-2">
        <span>Taxes & Fees (12%)</span>
        <span>${tax.toFixed(2)}</span>
      </div>
      <div className="flex justify-between font-bold text-lg mt-4 pt-2 border-t">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </>
  );
})()}
                      </div>
                      
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700 mt-4"
                        onClick={() => document.getElementById('bookingForm')?.scrollIntoView({ behavior: 'smooth' })}

                      >
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Booking Form */}
            <div id="bookingForm" className="mt-8 text-black">
              <h3 className="text-xl font-semibold mb-4 text-white">Complete Your Booking</h3>
              
              {validationError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{validationError}</AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleBookingSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
                    <Input 
                      type="text" 
                      name="name"
                      value={bookingDetails.name}
                      onChange={handleBookingChange}
                      required
                      className="bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address*</label>
                    <Input 
                      type="email" 
                      name="email"
                      value={bookingDetails.email}
                      onChange={handleBookingChange}
                      required
                      className="bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number*</label>
                    <Input 
                      type="tel" 
                      name="phone"
                      value={bookingDetails.phone}
                      onChange={handleBookingChange}
                      required
                      className="bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
                    <textarea
                      name="specialRequests"
                      value={bookingDetails.specialRequests}
                      onChange={handleBookingChange}
                      className="w-full border border-gray-300 rounded-md p-2 h-24 bg-white"
                      placeholder="Any special requests or preferences?"
                    />
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center mb-4">
                    <input 
                      type="checkbox" 
                      id="termsAgreed" 
                      className="h-4 w-4 text-blue-600 rounded border-gray-300" 
                      required
                    />
                    <label htmlFor="termsAgreed" className="ml-2 text-sm text-gray-700">
                      I agree to the terms and conditions and privacy policy
                    </label>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t flex justify-end">
                  <Button 
                    type="submit" 
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={isLoading || bookingInProgress}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      "Confirm Booking"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Booking Success Notification */}
      {bookingSuccess && (
        <div className="fixed bottom-8 right-8 bg-green-500 text-white p-4 rounded-lg shadow-lg flex items-center z-50 animate-in fade-in slide-in-from-bottom-5">
          <Check className="h-5 w-5 mr-2" />
          <div>
            <p className="font-semibold">Booking Confirmed!</p>
            <p className="text-sm">Your reservation has been confirmed. Redirecting to confirmation page...</p>
          </div>
        </div>
      )}

      {/* No Results State */}
      {filteredHotels.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No hotels found</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Try adjusting your search criteria or explore different destinations.
          </p>
          <Button className="mt-6" onClick={resetFilters}>
            Reset Filters
          </Button>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-semibold text-lg mb-4">About Us</h4>
            <p className="text-gray-600 text-sm">
              Experience the finest accommodations worldwide with our curated selection of premium hotels and resorts.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">Top Destinations</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>New York</li>
              <li>Maldives</li>
              <li>Swiss Alps</li>
              <li>Dubai</li>
              <li>Tokyo</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Help Center</li>
              <li>Cancellation Policy</li>
              <li>COVID-19 Travel Info</li>
              <li>Contact Us</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">Newsletter</h4>
            <p className="text-gray-600 text-sm mb-4">
              Subscribe to get exclusive deals and travel inspiration.
            </p>
            <div className="flex">
              <Input placeholder="Your email" className="rounded-r-none" />
              <Button className="rounded-l-none">Subscribe</Button>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>© 2025 Luxury Hotels & Resorts. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HotelBookingPage;