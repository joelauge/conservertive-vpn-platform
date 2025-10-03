'use client';

import { motion } from 'framer-motion';
import { 
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  HeartIcon,
  LightBulbIcon,
  ScaleIcon,
  AcademicCapIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import ParallaxStars from '../../components/ParallaxStars';
import { useUser, SignInButton, SignUpButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function OurWhyPage() {
  const { user, isLoaded } = useUser();

  // Check if Clerk is properly configured
  const isClerkConfigured = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('YOUR_CLERK_PUBLISHABLE_KEY_HERE');

  const principles = [
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'The Foundation of Democracy',
      description: 'Without the ability to speak freely, criticize government, and share ideas, democracy becomes meaningless. Freedom of speech is the bedrock upon which all democratic institutions rest.',
    },
    {
      icon: LightBulbIcon,
      title: 'The Engine of Innovation',
      description: 'Every breakthrough in science, technology, and human understanding begins with the free exchange of ideas. Censorship stifles the very creativity that drives human progress.',
    },
    {
      icon: ScaleIcon,
      title: 'The Guardian of Justice',
      description: 'When people cannot speak out against injustice, corruption flourishes unchecked. Freedom of speech is essential for holding power accountable and ensuring equal rights for all.',
    },
    {
      icon: AcademicCapIcon,
      title: 'The Path to Truth',
      description: 'Truth emerges not from silencing dissent, but from allowing all voices to be heard. The marketplace of ideas is where falsehoods are exposed and wisdom prevails.',
    },
  ];

  const historicalMoments = [
    {
      title: 'The Printing Press Revolution',
      description: 'When Gutenberg\'s printing press made knowledge accessible to the masses, it sparked the Renaissance, Reformation, and Enlightenment. The free flow of information changed the world forever.',
      impact: 'Led to the Reformation, Scientific Revolution, and modern democracy'
    },
    {
      title: 'The Underground Railroad',
      description: 'Secret networks of communication and information sharing enabled enslaved people to escape to freedom. Information became liberation.',
      impact: 'Helped thousands escape slavery and fueled abolitionist movements'
    },
    {
      title: 'The Fall of the Berlin Wall',
      description: 'When East Germans finally gained access to uncensored information from the West, the truth about their government\'s failures became undeniable.',
      impact: 'Led to the collapse of communist regimes across Eastern Europe'
    },
    {
      title: 'The Arab Spring',
      description: 'Social media and uncensored communication enabled citizens to organize, share their stories, and demand change from authoritarian regimes.',
      impact: 'Inspired democratic movements across the Middle East and North Africa'
    }
  ];

  return (
    <div className="min-h-screen relative">
      <ParallaxStars />
      
      {/* Navigation */}
      <nav className="relative px-6 py-4 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <img 
                src="/conservertive_logo_light_500px.png" 
                alt="ConSERVERtive VPN" 
                className="h-10 w-auto cursor-pointer"
              />
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/#features" className="text-gray-300 hover:text-white transition-colors text-base font-medium">Features</Link>
            <Link href="/#pricing" className="text-gray-300 hover:text-white transition-colors text-base font-medium">Pricing</Link>
            <Link href="/#impact" className="text-gray-300 hover:text-white transition-colors text-base font-medium">Impact</Link>
            <Link href="/our-why" className="text-blue-400 hover:text-blue-300 transition-colors text-base font-medium">Our Why</Link>
            {!isClerkConfigured ? (
              <button 
                className="btn-primary"
                onClick={() => alert('Please configure Clerk authentication keys in .env.local')}
              >
                Get Started
              </button>
            ) : isLoaded && user ? (
              <Link href="/dashboard" className="btn-primary">
                Dashboard
              </Link>
            ) : (
              <SignUpButton mode="modal">
                <button className="btn-primary">
                  Get Started
                </button>
              </SignUpButton>
            )}
          </div>
        </div>
      </nav>

      {/* Back Button */}
      <div className="relative px-6 py-4 z-10">
        <div className="max-w-7xl mx-auto">
          <Link 
            href="/"
            className="inline-flex items-center text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative px-6 py-20 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-semibold text-white mb-6 leading-tight">
              Our Why:
              <span className="text-gradient font-light block mt-2">
                Freedom of Speech
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto font-light leading-relaxed">
              The cornerstone upon which all other freedoms are built. When speech is silenced, 
              democracy dies, innovation stagnates, and truth becomes the first casualty.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Core Philosophy Section */}
      <section className="px-6 py-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6 leading-tight">
              The Foundation of All Freedoms
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
              Freedom of speech is not just one right among many—it is the essential precondition 
              for every other freedom we hold dear.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {principles.map((principle, index) => (
              <motion.div
                key={principle.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="card bg-white/10 backdrop-blur-sm border-white/20"
              >
                <principle.icon className="h-12 w-12 text-blue-400 mb-4" />
                <h3 className="text-2xl font-semibold text-white mb-4 leading-tight">{principle.title}</h3>
                <p className="text-gray-300 font-light leading-relaxed">{principle.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Treatise Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-gray-800/30 to-gray-900/30 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6 leading-tight">
              A Treatise on Freedom of Speech
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
              Why the free exchange of ideas is humanity's greatest achievement and most vulnerable treasure.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="prose prose-lg prose-invert max-w-none"
          >
            <div className="card bg-white/10 backdrop-blur-sm border-white/20 p-8 md:p-12">
              <div className="space-y-8 text-gray-300 leading-relaxed">
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-4">The Primacy of Speech</h3>
                  <p className="text-lg">
                    Freedom of speech is not merely a right—it is the fundamental mechanism by which 
                    human civilization advances. Every other freedom depends upon it. Without the ability 
                    to speak freely, to criticize, to question, and to propose alternatives, all other 
                    rights become meaningless platitudes.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-white mb-4">The Marketplace of Ideas</h3>
                  <p className="text-lg">
                    In the marketplace of ideas, truth emerges victorious not through force or decree, 
                    but through the rigorous testing of competing viewpoints. When ideas are allowed to 
                    clash freely, falsehoods are exposed, weak arguments crumble, and genuine wisdom 
                    rises to the surface. This process is messy, uncomfortable, and sometimes offensive—but 
                    it is also the only reliable path to truth.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-white mb-4">The Engine of Progress</h3>
                  <p className="text-lg">
                    Every scientific breakthrough, every technological advancement, every social reform 
                    began with someone daring to speak an unpopular truth. Galileo challenged the 
                    geocentric model. Darwin questioned creationist dogma. Martin Luther King Jr. 
                    demanded racial equality. Each of these voices was initially met with resistance, 
                    ridicule, or outright persecution—yet their ideas ultimately transformed the world.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-white mb-4">The Guardian Against Tyranny</h3>
                  <p className="text-lg">
                    History teaches us that the first target of any would-be tyrant is always freedom 
                    of speech. Why? Because tyrants understand that ideas are more powerful than armies. 
                    A single voice speaking truth to power can inspire millions. A single idea can 
                    topple empires. This is why authoritarian regimes invest so heavily in censorship—they 
                    know that free speech is their greatest enemy.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-white mb-4">The Digital Age Challenge</h3>
                  <p className="text-lg">
                    Today, we face unprecedented challenges to free speech. Governments around the world 
                    are building digital walls, censoring the internet, and monitoring every word we 
                    type. Corporations control the platforms where ideas are shared, creating new forms 
                    of censorship that are often more insidious than government control. The internet, 
                    once hailed as the great democratizer, is being weaponized against the very freedoms 
                    it was meant to protect.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-white mb-4">Our Mission</h3>
                  <p className="text-lg">
                    This is why ConSERVERtive VPN exists. We believe that access to uncensored 
                    information is not a luxury—it is a fundamental human right. Every person deserves 
                    the right to seek truth, share ideas, and connect with others without fear of 
                    surveillance or censorship. When we protect internet freedom, we protect the 
                    foundation upon which all other freedoms rest.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Historical Moments Section */}
      <section className="px-6 py-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6 leading-tight">
              Moments When Speech Changed History
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
              Throughout history, the free exchange of ideas has been the catalyst for humanity's greatest achievements.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {historicalMoments.map((moment, index) => (
              <motion.div
                key={moment.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="card bg-white/10 backdrop-blur-sm border-white/20"
              >
                <h3 className="text-2xl font-semibold text-white mb-4 leading-tight">{moment.title}</h3>
                <p className="text-gray-300 font-light leading-relaxed mb-4">{moment.description}</p>
                <div className="text-blue-400 font-semibold text-sm">
                  Impact: {moment.impact}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="px-6 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-gray-700/20 to-gray-800/20 backdrop-blur-sm rounded-2xl p-12 border border-white/20"
          >
            <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6 leading-tight">
              Join the Fight for Internet Freedom
            </h2>
            <p className="text-xl text-gray-300 mb-8 font-light leading-relaxed">
              Every subscription helps someone in a censored country access the free internet. 
              Your payment becomes their voice. Your support becomes their freedom.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isClerkConfigured ? (
                <button 
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105"
                  onClick={() => alert('Please configure Clerk authentication keys in .env.local')}
                >
                  <HeartIcon className="inline-block mr-2 h-5 w-5" />
                  Start Sponsoring Today
                </button>
              ) : (
                <SignUpButton mode="modal">
                  <button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105">
                    <HeartIcon className="inline-block mr-2 h-5 w-5" />
                    Start Sponsoring Today
                  </button>
                </SignUpButton>
              )}
              <Link 
                href="/#impact"
                className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all"
              >
                View Our Impact
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-white/20 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img 
                  src="/conservertive_logo_light_500px.png" 
                  alt="ConSERVERtive VPN" 
                  className="h-8 w-auto"
                />
              </div>
              <p className="text-gray-400">
                Fighting for internet freedom worldwide.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Download</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Status</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/our-why" className="hover:text-white transition-colors">Our Why</Link></li>
                <li><Link href="/#impact" className="hover:text-white transition-colors">Impact</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 ConSERVERtive VPN. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
