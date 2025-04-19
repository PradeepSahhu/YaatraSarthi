import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { 
  LuCalendarDays, LuMapPin, LuSun, LuRefreshCw, 
  LuHotel, LuPlane, LuUtensils, LuLandmark,
  LuSparkles
} from "react-icons/lu";
import { FaWalking, FaMoneyBillWave, FaUmbrella } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
  CardHeader
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Types for our application
type Activity = {
  type: string;
  percentage: number;
};

type TransportationType = {
  type: string;
  cost: number;
};

type Expense = {
  category: string;
  cost: number;
};

type ForecastDay = {
  day: string;
  weather: string;
  temp: number;
  rain: number;
};

type ItineraryActivity = {
  time: string;
  activity: string;
  type: string;
  location: string;
};

type DailyItinerary = {
  day: string;
  date: string;
  weather: string;
  temperature: number;
  activities: ItineraryActivity[];
};

type Recommendation = {
  name: string;
  location: string;
  price: string | number;
  rating: number;
  cuisine?: string;
  type?: string;
};

type DestinationInsights = {
  summary: string;
  tips: string[];
  culturalNotes: string;
};

type Recommendations = {
  accommodation: Recommendation[];
  restaurants: Recommendation[];
  activities: Recommendation[];
};

type AppData = {
  temperature: number;
  weatherCondition: string;
  date: string;
  destination: string;
  longitude: string;
  latitude: string;
  duration: number;
  budget: number;
  currency: string;
  travelers: number;
  loading: boolean;
  aiLoading: boolean;
  itineraryCompleteness: number;
  forecast: ForecastDay[];
  activities: Activity[];
  transportation: TransportationType[];
  expenses: Expense[];
  dailyItinerary: DailyItinerary[];
  destinationInsights: DestinationInsights | null;
  recommendations: Recommendations;
};

type ItineraryParams = {
  destination: string;
  duration: number;
  travelers: number;
  budget: number;
};

// Helper service for Gemini AI integration
const GeminiService = {
  // Safely get API key from environment variables
  getApiKey: (): string => {
    // In a real deployment, this would be an environment variable
    // For now, we'll use a placeholder to avoid exposing real keys
    return process.env.NEXT_PUBLIC_GEMINI_API_KEY || "AIzaSyAWTyhOcsDAbDbc2OgdSFz3rFtf3qYP4CE";
  },

  getDestinationInsights: async (destination: string): Promise<DestinationInsights> => {
    try {
      const apiKey = GeminiService.getApiKey();
      
      if (!apiKey) {
        throw new Error("API key not configured");
      }
      
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      
      const prompt = `
        You are a travel expert providing insights about ${destination}. 
        Provide a comprehensive overview in this JSON format:
        {
          "summary": "2-3 paragraph overview of the destination",
          "tips": ["array of 5 practical travel tips"],
          "culturalNotes": "important cultural information for visitors"
        }
        Be concise but informative.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse the JSON response from Gemini
      try {
        return JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse Gemini response:", text);
        return {
          summary: `Failed to get insights about ${destination}. Please try again later.`,
          tips: ["Check local travel advisories", "Research local customs", "Pack appropriate clothing", "Check visa requirements", "Learn basic local phrases"],
          culturalNotes: "Be respectful of local customs and traditions."
        };
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      return {
        summary: `An error occurred while fetching insights about ${destination}. Please check your API key configuration.`,
        tips: ["Check local travel advisories", "Research local customs", "Pack appropriate clothing", "Check visa requirements", "Learn basic local phrases"],
        culturalNotes: "Be respectful of local customs and traditions."
      };
    }
  },

  generateItinerary: async (params: ItineraryParams): Promise<DailyItinerary[]> => {
    try {
      const apiKey = GeminiService.getApiKey();
      
      if (!apiKey) {
        throw new Error("API key not configured");
      }
      
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      
      const { destination, duration, travelers, budget } = params;
      
      const prompt = `
        Create a detailed ${duration}-day itinerary for ${travelers} travelers visiting ${destination} 
        with a budget of ${budget} USD. Format the response as JSON with this structure:
        [
          {
            "day": "Day 1",
            "date": "formatted date",
            "weather": "typical weather",
            "temperature": number,
            "activities": [
              {
                "time": "08:00 AM",
                "activity": "activity description",
                "type": "food/accommodation/attraction/activity",
                "location": "location name"
              }
            ]
          }
        ]
        Include diverse activities and account for travel time between locations.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        return JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse itinerary response:", text);
        // Return default itinerary if parsing fails
        return generateDefaultItinerary(duration);
      }
    } catch (error) {
      console.error("Error generating itinerary:", error);
      return generateDefaultItinerary(params.duration);
    }
  },

  getRecommendations: async (destination: string, type: string): Promise<Recommendation[]> => {
    try {
      const apiKey = GeminiService.getApiKey();
      
      if (!apiKey) {
        throw new Error("API key not configured");
      }
      
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      
      const categoryMap: Record<string, string> = {
        accommodation: "hotels or resorts",
        restaurants: "restaurants or dining options",
        activities: "activities or things to do"
      };
      
      const prompt = `
        Provide 5 recommendations for ${categoryMap[type]} in ${destination}.
        Format as JSON array:
        [
          {
            "name": "venue name",
            "location": "neighborhood or area",
            ${type === 'accommodation' ? '"rating": number,' : ''}
            ${type === 'restaurants' ? '"cuisine": "type of food",' : ''}
            ${type === 'activities' ? '"type": "activity type",' : ''}
            "price": ${type === 'accommodation' ? 'nightly rate in USD' : type === 'restaurants' ? 'price range ($$-$$$$)' : 'cost per person'},
            "rating": number (1-5)
          }
        ]
        Include a mix of budget and premium options.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        return JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse recommendations:", text);
        return generateDefaultRecommendations(type);
      }
    } catch (error) {
      console.error("Error getting recommendations:", error);
      return generateDefaultRecommendations(type);
    }
  }
};

// Helper function to generate default itinerary if API fails
const generateDefaultItinerary = (duration: number): DailyItinerary[] => {
  const itinerary: DailyItinerary[] = [];
  const today = new Date();
  
  for (let i = 0; i < duration; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    itinerary.push({
      day: `Day ${i + 1}`,
      date: date.toLocaleDateString(),
      weather: ["Sunny", "Partly Cloudy", "Clear", "Rainy"][Math.floor(Math.random() * 4)],
      temperature: Math.floor(Math.random() * 10) + 22,
      activities: [
        {
          time: "08:00 AM",
          activity: "Breakfast at hotel",
          type: "food",
          location: "Hotel Restaurant"
        },
        {
          time: "10:00 AM",
          activity: "Visit local attraction",
          type: "attraction",
          location: "City Center"
        },
        {
          time: "01:00 PM",
          activity: "Lunch at local restaurant",
          type: "food",
          location: "Downtown"
        },
        {
          time: "03:00 PM",
          activity: "Relaxation time",
          type: "activity",
          location: "Hotel/Beach"
        },
        {
          time: "07:00 PM",
          activity: "Dinner at popular restaurant",
          type: "food",
          location: "Tourist District"
        }
      ]
    });
  }
  
  return itinerary;
};

// Helper function to generate default recommendations if API fails
const generateDefaultRecommendations = (type: string): Recommendation[] => {
  if (type === "accommodation") {
    return [
      { name: "Luxury Resort & Spa", location: "Beachfront", price: 350, rating: 4.8 },
      { name: "Boutique Hotel", location: "City Center", price: 180, rating: 4.5 },
      { name: "Budget Inn", location: "Downtown", price: 80, rating: 3.8 },
      { name: "Backpacker's Hostel", location: "Tourist District", price: 25, rating: 4.0 },
      { name: "Vacation Rental", location: "Residential Area", price: 120, rating: 4.2 }
    ];
  } else if (type === "restaurants") {
    return [
      { name: "Fine Dining Experience", location: "Uptown", price: "$$$$", cuisine: "Fusion", rating: 4.9 },
      { name: "Local Cuisine Restaurant", location: "Old Town", price: "$$$", cuisine: "Local", rating: 4.7 },
      { name: "Casual Dining", location: "Downtown", price: "$$", cuisine: "International", rating: 4.3 },
      { name: "Street Food Corner", location: "Market Area", price: "$", cuisine: "Street Food", rating: 4.5 },
      { name: "Seafood Restaurant", location: "Harbor", price: "$$$", cuisine: "Seafood", rating: 4.6 }
    ];
  } else {
    return [
      { name: "Historical Tour", location: "Old Town", price: 50, type: "Cultural", rating: 4.6 },
      { name: "Adventure Park", location: "Outskirts", price: 80, type: "Adventure", rating: 4.7 },
      { name: "Beach Day", location: "Coastline", price: 0, type: "Relaxation", rating: 4.9 },
      { name: "Museum Visit", location: "City Center", price: 15, type: "Cultural", rating: 4.3 },
      { name: "Shopping Mall", location: "Downtown", price: "Varies", type: "Shopping", rating: 4.0 }
    ];
  }
};

const ItineraryPlanner: React.FC = () => {
  const { toast } = useToast();
  const [data, setData] = useState<AppData>({
    temperature: 26.5,
    weatherCondition: "Sunny",
    date: new Date().toLocaleDateString(),
    destination: "Bali, Indonesia",
    longitude: "115.1889",
    latitude: "-8.4095",
    duration: 5,
    budget: 2500,
    currency: "USD",
    travelers: 2,
    loading: false,
    aiLoading: false,
    itineraryCompleteness: 75,
    forecast: [
      { day: "Day 1", weather: "Sunny", temp: 29, rain: 0 },
      { day: "Day 2", weather: "Partly Cloudy", temp: 28, rain: 20 },
      { day: "Day 3", weather: "Sunny", temp: 30, rain: 0 },
      { day: "Day 4", weather: "Rain Shower", temp: 26, rain: 60 },
      { day: "Day 5", weather: "Sunny", temp: 29, rain: 10 },
    ],
    activities: [
      { type: "Sightseeing", percentage: 35 },
      { type: "Food", percentage: 25 },
      { type: "Adventure", percentage: 20 },
      { type: "Relaxation", percentage: 15 },
      { type: "Shopping", percentage: 5 }
    ],
    transportation: [
      { type: "Flight", cost: 800 },
      { type: "Taxi", cost: 150 },
      { type: "Rental", cost: 220 },
      { type: "Public", cost: 50 }
    ],
    expenses: [
      { category: "Accommodation", cost: 750 },
      { category: "Transportation", cost: 1220 },
      { category: "Food", cost: 350 },
      { category: "Activities", cost: 400 },
      { category: "Shopping", cost: 150 },
      { category: "Miscellaneous", cost: 80 }
    ],
    dailyItinerary: [],
    destinationInsights: null,
    recommendations: {
      accommodation: [],
      restaurants: [],
      activities: []
    }
  });

  // Generate daily itinerary data
  useEffect(() => {
    const fetchItinerary = async () => {
      setData(prev => ({ ...prev, aiLoading: true }));
      try {
        const itinerary = await GeminiService.generateItinerary({
          destination: data.destination,
          duration: data.duration,
          travelers: data.travelers,
          budget: data.budget
        });
        setData(prev => ({ ...prev, dailyItinerary: itinerary, aiLoading: false }));
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to generate itinerary. Using default data.",
          variant: "destructive"
        });
        setData(prev => ({ 
          ...prev, 
          dailyItinerary: generateDefaultItinerary(data.duration), 
          aiLoading: false 
        }));
      }
    };

    fetchItinerary();
  }, [data.duration, data.destination]);

  // Fetch destination insights when destination changes
  useEffect(() => {
    const fetchInsights = async () => {
      setData(prev => ({ ...prev, aiLoading: true }));
      try {
        const insights = await GeminiService.getDestinationInsights(data.destination);
        const accommodation = await GeminiService.getRecommendations(data.destination, "accommodation");
        const restaurants = await GeminiService.getRecommendations(data.destination, "restaurants");
        const activities = await GeminiService.getRecommendations(data.destination, "activities");
        
        setData(prev => ({
          ...prev,
          destinationInsights: insights,
          recommendations: {
            accommodation,
            restaurants,
            activities
          },
          aiLoading: false
        }));
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load destination insights. Using default data.",
          variant: "destructive"
        });
        setData(prev => ({ ...prev, aiLoading: false }));
      }
    };

    fetchInsights();
  }, [data.destination]);

  // Chart data formatting
  const budgetData = data.expenses.map(item => ({
    name: item.category,
    amount: item.cost
  }));

  const weatherData = data.forecast.map(day => ({
    name: day.day,
    temperature: day.temp,
    precipitation: day.rain
  }));

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Handle numeric fields appropriately
    if (['duration', 'travelers', 'budget'].includes(name)) {
      setData(prev => ({
        ...prev,
        [name]: Number(value)
      }));
    } else {
      setData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Fetch destination data
  const fetchDestinationData = () => {
    setData(prev => ({ ...prev, loading: true }));

    // Simulate API call
    setTimeout(() => {
      setData(prev => ({
        ...prev,
        loading: false,
        temperature: Math.floor(Math.random() * 10) + 22, // Random temp between 22-32
        weatherCondition: ["Sunny", "Partly Cloudy", "Rainy", "Clear"][Math.floor(Math.random() * 4)]
      }));
    }, 1500);
  };

  // Regenerate itinerary with AI
  const regenerateItinerary = async () => {
    setData(prev => ({ ...prev, aiLoading: true }));
    toast({
      title: "Generating",
      description: "AI is creating your perfect itinerary..."
    });
    
    try {
      const itinerary = await GeminiService.generateItinerary({
        destination: data.destination,
        duration: data.duration,
        travelers: data.travelers,
        budget: data.budget
      });
      
      setData(prev => ({
        ...prev,
        dailyItinerary: itinerary,
        aiLoading: false,
        itineraryCompleteness: Math.min(100, prev.itineraryCompleteness + 15)
      }));
      
      toast({
        title: "Success",
        description: "Your itinerary has been updated with AI recommendations!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to regenerate itinerary",
        variant: "destructive"
      });
      setData(prev => ({ ...prev, aiLoading: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="container mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-indigo-900">
            YatraSaarthi Itinerary Planner
          </h1>
          <Badge className="bg-indigo-600 flex items-center gap-1">
            <LuSparkles size={14} /> AI-Powered
          </Badge>
        </div>

        {/* Main Trip Card */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 pb-2">
            <CardTitle className="text-xl text-indigo-800">
              Trip Overview
            </CardTitle>
            <CardDescription>Plan your perfect vacation</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left side - Destination & Overview */}
              <div className="space-y-6">
                {/* Destination Controls */}
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-sm text-gray-500 mb-1 block">
                      Destination
                    </label>
                    <div className="flex gap-3">
                      <Input
                        value={data.destination}
                        name="destination"
                        onChange={handleInputChange}
                        className="flex-1"
                      />
                      <Button
                        onClick={fetchDestinationData}
                        disabled={data.loading}
                      >
                        {data.loading ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                            <span>Loading</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <LuRefreshCw size={16} />
                            <span>Update</span>
                          </div>
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="text-sm text-gray-500 mb-1 block">
                        Duration (Days)
                      </label>
                      <Input
                        type="number"
                        value={data.duration}
                        name="duration"
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 mb-1 block">
                        Travelers
                      </label>
                      <Input
                        type="number"
                        value={data.travelers}
                        name="travelers"
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 mb-1 block">
                        Budget
                      </label>
                      <Input
                        type="number"
                        value={data.budget}
                        name="budget"
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 mb-1 block">
                        Currency
                      </label>
                      <Select 
                        defaultValue={data.currency}
                        onValueChange={(value) => setData(prev => ({ ...prev, currency: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="INR">INR</SelectItem>
                          <SelectItem value="IDR">IDR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Destination Insights */}
                {data.destinationInsights && (
                  <Card className="shadow-sm border-indigo-100">
                    <CardHeader className="pb-2">
                      <h3 className="font-medium text-lg">AI Destination Insights</h3>
                    </CardHeader>
                    <CardContent className="p-4">
                      <p className="text-gray-700 mb-3">{data.destinationInsights.summary}</p>
                      
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-sm text-gray-600 mb-1">Cultural Notes</h4>
                          <p className="text-gray-700 text-sm">{data.destinationInsights.culturalNotes}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-sm text-gray-600 mb-1">Travel Tips</h4>
                          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                            {data.destinationInsights.tips.map((tip, index) => (
                              <li key={index}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Budget */}
                  <Card className="shadow-sm border-indigo-100">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <FaMoneyBillWave size={20} className="text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Budget Per Person</p>
                          <p className="font-medium">{(data.budget / data.travelers).toFixed(0)} {data.currency}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Weather */}
                  <Card className="shadow-sm border-indigo-100">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <FaUmbrella size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Chance of Rain</p>
                          <p className="font-medium">{data.forecast[0].rain}% on Day 1</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Right side - Current Metrics */}
              <div className="grid grid-cols-1 gap-4">
                {/* Itinerary Completeness */}
                <Card className="shadow-sm border-indigo-100">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-gray-700">
                        Itinerary Completeness
                      </h3>
                      <span className="text-xl font-bold text-indigo-600">
                        {data.itineraryCompleteness}%
                      </span>
                    </div>
                    <Progress value={data.itineraryCompleteness} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">
                      {data.itineraryCompleteness < 50 ? "Keep adding activities" : 
                       data.itineraryCompleteness < 80 ? "Looking good!" : "Perfect itinerary!"}
                    </p>
                  </CardContent>
                </Card>

                {/* Activity Distribution */}
                <Card className="shadow-sm border-indigo-100">
                  <CardHeader className="pb-2">
                    <h3 className="font-semibold text-gray-700">Activity Distribution</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {data.activities.map((activity, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{activity.type}</span>
                            <span>{activity.percentage}%</span>
                          </div>
                          <Progress value={activity.percentage} className="h-1" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <Button className="bg-indigo-600 hover:bg-indigo-700">
                    <LuCalendarDays className="mr-2 h-4 w-4" /> Save Itinerary
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                    onClick={regenerateItinerary}
                    disabled={data.aiLoading}
                  >
                    {data.aiLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
                        <span>AI Working</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <LuSparkles size={16} />
                        <span>AI Enhance</span>
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      

        {/* Budget & Weather */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 pb-2">
            <CardTitle className="text-xl text-indigo-800">
              Budget & Weather Forecast
            </CardTitle>
            <CardDescription>
              Plan your spending and prepare for the weather
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs defaultValue="budget" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="budget">Budget Breakdown</TabsTrigger>
                <TabsTrigger value="weather">Weather Forecast</TabsTrigger>
              </TabsList>

              <TabsContent value="budget" className="mt-0">
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={budgetData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "0.375rem",
                          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                        }}
                        formatter={(value) => [`${value} ${data.currency}`, 'Amount']}
                      />
                      <Legend />
                      <Bar dataKey="amount" name={`Amount (${data.currency})`} fill="#4f46e5" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-indigo-50 p-3 rounded-lg text-center">
                    <p className="text-sm text-gray-600">Total Budget</p>
                    <p className="text-xl font-bold text-indigo-800">{data.budget} {data.currency}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg text-center">
                    <p className="text-sm text-gray-600">Spent</p>
                    <p className="text-xl font-bold text-green-800">
                      {data.expenses.reduce((sum, item) => sum + item.cost, 0)} {data.currency}
                    </p>
                  </div>
                  <div className="bg-amber-50 p-3 rounded-lg text-center">
                    <p className="text-sm text-gray-600">Remaining</p>
                    <p className="text-xl font-bold text-amber-800">
                      {data.budget - data.expenses.reduce((sum, item) => sum + item.cost, 0)} {data.currency}
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="weather" className="mt-0">
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weatherData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" stroke="#6b7280" />
                      <YAxis yAxisId="left" stroke="#6b7280" />
                      <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "0.375rem",
                          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="temperature"
                        stroke="#f59e0b"
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        name="Temperature (°C)"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="precipitation"
                        stroke="#3b82f6"
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        name="Chance of Rain (%)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex space-x-2 overflow-x-auto pb-2">
                  {data.forecast.map((day, index) => (
                    <Card key={index} className="flex-shrink-0 w-32 border-gray-200">
                      <CardContent className="p-3 text-center">
                        <p className="font-medium text-gray-600">{day.day}</p>
                        <div className="my-2">
                          {day.weather === "Sunny" && <LuSun className="w-8 h-8 mx-auto text-amber-500" />}
                          {day.weather === "Partly Cloudy" && <LuSun className="w-8 h-8 mx-auto text-gray-400" />}
                          {day.weather === "Rain Shower" && <FaUmbrella className="w-7 h-7 mx-auto text-blue-500" />}
                        </div>
                        <p className="text-lg font-semibold">{day.temp}°C</p>
                        <p className="text-xs text-gray-500">{day.rain}% rain</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Daily Itinerary */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 pb-2">
            <CardTitle className="text-xl text-indigo-800">
              Daily Itinerary
            </CardTitle>
            <CardDescription>
              Your day-by-day travel plan {data.aiLoading && "(AI is updating...)"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs defaultValue="day1" className="w-full">
              <TabsList className="flex overflow-x-auto pb-px mb-6">
                {data.dailyItinerary.map((day, index) => (
                  <TabsTrigger key={index} value={`day${index + 1}`} className="flex-shrink-0">
                    {day.day}
                  </TabsTrigger>
                ))}
              </TabsList>

              {data.dailyItinerary.map((day, dayIndex) => (
                <TabsContent key={dayIndex} value={`day${dayIndex + 1}`} className="mt-0">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-indigo-900">{day.day}: {day.date}</h3>
                      <p className="text-gray-600">Weather: {day.weather}, {day.temperature}°C</p>
                    </div>
                    <Badge className={
                      day.weather === "Sunny" ? "bg-amber-500" : 
                      day.weather === "Partly Cloudy" ? "bg-gray-400" : 
                      "bg-blue-500"
                    }>
                      {day.weather}
                    </Badge>
                  </div>
                  
                  <div className="space-y-4">
                    {day.activities.map((activity, actIndex) => (
                      <Card key={actIndex} className="shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-lg flex-shrink-0 ${
                                activity.type === "food" ? "bg-amber-100" : 
                                activity.type === "attraction" ? "bg-blue-100" : 
                                activity.type === "accommodation" ? "bg-indigo-100" : 
                                "bg-green-100"
                              }`}>
                                {activity.type === "food" ? <LuUtensils className="h-5 w-5 text-amber-600" /> : 
                                 activity.type === "attraction" ? <LuLandmark className="h-5 w-5 text-blue-600" /> : 
                                 activity.type === "accommodation" ? <LuHotel className="h-5 w-5 text-indigo-600" /> : 
                                 <FaWalking className="h-5 w-5 text-green-600" />}
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">{activity.activity}</h4>
                                <p className="text-gray-600 flex items-center gap-1 text-sm">
                                  <LuMapPin size={12} />
                                  <span>{activity.location}</span>
                                </p>
                              </div>
                            </div>
                            <div className="mt-2 sm:mt-0 sm:ml-2">
                              <Badge variant="outline" className="bg-gray-50">
                                {activity.time}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  {/* Day summary */}
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button variant="outline" size="sm" className="text-gray-600">
                      <LuPlane className="mr-1 h-4 w-4" /> Add Transportation
                    </Button>
                    <Button variant="outline" size="sm" className="text-gray-600">
                      <LuUtensils className="mr-1 h-4 w-4" /> Add Meal
                    </Button>
                    <Button variant="outline" size="sm" className="text-gray-600">
                      <LuLandmark className="mr-1 h-4 w-4" /> Add Attraction
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-indigo-600 border-indigo-600 hover:bg-indigo-50"
                      onClick={() => {
                        toast({
                          title: "AI Enhancement Requested",
                          description: `AI will optimize your ${day.day} activities`
                        });
                      }}
                    >
                      <LuSparkles className="mr-1 h-4 w-4" /> AI Enhance Day
                    </Button>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* AI Recommendations */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 pb-2">
            <CardTitle className="text-xl text-indigo-800">
              AI Recommendations
            </CardTitle>
            <CardDescription>
              Personalized suggestions for your trip to {data.destination}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Accommodation */}
              <Card className="shadow-sm hover:shadow-md transition-all">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                      <LuHotel className="h-5 w-5 text-indigo-600" />
                    </div>
                    <h3 className="font-medium text-lg">Top Accommodation</h3>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.recommendations.accommodation.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="bg-blue-50 p-2 rounded-lg flex-shrink-0">
                          <span className="text-blue-600 font-medium">{index + 1}</span>
                        </div>
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-gray-600 text-sm">{item.location} • {item.rating}★</p>
                          <p className="text-indigo-600 font-medium text-sm mt-1">
                            {item.price} {typeof item.price === 'number' ? `${data.currency}/night` : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="link" className="text-indigo-600 p-0 h-auto">
                    View all options
                  </Button>
                </CardFooter>
              </Card>

              {/* Restaurants */}
              <Card className="shadow-sm hover:shadow-md transition-all">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-100 p-2 rounded-lg">
                      <LuUtensils className="h-5 w-5 text-amber-600" />
                    </div>
                    <h3 className="font-medium text-lg">Must-Try Restaurants</h3>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.recommendations.restaurants.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="bg-blue-50 p-2 rounded-lg flex-shrink-0">
                          <span className="text-blue-600 font-medium">{index + 1}</span>
                        </div>
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-gray-600 text-sm">{item.location} • {item.cuisine}</p>
                          <p className="text-indigo-600 font-medium text-sm mt-1">
                            {item.price} • {item.rating}★
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="link" className="text-indigo-600 p-0 h-auto">
                    View all options
                  </Button>
                </CardFooter>
              </Card>

              {/* Activities */}
              <Card className="shadow-sm hover:shadow-md transition-all">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <FaWalking className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="font-medium text-lg">Popular Activities</h3>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.recommendations.activities.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="bg-blue-50 p-2 rounded-lg flex-shrink-0">
                          <span className="text-blue-600 font-medium">{index + 1}</span>
                        </div>
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-gray-600 text-sm">{item.location} • {item.type}</p>
                          <p className="text-indigo-600 font-medium text-sm mt-1">
                            {item.price} {data.currency} • {item.rating}★
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="link" className="text-indigo-600 p-0 h-auto">
                    View all options
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Final Actions */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Button 
            variant="outline" 
            className="border-gray-300 text-gray-700"
            onClick={regenerateItinerary}
            disabled={data.aiLoading}
          >
            {data.aiLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                <span>AI Working</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <LuSparkles className="mr-2 h-4 w-4" /> Regenerate with AI
              </div>
            )}
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" className="border-indigo-600 text-indigo-600 hover:bg-indigo-50">
              Export as PDF
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              Book This Trip
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryPlanner;