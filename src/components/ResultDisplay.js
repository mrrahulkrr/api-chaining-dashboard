// src/components/ResultDisplay.js
import React from 'react';

function ResultDisplay({ results }) {
  if (results.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">Results</h2>
      {results.map((result, index) => (
        <div key={index} className="mb-4">
          <h3 className="font-bold">API {index + 1} Response:</h3>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      ))}
    </div>
  );
}

export default ResultDisplay;