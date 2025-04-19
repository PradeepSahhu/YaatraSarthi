
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { 
  Wallet, Plus, DollarSign, TrendingUp, TrendingDown,
  Filter, Download, Calendar, CreditCard, Search,
  Plane, Hotel, Utensils
} from 'lucide-react';
import { motion } from 'framer-motion';

const ExpenseManager = () => {


  const expenses = [
    {
      id: 1,
      description: "Flight to Bali",
      category: "flights",
      amount: 850,
      date: "2025-01-15",
      icon: Plane,
      color: "#3B82F6"
    },
    {
      id: 2,
      description: "Grand Hyatt Hotel",
      category: "accommodation",
      amount: 1200,
      date: "2025-01-16",
      icon: Hotel,
      color: "#10B981"
    },
    {
      id: 3,
      description: "Local Restaurant",
      category: "food",
      amount: 45,
      date: "2025-01-16",
      icon: Utensils,
      color: "#F59E0B"
    }
  ];

  const categoryData = [
    { name: 'Flights', value: 2500, color: '#3B82F6' },
    { name: 'Hotels', value: 1800, color: '#10B981' },
    { name: 'Food', value: 800, color: '#F59E0B' },
    { name: 'Transport', value: 400, color: '#6366F1' },
    { name: 'Shopping', value: 600, color: '#EC4899' },
    { name: 'Activities', value: 900, color: '#8B5CF6' }
  ];

  const monthlyTrends = [
    { month: 'Jan', spent: 2800 },
    { month: 'Feb', spent: 3200 },
    { month: 'Mar', spent: 2900 },
    { month: 'Apr', spent: 3500 }
  ];

  const budgetOverview = [
    { category: 'Flights', allocated: 3000, spent: 2500 },
    { category: 'Hotels', allocated: 2000, spent: 1800 },
    { category: 'Food', allocated: 1000, spent: 800 },
    { category: 'Transport', allocated: 500, spent: 400 },
    { category: 'Shopping', allocated: 800, spent: 600 },
    { category: 'Activities', allocated: 1200, spent: 900 }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-400">Expense Manager</h1>
            <div className="flex space-x-4">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button variant="outline" className="text-gray-100 border-gray-400">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button variant="outline" className="text-gray-100 border-gray-400">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button className="bg-orange-500 hover:bg-orange-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Expense
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { title: "Total Spent", value: "$7,000", icon: Wallet, trend: "+12%", upward: true },
            { title: "Monthly Avg", value: "$2,333", icon: TrendingUp, trend: "+8%", upward: true },
            { title: "Last Trip", value: "$1,200", icon: Plane, trend: "-5%", upward: false },
            { title: "Available Budget", value: "$3,000", icon: DollarSign, trend: "-25%", upward: false }
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
                      <div className={`flex items-center mt-2 ${stat.upward ? 'text-green-400' : 'text-red-400'}`}>
                        {stat.upward ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                        <span className="text-sm">{stat.trend}</span>
                      </div>
                    </div>
                    <div className={`p-3 bg-gray-700 rounded-lg ${stat.upward ? 'text-green-400' : 'text-red-400'}`}>
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
              <CardTitle className="text-gray-100">Spending by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                      itemStyle={{ color: '#E5E7EB' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                {categoryData.map((category, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: category.color }} />
                    <span className="text-sm text-gray-400">{category.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-100">Monthly Spending Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                      itemStyle={{ color: '#E5E7EB' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="spent" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      dot={{ fill: '#3B82F6' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Budget vs Actual */}
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-gray-100">Budget vs Actual Spending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budgetOverview}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="category" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                    itemStyle={{ color: '#E5E7EB' }}
                  />
                  <Bar dataKey="allocated" fill="#3B82F6" name="Budget" />
                  <Bar dataKey="spent" fill="#10B981" name="Spent" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Expenses */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-gray-100">Recent Expenses</CardTitle>
              <div className="flex space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search expenses..." 
                    className="pl-10 bg-gray-700 border-gray-600 text-gray-100"
                  />
                </div>
                <Button variant="outline" className="text-gray-100 border-gray-400">
                  <Calendar className="h-4 w-4 mr-2" />
                  Date Range
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenses.map((expense) => (
                <motion.div
                  key={expense.id}
                  whileHover={{ scale: 1.01 }}
                  className="bg-gray-700 p-4 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: expense.color + '20' }}>
                        <expense.icon className="h-6 w-6" style={{ color: expense.color }} />
                      </div>
                      <div className="ml-4">
                        <p className="font-medium text-gray-100">{expense.description}</p>
                        <p className="text-sm text-gray-400">{expense.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-lg font-semibold text-gray-100">${expense.amount}</span>
                      <CreditCard className="h-4 w-4 text-gray-400 ml-2" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExpenseManager;