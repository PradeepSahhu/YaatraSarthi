import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, MapPin, Plus, Trash2, Save, Share2, Plane, Hotel, Utensils, Camera, Edit2, Check, X, ArrowRight } from 'lucide-react';

// Type definitions
interface Activity {
  id: number;
  time: string;
  type: string;
  title: string;
  location: string;
  duration: string;
  notes: string;
}

interface Day {
  id: number;
  date: string;
  activities: Activity[];
}

interface EditingActivity extends Activity {
  dayId: number;
  activityId: number;
}

const ItineraryPlanner = () => {
  const [tripName, setTripName] = useState<string>("Amazing India Tour");
  const [startDate, setStartDate] = useState<string>("2025-02-01");
  const [endDate, setEndDate] = useState<string>("2025-02-10");
  const [editingActivity, setEditingActivity] = useState<EditingActivity | null>(null);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const navigate = useNavigate();
  
  // Initial data with 10 days of sample activities
  const [days, setDays] = useState<Day[]>([
    {
      id: 1,
      date: "2025-02-01",
      activities: [
        {
          id: 1,
          time: "09:00",
          type: "transport",
          title: "Flight to New Delhi",
          location: "International Airport",
          duration: "8 hours",
          notes: "Air India AI302, Terminal 3"
        },
        {
          id: 2,
          time: "18:00",
          type: "hotel",
          title: "Check-in at Taj Palace",
          location: "New Delhi",
          duration: "1 hour",
          notes: "Confirmation #TAJ20250201"
        },
        {
          id: 3,
          time: "20:00",
          type: "food",
          title: "Dinner at Bukhara",
          location: "ITC Maurya, New Delhi",
          duration: "2 hours",
          notes: "Famous for its North-West Frontier cuisine"
        }
      ]
    },
    {
      id: 2,
      date: "2025-02-02",
      activities: [
        {
          id: 1,
          time: "08:00",
          type: "food",
          title: "Breakfast at Hotel",
          location: "Taj Palace, New Delhi",
          duration: "1 hour",
          notes: "Buffet breakfast included in stay"
        },
        {
          id: 2,
          time: "10:00",
          type: "attraction",
          title: "Visit Red Fort",
          location: "Old Delhi",
          duration: "3 hours",
          notes: "Hire a guide at entrance"
        },
        {
          id: 3,
          time: "14:00",
          type: "food",
          title: "Lunch at Karim's",
          location: "Old Delhi",
          duration: "1.5 hours",
          notes: "Try the mutton korma and biryani"
        },
        {
          id: 4,
          time: "16:00",
          type: "attraction",
          title: "Explore Chandni Chowk",
          location: "Old Delhi",
          duration: "2 hours",
          notes: "Shopping for souvenirs and spices"
        }
      ]
    },
    {
      id: 3,
      date: "2025-02-03",
      activities: [
        {
          id: 1,
          time: "07:00",
          type: "transport",
          title: "Train to Agra",
          location: "New Delhi Railway Station",
          duration: "2 hours",
          notes: "Gatimaan Express, Executive Class"
        },
        {
          id: 2,
          time: "10:00",
          type: "attraction",
          title: "Visit Taj Mahal",
          location: "Agra, India",
          duration: "3 hours",
          notes: "Don't forget camera! Hire official guide at entrance."
        },
        {
          id: 3,
          time: "14:00",
          type: "food",
          title: "Lunch at Peshawri",
          location: "ITC Mughal, Agra",
          duration: "1.5 hours",
          notes: "Reservation confirmed"
        },
        {
          id: 4,
          time: "16:00",
          type: "attraction",
          title: "Visit Agra Fort",
          location: "Agra",
          duration: "2 hours",
          notes: "UNESCO World Heritage Site"
        }
      ]
    },
    {
      id: 4,
      date: "2025-02-04",
      activities: [
        {
          id: 1,
          time: "08:00",
          type: "transport",
          title: "Drive to Jaipur",
          location: "Agra to Jaipur",
          duration: "5 hours",
          notes: "Private car with driver arranged"
        },
        {
          id: 2,
          time: "13:00",
          type: "food",
          title: "Lunch at Lakshmi Misthan Bhandar",
          location: "Jaipur",
          duration: "1 hour",
          notes: "Famous for local sweets and snacks"
        },
        {
          id: 3,
          time: "15:00",
          type: "hotel",
          title: "Check-in at Rambagh Palace",
          location: "Jaipur",
          duration: "1 hour",
          notes: "Confirmation #RAM20250204"
        },
        {
          id: 4,
          time: "17:00",
          type: "attraction",
          title: "Visit City Palace",
          location: "Jaipur",
          duration: "2 hours",
          notes: "Royal residence with museum"
        }
      ]
    },
    {
      id: 5,
      date: "2025-02-05",
      activities: [
        {
          id: 1,
          time: "08:00",
          type: "attraction",
          title: "Visit Amber Fort",
          location: "Jaipur",
          duration: "3 hours",
          notes: "Elephant ride to the top available"
        },
        {
          id: 2,
          time: "12:00",
          type: "food",
          title: "Lunch at Spice Court",
          location: "Jaipur",
          duration: "1.5 hours",
          notes: "Try the Rajasthani thali"
        },
        {
          id: 3,
          time: "14:30",
          type: "attraction",
          title: "Shopping at Johari Bazaar",
          location: "Jaipur",
          duration: "3 hours",
          notes: "Known for textiles, jewelry and crafts"
        },
        {
          id: 4,
          time: "19:00",
          type: "food",
          title: "Dinner at Chokhi Dhani",
          location: "Jaipur",
          duration: "3 hours",
          notes: "Cultural village with traditional dinner"
        }
      ]
    },
    {
      id: 6,
      date: "2025-02-06",
      activities: [
        {
          id: 1,
          time: "10:00",
          type: "transport",
          title: "Flight to Varanasi",
          location: "Jaipur International Airport",
          duration: "2 hours",
          notes: "IndiGo 6E-234"
        },
        {
          id: 2,
          time: "13:00",
          type: "hotel",
          title: "Check-in at Taj Ganges",
          location: "Varanasi",
          duration: "1 hour",
          notes: "Confirmation #TGV20250206"
        },
        {
          id: 3,
          time: "17:00",
          type: "attraction",
          title: "Evening Ganga Aarti",
          location: "Dashashwamedh Ghat, Varanasi",
          duration: "1.5 hours",
          notes: "Spectacular evening ceremony by the river"
        },
        {
          id: 4,
          time: "19:30",
          type: "food",
          title: "Dinner at Keshari Restaurant",
          location: "Varanasi",
          duration: "1.5 hours",
          notes: "Local vegetarian cuisine"
        }
      ]
    },
    {
      id: 7,
      date: "2025-02-07",
      activities: [
        {
          id: 1,
          time: "05:30",
          type: "attraction",
          title: "Sunrise Boat Ride on Ganges",
          location: "Assi Ghat, Varanasi",
          duration: "2 hours",
          notes: "Private boat arranged through hotel"
        },
        {
          id: 2,
          time: "08:30",
          type: "food",
          title: "Breakfast at hotel",
          location: "Taj Ganges, Varanasi",
          duration: "1 hour",
          notes: ""
        },
        {
          id: 3,
          type: "attraction",
          time: "10:00",
          title: "Visit Sarnath",
          location: "Near Varanasi",
          duration: "3 hours",
          notes: "Buddhist pilgrimage site"
        },
        {
          id: 4,
          type: "food",
          time: "14:00",
          title: "Lunch at Aadha-Aadha",
          location: "Varanasi",
          duration: "1.5 hours",
          notes: "Modern fusion restaurant"
        }
      ]
    },
    {
      id: 8,
      date: "2025-02-08",
      activities: [
        {
          id: 1,
          type: "transport",
          time: "09:00",
          title: "Flight to Mumbai",
          location: "Varanasi Airport",
          duration: "2.5 hours",
          notes: "Air India AI695"
        },
        {
          id: 2,
          type: "hotel",
          time: "12:30",
          title: "Check-in at Taj Mahal Palace",
          location: "Mumbai",
          duration: "1 hour",
          notes: "Confirmation #TMP20250208"
        },
        {
          id: 3,
          type: "attraction",
          time: "15:00",
          title: "Visit Gateway of India",
          location: "Apollo Bunder, Mumbai",
          duration: "1 hour",
          notes: "Historic monument overlooking the Arabian Sea"
        },
        {
          id: 4,
          type: "food",
          time: "19:00",
          title: "Dinner at Trishna",
          location: "Mumbai",
          duration: "2 hours",
          notes: "Famous for seafood, especially butter garlic crab"
        }
      ]
    },
    {
      id: 9,
      date: "2025-02-09",
      activities: [
        {
          id: 1,
          type: "attraction",
          time: "08:00",
          title: "Tour of Dharavi",
          location: "Mumbai",
          duration: "3 hours",
          notes: "Educational slum tour with reputable guide"
        },
        {
          id: 2,
          type: "food",
          time: "12:00",
          title: "Street Food Tour",
          location: "Various locations, Mumbai",
          duration: "2 hours",
          notes: "Try vada pav, pav bhaji, and bhel puri"
        },
        {
          id: 3,
          type: "attraction",
          time: "15:00",
          title: "Visit Elephanta Caves",
          location: "Elephanta Island, Mumbai",
          duration: "4 hours",
          notes: "UNESCO World Heritage Site, ferry from Gateway of India"
        },
        {
          id: 4,
          type: "food",
          time: "20:00",
          title: "Dinner at Khyber",
          location: "Mumbai",
          duration: "2 hours",
          notes: "North Indian cuisine in elegant setting"
        }
      ]
    },
    {
      id: 10,
      date: "2025-02-10",
      activities: [
        {
          id: 1,
          type: "attraction",
          time: "09:00",
          title: "Shopping at Colaba Causeway",
          location: "Mumbai",
          duration: "2 hours",
          notes: "Bargain for souvenirs and clothes"
        },
        {
          id: 2,
          type: "food",
          time: "12:00",
          title: "Lunch at Leopold Cafe",
          location: "Mumbai",
          duration: "1.5 hours",
          notes: "Historic restaurant mentioned in Shantaram"
        },
        {
          id: 3,
          type: "transport",
          time: "16:00",
          title: "Transfer to Airport",
          location: "Mumbai",
          duration: "1 hour",
          notes: "Private transfer arranged"
        },
        {
          id: 4,
          type: "transport",
          time: "21:00",
          title: "International Flight Home",
          location: "Chhatrapati Shivaji International Airport",
          duration: "9 hours",
          notes: "Check-in 3 hours before departure"
        }
      ]
    }
  ]);

  const addDay = (): void => {
    const lastDay = days[days.length - 1];
    const newDate = new Date(lastDay.date);
    newDate.setDate(newDate.getDate() + 1);
    
    setDays([...days, {
      id: days.length + 1,
      date: newDate.toISOString().split('T')[0],
      activities: []
    }]);
  };

  const addActivity = (dayId: number): void => {
    const updatedDays = days.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          activities: [...day.activities, {
            id: day.activities.length + 1,
            time: "12:00",
            type: "attraction",
            title: "New Activity",
            location: "Location",
            duration: "1 hour",
            notes: ""
          }]
        };
      }
      return day;
    });
    setDays(updatedDays);
  };

  const deleteActivity = (dayId: number, activityId: number): void => {
    const updatedDays = days.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          activities: day.activities.filter(activity => activity.id !== activityId)
        };
      }
      return day;
    });
    setDays(updatedDays);
  };
  
  const deleteDay = (dayId: number): void => {
    if (days.length > 1) {
      setDays(days.filter(day => day.id !== dayId).map((day, index) => ({
        ...day,
        id: index + 1
      })));
    }
  };

  const startEditing = (dayId: number, activityId: number): void => {
    const day = days.find(d => d.id === dayId);
    if (!day) return;
    
    const activity = day.activities.find(a => a.id === activityId);
    if (!activity) return;
    
    setEditingActivity({
      dayId,
      activityId,
      ...activity
    });
  };
  
  const saveActivityEdit = (): void => {
    if (!editingActivity) return;
    
    const updatedDays = days.map(day => {
      if (day.id === editingActivity.dayId) {
        return {
          ...day,
          activities: day.activities.map(activity => {
            if (activity.id === editingActivity.activityId) {
              return {
                id: activity.id,
                time: editingActivity.time,
                type: editingActivity.type,
                title: editingActivity.title,
                location: editingActivity.location,
                duration: editingActivity.duration,
                notes: editingActivity.notes
              };
            }
            return activity;
          })
        };
      }
      return day;
    });
    
    setDays(updatedDays);
    setEditingActivity(null);
  };
  
  const cancelEditing = (): void => {
    setEditingActivity(null);
  };

  const handleSave = (): void => {
    setShowSaveConfirmation(true);
    // In a real app, this would save to a database
    setTimeout(() => {
      setShowSaveConfirmation(false);
    }, 2000);
  };

  const handleHotelBooking = (): void => {
    navigate("/hotelbooking");
  };

  const getActivityIcon = (type: string) => {
    switch(type) {
      case "transport": return <Plane className="h-5 w-5" />;
      case "hotel": return <Hotel className="h-5 w-5" />;
      case "food": return <Utensils className="h-5 w-5" />;
      default: return <Camera className="h-5 w-5" />;
    }
  };
  
  // Sort activities by time for each day
  const sortedDays = days.map(day => {
    return {
      ...day,
      activities: [...day.activities].sort((a, b) => {
        return a.time.localeCompare(b.time);
      })
    };
  });

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-400">Trip Planner</h1>
            <div className="flex space-x-4">
              <div>
              <Button 
                  variant="outline" 
                  className="text-gray-100 border-gray-400"
                  onClick={handleHotelBooking}
                >
                
                 Hotel Booking
                </Button>
              </div>
              <div>
                <Button 
                  variant="outline" 
                  className="text-gray-100 border-gray-400"
                  onClick={handleSave}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
              </div>
              <div>
                <Button 
                  className="bg-orange-500 hover:bg-orange-600"
                  onClick={() => setShowShareModal(true)}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Plan
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Trip Overview */}
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Trip Name</label>
                <Input 
                  placeholder="Enter trip name"
                  className="bg-gray-700 border-gray-600 text-gray-100"
                  value={tripName}
                  onChange={(e) => setTripName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Start Date</label>
                <Input 
                  type="date"
                  className="bg-gray-700 border-gray-600 text-gray-100"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">End Date</label>
                <Input 
                  type="date"
                  className="bg-gray-700 border-gray-600 text-gray-100"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Itinerary */}
        <div className="space-y-6">
          {sortedDays.map((day) => (
            <div
              key={day.id}
              className="opacity-100"
            >
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-blue-400 mr-2" />
                      <h3 className="text-xl font-semibold">Day {day.id}</h3>
                      <span className="ml-4 text-gray-400">{day.date}</span>
                    </div>
                    <div className="flex space-x-3">
                      <div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-gray-100 border-gray-600"
                          onClick={() => addActivity(day.id)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Activity
                        </Button>
                      </div>
                      {days.length > 1 && (
                        <div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-400 border-red-700 hover:bg-red-900/20"
                            onClick={() => deleteDay(day.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Day
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {day.activities.length === 0 ? (
                      <div className="text-center py-6 text-gray-500">
                        No activities planned. Click "Add Activity" to get started.
                      </div>
                    ) : (
                      day.activities.map((activity) => (
                        <div
                          key={activity.id}
                          className="bg-gray-700 rounded-lg p-4 border border-gray-600 hover:scale-101"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                              <div className="bg-gray-600 p-2 rounded-lg">
                                {getActivityIcon(activity.type)}
                              </div>
                              <div>
                                <div className="flex items-center mb-2">
                                  <Clock className="h-4 w-4 text-gray-400 mr-2" />
                                  <span className="text-gray-300">{activity.time}</span>
                                  <span className="mx-2 text-gray-500">•</span>
                                  <span className="text-gray-300">{activity.duration}</span>
                                </div>
                                <h4 className="font-semibold mb-1">{activity.title}</h4>
                                <div className="flex items-center text-gray-400">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  <span>{activity.location}</span>
                                </div>
                                {activity.notes && (
                                  <p className="text-gray-400 text-sm mt-2">{activity.notes}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-gray-400 hover:text-gray-100"
                                onClick={() => startEditing(day.id, activity.id)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-gray-400 hover:text-red-400"
                                onClick={() => deleteActivity(day.id, activity.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Add Day Button */}
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            className="text-gray-100 border-gray-600"
            onClick={addDay}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Day
          </Button>
        </div>
      </div>

      {/* Edit Activity Modal */}
      {editingActivity && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Edit Activity</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Activity Type</label>
                <Select 
                  value={editingActivity.type} 
                  onValueChange={(value) => setEditingActivity({...editingActivity, type: value})}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="attraction">Attraction</SelectItem>
                    <SelectItem value="transport">Transportation</SelectItem>
                    <SelectItem value="hotel">Accommodation</SelectItem>
                    <SelectItem value="food">Food & Dining</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
                <Input 
                  className="bg-gray-700 border-gray-600"
                  value={editingActivity.title}
                  onChange={(e) => setEditingActivity({...editingActivity, title: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Time</label>
                  <Input 
                    type="time"
                    className="bg-gray-700 border-gray-600"
                    value={editingActivity.time}
                    onChange={(e) => setEditingActivity({...editingActivity, time: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Duration</label>
                  <Input 
                    className="bg-gray-700 border-gray-600"
                    value={editingActivity.duration}
                    onChange={(e) => setEditingActivity({...editingActivity, duration: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
                <Input 
                  className="bg-gray-700 border-gray-600"
                  value={editingActivity.location}
                  onChange={(e) => setEditingActivity({...editingActivity, location: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Notes</label>
                <Textarea 
                  className="bg-gray-700 border-gray-600 min-h-20"
                  value={editingActivity.notes}
                  onChange={(e) => setEditingActivity({...editingActivity, notes: e.target.value})}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={cancelEditing}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={saveActivityEdit}>
                <Check className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Save Confirmation */}
      {showSaveConfirmation && (
        <div className="fixed bottom-8 right-8 bg-gray-800 text-white p-4 rounded-lg shadow-lg border border-green-500 flex items-center z-50">
          <Check className="h-5 w-5 text-green-500 mr-2" />
          Itinerary saved successfully!
        </div>
      )}
      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Share Your Itinerary</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Share via Email</label>
                <div className="flex space-x-2">
                  <Input 
                    placeholder="Enter email address"
                    className="bg-gray-700 border-gray-600"
                  />
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Share Link</label>
                <div className="flex space-x-2">
                  <Input 
                    readOnly
                    value="https://trip-planner.com/share/amazing-india-tour"
                    className="bg-gray-700 border-gray-600"
                  />
                  <Button variant="outline">Copy</Button>
                </div>
              </div>
              
              <div className="pt-4">
              <Button 
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    onClick={() => setShowShareModal(false)}
                  >
                    Done
                  </Button>
                </div>
              </div>
            </div>
          </div>
       
      )}
    </div>
  );
};

export default ItineraryPlanner;
                  