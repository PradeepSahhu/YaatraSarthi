import { useLocation, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";

import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Download,
  Printer,
  MapPin,
  Star,
  Calendar,
  Users,
  Copy,
  Share2,
  Mail,
  Phone,
  ArrowLeft,
  Car,
  Info,
} from "lucide-react";
import { format, addDays } from "date-fns";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Define TypeScript interfaces for our data structures
interface Hotel {
  name: string;
  location: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice?: number;
  discount?: string;
  amenities: string[];
}

interface Dates {
  checkIn: string;
  checkOut: string;
}

interface GuestInfo {
  name: string;
  email: string;
  phone: string;
  specialRequests?: string;
}

interface BookingData {
  id: string;
  hotel: Hotel;
  roomType: string;
  dates: Dates;
  guests: number;
  totalPrice: number;
  guestInfo: GuestInfo;
  createdAt: string;
}

interface LocationState {
  bookingData: BookingData;
}

interface WeatherForecast {
  date: string;
  temp: string;
  conditions: string;
}

interface CheckInInstructions {
  time: string;
  process: string[];
  parking: string;
}

const BookingConfirmation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | undefined;
  const bookingData = state?.bookingData;
  console.log(bookingData)

  const [isClient, setIsClient] = useState<boolean>(false);
  const [showShareDialog, setShowShareDialog] = useState<boolean>(false);

  // Set isClient to true on component mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Redirect if no booking data
  if (!bookingData && isClient) {
    navigate("/");
    return null;
  }

  const handlePrint = (): void => {
    window.print();
  };

  const handleDownloadQR = (): void => {
    if (!isClient) return;
    
    const canvas = document.getElementById("qr-code") as HTMLCanvasElement | null;
    if (!canvas) return;
    
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${bookingData?.hotel.name.replace(
      /\s+/g,
      "-"
    )}-booking.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const calculateNights = (): number => {
    if (!bookingData) return 0;
    
    const checkIn = new Date(bookingData.dates.checkIn);
    const checkOut = new Date(bookingData.dates.checkOut);
    return Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  };

  const copyBookingInfo = (): void => {
    if (!bookingData) return;
    
    const bookingInfo = `
Booking ID: ${bookingData.id}
Hotel: ${bookingData.hotel.name}
Room Type: ${bookingData.roomType}
Check-in: ${format(new Date(bookingData.dates.checkIn), "MMM dd, yyyy")}
Check-out: ${format(new Date(bookingData.dates.checkOut), "MMM dd, yyyy")}
Guests: ${bookingData.guests}
Total Price: $${bookingData.totalPrice.toFixed(2)}
    `;
    
    navigator.clipboard.writeText(bookingInfo.trim());
    toast({
      title: "Copied to clipboard",
      description: "Booking information has been copied to your clipboard.",
      duration: 3000,
    });
  };

  const shareBooking = async (): Promise<void> => {
    if (!bookingData) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Booking at ${bookingData.hotel.name}`,
          text: `I've booked a stay at ${bookingData.hotel.name} from ${format(
            new Date(bookingData.dates.checkIn),
            "MMM dd, yyyy"
          )} to ${format(
            new Date(bookingData.dates.checkOut),
            "MMM dd, yyyy"
          )}. Booking reference: ${bookingData.id}`,
        });
      } catch (err) {
        console.error("Share failed:", err);
        setShowShareDialog(true);
      }
    } else {
      setShowShareDialog(true);
    }
  };

  const sendEmail = (): void => {
    if (!bookingData) return;
    
    const subject = encodeURIComponent(`My Booking at ${bookingData.hotel.name}`);
    const body = encodeURIComponent(`
Hi,

I wanted to share my booking details with you:

Booking ID: ${bookingData.id}
Hotel: ${bookingData.hotel.name}
Room Type: ${bookingData.roomType}
Check-in: ${format(new Date(bookingData.dates.checkIn), "MMM dd, yyyy")}
Check-out: ${format(new Date(bookingData.dates.checkOut), "MMM dd, yyyy")}
Guests: ${bookingData.guests}

Best regards,
${bookingData.guestInfo.name}
    `);
    
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  // Generate check-in instructions based on time
  const getCheckInInstructions = (): CheckInInstructions => {
    if (!bookingData) {
      return {
        time: "After 3:00 PM",
        process: ["Please check with hotel for details"],
        parking: "Please check with hotel for details"
      };
    }
    
    const checkInDate = new Date(bookingData.dates.checkIn);
    const checkInDay = format(checkInDate, "EEEE");
    
    return {
      time: "After 3:00 PM",
      process: [
        "Present this confirmation at the reception desk",
        "Have a valid ID for all adult guests",
        "Credit card for incidentals will be required",
        checkInDay === "Saturday" || checkInDay === "Sunday" 
          ? "Weekend check-in may experience higher wait times"
          : "Weekday check-in usually takes 5-10 minutes"
      ],
      parking: bookingData.hotel.amenities.includes("Free Parking") 
        ? "Free parking available on-site"
        : "Paid parking available at $25 per day"
    };
  };

  // Weather forecast (simulated)
  const getWeatherForecast = (): WeatherForecast[] => {
    if (!bookingData) return [];
    
    const checkIn = new Date(bookingData.dates.checkIn);
    const forecasts: WeatherForecast[] = [];
    
    for (let i = 0; i < Math.min(calculateNights() + 1, 5); i++) {
      const day = addDays(checkIn, i);
      const temp = Math.round(65 + Math.random() * 15);
      const conditions = ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain"][Math.floor(Math.random() * 4)];
      
      forecasts.push({
        date: format(day, "EEE, MMM d"),
        temp: `${temp}°F`,
        conditions
      });
    }
    
    return forecasts;
  };

  if (!isClient || !bookingData) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const checkInInfo = getCheckInInstructions();
  const weatherForecast = getWeatherForecast();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 print:bg-white print:py-0 text-black">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8 print:shadow-none print:rounded-none">
        {/* Confirmation Header */}
        <div className="text-center mb-8 print:mb-4">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4 print:h-12 print:w-12" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2 print:text-2xl">
            Booking Confirmed!
          </h1>
          <p className="text-lg text-gray-600 print:text-base">
            Your reservation at {bookingData.hotel.name} is complete.
          </p>
          <div className="flex items-center justify-center mt-2">
            <p className="text-sm text-gray-500">
              Booking ID: {bookingData.id}
            </p>
            <button 
              className="ml-2 p-1 text-gray-400 hover:text-gray-600 print:hidden"
              onClick={copyBookingInfo}
              title="Copy booking information"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </div>

        <Tabs defaultValue="details" className="print:hidden">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="details">Booking Details</TabsTrigger>
            <TabsTrigger value="checkin">Check-in Info</TabsTrigger>
            <TabsTrigger value="local">Local Info</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 print:grid-cols-2 print:gap-4">
              {/* Booking Details */}
              <div className="print:col-span-2">
                <h2 className="text-xl font-semibold mb-4 print:text-lg">
                  Booking Summary
                </h2>
                <div className="space-y-4 print:space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hotel:</span>
                    <span className="font-medium">{bookingData.hotel.name}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Room Type:</span>
                    <span className="font-medium">{bookingData.roomType}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                      <span className="font-medium">
                        {bookingData.hotel.location}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Rating:</span>
                    <div className="flex items-center">
                      <div className="flex mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(bookingData.hotel.rating)
                                ? "text-orange-400 fill-orange-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        ({bookingData.hotel.reviews} reviews)
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-in:</span>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                      <span className="font-medium">
                        {format(
                          new Date(bookingData.dates.checkIn),
                          "MMM dd, yyyy"
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-out:</span>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                      <span className="font-medium">
                        {format(
                          new Date(bookingData.dates.checkOut),
                          "MMM dd, yyyy"
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Nights:</span>
                    <span className="font-medium">{calculateNights()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Guests:</span>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-gray-500" />
                      <span className="font-medium">
                        {bookingData.guests}{" "}
                        {bookingData.guests === 1 ? "guest" : "guests"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="flex flex-col items-center print:col-span-2">
                <h2 className="text-xl font-semibold mb-4 print:text-lg">
                  Your Booking QR Code
                </h2>
                <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4 print:p-2">
                  <QRCode
                    id="qr-code"
                    value={`Booking ID: ${bookingData.id}\nHotel: ${
                      bookingData.hotel.name
                    }\nRoom: ${bookingData.roomType}\nCheck-in: ${format(
                      new Date(bookingData.dates.checkIn),
                      "MMM dd, yyyy"
                    )}\nCheck-out: ${format(
                      new Date(bookingData.dates.checkOut),
                      "MMM dd, yyyy"
                    )}`}
                    size={200}
                    level="H"
                   
                  />
                </div>
                <p className="text-sm text-gray-500 mb-4 print:hidden">
                  Scan this code at check-in
                </p>
                <div className="flex space-x-4 print:hidden">
                  <Button variant="outline" onClick={handleDownloadQR}>
                    <Download className="h-4 w-4 mr-2 text-white" />
                    <p className="text-white">Download QR</p>
                  </Button>
                  <Button variant="outline" onClick={handlePrint}>
                    <Printer className="h-4 w-4 mr-2 text-white" />
                    <p className="text-white">Print</p>
                  </Button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="md:col-span-2 print:col-span-2">
                <h2 className="text-xl font-semibold mb-4 print:text-lg">
                  Price Breakdown
                </h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Room Rate:</span>
                    <span>
                      ${bookingData.hotel.price} x {calculateNights()} nights
                    </span>
                    <span>${bookingData.hotel.price * calculateNights()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Taxes & Fees:</span>
                    <span></span>
                    <span>
                      $
                      {(bookingData.hotel.price * calculateNights() * 0.12).toFixed(
                        2
                      )}
                    </span>
                  </div>

                  {bookingData.hotel.discount && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({bookingData.hotel.discount}):</span>
                      <span></span>
                      <span>
                        -$
                        {(
                         bookingData.hotel?.originalPrice || 0 * calculateNights() -
                          bookingData.hotel.price * calculateNights()
                        ).toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="border-t pt-2 mt-2"></div>

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span></span>
                    <span>${bookingData.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Guest Information */}
              <div className="md:col-span-2 print:col-span-2 border-t pt-6 mt-4">
                <h2 className="text-xl font-semibold mb-4 print:text-lg">
                  Guest Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-medium">{bookingData.guestInfo.name}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{bookingData.guestInfo.email}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Phone Number</p>
                    <p className="font-medium">{bookingData.guestInfo.phone}</p>
                  </div>

                  {bookingData.guestInfo.specialRequests && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600">Special Requests</p>
                      <p className="font-medium">
                        {bookingData.guestInfo.specialRequests}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Hotel Amenities */}
            <div className="border-t pt-6 mt-4 print:pt-4">
              <h2 className="text-xl font-semibold mb-4 print:text-lg">
                Hotel Amenities
              </h2>
              <div className="flex flex-wrap gap-2">
                {bookingData.hotel.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-t pt-6 mt-6 print:pt-4">
              <h2 className="text-xl font-semibold mb-4 print:text-lg">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-600">Hotel Phone</p>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    <p className="font-medium">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hotel Email</p>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                    <p className="font-medium">
                      reservations@
                      {bookingData.hotel.name.replace(/\s+/g, "").toLowerCase()}.com
                    </p>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">Address</p>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    <p className="font-medium">
                      123 Luxury Street, {bookingData.hotel.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="checkin">
            <div className="space-y-8">
              {/* Check-in Instructions */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Check-in Details</h2>
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                  <div className="flex items-start mb-4">
                    <div className="bg-blue-100 p-2 rounded-full mr-4">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg text-blue-700">Check-in Time</h3>
                      <p className="text-blue-800">{checkInInfo.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start mb-4">
                    <div className="bg-blue-100 p-2 rounded-full mr-4">
                      <Info className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg text-blue-700">Check-in Process</h3>
                      <ul className="list-disc pl-5 text-blue-800">
                        {checkInInfo.process.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-4">
                      <Car className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg text-blue-700">Parking Information</h3>
                      <p className="text-blue-800">{checkInInfo.parking}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Digital Key Information */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Digital Key Access</h2>
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <p className="mb-4">
                    For contactless check-in, you can use our mobile app to access your room directly.
                  </p>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Download our hotel app from the App Store or Google Play</li>
                    <li>Sign in with the email used for booking: {bookingData.guestInfo.email}</li>
                    <li>Enter booking ID: {bookingData.id}</li>
                    <li>Your digital key will be activated on your check-in date</li>
                  </ol>
                </div>
              </div>
              
              {/* Cancellation Policy */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Cancellation Policy</h2>
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <p className="mb-2">
                    Free cancellation until {format(new Date(bookingData.dates.checkIn), "MMM dd, yyyy")} at 12:00 PM.
                  </p>
                  <p>
                    Cancellations after this time will be charged the first night's stay.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="local">
            <div className="space-y-8">
              {/* Weather Forecast */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Weather Forecast</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {weatherForecast.map((day, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                      <p className="font-medium text-gray-800">{day.date}</p>
                      <p className="text-2xl font-bold my-2">{day.temp}</p>
                      <p className="text-gray-600">{day.conditions}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Local Attractions */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Nearby Attractions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-medium text-lg mb-2">City Center</h3>
                    <p className="text-gray-600 mb-2">0.8 miles from hotel</p>
                    <p>Explore shops, restaurants, and historical landmarks within walking distance.</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-medium text-lg mb-2">Park & Gardens</h3>
                    <p className="text-gray-600 mb-2">1.2 miles from hotel</p>
                    <p>Beautiful green spaces perfect for walking, running, or a peaceful picnic.</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-medium text-lg mb-2">Art Museum</h3>
                    <p className="text-gray-600 mb-2">2.5 miles from hotel</p>
                    <p>World-class exhibits featuring local and international artists.</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-medium text-lg mb-2">Beach</h3>
                    <p className="text-gray-600 mb-2">3.0 miles from hotel</p>
                    <p>Pristine shoreline with water activities and stunning views.</p>
                  </div>
                </div>
              </div>
              
              {/* Transportation */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Transportation Options</h2>
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-lg">From Airport</h3>
                      <p className="mb-2">
                        The hotel is approximately 18 miles from the international airport.
                      </p>
                      <ul className="list-disc pl-5">
                        <li>Taxi: Approximately $45 (30-40 minutes)</li>
                        <li>Shuttle: $20 per person (45-60 minutes with stops)</li>
                        <li>Rideshare: $35-40 (30-40 minutes)</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-lg">Public Transportation</h3>
                      <p className="mb-2">
                        Bus stop is located 0.2 miles from hotel entrance.
                      </p>
                      <ul className="list-disc pl-5">
                        <li>Bus #42 goes to city center every 15 minutes</li>
                        <li>Metro station is 0.5 miles away</li>
                        <li>Day passes available for $10</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Print view - combined content */}
        <div className="hidden print:block">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 print:grid-cols-2 print:gap-4">
            {/* Booking Details */}
            <div className="print:col-span-2">
              <h2 className="text-xl font-semibold mb-4 print:text-lg">
                Booking Summary
              </h2>
              <div className="space-y-4 print:space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Hotel:</span>
                  <span className="font-medium">{bookingData.hotel.name}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Room Type:</span>
                  <span className="font-medium">{bookingData.roomType}</span>
                </div>

              

                <div className="flex justify-between">
                  <span className="text-gray-600">Room Type:</span>
                  <span className="font-medium">{bookingData.roomType}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                    <span className="font-medium">
                      {bookingData.hotel.location}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Check-in:</span>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                    <span className="font-medium">
                      {format(
                        new Date(bookingData.dates.checkIn),
                        "MMM dd, yyyy"
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Check-out:</span>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                    <span className="font-medium">
                      {format(
                        new Date(bookingData.dates.checkOut),
                        "MMM dd, yyyy"
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Nights:</span>

                  <span className="font-medium">{calculateNights()}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Guests:</span>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-gray-500" />
                    <span className="font-medium">
                      {bookingData.guests}{" "}
                      {bookingData.guests === 1 ? "guest" : "guests"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code Section - Print Version */}
            <div className="flex flex-col items-center print:col-span-2">
              <h2 className="text-xl font-semibold mb-4 print:text-lg">
                Your Booking QR Code
              </h2>
              <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4 print:p-2">
                <QRCode
                  id="qr-code-print"
                  value={`Booking ID: ${bookingData.id}\nHotel: ${
                    bookingData.hotel.name
                  }\nRoom: ${bookingData.roomType}\nCheck-in: ${format(
                    new Date(bookingData.dates.checkIn),
                    "MMM dd, yyyy"
                  )}\nCheck-out: ${format(
                    new Date(bookingData.dates.checkOut),
                    "MMM dd, yyyy"
                  )}`}
                  size={200}
                  level="H"
          
                />
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Scan this code at check-in
              </p>
            </div>

            {/* Price Breakdown - Print Version */}
            <div className="print:col-span-2">
              <h2 className="text-xl font-semibold mb-4 print:text-lg">
                Price Breakdown
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Room Rate:</span>
                  <span>
                    ${bookingData.hotel.price} x {calculateNights()} nights
                  </span>
                  <span>${bookingData.hotel.price * calculateNights()}</span>
                </div>

                <div className="flex justify-between">
                  <span>Taxes & Fees:</span>
                  <span></span>
                  <span>
                    $
                    {(
                      bookingData.hotel.price *
                      calculateNights() *
                      0.12
                    ).toFixed(2)}
                  </span>
                </div>

                {bookingData.hotel.discount && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({bookingData.hotel.discount}):</span>
                    <span></span>
                    <span>
                      -$
                      {(
                        bookingData.hotel?.originalPrice || 0 * calculateNights() -
                        bookingData.hotel.price * calculateNights()
                      ).toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="border-t pt-2 mt-2"></div>

                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span></span>
                  <span>${bookingData.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Guest Information - Print Version */}
            <div className="print:col-span-2 border-t pt-6 mt-4">
              <h2 className="text-xl font-semibold mb-4 print:text-lg">
                Guest Information
              </h2>
              <div className="grid grid-cols-1 print:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-medium">{bookingData.guestInfo.name}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{bookingData.guestInfo.email}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Phone Number</p>
                  <p className="font-medium">{bookingData.guestInfo.phone}</p>
                </div>

                {bookingData.guestInfo.specialRequests && (
                  <div className="print:col-span-2">
                    <p className="text-sm text-gray-600">Special Requests</p>
                    <p className="font-medium">
                      {bookingData.guestInfo.specialRequests}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Check-in Instructions - Print Version */}
            <div className="print:col-span-2 border-t pt-6 mt-4">
              <h2 className="text-xl font-semibold mb-4 print:text-lg">
                Check-in Information
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Check-in Time</p>
                  <p className="font-medium">{checkInInfo.time}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Check-in Process</p>
                  <ul className="list-disc pl-5">
                    {checkInInfo.process.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Parking Information</p>
                  <p className="font-medium">{checkInInfo.parking}</p>
                </div>
              </div>
            </div>

            {/* Hotel Amenities - Print Version */}
            <div className="print:col-span-2 border-t pt-6 mt-4">
              <h2 className="text-xl font-semibold mb-4 print:text-lg">
                Hotel Amenities
              </h2>
              <div className="flex flex-wrap gap-2">
                {bookingData.hotel.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact Information - Print Version */}
            <div className="print:col-span-2 border-t pt-6 mt-4">
              <h2 className="text-xl font-semibold mb-4 print:text-lg">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 print:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Hotel Phone</p>
                  <p className="font-medium">+1 (555) 123-4567</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hotel Email</p>
                  <p className="font-medium">
                    reservations@
                    {bookingData.hotel.name.replace(/\s+/g, "").toLowerCase()}
                    .com
                  </p>
                </div>
                <div className="print:col-span-2">
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium">
                    123 Luxury Street, {bookingData.hotel.location}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Print-only message */}
          <div className="mt-8 text-xs text-gray-500">
            <p>
              Thank you for your booking! Please present this confirmation at
              check-in.
            </p>
            <p className="mt-2">Booking reference: {bookingData.id}</p>
            <p>
              Issued on:{" "}
              {format(new Date(bookingData.createdAt), "MMM dd, yyyy hh:mm a")}
            </p>
          </div>
        </div>

        {/* Share Dialog */}
        <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share Your Booking</DialogTitle>
              <DialogDescription>
                Share your booking details with others
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Button variant="outline" onClick={copyBookingInfo}>
                <Copy className="h-4 w-4 mr-2" />
                Copy to Clipboard
              </Button>
              <Button variant="outline" onClick={sendEmail}>
                <Mail className="h-4 w-4 mr-2" />
                Share via Email
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 print:hidden">
          <Button variant="outline" onClick={() => navigate("/")} className="text-white">
            <ArrowLeft className="h-4 w-4 mr-2 text-white" />
           <p className="text-white"> Back to Home</p>
          </Button>
          <Button variant="outline" onClick={handlePrint} className="text-white">
            <Printer className="h-4 w-4 mr-2" />
            Print Confirmation
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={shareBooking}
           
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Booking
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
