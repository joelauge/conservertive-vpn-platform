'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UserIcon, 
  GlobeAltIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import ParallaxStars from '../../components/ParallaxStars';

interface ApplicationFormData {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  reason: string;
  urgency: 'low' | 'medium' | 'high';
}

const countries = [
  { code: 'CN', name: 'China' },
  { code: 'IR', name: 'Iran' },
  { code: 'RU', name: 'Russia' },
  { code: 'CU', name: 'Cuba' },
  { code: 'KP', name: 'North Korea' },
  { code: 'BY', name: 'Belarus' },
  { code: 'UZ', name: 'Uzbekistan' },
  { code: 'TM', name: 'Turkmenistan' },
  { code: 'VE', name: 'Venezuela' },
  { code: 'ET', name: 'Ethiopia' },
  { code: 'EG', name: 'Egypt' },
  { code: 'TR', name: 'Turkey' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'BD', name: 'Bangladesh' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'TH', name: 'Thailand' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'PH', name: 'Philippines' },
  { code: 'MM', name: 'Myanmar' },
  { code: 'LK', name: 'Sri Lanka' },
  { code: 'NP', name: 'Nepal' },
  { code: 'AF', name: 'Afghanistan' },
  { code: 'IQ', name: 'Iraq' },
  { code: 'SY', name: 'Syria' },
  { code: 'LB', name: 'Lebanon' },
  { code: 'JO', name: 'Jordan' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'KW', name: 'Kuwait' },
  { code: 'QA', name: 'Qatar' },
  { code: 'BH', name: 'Bahrain' },
  { code: 'OM', name: 'Oman' },
  { code: 'YE', name: 'Yemen' },
  { code: 'DZ', name: 'Algeria' },
  { code: 'MA', name: 'Morocco' },
  { code: 'TN', name: 'Tunisia' },
  { code: 'LY', name: 'Libya' },
  { code: 'SD', name: 'Sudan' },
  { code: 'SS', name: 'South Sudan' },
  { code: 'KE', name: 'Kenya' },
  { code: 'UG', name: 'Uganda' },
  { code: 'TZ', name: 'Tanzania' },
  { code: 'RW', name: 'Rwanda' },
  { code: 'BI', name: 'Burundi' },
  { code: 'CD', name: 'Democratic Republic of the Congo' },
  { code: 'CG', name: 'Republic of the Congo' },
  { code: 'CF', name: 'Central African Republic' },
  { code: 'TD', name: 'Chad' },
  { code: 'NE', name: 'Niger' },
  { code: 'ML', name: 'Mali' },
  { code: 'BF', name: 'Burkina Faso' },
  { code: 'CI', name: 'Ivory Coast' },
  { code: 'GH', name: 'Ghana' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'CM', name: 'Cameroon' },
  { code: 'GA', name: 'Gabon' },
  { code: 'GQ', name: 'Equatorial Guinea' },
  { code: 'ST', name: 'São Tomé and Príncipe' },
  { code: 'AO', name: 'Angola' },
  { code: 'ZM', name: 'Zambia' },
  { code: 'ZW', name: 'Zimbabwe' },
  { code: 'BW', name: 'Botswana' },
  { code: 'NA', name: 'Namibia' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'SZ', name: 'Eswatini' },
  { code: 'LS', name: 'Lesotho' },
  { code: 'MG', name: 'Madagascar' },
  { code: 'MU', name: 'Mauritius' },
  { code: 'SC', name: 'Seychelles' },
  { code: 'KM', name: 'Comoros' },
  { code: 'DJ', name: 'Djibouti' },
  { code: 'SO', name: 'Somalia' },
  { code: 'ER', name: 'Eritrea' }
];

export default function ApplyForAccountPage() {
  const [formData, setFormData] = useState<ApplicationFormData>({
    firstName: '',
    lastName: '',
    email: '',
    country: '',
    reason: '',
    urgency: 'medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof ApplicationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/sponsorship-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen relative">
        <ParallaxStars />
        
        <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8"
              >
                <CheckCircleIcon className="w-10 h-10 text-white" />
              </motion.div>
              
              <h1 className="text-4xl font-bold text-white mb-6">
                Application Submitted!
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Thank you for your application. We'll review your request and match you with a sponsor as soon as possible. 
                You'll receive an email notification when your application is approved.
              </p>
              
              <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-6 mb-8">
                <div className="flex items-center justify-center text-blue-400 mb-4">
                  <HeartIcon className="w-6 h-6 mr-3" />
                  <span className="text-lg font-semibold">What happens next?</span>
                </div>
                <ul className="text-gray-300 space-y-2 text-left">
                  <li className="flex items-center">
                    <ArrowRightIcon className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                    We'll review your application within 24-48 hours
                  </li>
                  <li className="flex items-center">
                    <ArrowRightIcon className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                    You'll be matched with a generous sponsor
                  </li>
                  <li className="flex items-center">
                    <ArrowRightIcon className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                    You'll receive your VPN credentials via email
                  </li>
                  <li className="flex items-center">
                    <ArrowRightIcon className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                    Start accessing the free internet immediately
                  </li>
                </ul>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.location.href = '/'}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-8 rounded-lg font-semibold transition-all transform hover:scale-105"
                >
                  Return Home
                </button>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="bg-white/10 hover:bg-white/20 text-white py-3 px-8 rounded-lg font-semibold transition-all border border-white/20"
                >
                  Submit Another Application
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <ParallaxStars />
      
      <div className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-bold text-white mb-6">
              Apply for a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Free Account</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Are you living in a country with internet censorship? Apply for a free ConSERVERtive VPN account 
              sponsored by generous users who believe in internet freedom for all.
            </p>
          </motion.div>

          {/* Application Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-semibold mb-3">
                    <UserIcon className="w-5 h-5 inline mr-2" />
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your first name"
                  />
                </div>
                
                <div>
                  <label className="block text-white font-semibold mb-3">
                    <UserIcon className="w-5 h-5 inline mr-2" />
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-3">
                  <UserIcon className="w-5 h-5 inline mr-2" />
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-3">
                  <GlobeAltIcon className="w-5 h-5 inline mr-2" />
                  Country *
                </label>
                <select
                  required
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="" className="bg-gray-800">Select your country</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.code} className="bg-gray-800">
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white font-semibold mb-3">
                  <ExclamationTriangleIcon className="w-5 h-5 inline mr-2" />
                  Reason for Request *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.reason}
                  onChange={(e) => handleInputChange('reason', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Please describe why you need access to a free VPN. What websites or services are blocked in your country? How will this help you?"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-3">
                  <ExclamationTriangleIcon className="w-5 h-5 inline mr-2" />
                  Urgency Level
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {(['low', 'medium', 'high'] as const).map((level) => (
                    <label key={level} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="urgency"
                        value={level}
                        checked={formData.urgency === level}
                        onChange={(e) => handleInputChange('urgency', e.target.value)}
                        className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 focus:ring-blue-500"
                      />
                      <span className={`text-sm font-medium capitalize ${
                        level === 'high' ? 'text-red-400' :
                        level === 'medium' ? 'text-yellow-400' :
                        'text-green-400'
                      }`}>
                        {level}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                  <p className="text-red-400">{error}</p>
                </div>
              )}

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-4 px-8 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      Submitting Application...
                    </div>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Information Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16 grid md:grid-cols-3 gap-8"
          >
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                <HeartIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Community Support</h3>
              <p className="text-gray-300">
                Your account will be sponsored by generous users who believe in internet freedom for all.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <CheckCircleIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Fast Approval</h3>
              <p className="text-gray-300">
                Applications are typically reviewed and approved within 24-48 hours.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <GlobeAltIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Global Access</h3>
              <p className="text-gray-300">
                Access servers worldwide to bypass censorship and access blocked content.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
