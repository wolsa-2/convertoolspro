import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  items: FAQItem[];
}

const FAQSection: React.FC<FAQSectionProps> = ({ items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#1A1A3A] mb-6">Frequently Asked Questions</h2>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div 
            key={index}
            className="group bg-white rounded-2xl border border-slate-100 overflow-hidden transition-all hover:border-indigo-200 hover:shadow-sm"
          >
            <button
              type="button"
              id={`faq-trigger-${index}`}
              aria-expanded={openIndex === index}
              aria-controls={`faq-panel-${index}`}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-5 flex items-center justify-between text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500"
            >
              <span className="font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">
                {item.question}
              </span>
              <span aria-hidden="true" className={`p-2 rounded-xl transition-all ${openIndex === index ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400'}`}>
                {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </span>
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  id={`faq-panel-${index}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${index}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <div className="px-6 pb-6 text-slate-500 leading-relaxed font-medium pt-0">
                    <div className="w-full h-px bg-slate-50 mb-4" />
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQSection;
