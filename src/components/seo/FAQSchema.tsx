import React from 'react';
import Schema from './Schema';

export interface FAQItem { question: string; answer: string }

const FAQSchema: React.FC<{ items: FAQItem[] }> = ({ items }) => (
  <Schema data={{
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  }} />
);

export default FAQSchema;

