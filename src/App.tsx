import React, { useState, useEffect } from 'react';
import { Search, Menu, X, Github, Heart, Zap, Home, BookOpen, Info, Mail, Shield, FileText } from 'lucide-react';
import { TOOLS, CATEGORIES, Category, Tool } from './constants';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { STATIC_PAGES_CONTENT } from './content';

const StructuredData = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Allinone.tools",
    "url": "https://allinone.tools/",
    "description": "Free online utility tools for developers and designers.",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any",
    "author": {
      "@type": "Person",
      "name": "Shivam Kumar"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  );
};

// Tool Components
import CharacterCounter from './components/tools/CharacterCounter';
import PasswordGenerator from './components/tools/PasswordGenerator';
import Base64Codec from './components/tools/Base64Codec';
import JsonFormatter from './components/tools/JsonFormatter';
import QrGenerator from './components/tools/QrGenerator';
import CaseConverter from './components/tools/CaseConverter';
import HashGenerator from './components/tools/HashGenerator';
import BionicReading from './components/tools/BionicReading';
import WebcamTest from './components/tools/WebcamTest';
import ImagePlaceholder from './components/tools/ImagePlaceholder';
import ImageToBase64 from './components/tools/ImageToBase64';
import PdfMetadata from './components/tools/PdfMetadata';
import JpgToPdf from './components/tools/JpgToPdf';
import TweetGenerator from './components/tools/TweetGenerator';
import HtmlEntities from './components/tools/HtmlEntities';

const Blog = React.lazy(() => import('./components/Blog'));
const ToolLayout = React.lazy(() => import('./components/ToolLayout'));
import { Marquee } from './components/Marquee';
import { Suspense } from 'react';

type Page = 'home' | 'blog' | 'about' | 'contact' | 'privacy' | 'terms' | '404';

export default function App() {
  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCookieConsent, setShowCookieConsent] = useState(() => {
    return !localStorage.getItem('cookie-consent');
  });

  useEffect(() => {
    // Scroll to top on page change
    window.scrollTo(0, 0);
  }, [currentPage, activeTool]);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'true');
    setShowCookieConsent(false);
  };

  const filteredTools = TOOLS.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const toolsByCategory = CATEGORIES.reduce((acc, cat) => {
    const tools = filteredTools.filter(t => t.category === cat);
    if (tools.length > 0) acc[cat] = tools;
    return acc;
  }, {} as Record<Category, Tool[]>);

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    setActiveTool(null);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const renderTool = () => {
    if (!activeTool) return null;
    
    let component = null;
    switch (activeTool.id) {
      case 'character-counter': component = <CharacterCounter />; break;
      case 'password-generator': component = <PasswordGenerator />; break;
      case 'base64-codec': component = <Base64Codec />; break;
      case 'json-formatter': component = <JsonFormatter />; break;
      case 'qr-generator': component = <QrGenerator />; break;
      case 'case-converter': component = <CaseConverter />; break;
      case 'hash-generator': component = <HashGenerator />; break;
      case 'bionic-reading': component = <BionicReading />; break;
      case 'webcam-test': component = <WebcamTest />; break;
      case 'image-placeholder': component = <ImagePlaceholder />; break;
      case 'image-to-base64': component = <ImageToBase64 />; break;
      case 'pdf-metadata': component = <PdfMetadata />; break;
      case 'jpg-to-pdf': component = <JpgToPdf />; break;
      case 'tweet-generator': component = <TweetGenerator />; break;
      case 'html-entities': component = <HtmlEntities />; break;
      default:
        component = (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="p-4 bg-amber-50 text-amber-600 rounded-lg border border-amber-100 mb-4">
              This tool is currently under development.
            </div>
          </div>
        );
    }

    return (
      <ToolLayout title={activeTool.name} description={activeTool.description} toolId={activeTool.id}>
        {component}
      </ToolLayout>
    );
  };

  const renderPage = () => {
    return (
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        {renderPageContent()}
      </Suspense>
    );
  };

  const renderPageContent = () => {
    if (activeTool) return renderTool();

    switch (currentPage) {
      case 'blog': return <Blog />;
      case 'about':
        return (
          <div className="max-w-4xl mx-auto space-y-8 py-12">
            <div className="prose prose-indigo prose-lg max-w-none text-slate-600 leading-relaxed space-y-6" 
                 dangerouslySetInnerHTML={{ __html: STATIC_PAGES_CONTENT.about }} />
          </div>
        );
      case 'contact':
        return (
          <div className="max-w-3xl mx-auto space-y-12 py-12">
            <div className="space-y-4">
              <h1 className="text-4xl font-black text-[#1A1A3A]">Contact Us</h1>
              <p className="text-slate-600 leading-relaxed text-lg">
                We value your feedback and are always looking for ways to improve Allinone.tools. Whether you have a question, a suggestion for a new tool, or need to report a bug, we're here to help.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                  <Mail size={24} />
                </div>
                <h3 className="text-xl font-bold text-[#1A1A3A]">Email Support</h3>
                <p className="text-sm text-slate-500">For general inquiries and technical support, reach out to us via email.</p>
                <a href="mailto:b605649@gmail.com" className="block text-lg font-black text-indigo-600 hover:underline">b605649@gmail.com</a>
              </div>

              <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                  <Github size={24} />
                </div>
                <h3 className="text-xl font-bold text-[#1A1A3A]">Open Source</h3>
                <p className="text-sm text-slate-500">Found a bug? Open an issue on our GitHub repository to help us improve.</p>
                <button className="text-lg font-black text-emerald-600 hover:underline">View on GitHub</button>
              </div>
            </div>

            <div className="bg-indigo-50 p-8 rounded-3xl border border-indigo-100 space-y-4">
              <h3 className="text-xl font-bold text-[#1A1A3A]">Response Time</h3>
              <p className="text-slate-600 leading-relaxed">
                Our team is based in India (IST). We typically respond to all inquiries within 24-48 hours. If you're suggesting a new tool, please provide as much detail as possible about the functionality you'd like to see.
              </p>
            </div>
          </div>
        );
      case 'privacy':
        return (
          <div className="max-w-4xl mx-auto space-y-8 py-12">
            <div className="prose prose-indigo prose-lg max-w-none text-slate-600 leading-relaxed space-y-6" 
                 dangerouslySetInnerHTML={{ __html: STATIC_PAGES_CONTENT.privacy }} />
          </div>
        );
      case 'terms':
        return (
          <div className="max-w-4xl mx-auto space-y-8 py-12">
            <div className="prose prose-indigo prose-lg max-w-none text-slate-600 leading-relaxed space-y-6" 
                 dangerouslySetInnerHTML={{ __html: STATIC_PAGES_CONTENT.terms }} />
          </div>
        );
      case '404':
        return (
          <div className="min-h-[50vh] flex flex-col items-center justify-center text-center space-y-8 py-20">
            <div className="relative">
              <h1 className="text-[12rem] font-black text-slate-100 leading-none">404</h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-indigo-600 rounded-[2.5rem] rotate-12 flex items-center justify-center text-white shadow-2xl">
                  <Zap size={64} fill="currentColor" />
                </div>
              </div>
            </div>
            <div className="space-y-4 max-w-md mx-auto">
              <h2 className="text-4xl font-black text-[#1A1A3A]">Oops! Page Not Found</h2>
              <p className="text-slate-500 font-medium"> The tool or page you are looking for doesn't exist or has been moved to a new location.</p>
              <button 
                onClick={() => navigateTo('home')}
                className="mt-8 px-10 py-4 bg-indigo-600 text-white rounded-[2rem] font-black hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-100 inline-block"
              >
                Back to Home
              </button>
            </div>
          </div>
        );
      default:
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-20"
          >
            {/* Hero */}
            <div className="text-center space-y-4">
              <h1 className="text-5xl font-black text-[#1A1A3A] tracking-tight">All Tools</h1>
              <p className="text-slate-500 font-medium">Free online tools for everyone. No sign-up required.</p>
            </div>

            {/* Marquee Section */}
            <div className="space-y-8">
              <div className="text-center space-y-2">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-500">Quick Access</span>
                <h2 className="text-2xl font-black text-[#1A1A3A]">Featured Tools</h2>
              </div>
              <div className="space-y-4">
                <Marquee 
                  items={TOOLS.slice(0, Math.ceil(TOOLS.length / 2))} 
                  onItemClick={(tool) => {
                    setActiveTool(tool);
                    window.scrollTo(0, 0);
                  }} 
                  speed={30}
                />
                <Marquee 
                  items={TOOLS.slice(Math.ceil(TOOLS.length / 2))} 
                  onItemClick={(tool) => {
                    setActiveTool(tool);
                    window.scrollTo(0, 0);
                  }} 
                  direction="right"
                  speed={35}
                />
              </div>
            </div>

            {/* Categorized Grid */}
            {Object.entries(toolsByCategory).map(([category, tools]) => (
              <div key={category} className="space-y-8">
                <div className="text-center space-y-2">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-500">{category}</span>
                  <h2 className="text-3xl font-black text-[#1A1A3A]">{category} Tools</h2>
                  <p className="text-slate-400 text-sm">All the {category.toLowerCase()} tools that you need in the same website.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                  {tools.map((tool) => (
                    <motion.div
                      key={tool.id}
                      whileHover={{ y: -4 }}
                      onClick={() => setActiveTool(tool)}
                      className="group bg-white p-8 rounded-[2rem] border border-slate-50 shadow-sm hover:shadow-2xl hover:border-indigo-50 transition-all cursor-pointer flex items-start gap-6"
                    >
                      <div className="w-14 h-14 bg-[#F8F9FF] rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-inner">
                        <tool.icon size={28} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <h3 className="text-xl font-black text-[#1A1A3A] group-hover:text-indigo-600 transition-colors">{tool.name}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">{tool.description}</p>
                        <div className="pt-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 group-hover:text-indigo-300 transition-colors">
                            {tool.category}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}

            {/* High Value Publisher Content Section */}
            <div className="max-w-5xl mx-auto space-y-16 py-20 border-t border-slate-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div className="space-y-6">
                  <h2 className="text-4xl font-black text-[#1A1A3A] leading-tight">
                    Why Choose <span className="text-indigo-600">Allinone.tools</span> for Your Daily Workflow?
                  </h2>
                  <p className="text-slate-600 leading-relaxed">
                    In the modern digital landscape, developers and designers are often forced to jump between dozens of different websites to perform simple tasks. This fragmentation leads to "tab fatigue" and breaks your creative flow. Allinone.tools was built to solve this problem by providing a centralized, high-performance hub for all your essential utilities.
                  </p>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                        <Shield size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#1A1A3A]">Privacy-First Architecture</h4>
                        <p className="text-sm text-slate-500">Most of our tools process data locally in your browser. Your sensitive information never leaves your device.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                        <Zap size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#1A1A3A]">Zero Latency Performance</h4>
                        <p className="text-sm text-slate-500">By leveraging client-side processing, we eliminate server round-trips, giving you instant results every time.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl space-y-6">
                  <h3 className="text-2xl font-black text-[#1A1A3A]">Our Commitment to Quality</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    We believe that free tools shouldn't mean low quality. Every utility on our platform is meticulously crafted to be intuitive, accessible, and robust. We follow industry best practices for security and performance, ensuring that you can rely on Allinone.tools for your most critical professional tasks.
                  </p>
                  <ul className="space-y-3">
                    {['100% Free to Use', 'No Registration Required', 'Open Source Spirit', 'Regularly Updated'].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                        <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-white">
                          <Zap size={10} fill="currentColor" />
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-[#1A1A3A] rounded-[3rem] p-12 md:p-20 text-center space-y-8 text-white">
                <h2 className="text-3xl md:text-5xl font-black tracking-tight">Ready to Streamline Your Work?</h2>
                <p className="text-indigo-200 max-w-2xl mx-auto text-lg">
                  Join thousands of developers and designers who use Allinone.tools every day to build a faster, more secure internet.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="px-8 py-4 bg-white text-[#1A1A3A] rounded-2xl font-black hover:bg-indigo-50 transition-all shadow-xl">
                    Explore All Tools
                  </button>
                  <button onClick={() => navigateTo('blog')} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-500 transition-all border border-indigo-400 shadow-xl">
                    Read Our Blog
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FF] text-[#1A1A3A] font-sans selection:bg-indigo-100 selection:text-indigo-700">
      <StructuredData />
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigateTo('home')}>
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                <Zap size={28} fill="currentColor" />
              </div>
              <span className="text-2xl font-black tracking-tight text-[#1A1A3A]">Allinone.tools</span>
            </div>

            <div className="hidden md:flex items-center flex-1 max-w-md mx-12">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text"
                  placeholder="Search for a tool..."
                  className="w-full pl-11 pr-4 py-3 bg-[#F8F9FF] border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (currentPage !== 'home') navigateTo('home');
                  }}
                />
              </div>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <button onClick={() => navigateTo('home')} className={cn("text-sm font-bold transition-colors", currentPage === 'home' ? "text-indigo-600" : "text-slate-500 hover:text-indigo-600")}>Home</button>
              <button onClick={() => navigateTo('blog')} className={cn("text-sm font-bold transition-colors", currentPage === 'blog' ? "text-indigo-600" : "text-slate-500 hover:text-indigo-600")}>Blog</button>
              <button onClick={() => navigateTo('about')} className={cn("text-sm font-bold transition-colors", currentPage === 'about' ? "text-indigo-600" : "text-slate-500 hover:text-indigo-600")}>About</button>
              <button onClick={() => navigateTo('contact')} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-500 transition-all">
                Contact Us
              </button>
            </div>

            <button 
              className="md:hidden p-2 text-slate-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white border-b border-slate-200 px-4 py-6 space-y-4 shadow-xl fixed top-20 left-0 right-0 z-40"
          >
            <div className="flex flex-col gap-2">
              <button onClick={() => navigateTo('home')} className="p-4 text-left font-bold text-slate-600 hover:bg-slate-50 rounded-xl">Home</button>
              <button onClick={() => navigateTo('blog')} className="p-4 text-left font-bold text-slate-600 hover:bg-slate-50 rounded-xl">Blog</button>
              <button onClick={() => navigateTo('about')} className="p-4 text-left font-bold text-slate-600 hover:bg-slate-50 rounded-xl">About</button>
              <button onClick={() => navigateTo('contact')} className="p-4 text-left font-bold text-slate-600 hover:bg-slate-50 rounded-xl">Contact</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                  <Zap size={18} fill="currentColor" />
                </div>
                <span className="text-lg font-bold tracking-tight text-slate-900">Allinone.tools</span>
              </div>
              <p className="text-slate-500 max-w-sm">
                Allinone.tools is your one-stop shop for all utility needs. We provide free, secure, and easy-to-use tools for everyone. No registration required.
              </p>
              <p className="text-[10px] text-slate-400 leading-relaxed max-w-xs">
                Disclaimer: All tools on this site are provided "as is" without warranty of any kind. We do not store any user data processed by our local-first tools.
              </p>
              <div className="flex gap-4">
                <button className="p-2 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                  <Github size={20} />
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 mb-6">Quick Links</h4>
              <ul className="space-y-4">
                <li><button onClick={() => navigateTo('home')} className="text-slate-500 hover:text-indigo-600 transition-colors">Home</button></li>
                <li><button onClick={() => navigateTo('blog')} className="text-slate-500 hover:text-indigo-600 transition-colors">Blog</button></li>
                <li><button onClick={() => navigateTo('about')} className="text-slate-500 hover:text-indigo-600 transition-colors">About Us</button></li>
                <li><button onClick={() => navigateTo('contact')} className="text-slate-500 hover:text-indigo-600 transition-colors">Contact Us</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-6">Legal</h4>
              <ul className="space-y-4 text-slate-500">
                <li><button onClick={() => navigateTo('privacy')} className="hover:text-indigo-600 transition-colors">Privacy Policy</button></li>
                <li><button onClick={() => navigateTo('terms')} className="hover:text-indigo-600 transition-colors">Terms of Service</button></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">
              © 2026 Allinone.tools. All rights reserved.
            </p>
            <div className="flex items-center gap-1 text-slate-400 text-sm">
              Made with <Heart size={14} className="text-rose-500 fill-rose-500" /> for the community.
            </div>
          </div>
        </div>
      </footer>

      {/* Cookie Consent */}
      <AnimatePresence>
        {showCookieConsent && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-8 right-8 md:left-auto md:right-8 md:max-w-md bg-white border border-slate-100 shadow-2xl rounded-3xl p-6 z-[60] space-y-4"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                <Shield size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900">Cookie Policy</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  We use cookies to enhance your experience and serve personalized ads via Google AdSense. By using our site, you agree to our use of cookies.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={acceptCookies}
                className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-500 transition-all"
              >
                Accept All
              </button>
              <button 
                onClick={() => navigateTo('privacy')}
                className="flex-1 py-2.5 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all"
              >
                Learn More
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
