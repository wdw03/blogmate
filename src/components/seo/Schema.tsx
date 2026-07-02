import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SchemaProps {
  data?: Record<string, unknown> | Array<Record<string, unknown>>;
}

const Schema: React.FC<SchemaProps> = ({ data }) => {
  if (!data) return null;
  const graph = Array.isArray(data) ? data : [data];
  return (
    <Helmet>
      {graph.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema).replace(/</g, '\\u003c')}
        </script>
      ))}
    </Helmet>
  );
};

export default Schema;

