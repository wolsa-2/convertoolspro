import { 
  Image as ImageIcon, 
  FileText, 
  Share2, 
  Type, 
  Lock, 
  Globe, 
  MoreHorizontal,
  Hash,
  ShieldCheck,
  FileJson,
  Code,
  QrCode,
  Camera,
  Scissors,
  FileArchive,
  Zap,
  RefreshCw,
  CaseSensitive,
  Binary,
  Key,
  FileDown,
  FileUp,
  FileEdit,
  Layers,
  FilePlus,
  RotateCw,
  Unlock,
  Settings,
} from 'lucide-react';

export type Category = 'Image' | 'PDF' | 'Social Media' | 'Text & Lists' | 'Encryption' | 'Web' | 'Others';

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: Category;
  icon: any;
  component?: string;
}

export const TOOLS: Tool[] = [
  // Image Tools
  { id: 'image-placeholder', name: 'Image Placeholder', description: 'Generate placeholder images with custom text.', category: 'Image', icon: ImageIcon },
  { id: 'image-to-base64', name: 'Image to BASE64', description: 'Convert an image to Base64 format online.', category: 'Image', icon: ImageIcon },
  
  // PDF Tools
  { id: 'jpg-to-pdf', name: 'JPG to PDF', description: 'Convert multiple images into a single PDF.', category: 'PDF', icon: FileUp },
  { id: 'merge-pdf', name: 'Merge PDF', description: 'Combine multiple PDF files into one document.', category: 'PDF', icon: Layers },
  { id: 'split-pdf', name: 'Split PDF', description: 'Separate one PDF file into multiple documents.', category: 'PDF', icon: Scissors },
  { id: 'rotate-pdf', name: 'Rotate PDF', description: 'Rotate one or all pages in your PDF.', category: 'PDF', icon: RotateCw },
  { id: 'watermark-pdf', name: 'Watermark PDF', description: 'Add a text watermark to your PDF in your browser.', category: 'PDF', icon: ImageIcon },
  { id: 'pdf-metadata', name: 'PDF Metadata', description: 'View PDF metadata, page count, and document details in your browser.', category: 'PDF', icon: Settings },
  
  // Social Media Tools
  { id: 'tweet-generator', name: 'Tweet Generator', description: 'Generate realistic fake tweets for memes.', category: 'Social Media', icon: Share2 },
  
  // Text & Lists Tools
  { id: 'character-counter', name: 'Character Counter', description: 'Count characters, words, and lines in your text.', category: 'Text & Lists', icon: Type },
  { id: 'case-converter', name: 'Case Converter', description: 'Convert text to uppercase, lowercase, camelCase, etc.', category: 'Text & Lists', icon: CaseSensitive },
  { id: 'password-generator', name: 'Password Generator', description: 'Generate secure and random passwords.', category: 'Text & Lists', icon: Key },
  { id: 'bionic-reading', name: 'Bionic Reading', description: 'Convert text to bionic reading format for faster reading.', category: 'Text & Lists', icon: Zap },
  
  // Encryption Tools
  { id: 'base64-codec', name: 'Base64 Encode/Decode', description: 'Encode or decode text to/from Base64.', category: 'Encryption', icon: Lock },
  { id: 'hash-generator', name: 'Hash Generator', description: 'Generate SHA-1, SHA-256, and SHA-512 hashes.', category: 'Encryption', icon: Hash },
  
  // Web Tools
  { id: 'json-formatter', name: 'JSON Formatter', description: 'Beautify or minify JSON data.', category: 'Web', icon: FileJson },
  { id: 'html-entities', name: 'HTML Entities', description: 'Encode or decode HTML entities.', category: 'Web', icon: Code },
  
  // Others
  { id: 'qr-generator', name: 'QR Code Generator', description: 'Create custom QR codes for links or text.', category: 'Others', icon: QrCode },
];

export const CATEGORIES: Category[] = [
  'Image', 'PDF', 'Social Media', 'Text & Lists', 'Encryption', 'Web', 'Others'
];
