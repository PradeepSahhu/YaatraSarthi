
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Calendar, MapPin, CreditCard, Users, Plane, ChevronRight, Bell,
  Settings, LogOut, Search
} from 'lucide-react';
import { motion } from 'framer-motion';

const DashboardPage = () => {
  const upcomingTrips = [
    {
      id: 1,
      destination: "Bali Adventure",
      date: "Feb 15 - Feb 22",
      location: "Bali, Indonesia",
      image: "/api/placeholder/300/200",
      progress: 75
    },
    {
      id: 2,
      destination: "Europe Tour",
      date: "Mar 10 - Mar 25",
      location: "Multiple Cities",
      image: "/api/placeholder/300/200",
      progress: 45
    }
  ];

  const bookingStats = [
    { name: 'Jan', flights: 12, hotels: 8, activities: 15 },
    { name: 'Feb', flights: 19, hotels: 12, activities: 22 },
    { name: 'Mar', flights: 15, hotels: 10, activities: 18 },
    { name: 'Apr', flights: 25, hotels: 18, activities: 28 }
  ];

  const spendingData = [
    { name: 'Jan', amount: 2500 },
    { name: 'Feb', amount: 3800 },
    { name: 'Mar', amount: 3200 },
    { name: 'Apr', amount: 4500 }
  ];

  const notifications = [
    {
      id: 1,
      type: "reminder",
      message: "Complete your Europe trip checklist",
      time: "2 hours ago"
    },
    {
      id: 2,
      type: "booking",
      message: "Flight booking confirmed for Bali",
      time: "5 hours ago"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Top Navigation */}
      <nav className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-blue-400">Dashboard</h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-gray-800 text-gray-100 pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-400 w-64"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5 text-gray-300" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-4 h-4 flex items-center justify-center">2</span>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5 text-gray-300" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button variant="ghost" size="icon">
                  <LogOut className="h-5 w-5 text-gray-300" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { title: "Total Trips", value: "24", icon: Plane, color: "text-blue-400" },
            { title: "Upcoming", value: "3", icon: Calendar, color: "text-green-400" },
            { title: "Total Spent", value: "$14,280", icon: CreditCard, color: "text-orange-400" },
            { title: "Travel Buddies", value: "16", icon: Users, color: "text-purple-400" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-100 mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 bg-gray-700 rounded-lg ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-100">Booking Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bookingStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                      itemStyle={{ color: '#E5E7EB' }}
                    />
                    <Bar dataKey="flights" fill="#3B82F6" />
                    <Bar dataKey="hotels" fill="#10B981" />
                    <Bar dataKey="activities" fill="#F59E0B" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-100">Travel Spending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={spendingData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                      itemStyle={{ color: '#E5E7EB' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#3B82F6" 
                      fill="#3B82F6" 
                      fillOpacity={0.2} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Trips & Notifications */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-gray-100">Upcoming Trips</CardTitle>
                <Button variant="ghost" className="text-gray-300">
                  View All <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {upcomingTrips.map((trip) => (
                    <motion.div
                      key={trip.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-gray-700 rounded-lg overflow-hidden"
                    >
                      <div className="flex">
                        <img 
                          src={trip.image} 
                          alt={trip.destination}
                          className="w-32 h-32 object-cover"
                        />
                        <div className="p-4 flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-lg text-gray-100">{trip.destination}</h3>
                              <div className="flex items-center text-gray-400 mt-1">
                                <Calendar className="h-4 w-4 mr-2" />
                                <span>{trip.date}</span>
                              </div>
                              <div className="flex items-center text-gray-400 mt-1">
                                <MapPin className="h-4 w-4 mr-2" />
                                <span>{trip.location}</span>
                              </div>
                            </div>
                            <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                              View Details
                            </Button>
                          </div>
                          <div className="mt-4">
                            <div className="flex items-center justify-between text-sm text-gray-400">
                              <span>Planning Progress</span>
                              <span>{trip.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                              <div 
                                className="bg-blue-500 rounded-full h-2"
                                style={{ width: `${trip.progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-gray-100">Notifications</CardTitle>
                <Button variant="ghost" size="sm" className="text-gray-300">
                  Mark All Read
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-gray-700 p-4 rounded-lg"
                    >
                      <div className="flex items-start">
                        <div className="bg-blue-500/10 p-2 rounded-lg">
                          <Bell className="h-5 w-5 text-blue-400" />
                        </div>
                        <div className="ml-4 flex-1">
                          <p className="text-gray-100">{notification.message}</p>
                          <p className="text-sm text-gray-400 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;