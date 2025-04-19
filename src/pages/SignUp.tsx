import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from 'framer-motion';

const RegisterPage = () => {
  const [userInfo, setUserInfo] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo({
      ...userInfo,
      [name]: value,
    });
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInfo),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Success:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  return (
    <div className="min-h-screen bg-gray-950 flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <motion.h2
          whileHover={{ scale: 1.05 }}
          className="text-3xl font-bold text-blue-400 text-center mb-6"
        >
          Create an Account
        </motion.h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              name="fullName"
              value={userInfo.fullName}
              onChange={handleChange}
              placeholder="Your Name"
              className="bg-gray-700/50 text-gray-100 border-gray-600"
            />
          </div>
          <div>
            <Input
              type="email"
              name="email"
              value={userInfo.email}
              onChange={handleChange}
              placeholder="Your Email"
              className="bg-gray-700/50 text-gray-100 border-gray-600"
            />
          </div>
          <div>
            <Input
              type="password"
              name="password"
              value={userInfo.password}
              onChange={handleChange}
              placeholder="Password"
              className="bg-gray-700/50 text-gray-100 border-gray-600"
            />
          </div>
          <div>
            <Input
              type="password"
              name="confirmPassword"
              value={userInfo.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="bg-gray-700/50 text-gray-100 border-gray-600"
            />
          </div>
          <motion.div whileHover={{ scale: 1.05 }} className='flex justify-center'>
            <Button type="submit" className="w-auto bg-orange-500 hover:bg-orange-600">
              Sign Up
            </Button>
          </motion.div>
        </form>
        <div className="text-center mt-4 text-gray-300">
          <p>Already have an account? <a href="/login" className="text-blue-400 hover:underline">Log in</a></p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
