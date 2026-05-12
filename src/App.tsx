import React, { useState, useEffect } from 'react';
import { Search, Menu, X, Github, Heart, Zap, Home, BookOpen, Info, Mail, Shield, FileText, ArrowRight, Facebook, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';
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

// Tool Components (Lazy Loaded)
const CharacterCounter = React.lazy(() => import('./components/tools/CharacterCounter'));
const PasswordGenerator = React.lazy(() => import('./components/tools/PasswordGenerator'));
const Base64Codec = React.lazy(() => import('./components/tools/Base64Codec'));
const JsonFormatter = React.lazy(() => import('./components/tools/JsonFormatter'));
const QrGenerator = React.lazy(() => import('./components/tools/QrGenerator'));
const CaseConverter = React.lazy(() => import('./components/tools/CaseConverter'));
const HashGenerator = React.lazy(() => import('./components/tools/HashGenerator'));
const BionicReading = React.lazy(() => import('./components/tools/BionicReading'));
const WebcamTest = React.lazy(() => import('./components/tools/WebcamTest'));
const ImagePlaceholder = React.lazy(() => import('./components/tools/ImagePlaceholder'));
const ImageToBase64 = React.lazy(() => import('./components/tools/ImageToBase64'));
const PdfMetadata = React.lazy(() => import('./components/tools/PdfMetadata'));
const JpgToPdf = React.lazy(() => import('./components/tools/JpgToPdf'));
const PdfToolsOverview = React.lazy(() => import('./components/tools/PdfToolsOverview'));
const SimplePdfTool = React.lazy(() => import('./components/tools/SimplePdfTool'));
const TweetGenerator = React.lazy(() => import('./components/tools/TweetGenerator'));
const HtmlEntities = React.lazy(() => import('./components/tools/HtmlEntities'));

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
      case 'pdf-to-word':
      case 'pdf-to-excel':
      case 'pdf-to-ppt':
      case 'pdf-to-jpg':
      case 'pdf-to-text':
      case 'word-to-pdf':
      case 'excel-to-pdf':
      case 'ppt-to-pdf':
      case 'edit-pdf':
      case 'merge-pdf':
      case 'split-pdf':
      case 'compress-pdf':
      case 'rotate-pdf':
      case 'unlock-pdf':
      case 'protect-pdf':
      case 'watermark-pdf':
        component = <SimplePdfTool toolId={activeTool.id} />;
        break;
      case 'tweet-generator': component = <TweetGenerator />; break;
      case 'html-entities': component = <HtmlEntities />; break;
      default:
        navigateTo('404');
        return null;
    }

    return (
      <ToolLayout 
        title={activeTool.name} 
        description={activeTool.description} 
        toolId={activeTool.id}
        onToolNavigate={(tool) => setActiveTool(tool)}
      >
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
          <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-12 py-20 px-4">
            <div className="relative">
              <h1 className="text-[10rem] md:text-[15rem] font-black text-slate-50 leading-none select-none">404</h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 12 }}
                  className="w-24 h-24 md:w-40 md:h-40 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl"
                >
                  <Zap size={64} fill="currentColor" />
                </motion.div>
              </div>
            </div>
            <div className="space-y-6 max-w-2xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-black text-[#1A1A3A] tracking-tight">Lost in the Digital Void?</h2>
              <p className="text-slate-500 font-medium text-lg leading-relaxed">
                The page you're looking for has vanished into thin air. Don't worry, we've got plenty of other tools to help you get back on track.
              </p>
              
              <div className="pt-8">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Popular Destination</h3>
                <div className="flex flex-wrap justify-center gap-4">
                  {TOOLS.slice(0, 4).map(tool => (
                    <button 
                      key={tool.id}
                      onClick={() => setActiveTool(tool)}
                      className="px-6 py-3 bg-white border border-slate-100 rounded-2xl font-bold text-slate-600 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm"
                    >
                      {tool.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => navigateTo('home')}
                  className="px-10 py-4 bg-[#1A1A3A] text-white rounded-[2rem] font-black hover:bg-[#2A2A5A] transition-all shadow-xl inline-block"
                >
                  Return to Dashboard
                </button>
                <button 
                  onClick={() => navigateTo('blog')}
                  className="px-10 py-4 bg-white border-2 border-slate-100 text-[#1A1A3A] rounded-[2rem] font-black hover:bg-slate-50 transition-all inline-block"
                >
                  Read Recent Blogs
                </button>
              </div>
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
            {/* Hero Section with H1 */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-6xl font-black text-[#1A1A3A] tracking-tighter leading-tight max-w-4xl mx-auto">
                Free Online Utility Tools for Developers & Designers
              </h1>
              <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto px-4">
                Boost your productivity with our suite of 100% free online utility tools. From text conversion to image generation, everything is secure and local-first.
              </p>
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
              <div key={category} className="space-y-12">
                <div className="text-center space-y-3">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-500">{category}</span>
                  <h2 className="text-3xl font-black text-[#1A1A3A]">
                    {category === 'Image' && 'High-Quality Image & Design Utilities'}
                    {category === 'PDF' && 'Advanced PDF Management & Conversion'}
                    {category === 'Social Media' && 'Social Media Content Generators'}
                    {category === 'Text & Lists' && 'Professional Text Tools & Converters'}
                    {category === 'Encryption' && 'Secure Encryption & Hashing Utilities'}
                    {category === 'Web' && 'Web Developer & Coding Utilities'}
                    {category === 'Others' && 'General Utility Tools'}
                  </h2>
                </div>

                {category === 'PDF' && searchQuery === '' ? (
                  <div className="max-w-6xl mx-auto px-4">
                    <PdfToolsOverview onToolSelect={(tool) => setActiveTool(tool)} />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {tools.map((tool) => (
                      <motion.div
                        key={tool.id}
                        whileHover={{ y: -8 }}
                        onClick={() => setActiveTool(tool)}
                        className="group bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm hover:shadow-2xl hover:border-indigo-100 transition-all duration-500 cursor-pointer flex items-start gap-8"
                      >
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
                          <tool.icon size={30} />
                        </div>
                        <div className="flex-1 space-y-2">
                          <h3 className="text-2xl font-black text-[#1A1A3A] group-hover:text-indigo-600 transition-colors tracking-tight">{tool.name}</h3>
                          <p className="text-slate-500 font-medium leading-relaxed">{tool.description}</p>
                          <div className="pt-4 flex items-center text-xs font-black text-indigo-600 uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-all">
                             Try {tool.name} <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Breadcrumb Schema for SEO */}
            <script type="application/ld+json">
              {JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [{
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://allinone.tools/"
                }, {
                  "@type": "ListItem",
                  "position": 2,
                  "name": activeTool ? activeTool.name : "Utilities",
                  "item": activeTool ? `https://allinone.tools/?tool=${activeTool.id}` : "https://allinone.tools/"
                }]
              })}
            </script>

            {/* Featured Articles Mini-Section */}
            <div className="max-w-6xl mx-auto py-20 border-t border-slate-100">
               <div className="text-center space-y-4 mb-12">
                  <h2 className="text-4xl font-black text-[#1A1A3A] tracking-tight">Latest from our SEO Blog</h2>
                  <p className="text-slate-500 max-w-2xl mx-auto">Stay ahead with digital marketing trends, developer tips, and utility guides.</p>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { title: 'The Ultimate Guide to Core Web Vitals', desc: 'Learn how to optimize your website for Googles vital speed metrics.', date: 'May 2026' },
                    { title: 'Why Privacy-First Tools are the Future', desc: 'Discover why local processing is becoming the standard for professional utilities.', date: 'April 2026' },
                    { title: 'Mastering PDF Management Online', desc: 'Tips and tricks for editing PDF metadata safely without tracking.', date: 'March 2026' }
                  ].map((article, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-50 hover:border-indigo-100 transition-all cursor-pointer group shadow-sm hover:shadow-xl">
                      <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">{article.date}</span>
                      <h3 className="text-xl font-bold text-[#1A1A3A] mt-2 mb-3 group-hover:text-indigo-600 transition-colors">{article.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed mb-6">{article.desc}</p>
                      <button onClick={() => navigateTo('blog')} className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center">
                        Read Story <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  ))}
               </div>
            </div>

            {/* High Value Publisher Content Section */}
            <div className="max-w-5xl mx-auto space-y-24 py-20 border-t border-slate-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div className="space-y-6 text-left">
                  <h2 className="text-4xl font-black text-[#1A1A3A] leading-tight">
                    Why Choose <span className="text-indigo-600">Allinone.tools</span> for Your Daily Workflow?
                  </h2>
                  <p className="text-slate-600 leading-relaxed text-lg">
                    In the modern digital landscape, developers and designers are often forced to jump between dozens of different websites to perform simple tasks. This fragmentation leads to "tab fatigue" and breaks your creative flow. Allinone.tools was built to solve this problem by providing a centralized, high-performance hub for all your essential utilities.
                  </p>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0 shadow-sm">
                        <Shield size={24} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-xl text-[#1A1A3A]">Privacy-First Architecture</h4>
                        <p className="text-slate-500 leading-relaxed">Unlike other platforms that upload your files to remote servers for processing, our tools are designed to work locally in your browser. This means your text, images, and sensitive data never leave your device, ensuring total privacy and security.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0 shadow-sm">
                        <Zap size={24} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-xl text-[#1A1A3A]">Zero Latency Performance</h4>
                        <p className="text-slate-500 leading-relaxed">By leveraging powerful client-side processing, we eliminate the need for server round-trips. This delivers instantaneous results, whether you are generating a QR code or converting a large block of text. Efficiency is our top priority.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-2xl space-y-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
                  <h3 className="text-3xl font-black text-[#1A1A3A] relative">Our Commitment to Excellence</h3>
                  <p className="text-slate-600 leading-relaxed relative">
                    We believe that free tools shouldn't mean a compromise in quality. Every utility on our platform is meticulously crafted to be intuitive, accessible, and robust. We follow industry best practices for both security and user experience design, ensuring that you can rely on Allinone.tools for even your most critical professional projects.
                  </p>
                  <ul className="space-y-4 relative">
                    {['100% Free to Use Forever', 'No Registration or Sign-up', 'Open Source Driven Spirit', 'Regularly Updated Features'].map((item) => (
                      <li key={item} className="flex items-center gap-4 font-bold text-slate-700">
                        <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                          <Zap size={12} fill="currentColor" />
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="space-y-12">
                <div className="text-center space-y-4">
                  <h2 className="text-4xl font-black text-[#1A1A3A] tracking-tight">Frequently Asked Questions</h2>
                  <p className="text-slate-500 max-w-2xl mx-auto">Get answers to the most common questions about our platform and how our tools work.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* ... Existing FAQ items ... */}
                  <div className="bg-white p-10 rounded-[2.5rem] border border-slate-50 shadow-sm space-y-4">
                    <h3 className="text-xl font-bold text-[#1A1A3A]">Are the tools really free?</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Yes, absolutely. Allinone.tools is committed to providing high-quality utility tools completely free of charge. We do not have hidden fees, subscriptions, or paywalls for any of our standard utilities.
                    </p>
                  </div>
                  <div className="bg-white p-10 rounded-[2.5rem] border border-slate-50 shadow-sm space-y-4">
                    <h3 className="text-xl font-bold text-[#1A1A3A]">Is my data safe with Allinone.tools?</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Privacy is our core value. Most of our tools, including the Text Converter and JSON Formatter, run entirely in your browser. This means your data is processed locally and is never sent to our servers.
                    </p>
                  </div>
                  <div className="bg-white p-10 rounded-[2.5rem] border border-slate-50 shadow-sm space-y-4">
                    <h3 className="text-xl font-bold text-[#1A1A3A]">Do I need to create an account?</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      No. We respect your time and privacy. You can use any tool on our platform instantly without the need for registration, email verification, or login. Efficiency is just one click away.
                    </p>
                  </div>
                  <div className="bg-white p-10 rounded-[2.5rem] border border-slate-50 shadow-sm space-y-4">
                    <h3 className="text-xl font-bold text-[#1A1A3A]">How can I suggest a new tool?</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      We love hearing from our community! If there is a tool you need that we don't have yet, please use our Contact Us page to send your suggestion. We regularly update the platform with new requested features.
                    </p>
                  </div>
                </div>
              </div>

              {/* YouTube Tutorial Hook Section */}
              <div className="max-w-6xl mx-auto space-y-12 py-16">
                <div className="text-center space-y-4">
                  <h2 className="text-4xl md:text-5xl font-black text-[#1A1A3A] tracking-tight">Master Our Tools with Video Guides</h2>
                  <p className="text-slate-500 max-w-3xl mx-auto text-lg leading-relaxed">
                    Visual learner? Watch our comprehensive video tutorials to master PDF conversion, image editing, and developer utilities in record time.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                  {[
                    { id: '5XU6bWNUtXE', title: 'Complete Tools Overview' },
                    { id: 'qKWTQB4Ir_Y', title: 'PDF & File Management Guide' },
                    { id: 'ZxnjsvW563g', title: 'Advanced Developer Utilities' }
                  ].map((video, idx) => (
                    <div key={idx} className="relative group p-3 bg-white rounded-[2.5rem] border border-slate-100 shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                      <div className="aspect-video w-full rounded-[1.8rem] overflow-hidden bg-slate-100 mb-4">
                        <iframe 
                          className="w-full h-full"
                          src={`https://www.youtube.com/embed/${video.id}`} 
                          title={`${video.title} - Allinone.tools Tutorial`}
                          frameBorder="0" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                          referrerPolicy="strict-origin-when-cross-origin" 
                          allowFullScreen
                          loading="lazy"
                        ></iframe>
                      </div>
                      <div className="px-4 pb-4">
                        <h3 className="text-lg font-black text-[#1A1A3A] group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                          {video.title}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-center flex-wrap gap-6 pt-4">
                  <div className="flex items-center gap-3 px-8 py-4 bg-indigo-50 text-indigo-700 rounded-full font-black text-xs uppercase tracking-widest shadow-sm">
                    <Zap size={18} fill="currentColor" className="text-indigo-500" /> Fast & Instant
                  </div>
                  <div className="flex items-center gap-3 px-8 py-4 bg-emerald-50 text-emerald-700 rounded-full font-black text-xs uppercase tracking-widest shadow-sm">
                    <Shield size={18} fill="currentColor" className="text-emerald-500" /> Secure Processing
                  </div>
                  <div className="flex items-center gap-3 px-8 py-4 bg-pink-50 text-pink-700 rounded-full font-black text-xs uppercase tracking-widest shadow-sm">
                    <Heart size={18} fill="currentColor" className="text-pink-500" /> 100% Free Forever
                  </div>
                </div>
              </div>

              <div className="bg-[#1A1A3A] rounded-[4rem] p-12 md:p-24 text-center space-y-10 text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent)] pointer-events-none"></div>
                <div className="space-y-4 relative">
                  <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">Ready to Streamline Your Work?</h2>
                  <p className="text-indigo-200 max-w-3xl mx-auto text-xl font-medium leading-relaxed">
                    Join thousands of developers, designers, and digital professionals who use Allinone.tools every day to automate repetitive tasks and focus on what matters.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-6 relative">
                  <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="px-10 py-5 bg-white text-[#1A1A3A] rounded-2xl font-black hover:bg-indigo-50 transition-all shadow-2xl hover:scale-105 active:scale-95 duration-200">
                    Explore All Tools
                  </button>
                  <button onClick={() => navigateTo('blog')} className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-500 transition-all border border-indigo-400/30 shadow-2xl hover:scale-105 active:scale-95 duration-200">
                    Read Our SEO Blog
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
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 overflow-hidden">
                <img 
                  src="/vite.svg" 
                  alt="Allinone.tools Logo" 
                  className="w-8 h-8"
                  referrerPolicy="no-referrer"
                />
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
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" aria-label="Github">
                  <Github size={20} />
                </a>
                <a href="https://www.facebook.com/Online2PDF" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" aria-label="Facebook">
                  <Facebook size={20} />
                </a>
                <a href="https://www.instagram.com/online2pdf" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-50 text-slate-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-all" aria-label="Instagram">
                  <Instagram size={20} />
                </a>
                <a href="https://www.linkedin.com/company/online2pdf" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-50 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all" aria-label="LinkedIn">
                  <Linkedin size={20} />
                </a>
                <a href="https://www.youtube.com/@online2pdf_official" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" aria-label="YouTube">
                  <Youtube size={20} />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 mb-6">Quick Links</h4>
              <ul className="space-y-4">
                <li><a href="/" onClick={(e) => { e.preventDefault(); navigateTo('home'); }} className="text-slate-500 hover:text-indigo-600 transition-colors">Home Dashboard</a></li>
                <li><a href="/blog" onClick={(e) => { e.preventDefault(); navigateTo('blog'); }} className="text-slate-500 hover:text-indigo-600 transition-colors">SEO & Tools Blog</a></li>
                <li><a href="/about" onClick={(e) => { e.preventDefault(); navigateTo('about'); }} className="text-slate-500 hover:text-indigo-600 transition-colors">About Us</a></li>
                <li><a href="/contact" onClick={(e) => { e.preventDefault(); navigateTo('contact'); }} className="text-slate-500 hover:text-indigo-600 transition-colors">Contact Support</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-6">Popular Tools</h4>
              <ul className="space-y-4 text-slate-500">
                <li><a href="/?tool=case-converter" onClick={(e) => { e.preventDefault(); setActiveTool(TOOLS.find(t => t.id === 'case-converter')!); }} className="hover:text-indigo-600 transition-colors">Case Converter</a></li>
                <li><a href="/?tool=image-placeholder" onClick={(e) => { e.preventDefault(); setActiveTool(TOOLS.find(t => t.id === 'image-placeholder')!); }} className="hover:text-indigo-600 transition-colors">Image Placeholder</a></li>
                <li><a href="/?tool=pdf-metadata" onClick={(e) => { e.preventDefault(); setActiveTool(TOOLS.find(t => t.id === 'pdf-metadata')!); }} className="hover:text-indigo-600 transition-colors">PDF Editor</a></li>
                <li><a href="/?tool=json-formatter" onClick={(e) => { e.preventDefault(); setActiveTool(TOOLS.find(t => t.id === 'json-formatter')!); }} className="hover:text-indigo-600 transition-colors">JSON Formatter</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-6">Legal & Resources</h4>
              <ul className="space-y-4 text-slate-500">
                <li><a href="/privacy" onClick={(e) => { e.preventDefault(); navigateTo('privacy'); }} className="hover:text-indigo-600 transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" onClick={(e) => { e.preventDefault(); navigateTo('terms'); }} className="hover:text-indigo-600 transition-colors">Terms of Service</a></li>
                <li><a href="/sitemap.xml" target="_blank" className="hover:text-emerald-600 transition-colors">XML Sitemap</a></li>
                <li><a href="https://developer.mozilla.org/" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors">Web Documentation</a></li>
                <li><a href="https://www.w3.org/" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors">W3C Standards</a></li>
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
