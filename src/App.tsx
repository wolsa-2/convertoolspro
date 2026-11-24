import React, { useState, useEffect } from 'react';
import { Search, Menu, X, Github, Heart, Zap, Home, BookOpen, Info, Mail, Shield, FileText, ArrowRight, Facebook, Instagram, Twitter, Linkedin, Youtube, Moon, Sun, Camera, Image as ImageIcon, MousePointerClick, Smartphone, ChevronDown, Code } from 'lucide-react';
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

const getRouteFromLocation = (): { page: Page; tool: Tool | null } => {
  let pathname = window.location.pathname;
  while (pathname.length > 1 && pathname.endsWith('/')) pathname = pathname.slice(0, -1);
  const toolPrefix = '/tool/';
  if (pathname.startsWith(toolPrefix)) {
    const id = decodeURIComponent(pathname.slice(toolPrefix.length));
    const tool = TOOLS.find(item => item.id === id) || null;
    return tool ? { page: 'home', tool } : { page: '404', tool: null };
  }
  const pageByPath: Record<string, Page> = {
    '/': 'home', '/blog': 'blog', '/about': 'about', '/contact': 'contact',
    '/privacy': 'privacy', '/terms': 'terms', '/disclaimer': 'disclaimer', '/404': '404',
  };
  return { page: pageByPath[pathname] || '404', tool: null };
};

export default function App() {
  const [activeTool, setActiveTool] = useState<Tool | null>(() => getRouteFromLocation().tool);
  const [currentPage, setCurrentPage] = useState<Page>(() => getRouteFromLocation().page);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<'All Tools' | Category>('All Tools');
  const [openMegaMenu, setOpenMegaMenu] = useState<string | null>(null);
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
    const path = page === 'home' ? '/' : `/${page}`;
    if (window.location.pathname !== path) window.history.pushState({}, '', path);
    setCurrentPage(page);
    setActiveTool(null);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const navigateToTool = (tool: Tool) => {
    const path = `/tool/${encodeURIComponent(tool.id)}`;
    if (window.location.pathname !== path) window.history.pushState({}, '', path);
    setActiveTool(tool);
    setCurrentPage('home');
    setIsMenuOpen(false);
    setOpenMegaMenu(null);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const handlePopState = () => {
      const route = getRouteFromLocation();
      setCurrentPage(route.page);
      setActiveTool(route.tool);
      setIsMenuOpen(false);
      window.scrollTo(0, 0);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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
        onToolNavigate={navigateToTool}
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
    const visibleTools = TOOLS.filter((tool) => {
      const matchesSection = activeSection === 'All Tools' || tool.category === activeSection;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch = !q || tool.name.toLowerCase().includes(q) || tool.description.toLowerCase().includes(q);
      return matchesSection && matchesSearch;
    });

    const sectionCards = [
      { label: 'Image tools', category: 'Image' as Category, description: 'Image utilities and file helpers', tone: 'blue' },
      { label: 'PDF tools', category: 'PDF' as Category, description: 'Create, organize and inspect PDFs', tone: 'rose' },
      { label: 'Text & web tools', category: 'Text & Lists' as Category, description: 'Writing, coding and everyday utilities', tone: 'violet' }
    ];

    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }} className="space-y-12 pb-12">
        <section className="ps-hero relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-100/80 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-violet-100/70 blur-3xl" />
          <div className="relative grid items-center gap-10 px-6 py-12 sm:px-10 md:grid-cols-[1.15fr_.85fr] md:px-14 md:py-16">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Simple tools. Clear results.
              </div>
              <div className="space-y-4">
                <h1 className="max-w-2xl text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl md:text-[3.7rem]">
                  Your everyday <span className="text-blue-600">image & file tools.</span>
                </h1>
                <p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                  Resize, convert, organize and create with a growing collection of straightforward online utilities.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button onClick={() => document.getElementById('all-tools')?.scrollIntoView({ behavior: 'smooth' })} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700">
                  Explore all tools <ArrowRight size={17} />
                </button>
                <button onClick={() => setActiveSection('Image')} className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50">
                  Browse image tools
                </button>
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-slate-500">
                <span className="inline-flex items-center gap-1.5"><Shield size={14} className="text-emerald-600" /> No account required</span>
                <span className="inline-flex items-center gap-1.5"><Smartphone size={14} className="text-blue-600" /> Mobile friendly</span>
                <span className="inline-flex items-center gap-1.5"><Zap size={14} className="text-violet-600" /> Simple workflow</span>
              </div>
            </div>
            <div className="mx-auto w-full max-w-md">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white"><Camera size={20} /></div>
                    <div><p className="text-sm font-bold text-slate-900">PhotoSize workspace</p><p className="text-xs text-slate-500">Pick a tool to get started</p></div>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">Ready</span>
                </div>
                <div className="my-5 rounded-2xl border border-dashed border-blue-200 bg-blue-50/70 px-5 py-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm"><ImageIcon size={27} /></div>
                  <p className="mt-4 text-sm font-semibold text-slate-800">A clean space for everyday tasks</p>
                  <p className="mt-1 text-xs text-slate-500">Choose from the tools available below</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-slate-100 p-3"><ImageIcon size={19} className="mb-2 text-blue-600" /><p className="text-xs font-semibold text-slate-800">Image utilities</p><p className="mt-1 text-[11px] text-slate-500">Work with image files</p></div>
                  <div className="rounded-xl border border-slate-100 p-3"><FileText size={19} className="mb-2 text-rose-600" /><p className="text-xs font-semibold text-slate-800">PDF utilities</p><p className="mt-1 text-[11px] text-slate-500">Manage documents</p></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {sectionCards.map((item) => (
            <button key={item.category} onClick={() => { setActiveSection(item.category); document.getElementById('all-tools')?.scrollIntoView({ behavior: 'smooth' }); }} className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">
              <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", item.tone === 'rose' ? "bg-rose-50 text-rose-600" : item.tone === 'violet' ? "bg-violet-50 text-violet-600" : "bg-blue-50 text-blue-600")}>
                {item.category === 'Image' ? <ImageIcon size={23} /> : item.category === 'PDF' ? <FileText size={23} /> : <Code size={23} />}
              </span>
              <span className="min-w-0 flex-1"><span className="block text-sm font-bold text-slate-900">{item.label}</span><span className="mt-1 block text-xs text-slate-500">{item.description}</span></span>
              <ArrowRight size={17} className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600" />
            </button>
          ))}
        </section>

        <section id="all-tools" className="scroll-mt-36 space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div><span className="text-xs font-bold uppercase tracking-[.18em] text-blue-600">PhotoSize directory</span><h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Find the right tool</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Browse the currently available tools by category or search by name.</p></div>
            <div className="relative w-full lg:max-w-sm"><Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search all tools..." aria-label="Search all tools" className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100" /></div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {(['All Tools', ...CATEGORIES] as Array<'All Tools' | Category>).map((category) => (
              <button key={category} onClick={() => setActiveSection(category)} className={cn("shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition", activeSection === category ? "border-blue-600 bg-blue-600 text-white shadow-sm" : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-700")}>{category}</button>
            ))}
          </div>
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-slate-600"><span className="h-2 w-2 rounded-full bg-emerald-500" /><span>{activeSection === 'All Tools' ? 'All categories' : activeSection} <span className="text-slate-400">/</span> Available tools</span></div>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold tabular-nums text-slate-600">{visibleTools.length} tools</span>
          </div>
          {visibleTools.length ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visibleTools.map((tool) => (
                <motion.button key={tool.id} type="button" whileHover={{ y: -3 }} whileTap={{ scale: .99 }} onClick={() => { navigateToTool(tool); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="group flex min-h-44 w-full items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-200 hover:shadow-xl hover:shadow-slate-900/5 focus:outline-none focus:ring-4 focus:ring-blue-100">
                  <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", tool.category === 'PDF' ? "bg-rose-50 text-rose-600" : tool.category === 'Image' ? "bg-blue-50 text-blue-600" : "bg-violet-50 text-violet-600")}><tool.icon size={23} /></span>
                  <span className="min-w-0 flex-1"><span className="block text-base font-bold tracking-tight text-slate-900 transition group-hover:text-blue-700">{tool.name}</span><span className="mt-2 block text-sm leading-6 text-slate-500">{tool.description}</span><span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600">Open tool <ArrowRight size={14} className="transition group-hover:translate-x-1" /></span></span>
                </motion.button>
              ))}
            </div>
          ) : <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center"><Search size={25} className="mx-auto text-slate-400" /><p className="mt-3 font-semibold text-slate-800">No matching tools</p><p className="mt-1 text-sm text-slate-500">Try a different search or category.</p></div>}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white px-6 py-10 sm:px-10">
          <div className="mx-auto max-w-2xl text-center"><span className="text-xs font-bold uppercase tracking-[.18em] text-blue-600">How it works</span><h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Three simple steps</h2><p className="mt-2 text-sm leading-6 text-slate-500">A clear workflow from choosing a tool to getting your result.</p></div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[{n:'01',title:'Choose a tool',body:'Open the utility that matches your task.'},{n:'02',title:'Add your content',body:'Follow the controls and instructions on that tool page.'},{n:'03',title:'Get your result',body:'Use the available download, copy or export action.'}].map((step) => <div key={step.n} className="rounded-2xl bg-slate-50 p-6"><span className="text-xs font-bold tracking-widest text-blue-600">{step.n}</span><h3 className="mt-3 text-base font-bold text-slate-900">{step.title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{step.body}</p></div>)}
          </div>
        </section>
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

      <div className="ps-mega-bar sticky top-20 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 py-2 sm:px-6 lg:px-8">
          {[
            { id: 'image', label: 'Image Tools', category: 'Image' as Category },
            { id: 'pdf', label: 'PDF Tools', category: 'PDF' as Category },
            { id: 'more', label: 'More Tools', category: 'Text & Lists' as Category }
          ].map((group) => {
            const groupTools = group.id === 'more' ? TOOLS.filter((tool) => !['Image', 'PDF'].includes(tool.category)) : TOOLS.filter((tool) => tool.category === group.category);
            return (
              <div key={group.id} className="relative shrink-0">
                <button type="button" aria-expanded={openMegaMenu === group.id} onClick={() => setOpenMegaMenu(openMegaMenu === group.id ? null : group.id)} className={cn("inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition", openMegaMenu === group.id ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-blue-700")}>
                  {group.label}<ChevronDown size={15} className={cn("transition-transform", openMegaMenu === group.id && "rotate-180")} />
                </button>
                {openMegaMenu === group.id && (
                  <div className="absolute left-0 top-full z-50 mt-2 grid w-[min(92vw,560px)] grid-cols-1 gap-1 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl sm:grid-cols-2">
                    {groupTools.map((tool) => (
                      <button key={tool.id} onClick={() => { navigateToTool(tool); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex items-start gap-3 rounded-xl p-3 text-left transition hover:bg-blue-50">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><tool.icon size={18} /></span>
                        <span><span className="block text-sm font-semibold text-slate-800">{tool.name}</span><span className="mt-0.5 block text-xs leading-5 text-slate-500">{tool.description}</span></span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <button onClick={() => { setActiveSection('All Tools'); setOpenMegaMenu(null); document.getElementById('all-tools')?.scrollIntoView({ behavior: 'smooth' }); }} className="ml-auto shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50">View all tools <ArrowRight size={14} className="ml-1 inline" /></button>
        </div>
      </div>

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
                <li><a href="/tool/case-converter" onClick={(e) => { e.preventDefault(); navigateToTool(TOOLS.find(t => t.id === 'case-converter')!); }} className="hover:text-indigo-600 transition-colors">Case Converter</a></li>
                <li><a href="/tool/image-placeholder" onClick={(e) => { e.preventDefault(); navigateToTool(TOOLS.find(t => t.id === 'image-placeholder')!); }} className="hover:text-indigo-600 transition-colors">Image Placeholder</a></li>
                <li><a href="/tool/pdf-metadata" onClick={(e) => { e.preventDefault(); navigateToTool(TOOLS.find(t => t.id === 'pdf-metadata')!); }} className="hover:text-indigo-600 transition-colors">PDF Editor</a></li>
                <li><a href="/tool/json-formatter" onClick={(e) => { e.preventDefault(); navigateToTool(TOOLS.find(t => t.id === 'json-formatter')!); }} className="hover:text-indigo-600 transition-colors">JSON Formatter</a></li>
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
