import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const initialToolLoaders: Record<string, () => Promise<unknown>> = {
  'character-counter': () => import('./components/tools/CharacterCounter'),
  'password-generator': () => import('./components/tools/PasswordGenerator'),
  'base64-codec': () => import('./components/tools/Base64Codec'),
  'json-formatter': () => import('./components/tools/JsonFormatter'),
  'qr-generator': () => import('./components/tools/QrGenerator'),
  'case-converter': () => import('./components/tools/CaseConverter'),
  'hash-generator': () => import('./components/tools/HashGenerator'),
  'bionic-reading': () => import('./components/tools/BionicReading'),
  'webcam-test': () => import('./components/tools/WebcamTest'),
  'image-placeholder': () => import('./components/tools/ImagePlaceholder'),
  'image-to-base64': () => import('./components/tools/ImageToBase64'),
  'pdf-metadata': () => import('./components/tools/PdfMetadata'),
  'jpg-to-pdf': () => import('./components/tools/JpgToPdf'),
  'pdf-to-word': () => import('./components/tools/SimplePdfTool'),
  'pdf-to-excel': () => import('./components/tools/SimplePdfTool'),
  'pdf-to-ppt': () => import('./components/tools/SimplePdfTool'),
  'pdf-to-jpg': () => import('./components/tools/SimplePdfTool'),
  'pdf-to-text': () => import('./components/tools/SimplePdfTool'),
  'word-to-pdf': () => import('./components/tools/SimplePdfTool'),
  'excel-to-pdf': () => import('./components/tools/SimplePdfTool'),
  'ppt-to-pdf': () => import('./components/tools/SimplePdfTool'),
  'edit-pdf': () => import('./components/tools/SimplePdfTool'),
  'merge-pdf': () => import('./components/tools/SimplePdfTool'),
  'split-pdf': () => import('./components/tools/SimplePdfTool'),
  'compress-pdf': () => import('./components/tools/SimplePdfTool'),
  'rotate-pdf': () => import('./components/tools/SimplePdfTool'),
  'unlock-pdf': () => import('./components/tools/SimplePdfTool'),
  'protect-pdf': () => import('./components/tools/SimplePdfTool'),
  'watermark-pdf': () => import('./components/tools/SimplePdfTool'),
  'tweet-generator': () => import('./components/tools/TweetGenerator'),
  'html-entities': () => import('./components/tools/HtmlEntities'),
};

async function mountApp() {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
  const initialLoads: Promise<unknown>[] = [];

  if (pathname === '/blog' || pathname.startsWith('/blog/')) {
    initialLoads.push(import('./components/Blog'));
  } else if (pathname.startsWith('/tool/')) {
    let toolId = '';
    try {
      toolId = decodeURIComponent(pathname.slice('/tool/'.length));
    } catch {
      // App handles malformed routes as its normal not-found page.
    }

    const loadTool = initialToolLoaders[toolId];
    if (loadTool) {
      initialLoads.push(import('./components/ToolLayout'), loadTool());
    }
  }

  // Keep prerendered route content in place while the first route chunk loads.
  // This prevents the short Suspense fallback from replacing it during startup.
  try {
    await Promise.all(initialLoads);
  } catch (error) {
    // Still mount the app if preloading fails; React.lazy can retry the route import.
    console.error('Initial route preload failed.', error);
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

void mountApp();
