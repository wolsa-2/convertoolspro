import {
  Image as ImageIcon,
  Type,
  Lock,
  Hash,
  FileJson,
  Code,
  QrCode,
  CaseSensitive,
  Key,
  Layers,
  RotateCw,
  Settings,
  FileUp,
} from 'lucide-react';

export type Category = 'Image' | 'PDF' | 'Text & Lists' | 'Encryption' | 'Web' | 'Others';

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
  { id: 'image-to-base64', name: 'Image to BASE64', description: 'Convert an image to Base64 format in your browser.', category: 'Image', icon: ImageIcon },

  // PDF tools currently supported by the implementation
  { id: 'jpg-to-pdf', name: 'JPG to PDF', description: 'Convert images into a single PDF.', category: 'PDF', icon: FileUp },
  { id: 'merge-pdf', name: 'Merge PDF', description: 'Combine multiple PDF files into one document.', category: 'PDF', icon: Layers },
  { id: 'rotate-pdf', name: 'Rotate PDF', description: 'Rotate every page in a PDF by 90 degrees.', category: 'PDF', icon: RotateCw },
  { id: 'watermark-pdf', name: 'Watermark PDF', description: 'Add a simple text watermark to each PDF page.', category: 'PDF', icon: ImageIcon },
  { id: 'pdf-metadata', name: 'PDF Metadata Viewer', description: 'View document metadata and page count.', category: 'PDF', icon: Settings },

  // Text & Lists
  { id: 'character-counter', name: 'Character & Word Counter', description: 'Count characters, words, lines, sentences, and characters without spaces.', category: 'Text & Lists', icon: Type },
  { id: 'case-converter', name: 'Case Converter', description: 'Convert text to uppercase, lowercase, camelCase, and more.', category: 'Text & Lists', icon: CaseSensitive },
  { id: 'password-generator', name: 'Secure Password Generator', description: 'Generate passwords using the browser cryptographic random number generator.', category: 'Text & Lists', icon: Key },

  // Encoding & hashing
  { id: 'base64-codec', name: 'Base64 Text Encoder / Decoder', description: 'Encode and decode UTF-8 text, including Hindi and other Unicode languages.', category: 'Encryption', icon: Lock },
  { id: 'hash-generator', name: 'SHA Hash Generator', description: 'Generate SHA-1, SHA-256, and SHA-512 hashes locally.', category: 'Encryption', icon: Hash },

  // Developer tools
  { id: 'json-formatter', name: 'JSON Formatter', description: 'Validate, beautify, and minify JSON.', category: 'Web', icon: FileJson },
  { id: 'html-entities', name: 'HTML Entities', description: 'Encode or decode HTML entities.', category: 'Web', icon: Code },
  { id: 'qr-generator', name: 'QR Code Generator', description: 'Create a QR code from text or a link.', category: 'Others', icon: QrCode },
];

export const CATEGORIES: Category[] = [
  'Image', 'PDF', 'Text & Lists', 'Encryption', 'Web', 'Others'
];
