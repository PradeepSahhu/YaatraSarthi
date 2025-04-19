import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { motion } from "framer-motion";
import { Settings, Globe, User, Shield } from "lucide-react";

const ProfileSettingsPage = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between pb-8 border-b border-gray-800"
        >
          <div className="flex items-center space-x-6">
            <motion.div whileHover={{ scale: 1.05 }} className="relative">
              <Avatar className="h-24 w-24 border-2 border-blue-400/50">
                <AvatarImage src="https://example.com/avatar.jpg" alt="User Avatar" />
                <AvatarFallback className="bg-gray-800 text-2xl">YS</AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 bg-blue-500 p-1.5 rounded-full">
                <Settings className="h-5 w-5 text-white" />
              </div>
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold">Aarav Sharma</h1>
              <p className="text-gray-400">Explorer Tier • 4,500 Points</p>
            </div>
          </div>
          <Button variant="outline" className="border-gray-700 hover:bg-gray-800">
            <Globe className="mr-2 h-4 w-4" />
            Public Profile
          </Button>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Account Settings */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-gray-800 bg-gray-900">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-blue-400" />
                    <span>Account Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <label className="block">
                      <span className="text-sm font-medium text-gray-300">Full Name</span>
                      <Input defaultValue="Aarav Sharma" className="bg-gray-800 border-gray-700 mt-1" />
                    </label>
                    <label className="block">
                      <span className="text-sm font-medium text-gray-300">Email</span>
                      <Input type="email" defaultValue="aarav@yatrasaarthi.com" className="bg-gray-800 border-gray-700 mt-1" />
                    </label>
                    <label className="block">
                      <span className="text-sm font-medium text-gray-300">Phone Number</span>
                      <Input defaultValue="+91 98765 43210" className="bg-gray-800 border-gray-700 mt-1" />
                    </label>
                    <Button variant="outline" className="border-gray-700 hover:bg-gray-800">
                      Update
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Security Settings */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-gray-800 bg-gray-900">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-orange-400" />
                    <span>Security</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-400">Add extra security layer</p>
                    </div>
                    <Button variant="outline" className="border-gray-700 hover:bg-gray-800">
                      Enable 2FA
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Password</h3>
                      <p className="text-sm text-gray-400">Last changed 3 months ago</p>
                    </div>
                    <Button variant="outline" className="border-gray-700 hover:bg-gray-800">
                      Change
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="pt-8 border-t border-gray-800"
        >
          <Card className="border-red-900/50 bg-red-900/10">
            <CardHeader>
              <CardTitle className="text-red-400">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Export Data</h3>
                  <p className="text-sm text-red-300">Download all your travel data</p>
                </div>
                <Button className="bg-red-500 hover:bg-red-600 text-white">
                  Export Data
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Delete Account</h3>
                  <p className="text-sm text-red-300">Permanently remove your account</p>
                </div>
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
