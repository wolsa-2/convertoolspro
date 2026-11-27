import React, { useState, useEffect, useMemo } from 'react';
import { Search, Menu, X, Heart, Zap, Home, BookOpen, Info, Mail, Shield, FileText, ArrowRight, Facebook, Instagram, Twitter, Linkedin, Youtube, Moon, Sun, Camera, Image as ImageIcon, MousePointerClick, Smartphone, ChevronDown, Code } from 'lucide-react';
import { TOOLS, CATEGORIES, Category, Tool } from './constants';
import { cn } from './lib/utils';
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
      "@type": "Organization",
      "name": "PhotoSize"
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
// Start loading the Blog route chunk as soon as the app module runs, rather than waiting for the first React render.
if (typeof window !== 'undefined' && window.location.pathname.startsWith('/blog')) {
  void import('./components/Blog');
}
const ToolLayout = React.lazy(() => import('./components/ToolLayout'));
import { Marquee } from './components/Marquee';
import { Suspense } from 'react';


type Page = 'home' | 'blog' | 'about' | 'contact' | 'privacy' | 'terms' | 'disclaimer' | '404';

const HOME_SECTION_CARDS = [
  { label: 'Image tools', category: 'Image' as Category, description: 'Image utilities and file helpers', tone: 'blue' },
  { label: 'PDF tools', category: 'PDF' as Category, description: 'Create, organize and inspect PDFs', tone: 'rose' },
  { label: 'Text & web tools', category: 'Text & Lists' as Category, description: 'Writing, coding and everyday utilities', tone: 'violet' }
];

const getRouteFromLocation = (): { page: Page; tool: Tool | null } => {
  let pathname = window.location.pathname;
  while (pathname.length > 1 && pathname.endsWith('/')) pathname = pathname.slice(0, -1);
  const toolPrefix = '/tool/';
  if (pathname === '/blog' || pathname.startsWith('/blog/')) return { page: 'blog', tool: null };
  if (pathname.startsWith(toolPrefix)) {
    let id = '';
    try {
      id = decodeURIComponent(pathname.slice(toolPrefix.length));
    } catch {
      return { page: '404', tool: null };
    }
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
    const savedConsent = localStorage.getItem('cookie-consent');
    // Preserve consent already granted by earlier PhotoSize versions.
    if (savedConsent === 'true') {
      localStorage.setItem('cookie-consent', 'accepted');
    }
    return !savedConsent;
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
      // Blog.tsx owns listing and article metadata, including article-specific titles and descriptions.
      return;
    } else if (currentPage === 'about') {
      title = 'About PhotoSize | PhotoSize';
      description = 'Learn about PhotoSize, its image, PDF and everyday digital tools, and the project’s focus on simple, useful online workflows.';
      canonical = 'https://photosize.vercel.app/about';
    } else if (currentPage === 'contact') {
      title = 'Contact PhotoSize | PhotoSize';
      description = 'Contact PhotoSize for questions, technical support, bug reports, feedback or suggestions for new online tools.';
      canonical = 'https://photosize.vercel.app/contact';
    } else if (currentPage === 'privacy') {
      title = 'Privacy Policy | PhotoSize';
      description = 'Read the PhotoSize Privacy Policy about local browser processing, advertising cookies, log files and third-party privacy practices.';
      canonical = 'https://photosize.vercel.app/privacy';
    } else if (currentPage === 'terms') {
      title = 'Terms of Service | PhotoSize';
      description = 'Review the PhotoSize Terms of Service, including acceptable use, user content, warranties and liability limitations.';
      canonical = 'https://photosize.vercel.app/terms';
    } else if (currentPage === 'disclaimer') {
      title = 'Disclaimer | PhotoSize';
      description = 'Read the PhotoSize disclaimer about tool accuracy, general information, external links and use of the website at your own risk.';
      canonical = 'https://photosize.vercel.app/disclaimer';
    } else if (currentPage === '404') {
      title = 'Page Not Found | PhotoSize';
      description = 'The page you requested could not be found on PhotoSize.';
      canonical = 'https://photosize.vercel.app/404';
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

    // Keep share previews aligned with the active route.
    const ogUrl = document.querySelector('meta[property="og:url"]');
    const twitterUrl = document.querySelector('meta[property="twitter:url"]');
    if (ogUrl) ogUrl.setAttribute('content', canonical);
    if (twitterUrl) twitterUrl.setAttribute('content', canonical);

    // Unknown routes should not become search results.
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.setAttribute('name', 'robots');
      document.head.appendChild(robots);
    }
    robots.setAttribute('content', currentPage === '404' ? 'noindex, follow' : 'index, follow');

    // Add route-aware application data for individual tool landing pages.
    const previousToolSchema = document.getElementById('photosize-tool-schema');
    previousToolSchema?.remove();
    if (activeTool) {
      const schema = document.createElement('script');
      schema.id = 'photosize-tool-schema';
      schema.type = 'application/ld+json';
      schema.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: activeTool.name,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Any',
        description,
        url: canonical,
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        publisher: { '@type': 'Organization', name: 'PhotoSize', url: 'https://photosize.vercel.app/' }
      });
      document.head.appendChild(schema);
    }
    
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
    localStorage.setItem('cookie-consent', 'accepted');
    window.location.reload();
  };

  const rejectCookies = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    // Reload so any optional scripts loaded during an earlier accepted session
    // are no longer active in the new page session.
    window.location.reload();
  };

  useEffect(() => {
    if (localStorage.getItem('cookie-consent') !== 'accepted') return;
    const trackingWindow = window as Window & {
      dataLayer?: unknown[];
      gtag?: (...args: unknown[]) => void;
    };
    trackingWindow.dataLayer = trackingWindow.dataLayer || [];
    trackingWindow.gtag = (...args: unknown[]) => {
      trackingWindow.dataLayer?.push(args);
    };
    trackingWindow.gtag('js', new Date());
    trackingWindow.gtag('config', 'G-E5M3FZVL7Q');
    trackingWindow.gtag('config', 'AW-16905142948');

    if (!document.getElementById('photosize-gtag-loader')) {
      const script = document.createElement('script');
      script.id = 'photosize-gtag-loader';
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=G-E5M3FZVL7Q';
      document.head.appendChild(script);
    }
  }, []);

  // Recompute the tool directory only when its actual filters change.
  const visibleTools = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return TOOLS.filter((tool) => {
      const matchesSection = activeSection === 'All Tools' || tool.category === activeSection;
      const matchesSearch = !query || tool.name.toLowerCase().includes(query) || tool.description.toLowerCase().includes(query);
      return matchesSection && matchesSearch;
    });
  }, [activeSection, searchQuery]);

  const navigateTo = (page: Page) => {
    const path = page === 'home' ? '/' : `/${page}`;
    if (window.location.pathname !== path) window.history.pushState({}, '', path);
    setCurrentPage(page);
    setActiveTool(null);
    setActiveSection('All Tools');
    setSearchQuery('');
    setIsMenuOpen(false);
    setOpenMegaMenu(null);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const navigateToTool = (tool: Tool) => {
    const path = `/tool/${encodeURIComponent(tool.id)}`;
    if (window.location.pathname !== path) window.history.pushState({}, '', path);
    setActiveTool(tool);
    setCurrentPage('home');
    setIsMenuOpen(false);
    setOpenMegaMenu(null);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  // Open the tool directory from any page, then scroll after the home view renders.
  const navigateToTools = (category: 'All Tools' | Category = 'All Tools') => {
    if (window.location.pathname !== '/') window.history.pushState({}, '', '/');
    setCurrentPage('home');
    setActiveTool(null);
    setActiveSection(category);
    setSearchQuery('');
    setIsMenuOpen(false);
    setOpenMegaMenu(null);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        document.getElementById('all-tools')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  };

  useEffect(() => {
    const handlePopState = () => {
      const route = getRouteFromLocation();
      setCurrentPage(route.page);
      setActiveTool(route.tool);
      setActiveSection('All Tools');
      setSearchQuery('');
      setIsMenuOpen(false);
      setOpenMegaMenu(null);
      window.scrollTo({ top: 0, behavior: 'auto' });
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
          <main className="bg-[#FAF8F5] text-[#20242B]">
            <section className="relative isolate overflow-hidden rounded-[30px] border border-[#E8E2DA] bg-[#FAF8F5] px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
              <div className="pointer-events-none absolute -right-20 -top-24 -z-10 h-80 w-80 rounded-full bg-[#FF684A]/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-28 left-1/3 -z-10 h-72 w-72 rounded-full bg-[#FF684A]/[0.07] blur-3xl" />
              <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_.9fr]">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#E8E2DA] bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-[#5B626B]"><Info size={14} className="text-[#FF684A]"/> About PhotoSize</span>
                  <h1 className="mt-6 max-w-2xl text-4xl font-bold leading-[1.04] tracking-[-.05em] text-[#20242B] sm:text-5xl lg:text-6xl">A little less digital clutter. <span className="text-[#E65C40]">A lot more done.</span></h1>
                  <p className="mt-5 max-w-xl text-base leading-8 text-[#666D76] sm:text-lg">PhotoSize brings useful image, PDF and everyday digital tools into one straightforward workspace—so common tasks take fewer steps.</p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <button onClick={() => navigateTo('home')} className="inline-flex items-center gap-2 rounded-xl bg-[#C7432A] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#B83D26]">Explore tools <ArrowRight size={16}/></button>
                    <button onClick={() => navigateTo('contact')} className="inline-flex items-center gap-2 rounded-xl border border-[#E8E2DA] bg-white px-5 py-3 text-sm font-bold text-[#555B63] transition hover:border-[#FF684A] hover:text-[#D94F34]">Get in touch</button>
                  </div>
                </div>
                <div className="rounded-[26px] border border-[#E8E2DA] bg-white p-5 shadow-sm sm:p-7">
                  <div className="flex items-center justify-between gap-3 border-b border-[#EEEAE5] pb-4">
                    <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF0EB] text-[#D94F34]"><ImageIcon size={22}/></span><div><p className="font-bold text-[#20242B]">PhotoSize</p><p className="text-xs text-[#666D76]">Your everyday utility workspace</p></div></div>
                    <span className="rounded-full bg-[#FFF0EB] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#B83D26]">Simple by design</span>
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-[#FAF8F5] p-4"><Camera className="text-[#E65C40]" size={22}/><p className="mt-3 font-bold text-[#20242B]">Image tools</p><p className="mt-1 text-xs leading-5 text-[#666D76]">Resize, convert and prepare images</p></div>
                    <div className="rounded-2xl bg-[#FAF8F5] p-4"><FileText className="text-[#E65C40]" size={22}/><p className="mt-3 font-bold text-[#20242B]">PDF tools</p><p className="mt-1 text-xs leading-5 text-[#666D76]">Handle everyday documents</p></div>
                    <div className="rounded-2xl bg-[#FAF8F5] p-4"><Code className="text-[#E65C40]" size={22}/><p className="mt-3 font-bold text-[#20242B]">Developer tools</p><p className="mt-1 text-xs leading-5 text-[#666D76]">Quick helpers for digital work</p></div>
                    <div className="rounded-2xl bg-[#FAF8F5] p-4"><Shield className="text-[#E65C40]" size={22}/><p className="mt-3 font-bold text-[#20242B]">Privacy aware</p><p className="mt-1 text-xs leading-5 text-[#666D76]">Processing details made clear</p></div>
                  </div>
                </div>
              </div>
            </section>

            <section className="py-14 sm:py-16">
              <div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-widest text-[#B83D26]">Why PhotoSize exists</p><h2 className="mt-2 text-3xl font-bold tracking-[-.04em] text-[#20242B] sm:text-4xl">Useful tools. Less friction.</h2><p className="mt-4 text-base leading-7 text-[#666D76]">Helpful digital utilities should be easy to find, straightforward to use and accessible without unnecessary complexity.</p></div>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <article className="rounded-[24px] border border-[#E8E2DA] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#FFB09E] hover:shadow-lg"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF0EB] text-[#D94F34]"><Zap size={22}/></span><h3 className="mt-4 text-lg font-bold text-[#20242B]">Our mission</h3><p className="mt-2 text-sm leading-7 text-[#707780]">Bring practical tools for creators, students, developers and everyday users into one accessible workspace—without making simple tasks feel complicated.</p></article>
                <article className="rounded-[24px] border border-[#E8E2DA] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#FFB09E] hover:shadow-lg"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF0EB] text-[#D94F34]"><Shield size={22}/></span><h3 className="mt-4 text-lg font-bold text-[#20242B]">Privacy matters</h3><p className="mt-2 text-sm leading-7 text-[#707780]">We favour browser-based processing wherever a tool supports it. Check each tool's details for its specific processing behaviour before using sensitive files.</p></article>
                <article className="rounded-[24px] border border-[#E8E2DA] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#FFB09E] hover:shadow-lg"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF0EB] text-[#D94F34]"><Heart size={22}/></span><h3 className="mt-4 text-lg font-bold text-[#20242B]">Built with purpose</h3><p className="mt-2 text-sm leading-7 text-[#707780]">PhotoSize began as an independent project to make common digital tasks feel more organised, approachable and less scattered across the web.</p></article>
              </div>
            </section>

            <section className="rounded-[28px] border border-[#E8E2DA] bg-white px-6 py-9 sm:px-10 sm:py-12">
              <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
                <div><p className="text-xs font-bold uppercase tracking-widest text-[#B83D26]">The story</p><h2 className="mt-2 text-3xl font-bold leading-tight tracking-[-.04em] text-[#20242B] sm:text-4xl">Made to make everyday work feel easier.</h2></div>
                <div className="space-y-4 text-sm leading-7 text-[#666D76]"><p>Too many everyday tasks require opening a different website, learning a new interface or navigating unnecessary steps. PhotoSize brings those small but frequent jobs into one consistent place.</p><p>We keep improving the experience, refining existing tools and adding practical guides based on what people need. The goal is not to add features for the sake of a longer list—it is to make the tools genuinely useful.</p></div>
              </div>
            </section>

            <section className="py-14 sm:py-16">
              <div className="overflow-hidden rounded-[28px] bg-[#20242B] px-6 py-8 text-white sm:px-10 sm:py-10">
                <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center">
                  <div><p className="text-xs font-bold uppercase tracking-widest text-[#FF9A83]">The creator</p><h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">An independent project, built with care.</h2><p className="mt-4 max-w-2xl text-sm leading-7 text-[#D4D6D9]">PhotoSize was created by <strong className="text-white">Shivam Kumar</strong>, with a focus on clean design, intuitive user experiences and practical technical solutions. The project continues to evolve through iteration and user feedback.</p></div>
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/15 bg-white/10 text-3xl font-black text-[#FF9A83] sm:h-24 sm:w-24">SK</div>
                </div>
              </div>
              <div className="mt-5 flex flex-col items-start justify-between gap-4 rounded-[24px] border border-[#E8E2DA] bg-[#FAF8F5] p-6 sm:flex-row sm:items-center"><div><h3 className="text-lg font-bold text-[#20242B]">Have an idea or feedback?</h3><p className="mt-1 text-sm text-[#666D76]">Tell us what would make PhotoSize more useful.</p></div><button onClick={() => navigateTo('contact')} className="inline-flex items-center gap-2 rounded-xl bg-[#C7432A] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#B83D26]">Contact us <ArrowRight size={16}/></button></div>
            </section>
          </main>
        );
      case 'contact':
        return (
          <main className="mx-auto max-w-7xl px-5 py-8 text-[#20242B] sm:px-8 sm:py-12">
            <section className="relative isolate overflow-hidden rounded-[30px] border border-[#E8E2DA] bg-[#FAF8F5] px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
              <div className="pointer-events-none absolute -right-20 -top-24 -z-10 h-80 w-80 rounded-full bg-[#FF684A]/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-28 left-1/3 -z-10 h-72 w-72 rounded-full bg-[#FF684A]/[0.07] blur-3xl" />
              <div className="max-w-3xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#E8E2DA] bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-[#5B626B]"><Mail size={14} className="text-[#FF684A]"/> Contact PhotoSize</span>
                <h1 className="mt-6 text-4xl font-bold leading-[1.04] tracking-[-.05em] text-[#20242B] sm:text-5xl lg:text-6xl">Let’s make your <span className="text-[#E65C40]">experience better.</span></h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-[#666D76] sm:text-lg">Have a question, found a bug, or want to suggest a useful tool? We’d like to hear from you. Choose the contact option below and tell us how we can help.</p>
              </div>
            </section>

            <section className="grid gap-5 py-10 md:grid-cols-[1.15fr_.85fr] sm:py-12">
              <article className="rounded-[26px] border border-[#E8E2DA] bg-white p-6 shadow-sm sm:p-8">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF0EB] text-[#D94F34]"><Mail size={24}/></span>
                <p className="mt-6 text-xs font-bold uppercase tracking-widest text-[#D94F34]">Email support</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#20242B]">We’re just an email away.</h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-[#707780]">For general questions, technical support, feedback or new tool suggestions, send us a message. Please include enough detail so we can understand and respond to your request.</p>
                <a href="mailto:b605649@gmail.com" className="mt-6 inline-flex max-w-full items-center gap-2 break-all rounded-xl bg-[#FF684A] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#E95B3F]">b605649@gmail.com <ArrowRight size={16}/></a>
              </article>

              <article className="rounded-[26px] border border-[#E8E2DA] bg-[#FAF8F5] p-6 sm:p-8">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#D94F34]"><Info size={24}/></span>
                <p className="mt-6 text-xs font-bold uppercase tracking-widest text-[#D94F34]">What to expect</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#20242B]">Response time</h2>
                <p className="mt-3 text-sm leading-7 text-[#707780]">PhotoSize operates on India Standard Time (IST). We typically respond to inquiries within 24–48 hours.</p>
                <div className="mt-5 rounded-2xl border border-[#E8E2DA] bg-white p-4"><p className="text-xs font-bold uppercase tracking-wide text-[#858A91]">Helpful tip</p><p className="mt-1 text-sm leading-6 text-[#666D76]">Reporting a bug? Mention the tool name, what you were trying to do and what happened.</p></div>
              </article>
            </section>

            <section className="rounded-[26px] bg-[#20242B] px-6 py-8 text-white sm:px-9 sm:py-10">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div><p className="text-xs font-bold uppercase tracking-widest text-[#FF9A83]">Your feedback matters</p><h2 className="mt-2 text-2xl font-bold tracking-tight">Help us make PhotoSize more useful.</h2><p className="mt-2 max-w-2xl text-sm leading-7 text-[#D4D6D9]">Every thoughtful suggestion helps us improve the tools and experience.</p></div>
                <a href="mailto:b605649@gmail.com" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#FF684A] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#E95B3F]">Send feedback <ArrowRight size={16}/></a>
              </div>
            </section>
          </main>
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
                <div className="w-24 h-24 md:w-40 md:h-40 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl rotate-12">
                  <Zap size={64} fill="currentColor" />
                </div>
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
                  <button onClick={() => navigateTo('home')} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100">Home Hub</button>
                  <button onClick={() => navigateTo('blog')} className="px-6 py-3 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-sm">Visit Blog</button>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  const renderHome = () => {
    return (
      <div className="space-y-12 pb-12">
        <section className="ps-hero overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <img
            src="/photosize-brand-hero.svg"
            alt="PhotoSize — Photo and PDF tools made simple, with image utilities, PDF tools, and an easy workflow"
            width="720"
            height="405"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className="block h-auto w-full"
          />
          <div className="flex flex-col justify-center gap-3 bg-white px-5 py-5 sm:flex-row">
            <button onClick={() => navigateToTools('All Tools')} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700">
              Explore all tools <ArrowRight size={17} />
            </button>
            <button onClick={() => navigateToTools('Image')} className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50">
              Browse image tools
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {HOME_SECTION_CARDS.map((item) => (
            <button key={item.category} onClick={() => navigateToTools(item.category)} className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">
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
                <button key={tool.id} type="button" onClick={() => { navigateToTool(tool); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="group flex min-h-44 w-full items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-200 hover:shadow-xl hover:shadow-slate-900/5 focus:outline-none focus:ring-4 focus:ring-blue-100">
                  <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", tool.category === 'PDF' ? "bg-rose-50 text-rose-600" : tool.category === 'Image' ? "bg-blue-50 text-blue-600" : "bg-violet-50 text-violet-600")}><tool.icon size={23} /></span>
                  <span className="min-w-0 flex-1"><span className="block text-base font-bold tracking-tight text-slate-900 transition group-hover:text-blue-700">{tool.name}</span><span className="mt-2 block text-sm leading-6 text-slate-500">{tool.description}</span><span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600">Open tool <ArrowRight size={14} className="transition group-hover:translate-x-1" /></span></span>
                </button>
              ))}
            </div>
          ) : <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center"><Search size={25} className="mx-auto text-slate-400" /><p className="mt-3 font-semibold text-slate-800">No matching tools</p><p className="mt-1 text-sm text-slate-500">Try a different search or category.</p></div>}
        </section>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <img
            src="/photosize-how-it-works.svg"
            alt="PhotoSize workflow: choose a tool, add your content, and get your result"
            width="1600"
            height="864"
            loading="lazy"
            decoding="async"
            className="block h-auto w-full"
          />
        </section>
      </div>
    );
  };

  return (
    <div className={`min-h-screen bg-[#F8F9FF] dark:bg-slate-950 text-[#1A1A3A] dark:text-slate-100 font-sans selection:bg-indigo-100 selection:text-indigo-700 ${currentPage !== 'home' || activeTool ? 'ps-editorial-theme' : ''}`}>
      <StructuredData />
      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigateTo('home')}>
              <img
                src="/photosize-brand-icon.svg"
                alt="PhotoSize"
                width="48"
                height="48"
                className="h-12 w-12 shrink-0 rounded-2xl shadow-sm ring-1 ring-[#E8E2DA]"
              />
              <span className="text-2xl font-black tracking-tight text-[#20242B] dark:text-white">PhotoSize</span>
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
                    const query = e.target.value;
                    if (currentPage !== 'home' || activeTool) {
                      navigateTo('home');
                      setSearchQuery(query);
                    } else {
                      setSearchQuery(query);
                    }
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
              type="button"
              className="md:hidden p-2 text-slate-600"
              aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      <div className="ps-mega-bar sticky top-20 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-1 px-4 py-2 sm:px-6 lg:px-8">
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
          <button type="button" onClick={() => navigateToTools('All Tools')} className="ml-auto shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50">View all tools <ArrowRight size={14} className="ml-1 inline" /></button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
          <div id="mobile-navigation" className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-6 space-y-4 shadow-xl fixed top-20 left-0 right-0 z-40">
            <div className="flex flex-col gap-2">
              <button onClick={() => navigateTo('home')} className="p-4 text-left font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl">Home</button>
              <button onClick={() => navigateTo('blog')} className="p-4 text-left font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl">Blog</button>
              <button onClick={() => navigateTo('about')} className="p-4 text-left font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl">About</button>
              <button onClick={() => navigateTo('contact')} className="p-4 text-left font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl">Contact</button>
              <button onClick={() => navigateToTools('All Tools')} className="p-4 text-left font-bold text-blue-700 hover:bg-blue-50 rounded-xl">All Tools</button>
              {CATEGORIES.map(category => <button key={category} onClick={() => navigateToTools(category)} className="p-4 text-left font-semibold text-slate-600 hover:bg-slate-50 rounded-xl">{category} Tools</button>)}
            </div>
          </div>
        )}

      <main className="min-h-[calc(100svh-8rem)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {renderPage()}
      </main>

      {/* Footer */}
      <AdUnit slot={import.meta.env.VITE_ADSENSE_SLOT_FOOTER || ""} className="max-w-7xl mx-auto px-4" />
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <div className="flex items-center gap-2">
                <img
                  src="/photosize-brand-icon.svg"
                  alt=""
                  aria-hidden="true"
                  width="32"
                  height="32"
                  style={{ width: 32, height: 32 }}
                  className="h-8 w-8 shrink-0 rounded-lg ring-1 ring-[#E8E2DA]"
                />
                <span className="text-lg font-bold tracking-tight text-[#20242B] dark:text-white">PhotoSize</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                PhotoSize brings simple online image utilities together in one focused, easy-to-use workspace.
              </p>
              <p className="text-[10px] text-slate-600 leading-relaxed max-w-xs">
                Disclaimer: Tools are provided as is. Processing behavior can vary by tool; review the relevant tool details before using sensitive files or information.
              </p>

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
                <li><a href="/tool/pdf-metadata" onClick={(e) => { e.preventDefault(); navigateToTool(TOOLS.find(t => t.id === 'pdf-metadata')!); }} className="hover:text-indigo-600 transition-colors">PDF Metadata</a></li>
                <li><a href="/tool/json-formatter" onClick={(e) => { e.preventDefault(); navigateToTool(TOOLS.find(t => t.id === 'json-formatter')!); }} className="hover:text-indigo-600 transition-colors">JSON Formatter</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-6">Legal & Resources</h4>
              <ul className="space-y-4 text-slate-500">
                <li><a href="/privacy" onClick={(e) => { e.preventDefault(); navigateTo('privacy'); }} className="hover:text-indigo-600 transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" onClick={(e) => { e.preventDefault(); navigateTo('terms'); }} className="hover:text-indigo-600 transition-colors">Terms of Service</a></li>
                <li><a href="/disclaimer" onClick={(e) => { e.preventDefault(); navigateTo('disclaimer'); }} className="hover:text-indigo-600 transition-colors">Disclaimer</a></li>
                <li><button type="button" onClick={() => setShowCookieConsent(true)} className="text-left hover:text-indigo-600 transition-colors">Cookie Settings</button></li>
                <li><a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 transition-colors">XML Sitemap</a></li>
                <li><a href="https://developer.mozilla.org/" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors">Web Documentation</a></li>
                <li><a href="https://www.w3.org/" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors">W3C Standards</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              © 2026 PhotoSize. All rights reserved.
            </p>
            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300 text-sm">
              Made with <Heart size={14} className="text-rose-500 fill-rose-500" /> for the community.
            </div>
          </div>
        </div>
      </footer>

      {/* Cookie Consent */}
      {showCookieConsent && (
          <div className="fixed bottom-8 left-8 right-8 md:left-auto md:right-8 md:max-w-md bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl rounded-3xl p-6 z-[60] space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                <Shield size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white">Cookie Policy</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Essential site storage keeps the website working. Optional analytics and advertising scripts are enabled only if you choose to accept them.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={rejectCookies}
                className="flex-1 py-3 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-all font-sans"
              >
                Reject Optional
              </button>
              <button
                onClick={acceptCookies}
                className="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 dark:shadow-none hover:bg-indigo-500 transition-all font-sans"
              >
                Accept All
              </button>
            </div>
            <button onClick={() => navigateTo('privacy')} className="text-xs font-semibold text-indigo-600 hover:underline">
              Read Privacy Policy
            </button>
          </div>
        )}
    </div>
  );
}
