import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Map, MessageCircle, Calendar, Wallet, Heart, Star, Search, Plane,
  Users, Shield, Facebook, Twitter, Instagram, Mail, Phone, MapPin
} from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const features = [
  {
    icon: <Map className="h-8 w-8 text-blue-400" />,
    title: <h2> <GradientText>Smart Navigation</GradientText> </h2>,
    description: "AI-powered route optimization and real-time navigation for seamless travel experiences."
  },
  {
    icon: <MessageCircle className="h-8 w-8 text-green-400" />,
    title: <h2> <GradientText>Multilingual Support</GradientText></h2>,
    description: "Communication support in 32 different languages for global travelers."
  },
  {
    icon: <Calendar className="h-8 w-8 text-orange-400" />,
    title: <h2> <GradientText>Interactive Planner</GradientText></h2>,
    description: "Drag-and-drop itinerary creation with collaborative tools."
  },
  {
    icon: <Wallet className="h-8 w-8 text-blue-400" />,
    title: <h2><GradientText>Smart Budgeting</GradientText></h2>,
    description: "Real-time expense tracking and budget optimization for groups."
  },
  {
    icon: <Heart className="h-8 w-8 text-green-400" />,
    title: <h2><GradientText>Personalized Recommendations</GradientText></h2>,
    description: "AI-driven suggestions for activities and dining based on preferences."
  },
  {
    icon: <Star className="h-8 w-8 text-orange-400" />,
    title: <h2><GradientText>Rewards Program</GradientText></h2>,
    description: "Earn points and unlock exclusive deals with every booking."
  }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    location: "New York, USA",
    text: "YatraSaarthi made planning our family vacation so much easier! The AI recommendations were spot-on and saved us hours of research."
  },
  {
    name: "David Chen",
    location: "Singapore",
    text: "The multilingual support is fantastic! I could plan my entire Europe trip without any language barriers."
  },
  {
    name: "Emma Wilson",
    location: "London, UK",
    text: "The budget tracking feature helped our group stay on track while still enjoying amazing experiences. Highly recommended!"
  }
];

const steps = [
  {
    icon: <Search className="h-6 w-6 text-blue-400" />,
    title: <h2><GradientText>Set Your Preferences</GradientText></h2>,
    description: "Tell us about your travel style and preferences."
  },
  {
    icon: <Map className="h-6 w-6 text-green-400" />,
    title: <h2><GradientText>Get AI Recommendations</GradientText></h2>,
    description: "Receive personalized suggestions and itineraries."
  },
  {
    icon: <Calendar className="h-6 w-6 text-orange-400" />,
    title: <h2><GradientText>Plan & Book</GradientText></h2>,
    description: "Book everything in one place with real-time updates."
  },
  {
    icon: <Plane className="h-6 w-6 text-blue-400" />,
    title: <h2><GradientText>Start Your Journey</GradientText></h2>,
    description: "Enjoy your trip with 24/7 travel assistance."
  }
];

interface FeatureCardProps {
  icon: React.ReactNode;
  title: React.ReactNode;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <Card className="group hover:shadow-lg transition-all duration-300 bg-gray-800 hover:bg-gray-700 border-gray-700">
    <CardContent className="p-6">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-400 text-gray-100">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </CardContent>
  </Card>
);


const LandingPage = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  React.useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };


  // country and date

  const [destinationInfo, setDestinationInfo] = useState({
    country:"",
    startDate:""
  })


  // handleOnChange

  const handleDestinationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;


    setDestinationInfo((prev)=>({
      ...prev,
      [name]:value
    }))
    // Use name and value as needed

    console.log(destinationInfo)
};

const navigate = useNavigate();


const handleNavigation=(path:string) => {


    navigate(path,{state:destinationInfo});
  
}

const handleSubmit = async ()=>{

  try{
    const response = await fetch("http://localhost:8000/api/sightSeeing",{
      method:"POST",
      body: JSON.stringify(destinationInfo),
    
      headers: {
        'Content-Type': 'application/json',
      },
     
    });

    if(response.ok){
      
      navigate("/sightSeeing");
    }

  }catch(error){

  }
  
}

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 overflow-hidden">
      {/* Navigation */}
      
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed w-full bg-gray-900/90 backdrop-blur-sm z-50 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <motion.h1 
                whileHover={{ scale: 1.05 }}
                className="text-2xl font-bold text-blue-400"
              >
                YatraSaarthi
              </motion.h1>
              <div className="hidden md:flex space-x-6">
                {['Destinations', 'Features', 'Packages', 'About'].map((item, index) => (
                  <motion.a
                    key={item}
                    href="#"
                    whileHover={{ scale: 1.1, color: '#60A5FA' }}
                    className="text-gray-300 hover:text-blue-400 transition-colors"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {item}
                  </motion.a>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
              >
                <Button variant="outline" className="hidden md:inline-flex text-gray-100 border-gray-400 hover:bg-gray-800" name="login"  onClick={()=>handleNavigation('/login')}>
                  Login
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
              >
                <Button className="bg-orange-500 hover:bg-orange-600" onClick={()=>handleNavigation('/SignUp')}>Sign Up</Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-24 lg:pt-32 pb-16 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h1
                variants={itemVariants}
                className="text-5xl lg:text-6xl font-bold text-blue-400 mb-6"
              >
                <GradientText>Your Virtual</GradientText> 
                <br />
                <span className='text-white'>Travel Assistant</span>
             
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="text-xl text-gray-300 mb-8"
              >
                Simplifying group tours and travel planning with AI-powered innovation.
              </motion.p>
              <motion.div
                variants={itemVariants}
                className="p-4 bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg mb-8 border border-gray-700"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  <Input placeholder="Where do you want to go?" className="flex-grow bg-gray-700/50 text-gray-100 border-gray-600" name="country" onChange={(e)=>handleDestinationChange(e)}/>
                  <Input type="date" className="md:w-40 bg-gray-700/50 text-gray-100 border-gray-600" name="startDate"  onChange={(e)=>handleDestinationChange(e)} />
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Button className="bg-orange-500 hover:bg-orange-600 w-full" onClick={()=>handleNavigation('/SightSeeing')}>
                      <Search className="mr-2 h-4 w-4"  onClick={handleSubmit}/> Search
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="flex items-center space-x-8"
              >
                <motion.div 
                  className="flex items-center"
                  whileHover={{ scale: 1.1 }}
                >
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span className="ml-2 text-gray-300">4.9/5 Rating</span>
                </motion.div>
                <motion.div 
                  className="flex items-center"
                  whileHover={{ scale: 1.1 }}
                >
                  <Users className="h-5 w-5 text-blue-400" />
                  <span className="ml-2 text-gray-300">50K+ Users</span>
                </motion.div>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80"
                alt="Travel Experience"
                className="rounded-2xl shadow-2xl"
              />
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-6 -left-6 bg-gray-800/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-700"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-green-900/50 p-2 rounded-lg">
                    <Shield className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-100">Trusted Platform</p>
                    <p className="text-sm text-gray-400">100% Secure Booking</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <motion.section
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className="py-20 bg-gray-900"
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            variants={itemVariants}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-blue-400 mb-4">
              Everything You Need in One Place
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Plan your perfect trip with our comprehensive suite of travel tools and features.
            </p>
          </motion.div>
          <motion.div
            variants={containerVariants}
            className="grid md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-blue-400 mb-16">
            How YatraSaarthi Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={controls}
                variants={{
                  visible: { opacity: 1, y: 0 },
                  hidden: { opacity: 0, y: 20 }
                }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                >
                  {step.icon}
                </motion.div>
                <h3 className="font-semibold mb-2 text-gray-100">{step.title}</h3>
                <p className="text-gray-300 text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-blue-400 mb-16">
            What Our Travelers Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={controls}
                variants={{
                  visible: { opacity: 1, y: 0 },
                  hidden: { opacity: 0, y: 20 }
                }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <Card className="p-6 bg-gray-700 hover:shadow-lg transition-all duration-300 border-gray-600">
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-4">
                      <img
                        src={`https://i.pravatar.cc/40?img=${index + 1}`}
                        alt={testimonial.name}
                        className="rounded-full"
                      />
                      <div className="ml-4">
                        <p className="font-semibold text-gray-100">{testimonial.name}</p>
                        <p className="text-sm text-gray-400">{testimonial.location}</p>
                      </div>
                    </div>
                    <p className="text-gray-300">{testimonial.text}</p>
                    <div className="flex mt-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">YatraSaarthi</h3>
              <p className="mb-4">Your AI-powered travel companion for seamless journey planning.</p>
              <div className="flex space-x-4">
                <motion.div whileHover={{ scale: 1.1 }}>
                  <Facebook className="h-5 w-5 cursor-pointer hover:text-blue-400" />
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }}>
                  <Twitter className="h-5 w-5 cursor-pointer hover:text-blue-400" />
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }}>
                  <Instagram className="h-5 w-5 cursor-pointer hover:text-blue-400" />
                </motion.div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Destinations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tour Packages</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <div className="space-y-4">
                <motion.div 
                  className="flex items-center"
                  whileHover={{ scale: 1.05, x: 10 }}
                >
                  <Mail className="h-5 w-5 mr-2" />
                  <span>support@yatrasaarthi.com</span>
                </motion.div>
                <motion.div 
                  className="flex items-center"
                  whileHover={{ scale: 1.05, x: 10 }}
                >
                  <Phone className="h-5 w-5 mr-2" />
                  <span>+1 (555) 123-4567</span>
                </motion.div>
                <motion.div 
                  className="flex items-center"
                  whileHover={{ scale: 1.05, x: 10 }}
                >
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>123 Travel Street, Journey City</span>
                </motion.div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p>&copy; 2025 YatraSaarthi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

function GradientText({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-gradient-to-r from-blue-400 to-green-400 text-transparent bg-clip-text inline-block">
      {children}
    </span>
  );
}

export default LandingPage;
