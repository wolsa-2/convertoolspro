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
  { id: 'pdf-to-word', name: 'PDF to Word', description: 'Convert PDF documents to editable Microsoft Word files.', category: 'PDF', icon: FileDown },
  { id: 'pdf-to-excel', name: 'PDF to Excel', description: 'Convert PDF tables into Excel spreadsheets.', category: 'PDF', icon: FileDown },
  { id: 'pdf-to-ppt', name: 'PDF to PPT', description: 'Convert PDF presentations to PowerPoint slides.', category: 'PDF', icon: FileDown },
  { id: 'pdf-to-jpg', name: 'PDF to JPG', description: 'Extract images or convert pages to JPG format.', category: 'PDF', icon: ImageIcon },
  { id: 'pdf-to-text', name: 'PDF to Text', description: 'Extract text from PDF documents.', category: 'PDF', icon: FileText },
  
  { id: 'word-to-pdf', name: 'Word to PDF', description: 'Convert Microsoft Word documents to PDF.', category: 'PDF', icon: FileUp },
  { id: 'excel-to-pdf', name: 'Excel to PDF', description: 'Convert Excel spreadsheets to PDF.', category: 'PDF', icon: FileUp },
  { id: 'ppt-to-pdf', name: 'PPT to PDF', description: 'Convert PowerPoint presentations to PDF.', category: 'PDF', icon: FileUp },
  { id: 'jpg-to-pdf', name: 'JPG to PDF', description: 'Convert multiple images into a single PDF.', category: 'PDF', icon: FileUp },

  { id: 'edit-pdf', name: 'Edit PDF', description: 'Add text, shapes, and signatures to your PDF.', category: 'PDF', icon: FileEdit },
  { id: 'merge-pdf', name: 'Merge PDF', description: 'Combine multiple PDF files into one document.', category: 'PDF', icon: Layers },
  { id: 'split-pdf', name: 'Split PDF', description: 'Separate one PDF file into multiple documents.', category: 'PDF', icon: Scissors },
  { id: 'compress-pdf', name: 'Compress PDF', description: 'Reduce the file size of your PDF document.', category: 'PDF', icon: FileArchive },
  { id: 'rotate-pdf', name: 'Rotate PDF', description: 'Rotate one or all pages in your PDF.', category: 'PDF', icon: RotateCw },
  { id: 'unlock-pdf', name: 'Unlock PDF', description: 'Remove password protection from your PDF.', category: 'PDF', icon: Unlock },
  { id: 'protect-pdf', name: 'Protect PDF', description: 'Add a password and encrypt your PDF file.', category: 'PDF', icon: Lock },
  { id: 'watermark-pdf', name: 'Watermark PDF', description: 'Add image or text watermark to your PDF.', category: 'PDF', icon: ImageIcon },
  { id: 'pdf-metadata', name: 'PDF Metadata', description: 'View and edit PDF metadata online.', category: 'PDF', icon: Settings },
  
  // Social Media Tools
  { id: 'tweet-generator', name: 'Tweet Generator', description: 'Generate realistic fake tweets for memes.', category: 'Social Media', icon: Share2 },
  
  // Text & Lists Tools
  { id: 'character-counter', name: 'Character Counter', description: 'Count characters, words, and lines in your text.', category: 'Text & Lists', icon: Type },
  { id: 'case-converter', name: 'Case Converter', description: 'Convert text to uppercase, lowercase, camelCase, etc.', category: 'Text & Lists', icon: CaseSensitive },
  { id: 'password-generator', name: 'Password Generator', description: 'Generate secure and random passwords.', category: 'Text & Lists', icon: Key },
  { id: 'bionic-reading', name: 'Bionic Reading', description: 'Convert text to bionic reading format for faster reading.', category: 'Text & Lists', icon: Zap },
  
  // Encryption Tools
  { id: 'base64-codec', name: 'Base64 Encode/Decode', description: 'Encode or decode text to/from Base64.', category: 'Encryption', icon: Lock },
  { id: 'hash-generator', name: 'Hash Generator', description: 'Generate MD5, SHA-1, SHA-256 hashes.', category: 'Encryption', icon: Hash },
  
  // Web Tools
  { id: 'json-formatter', name: 'JSON Formatter', description: 'Beautify or minify JSON data.', category: 'Web', icon: FileJson },
  { id: 'html-entities', name: 'HTML Entities', description: 'Encode or decode HTML entities.', category: 'Web', icon: Code },
  
  // Others
  { id: 'qr-generator', name: 'QR Code Generator', description: 'Create custom QR codes for links or text.', category: 'Others', icon: QrCode },
  { id: 'webcam-test', name: 'Webcam Test', description: 'Test your webcam and microphone.', category: 'Others', icon: Camera },
];

export const CATEGORIES: Category[] = [
  'Image', 'PDF', 'Social Media', 'Text & Lists', 'Encryption', 'Web', 'Others'
];
