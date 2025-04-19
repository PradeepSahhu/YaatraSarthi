import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from 'framer-motion';
import { AuthPageProps } from '@/types';
import { useNavigate } from 'react-router-dom';

const AuthPage: React.FC<AuthPageProps> = ({ toggleAuth }) => {

  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = ()=>{
    toggleAuth();
    navigate("/SignUp");
  }

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // const response = await fetch('http://localhost:8000/api/login', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // });
      
      // if (!response.ok) {
      //   throw new Error(`HTTP error! Status: ${response.status}`);
      // }
        navigate("/itinery");
      
      
      // const data = await response.json();
      // console.log('Success:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-100">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700 shadow-lg">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-blue-400 text-center mb-4">
            Login
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
              type="email" 
              name="email" 
              placeholder="Email" 
              value={formData.email} 
              onChange={handleChange} 
              className="bg-gray-700 text-gray-100 border-gray-600" 
            />
            <Input 
              type="password" 
              name="password" 
              placeholder="Password" 
              value={formData.password} 
              onChange={handleChange} 
              className="bg-gray-700 text-gray-100 border-gray-600" 
            />
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button className="w-full bg-orange-500 hover:bg-orange-600">
                Login
              </Button>
            </motion.div>
          </form>
          <p className="text-center text-gray-400 mt-4">
            Don't have an account? 
            <span 
              className="text-blue-400 cursor-pointer hover:underline" 
              onClick={handleRegister}
            >
              Register
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

const AuthContainer = () => {
  const [isLogin, setIsLogin] = useState(true);
  const toggleAuth = () => setIsLogin(!isLogin);
  return <AuthPage isLogin={isLogin} toggleAuth={toggleAuth} />;
};

export default AuthContainer;
