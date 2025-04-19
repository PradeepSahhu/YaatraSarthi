import  { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Send, Mic, Image, Paperclip, 
  Bot, User, Calendar, MapPin, 
  Hotel, Plane, X, 
  Maximize2, Minimize2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Environment variable for API key
// In a real implementation, this would be handled securely through environment variables
// You'll need to replace GEMINI_API_KEY with your actual API key in your environment
// const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "YOUR_GEMINI_API_KEY";
// const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

const TravelAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hello! I'm your YatraSaarthi AI travel assistant. How can I help you plan your perfect trip today?",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  const GEMINI_API_KEY = "AIzaSyAWTyhOcsDAbDbc2OgdSFz3rFtf3qYP4CE"; 
  const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";


  const suggestions = [
    { icon: Plane, text: "Find flights to Bali" },
    { icon: Hotel, text: "Best hotels in Paris" },
    { icon: Calendar, text: "Weekend getaway ideas" },
    { icon: MapPin, text: "Offbeat destinations in India" }
  ];

  // Function to call Gemini API
  const getGeminiResponse = async (userMessage: string) => {
    try {
      const payload = {
        contents: [
          {
            parts: [
              {
                text: `You are YatraSaarthi, a helpful AI travel assistant. Respond to the following message from a user seeking travel advice: "${userMessage}". Keep your response friendly, concise, and related to travel assistance. Do not use asterisks, underscores, or other markdown formatting in your response. Previous conversation context: ${
                  messages.map(msg => `${msg.type === 'user' ? 'User' : 'YatraSaarthi'}: ${msg.content}`).join(' | ')
                }`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        }
      };
  
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
  
      const data = await response.json();
      
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        // Clean the response to remove any special characters or markdown formatting
        let cleanedResponse = data.candidates[0].content.parts[0].text;
        
        // Remove markdown formatting characters
        cleanedResponse = cleanedResponse.replace(/\*/g, ''); // Remove asterisks
        cleanedResponse = cleanedResponse.replace(/\_/g, ''); // Remove underscores
        cleanedResponse = cleanedResponse.replace(/\#/g, ''); // Remove hashtags
        cleanedResponse = cleanedResponse.replace(/\`/g, ''); // Remove backticks
        cleanedResponse = cleanedResponse.replace(/\~/g, ''); // Remove tildes
        
        return cleanedResponse;
      } else {
        console.error("Unexpected API response:", data);
        return "I apologize, but I'm having trouble connecting to my travel database right now. Could you please try again?";
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      return "Sorry, I'm experiencing some technical difficulties. Please try again in a moment.";
    }
  };
  const handleSend = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Get response from Gemini
      const geminiResponse = await getGeminiResponse(inputValue);
      
      // Add bot response
      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: geminiResponse,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error("Error in handleSend:", error);
      // Add error message if API fails
      const errorResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: "I apologize, but I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const MessageBubble = ({ message }: { message: any }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`flex items-start max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          message.type === 'user' ? 'bg-blue-500 ml-2' : 'bg-gray-700 mr-2'
        }`}>
          {message.type === 'user' ? 
            <User className="h-5 w-5 text-white" /> : 
            <Bot className="h-5 w-5 text-white" />
          }
        </div>
        <div className={`flex flex-col ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
          <div className={`rounded-lg p-3 ${
            message.type === 'user' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-700 text-gray-100'
          }`}>
            <p>{message.content}</p>
          </div>
          <span className="text-xs text-gray-400 mt-1">{message.timestamp}</span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={false}
      animate={isExpanded ? {
        width: '100%',
        height: '100%',
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 50
      } : {
        width: '380px',
        height: '600px',
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 50
      }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full h-full bg-gray-800 border-gray-700 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gray-900 p-4 flex items-center justify-between border-b border-gray-700">
          <div className="flex items-center">
            <div className="bg-blue-500 p-2 rounded-lg mr-3">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-100">YatraSaarthi</h3>
              <p className="text-xs text-gray-400">AI Travel Assistant</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-gray-100"
            >
              {isExpanded ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-gray-400 hover:text-gray-100"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900">
          {/* Quick Suggestions */}
          <div className="flex flex-wrap gap-2 mb-4">
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="flex-shrink-0"
              >
                <Button 
                  variant="outline" 
                  className="bg-gray-700 border-gray-600 text-gray-100 hover:bg-gray-600"
                  onClick={() => setInputValue(suggestion.text)}
                >
                  <suggestion.icon className="h-4 w-4 mr-2" />
                  {suggestion.text}
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Messages */}
          {messages.map(message => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="flex items-center space-x-2"
              >
                <div className="bg-gray-700 rounded-full p-2">
                  <Bot className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-700 bg-gray-800">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="icon"
                className="text-gray-400 hover:text-gray-100"
              >
                <Paperclip className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-gray-400 hover:text-gray-100"
              >
                <Image className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-gray-400 hover:text-gray-100"
              >
                <Mic className="h-5 w-5" />
              </Button>
            </div>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me about travel plans..."
              className="flex-1 bg-gray-700 border-gray-600 text-gray-100"
            />
            <Button 
              onClick={handleSend}
              disabled={isTyping || !inputValue.trim()}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default TravelAssistant;