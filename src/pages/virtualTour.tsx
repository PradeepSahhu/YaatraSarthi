import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, Html } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Globe, MapPin, Video, Headphones, Expand, Share2, ArrowRight } from 'lucide-react';

const VirtualTourPage = () => {
  const locations = [
    { id: 1, name: 'Taj Mahal', coords: [27.1751, 78.0421], type: 'cultural' },
    { id: 2, name: 'Himalayas', coords: [35.3841, 82.1846], type: 'adventure' },
    { id: 3, name: 'Goa Beaches', coords: [15.2993, 74.1240], type: 'leisure' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* 3D Globe Section */}
      <div className="h-[80vh] relative">
        <Canvas camera={{ position: [0, 0, 3] }}>
          <ambientLight intensity={1.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <OrbitControls enableZoom={true} zoomSpeed={0.5} />
          
          <Sphere args={[1, 64, 64]}>
            <meshPhongMaterial
              color="#1e40af"
              emissive="#059669"
              specular="#f59e0b"
              shininess={100}
              wireframe={false}
            />
          </Sphere>

          {locations.map((location) => (
            <Html key={location.id} position={[Math.random() - 0.5, Math.random() - 0.5, 1]}>
              <motion.div 
                className="p-2 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-blue-500/30 cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                <MapPin className="h-5 w-5 text-blue-400" />
                <span className="ml-2">{location.name}</span>
              </motion.div>
            </Html>
          ))}
        </Canvas>

        <div className="absolute top-4 left-4 bg-gray-900/50 backdrop-blur-sm p-4 rounded-xl">
          <h1 className="text-3xl font-bold mb-4">Explore Destinations in 360°</h1>
          <div className="flex gap-2">
            <button >
              <Headphones className="mr-2" />
              Audio Guide
            </button>
            <button >
              <Share2 className="mr-2" />
              Share Tour
            </button>
            <button>
              <Expand className="mr-2" />
              Fullscreen
            </button>
          </div>
        </div>
      </div>

      {/* Featured Tours Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold mb-12 text-center">Featured Virtual Tours</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div 
            className="relative group rounded-2xl overflow-hidden"
            whileHover="hover"
            initial="rest"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10" />
            <img 
              src="https://images.unsplash.com/photo-1585506942812-e72b29cef752?auto=format&fit=crop&w=800&q=80" 
              className="w-full h-96 object-cover"
              alt="Taj Mahal"
            />
            <div className="absolute bottom-0 left-0 p-6 z-20">
              <h3 className="text-2xl font-bold mb-2">Taj Mahal</h3>
              <div className="flex items-center space-x-4">
                <button>
                  Start Tour <ArrowRight className="ml-2 h-4 w-4" />
                </button>
                <span className="flex items-center">
                  <Video className="h-5 w-5 mr-2 text-blue-400" />
                  360° Video
                </span>
              </div>
            </div>
          </motion.div>

          {/* Interactive Timeline */}
          <div className="md:col-span-2 bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl">
            <h3 className="text-2xl font-bold mb-6">Historical Timeline</h3>
            <div className="relative h-2 bg-gray-800 rounded-full mb-8">
              <div className="absolute left-0 w-1/3 h-full bg-blue-500 rounded-full" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {['Foundation', 'Construction', "Today"].map((era) => (
                <motion.div 
                  key={era}
                  className="p-4 bg-gray-800 rounded-lg"
                  whileHover={{ y: -5 }}
                >
                  <div className="h-24 mb-4 bg-gray-700 rounded-lg" />
                  <h4 className="font-semibold mb-2">{era}</h4>
                  <p className="text-gray-400 text-sm">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Guide Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-900/50 to-green-900/50 p-8 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Live Virtual Guide</h3>
              <p className="text-gray-400">Connect with our AI-powered travel assistant</p>
            </div>
            <button className="bg-orange-500 hover:bg-orange-600">
              Start Conversation <Headphones className="ml-2 h-4 w-4" />
            </button>
          </div>
          <div className="mt-8 grid grid-cols-4 gap-4">
            {['History', 'Architecture', 'Culture', 'Tips'].map((topic) => (
              <motion.div
                key={topic}
                className="p-4 bg-gray-800 rounded-lg text-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className="h-12 w-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-6 w-6 text-blue-400" />
                </div>
                <span className="font-medium">{topic}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tour Packages */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold mb-8">Related Tour Packages</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <motion.div 
                key={item}
                className="border border-gray-800 rounded-xl overflow-hidden"
                whileHover={{ y: -5 }}
              >
                <div className="h-48 bg-gray-800" />
                <div className="p-4">
                  <h4 className="font-semibold mb-2">Golden Triangle Tour</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-400">$1,299/person</span>
                    <button className='sm'>Book Now</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualTourPage;