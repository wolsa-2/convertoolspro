import React, { useState, useEffect } from 'react';
import { Search, Menu, X, Github, Heart, Zap, Home, BookOpen, Info, Mail, Shield, FileText, ArrowRight, Facebook, Instagram, Twitter, Linkedin, Youtube, Moon, Sun, Camera } from 'lucide-react';
import { TOOLS, CATEGORIES, Category, Tool } from './constants';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { STATIC_PAGES_CONTENT } from './content';
import { AdUnit } from './components/AdUnit';

const StructuredData = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "PhotoSize",
    "url": "https://photosize.vercel.app/",
    "description": "Useful photo and image utilities, with PDF, text and developer tools in one browser-based workspace.",
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

type Page = 'home' | 'blog' | 'about' | 'contact' | 'privacy' | 'terms' | 'disclaimer' | '404';

export default function App() {
  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const [showCookieConsent, setShowCookieConsent] = useState(() => {
    return !localStorage.getItem('cookie-consent');
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    // Scroll to top on page change
    window.scrollTo(0, 0);

    // Dynamic Title, Description & Social Meta Updates
    let title = 'PhotoSize | Free Online Photo, Image & Utility Tools';
    let description = 'Free online photo and image utilities, plus useful PDF, text and developer tools. Simple browser-based tools with no account required.';
    let canonical = 'https://photosize.vercel.app/';

    if (activeTool) {
      title = `${activeTool.name} | PhotoSize`;
      description = `Use the ${activeTool.name} tool on PhotoSize. ${activeTool.description} Review this tool's details for supported formats and processing behavior.`;
      canonical = `https://photosize.vercel.app/tool/${activeTool.id}`;
    } else if (currentPage === 'blog') {
      title = 'SEO & Productivity Blog | PhotoSize';
      description = 'Read practical guides on photo and image workflows, digital productivity, and online utilities.';
      canonical = 'https://photosize.vercel.app/blog';
    } else if (currentPage !== 'home') {
      title = `${currentPage.charAt(0).toUpperCase() + currentPage.slice(1)} | PhotoSize`;
      description = `Learn more about PhotoSize, our available image and file utilities, and how to use the website.`;
      canonical = `https://photosize.vercel.app/${currentPage}`;
    }

    // Apply basic metadata
    document.title = title;
    
    // Update Meta Description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);

    // Fix Issue 1: Update Open Graph tags for branding consistency
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    const twitterTitle = document.querySelector('meta[property="twitter:title"]');
    const twitterDesc = document.querySelector('meta[property="twitter:description"]');
    const ogImage = document.querySelector('meta[property="og:image"]');
    const twitterImage = document.querySelector('meta[property="twitter:image"]');

    if (ogTitle) ogTitle.setAttribute('content', title);
    if (ogDesc) ogDesc.setAttribute('content', description);
    if (twitterTitle) twitterTitle.setAttribute('content', title);
    if (twitterDesc) twitterDesc.setAttribute('content', description);
    
    // Fix Issue 2: Branded OG Image
    const brandedImage = 'https://photosize.vercel.app/og-image.svg';
    if (ogImage) ogImage.setAttribute('content', brandedImage);
    if (twitterImage) twitterImage.setAttribute('content', brandedImage);

    // Update or create canonical tag
    let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonical);
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
        component = <SimplePdfTool key={activeTool.id} toolId={activeTool.id} />;
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
                We value your feedback and are always looking for ways to improve PhotoSize. Whether you have a question, a suggestion for a new tool, or need to report a bug, we're here to help.
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
            <div className="prose prose-indigo prose-lg max-w-none text-slate-600 dark:text-slate-400 leading-relaxed space-y-6" 
                 dangerouslySetInnerHTML={{ __html: STATIC_PAGES_CONTENT.terms }} />
          </div>
        );
      case 'disclaimer':
        return (
          <div className="max-w-4xl mx-auto space-y-8 py-12">
            <div className="prose prose-indigo prose-lg dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed space-y-6" 
                 dangerouslySetInnerHTML={{ __html: STATIC_PAGES_CONTENT.disclaimer }} />
          </div>
        );
      case 'home':
        return renderHome();
      default:
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
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 font-sans">Popular Destination</h3>
                <div className="flex flex-wrap justify-center gap-4">
                  <button onClick={() => setCurrentPage('home')} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100">Home Hub</button>
                  <button onClick={() => setCurrentPage('blog')} className="px-6 py-3 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-sm">Visit Blog</button>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  const renderHome = () => {
    const imageTools = TOOLS.filter((tool) =>
      tool.category === 'Image' &&
      (tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       tool.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const steps = [
      { number: '01', title: 'Choose a tool', description: 'Select the image utility that matches your task.' },
      { number: '02', title: 'Set your options', description: 'Use the available controls to prepare your image.' },
      { number: '03', title: 'Get your result', description: 'View the result and follow the tool’s download or copy action.' }
    ];

    const faqs = [
      { question: 'Which image tools are available on PhotoSize?', answer: 'PhotoSize currently provides an Image Placeholder generator and an Image to Base64 converter. More tools should appear here only when they are ready to use.' },
      { question: 'Do I need to create an account?', answer: 'No account is required to use the available tools.' },
      { question: 'Is PhotoSize free to use?', answer: 'The currently available PhotoSize tools are free to use.' },
      { question: 'Are my images uploaded to a server?', answer: 'Processing behavior can differ by tool. Please review the individual tool’s description before using sensitive images or data.' }
    ];

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-16 md:space-y-24 tool-container">
        <section className="relative overflow-hidden rounded-[2rem] border border-indigo-100/80 bg-gradient-to-br from-white via-white to-indigo-50/80 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/40 dark:border-slate-800">
          <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-500/10" />
          <div className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-violet-200/20 blur-3xl dark:bg-violet-500/10" />
          <div className="relative grid items-center gap-10 px-6 py-12 sm:px-10 md:grid-cols-2 md:px-14 md:py-20">
            <div className="space-y-7 text-center md:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/90 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-indigo-700 shadow-sm dark:border-indigo-900 dark:bg-slate-900 dark:text-indigo-300">
                <span className="h-2 w-2 rounded-full bg-indigo-500" /> Simple online image tools
              </div>
              <div className="space-y-5">
                <h1 className="mx-auto max-w-2xl text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 dark:text-white sm:text-5xl md:mx-0 md:text-[3.65rem]">
                  Make more of your <span className="text-indigo-600 dark:text-indigo-400">images.</span>
                </h1>
                <p className="mx-auto max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg md:mx-0">
                  Straightforward online image tools for everyday tasks. Choose a tool, make your changes, and get your result without a complicated workflow.
                </p>
              </div>
              <div className="flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
                <button onClick={() => document.getElementById('image-tools')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-0.5 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-900">
                  Explore image tools <ArrowRight size={17} />
                </button>
                <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-indigo-200 hover:bg-indigo-50/60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
                  How it works
                </button>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-slate-500 dark:text-slate-400 md:justify-start">
                <span className="inline-flex items-center gap-1.5"><Shield size={14} className="text-indigo-500" /> No account required</span>
                <span className="inline-flex items-center gap-1.5"><Zap size={14} className="text-indigo-500" /> Simple workflow</span>
              </div>
            </div>
            <div className="mx-auto w-full max-w-md">
              <div className="rounded-3xl border border-slate-200/90 bg-white p-4 shadow-2xl shadow-indigo-950/10 dark:border-slate-700 dark:bg-slate-900 sm:p-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white"><Camera size={18} /></div>
                    <div><p className="text-sm font-bold text-slate-900 dark:text-white">PhotoSize workspace</p><p className="text-xs text-slate-500 dark:text-slate-400">A simpler image workflow</p></div>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">Ready to use</span>
                </div>
                <div className="my-5 rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/60 px-5 py-8 text-center dark:border-indigo-900 dark:bg-indigo-950/30">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-300"><Camera size={27} /></div>
                  <p className="mt-4 text-sm font-semibold text-slate-800 dark:text-slate-100">Your image tools, in one place</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Pick the right tool for your task</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-slate-100 p-3 dark:border-slate-800">
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300"><ImageIcon size={18} /></div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Image Placeholder</p><p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Create a placeholder</p>
                  </div>
                  <div className="rounded-2xl border border-slate-100 p-3 dark:border-slate-800">
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-900/40 dark:text-violet-300"><FileText size={18} /></div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Image to Base64</p><p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Convert image data</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-3 dark:bg-slate-800/70"><span className="text-xs font-medium text-slate-600 dark:text-slate-300">Clean. Clear. Focused.</span><span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">PhotoSize</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { icon: Shield, title: 'No account required', text: 'Open a tool and get started.' },
            { icon: MousePointerClick, title: 'Easy to use', text: 'Clear tools and simple controls.' },
            { icon: Smartphone, title: 'Works across screens', text: 'A responsive experience on mobile and desktop.' }
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300"><item.icon size={21} /></div>
              <div><h2 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h2><p className="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">{item.text}</p></div>
            </div>
          ))}
        </section>

        <section id="image-tools" className="scroll-mt-28 space-y-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">Explore PhotoSize</span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">Image tools</h2>
              <p className="max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">Choose from the image utilities currently available on PhotoSize.</p>
            </div>
            <div className="relative w-full sm:max-w-xs">
              <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search image tools..." aria-label="Search image tools" className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:ring-indigo-950" />
            </div>
          </div>
          {imageTools.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {imageTools.map((tool) => (
                <motion.button key={tool.id} type="button" whileHover={{ y: -3 }} whileTap={{ scale: 0.99 }} onClick={() => { setActiveTool(tool); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="group flex min-h-44 w-full items-start gap-5 rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition-all hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-950/5 focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-800 dark:focus:ring-indigo-950 sm:p-7">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white dark:bg-indigo-900/40 dark:text-indigo-300"><tool.icon size={26} /></div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold tracking-tight text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">{tool.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{tool.description}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400">Open tool <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" /></span>
                  </div>
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900">
              <Search size={24} className="mx-auto text-slate-400" /><p className="mt-3 font-semibold text-slate-800 dark:text-white">No matching image tools</p><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Try another search term.</p>
            </div>
          )}
        </section>

        <section id="how-it-works" className="scroll-mt-28 rounded-[2rem] bg-slate-50 px-6 py-10 dark:bg-slate-900/70 sm:px-10 md:py-14">
          <div className="mx-auto max-w-2xl space-y-3 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">A straightforward workflow</span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white">How PhotoSize works</h2>
            <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">No complicated setup. Start with the tool that matches what you want to do.</p>
          </div>
          <div className="mt-9 grid grid-cols-1 gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.number} className="relative rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <span className="text-xs font-bold tracking-widest text-indigo-600 dark:text-indigo-400">{step.number}</span><h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">{step.title}</h3><p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{step.description}</p>
                {index < steps.length - 1 && <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-slate-200 bg-white p-1 text-indigo-500 md:block dark:border-slate-700 dark:bg-slate-900" size={25} />}
              </div>
            ))}
          </div>
        </section>

        <section className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">Designed for clarity</span>
            <h2 className="text-3xl font-bold leading-tight tracking-tight text-slate-950 dark:text-white sm:text-4xl">The image tools you need, without the clutter.</h2>
            <p className="text-base leading-7 text-slate-600 dark:text-slate-300">PhotoSize keeps the experience focused: clear tool names, simple navigation, and a layout that works on the device you are using.</p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              { icon: Camera, title: 'Image focused', text: 'A dedicated place to find image utilities.' },
              { icon: MousePointerClick, title: 'Simple controls', text: 'Straightforward tool pages and actions.' },
              { icon: Smartphone, title: 'Responsive layout', text: 'Comfortable to use on smaller screens.' },
              { icon: Shield, title: 'Clear information', text: 'Tool descriptions help explain what each utility does.' }
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                <item.icon size={21} className="text-indigo-600 dark:text-indigo-400" /><h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">{item.title}</h3><p className="mt-1.5 text-xs leading-5 text-slate-500 dark:text-slate-400">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-3xl space-y-7">
          <div className="space-y-2 text-center"><span className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">Helpful answers</span><h2 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white">Frequently asked questions</h2></div>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details key={faq.question} className="group rounded-2xl border border-slate-200 bg-white p-5 open:border-indigo-200 open:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:open:border-indigo-900">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-slate-900 marker:hidden dark:text-white">{faq.question}<ChevronDown size={18} className="shrink-0 text-slate-400 transition-transform group-open:rotate-180" /></summary>
                <p className="pt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-12 text-center text-white sm:px-10 md:py-16">
          <div className="mx-auto max-w-2xl space-y-5">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-300"><Camera size={24} /></div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to work with your images?</h2>
            <p className="text-sm leading-6 text-slate-300">Explore the image tools currently available on PhotoSize and choose the one that fits your task.</p>
            <button onClick={() => document.getElementById('image-tools')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-indigo-50">Explore image tools <ArrowRight size={16} /></button>
          </div>
        </section>

        <script type="application/ld+json">
          {JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://photosize.vercel.app/" }] })}
        </script>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F9FF] dark:bg-slate-950 text-[#1A1A3A] dark:text-slate-100 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      <StructuredData />
      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigateTo('home')}>
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 overflow-hidden">
                <Camera size={26} strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-black tracking-tight text-[#1A1A3A] dark:text-white">PhotoSize</span>
            </div>

            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text"
                  placeholder="Search image tools..."
                  className="w-full pl-11 pr-4 py-3 bg-[#F8F9FF] dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm dark:text-white"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (currentPage !== 'home') navigateTo('home');
                  }}
                />
              </div>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-indigo-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all shadow-sm"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
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
            className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-6 space-y-4 shadow-xl fixed top-20 left-0 right-0 z-40"
          >
            <div className="flex flex-col gap-2">
              <button onClick={() => navigateTo('home')} className="p-4 text-left font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl">Home</button>
              <button onClick={() => navigateTo('blog')} className="p-4 text-left font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl">Blog</button>
              <button onClick={() => navigateTo('about')} className="p-4 text-left font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl">About</button>
              <button onClick={() => navigateTo('contact')} className="p-4 text-left font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl">Contact</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {renderPage()}
      </main>

      {/* Footer */}
      <AdUnit slot={import.meta.env.VITE_ADSENSE_SLOT_FOOTER || ""} className="max-w-7xl mx-auto px-4" />
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                  <Camera size={18} strokeWidth={2.5} />
                </div>
                <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">PhotoSize</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                PhotoSize brings simple online image utilities together in one focused, easy-to-use workspace.
              </p>
              <p className="text-[10px] text-slate-400 leading-relaxed max-w-xs">
                Disclaimer: Tools are provided as is. Processing behavior can vary by tool; review the relevant tool details before using sensitive files or information.
              </p>
              <div className="flex gap-4">
                <a href="https://github.com/wolsa-2/convertoolspro" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900 transition-all" aria-label="Github">
                  <Github size={20} />
                </a>

              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-6">Quick Links</h4>
              <ul className="space-y-4">
                <li><a href="/" onClick={(e) => { e.preventDefault(); navigateTo('home'); }} className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors">Home Dashboard</a></li>
                <li><a href="/blog" onClick={(e) => { e.preventDefault(); navigateTo('blog'); }} className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors">SEO & Tools Blog</a></li>
                <li><a href="/about" onClick={(e) => { e.preventDefault(); navigateTo('about'); }} className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors">About Us</a></li>
                <li><a href="/contact" onClick={(e) => { e.preventDefault(); navigateTo('contact'); }} className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors">Contact Support</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-6">Popular Tools</h4>
              <ul className="space-y-4 text-slate-500 dark:text-slate-400">
                <li><a href="/?tool=case-converter" onClick={(e) => { e.preventDefault(); setActiveTool(TOOLS.find(t => t.id === 'case-converter')!); }} className="hover:text-indigo-600 transition-colors">Case Converter</a></li>
                <li><a href="/?tool=image-placeholder" onClick={(e) => { e.preventDefault(); setActiveTool(TOOLS.find(t => t.id === 'image-placeholder')!); }} className="hover:text-indigo-600 transition-colors">Image Placeholder</a></li>
                <li><a href="/?tool=pdf-metadata" onClick={(e) => { e.preventDefault(); setActiveTool(TOOLS.find(t => t.id === 'pdf-metadata')!); }} className="hover:text-indigo-600 transition-colors">PDF Editor</a></li>
                <li><a href="/?tool=json-formatter" onClick={(e) => { e.preventDefault(); setActiveTool(TOOLS.find(t => t.id === 'json-formatter')!); }} className="hover:text-indigo-600 transition-colors">JSON Formatter</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-6">Legal & Resources</h4>
              <ul className="space-y-4 text-slate-500">
                <li><a href="/privacy" onClick={(e) => { e.preventDefault(); navigateTo('privacy'); }} className="hover:text-indigo-600 transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" onClick={(e) => { e.preventDefault(); navigateTo('terms'); }} className="hover:text-indigo-600 transition-colors">Terms of Service</a></li>
                <li><a href="/disclaimer" onClick={(e) => { e.preventDefault(); navigateTo('disclaimer'); }} className="hover:text-indigo-600 transition-colors">Disclaimer</a></li>
                <li><a href="/sitemap.xml" target="_blank" className="hover:text-emerald-600 transition-colors">XML Sitemap</a></li>
                <li><a href="https://developer.mozilla.org/" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors">Web Documentation</a></li>
                <li><a href="https://www.w3.org/" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors">W3C Standards</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">
              © 2026 PhotoSize. All rights reserved.
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
            className="fixed bottom-8 left-8 right-8 md:left-auto md:right-8 md:max-w-md bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl rounded-3xl p-6 z-[60] space-y-4"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                <Shield size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white">Cookie Policy</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  We use cookies to enhance your experience and serve personalized ads via Google AdSense. By using our site, you agree to our use of cookies.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={acceptCookies}
                className="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 dark:shadow-none hover:bg-indigo-500 transition-all font-sans"
              >
                Accept All
              </button>
              <button 
                onClick={() => navigateTo('privacy')}
                className="flex-1 py-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-all font-sans"
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
