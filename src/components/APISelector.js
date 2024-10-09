// src/components/APISelector.js
import React, { useState } from 'react';

const APIs = [
  { name: 'Get Users', url: 'https://jsonplaceholder.typicode.com/users', method: 'GET' },
  { name: 'Create Post', url: 'https://jsonplaceholder.typicode.com/posts', method: 'POST' },
  { name: 'Get Comments', url: 'https://jsonplaceholder.typicode.com/comments', method: 'GET' },
];

function APISelector({ onSelectAPI }) {
  const [selectedAPI, setSelectedAPI] = useState(APIs[0]);
  const [postBody, setPostBody] = useState({ title: '', body: '', userId: '' });
  const [paramMapping, setParamMapping] = useState({ paramName: '', paramValue: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const apiConfig = {
      ...selectedAPI,
      body: selectedAPI.method === 'POST' ? postBody : undefined,
      ...paramMapping
    };
    onSelectAPI(apiConfig);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Select API:</label>
        <select
          value={selectedAPI.name}
          onChange={(e) => setSelectedAPI(APIs.find(api => api.name === e.target.value))}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {APIs.map(api => (
            <option key={api.name} value={api.name}>{api.name}</option>
          ))}
        </select>
      </div>
      {selectedAPI.method === 'POST' && (
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Title"
            value={postBody.title}
            onChange={(e) => setPostBody({ ...postBody, title: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <input
            type="text"
            placeholder="Body"
            value={postBody.body}
            onChange={(e) => setPostBody({ ...postBody, body: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <input
            type="number"
            placeholder="User ID"
            value={postBody.userId}
            onChange={(e) => setPostBody({ ...postBody, userId: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      )}
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Parameter Name"
          value={paramMapping.paramName}
          onChange={(e) => setParamMapping({ ...paramMapping, paramName: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <input
          type="text"
          placeholder="Parameter Value (from previous response)"
          value={paramMapping.paramValue}
          onChange={(e) => setParamMapping({ ...paramMapping, paramValue: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <button type="submit" className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Add to Chain
      </button>
    </form>
  );
}

export default APISelector;