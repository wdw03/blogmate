import React from 'react';
import Schema from './Schema';
import { BreadcrumbItem, generateBreadcrumb } from '../../utils/generateBreadcrumb';

const BreadcrumbSchema: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => (
  <Schema data={generateBreadcrumb(items)} />
);

export default BreadcrumbSchema;

