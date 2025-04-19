import { motion } from 'framer-motion';
import { Star, MessageCircle, ThumbsUp, User, Hash, Smile, Frown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const FeedbackPage = () => {
  const reviews = [
    { id: 1, user: 'Anika Patel', rating: 5, comment: 'Best travel experience ever! The AI recommendations were spot on.', date: '2 days ago' },
    { id: 2, user: 'Rohan Singh', rating: 4, comment: 'Great platform, but could improve cancellation policies.', date: '1 week ago' },
    { id: 3, user: 'Priya Sharma', rating: 5, comment: 'Loved the personalized itinerary suggestions!', date: '3 days ago' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold mb-4">Share Your Experience</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Help us improve and guide fellow travelers by sharing your journey details
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Feedback Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <Card className="border-gray-800 bg-gray-900">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="h-6 w-6 text-blue-400" />
                  <span>Submit Feedback</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Overall Experience</h3>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        whileHover={{ scale: 1.1 }}
                        className="p-2 rounded-full bg-gray-800 hover:bg-blue-500/20"
                      >
                        <Star className="h-8 w-8 text-yellow-400 fill-current" />
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Category Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Tour Experience', 'Accommodation', 'Transport', 'Food', 'Guides'].map((tag) => (
                      <motion.button
                        key={tag}
                        whileHover={{ scale: 1.05 }}
                        className="px-4 py-2 rounded-full bg-gray-800 hover:bg-blue-500/20 text-sm"
                      >
                        #{tag}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Detailed Feedback</h3>
                  <div className="relative">
                    <textarea
                      placeholder="Tell us about your experience..."
                      className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg p-4 placeholder-gray-500"
                    />
                    <span className="absolute bottom-4 right-4 text-gray-500 text-sm">0/500</span>
                  </div>
                </div>

                <Button className="w-full bg-blue-500 hover:bg-blue-600">
                  Submit Feedback <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Ratings Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <Card className="border-gray-800 bg-gray-900">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-6 w-6 text-yellow-400" />
                  <span>Community Ratings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-center space-x-4">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-yellow-400">4.8</div>
                    <div className="text-gray-400">out of 5 stars</div>
                  </div>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-6 w-6 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <span className="w-8">{rating}</span>
                        <Star className="h-4 w-4 text-yellow-400" />
                      </div>
                      <Progress value={(rating/5)*100} className="h-2 bg-gray-800" />
                      <span className="text-gray-400">78%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Reviews */}
            <Card className="border-gray-800 bg-gray-900">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-6 w-6 text-green-400" />
                  <span>Recent Reviews</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {reviews.map((review) => (
                  <motion.div
                    key={review.id}
                    whileHover={{ y: -5 }}
                    className="p-4 bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="h-10 w-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <div className="font-medium">{review.user}</div>
                          <div className="text-sm text-gray-400">{review.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <span>{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-300">{review.comment}</p>
                    <div className="flex items-center space-x-4 mt-4">
                      <Button variant="ghost" size="sm" className="text-gray-400">
                        <ThumbsUp className="h-4 w-4 mr-2" /> 24
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-400">
                        Reply
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-3 gap-6"
        >
          <Card className="border-gray-800 bg-gray-900">
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="p-3 bg-green-500/20 rounded-full">
                <Smile className="h-8 w-8 text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">92%</div>
                <div className="text-gray-400">Positive Reviews</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-gray-800 bg-gray-900">
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="p-3 bg-blue-500/20 rounded-full">
                <Hash className="h-8 w-8 text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">1.2K</div>
                <div className="text-gray-400">Total Reviews</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-gray-900">
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="p-3 bg-red-500/20 rounded-full">
                <Frown className="h-8 w-8 text-red-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">8%</div>
                <div className="text-gray-400">Critical Feedback</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default FeedbackPage;