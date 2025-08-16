'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category?: string;
  isActive: boolean;
  order: number;
}

const FAQSection = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const response = await fetch('/api/faq?isActive=true&limit=5&sort=order');
      const data = await response.json();
      if (data.success && data.data) {
        setFaqs(data.data);
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFAQ = (faqId: string) => {
    setOpenFAQ(openFAQ === faqId ? null : faqId);
  };

  // Don't show the section if no FAQs
  if (!loading && faqs.length === 0) {
    return null;
  }

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="flex justify-center mb-8">
              <div className="h-10 bg-gray-200 rounded-full w-24"></div>
            </div>
            <div className="flex items-center justify-center mb-8">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded max-w-2xl mx-auto mb-16"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-5">
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* View More Button at top */}
        <div className="flex justify-center mb-8">
          <a
            href="/faq"
            className="inline-flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full text-sm transition-all duration-200 transform hover:scale-105"
          >
            View More
          </a>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center justify-center mb-8 text-sm">
          <span className="text-gray-500">•</span>
          <span className="ml-2 text-gray-600">FAQ</span>
        </div>

        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            "Frequently Asked Questions –<br />
            Everything You Need to Know"
          </h2>
        </div>

        {/* FAQ Accordion */}
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={faq._id}
              className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.01 }}
            >
              <motion.button
                onClick={() => toggleFAQ(faq._id)}
                className="w-full px-5 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                whileHover={{ backgroundColor: "rgba(249, 250, 251, 1)" }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ 
                      rotate: openFAQ === faq._id ? 45 : 0,
                      scale: openFAQ === faq._id ? 1.1 : 1
                    }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  >
                    <svg
                      className="w-5 h-5 text-blue-500 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
                      />
                    </svg>
                  </motion.div>
                  <h3 className="text-base font-medium text-gray-900">
                    {faq.question}
                  </h3>
                </div>
                <motion.div
                  animate={{ 
                    rotate: openFAQ === faq._id ? 180 : 0,
                    scale: openFAQ === faq._id ? 1.1 : 1
                  }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <svg
                    className="w-5 h-5 text-gray-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
              </motion.button>
              

              <AnimatePresence initial={false}>
                {openFAQ === faq._id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ 
                      height: "auto", 
                      opacity: 1,
                      transition: {
                        height: { duration: 0.3, ease: "easeInOut" },
                        opacity: { duration: 0.2, delay: 0.1 }
                      }
                    }}
                    exit={{ 
                      height: 0, 
                      opacity: 0,
                      transition: {
                        height: { duration: 0.3, ease: "easeInOut" },
                        opacity: { duration: 0.1 }
                      }
                    }}
                    className="overflow-hidden"
                  >
                    <motion.div 
                      className="px-5 pb-4"
                      initial={{ y: -10 }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.2, delay: 0.1 }}
                    >
                      <div className="pl-8 border-l-2 border-blue-200 ml-2">
                        <motion.p 
                          className="text-sm text-gray-600 leading-relaxed pl-4 whitespace-pre-line"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                        >
                          {faq.answer}
                        </motion.p>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;