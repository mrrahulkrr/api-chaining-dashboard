// src/App.js
import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import APISelector from './components/APISelector';
import APIChain from './components/APIChain';
import ResultDisplay from './components/ResultDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';
import DataTransformationModal from './components/DataTransformatrionModel';
import SaveLoadChain from './components/SaveLoadChain';
import DataFlowVisualizer from './components/DataFlowVisualizer';

function App() {
  const [apiChain, setApiChain] = useState([]);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showTransformModal, setShowTransformModal] = useState(false);
  const [currentApiIndex, setCurrentApiIndex] = useState(null);

  useEffect(() => {
    const savedChain = localStorage.getItem('apiChain');
    if (savedChain) {
      setApiChain(JSON.parse(savedChain));
    }
  }, []);

  const addApiToChain = (api) => {
    const newChain = [...apiChain, api];
    setApiChain(newChain);
    localStorage.setItem('apiChain', JSON.stringify(newChain));
  };

  const removeApiFromChain = (index) => {
    const newChain = apiChain.filter((_, i) => i !== index);
    setApiChain(newChain);
    localStorage.setItem('apiChain', JSON.stringify(newChain));
  };

  const moveApi = (dragIndex, hoverIndex) => {
    const newChain = [...apiChain];
    const [reorderedItem] = newChain.splice(dragIndex, 1);
    newChain.splice(hoverIndex, 0, reorderedItem);
    setApiChain(newChain);
    localStorage.setItem('apiChain', JSON.stringify(newChain));
  };

  const openTransformModal = (index) => {
    setCurrentApiIndex(index);
    setShowTransformModal(true);
  };

  const saveTransformation = (transformation) => {
    const newChain = [...apiChain];
    newChain[currentApiIndex].transformation = transformation;
    setApiChain(newChain);
    localStorage.setItem('apiChain', JSON.stringify(newChain));
    setShowTransformModal(false);
  };

  const executeChain = async () => {
    setIsLoading(true);
    setError(null);
    let chainResults = [];
    let previousResult = null;

    for (const api of apiChain) {
      try {
        let response;
        let transformedData = previousResult;

        if (api.transformation) {
          transformedData = executeTransformation(previousResult, api.transformation);
        }

        if (api.method === 'GET') {
          const url = transformedData 
            ? `${api.url}?${api.paramName}=${transformedData[api.paramValue]}`
            : api.url;
          response = await fetch(url);
        } else if (api.method === 'POST') {
          const body = transformedData
            ? { ...api.body, [api.paramName]: transformedData[api.paramValue] }
            : api.body;
          response = await fetch(api.url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          });
        }
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        chainResults.push(data);
        previousResult = data;
      } catch (error) {
        console.error('Error executing API chain:', error);
        setError(`Error in API ${api.name}: ${error.message}`);
        chainResults.push({ error: error.message });
        break;
      }
    }

    setResults(chainResults);
    setIsLoading(false);
  };

  const executeTransformation = (data, transformation) => {
    // This is a simple implementation. In a real-world scenario, you'd want to use a more
    // robust solution like a JavaScript sandbox to safely execute user-defined transformations.
    const transformFunc = new Function('data', `return ${transformation}`);
    try {
      return transformFunc(data);
    } catch (error) {
      console.error('Error in data transformation:', error);
      return data;
    }
  };

  return (
    <ErrorBoundary>
      <DndProvider backend={HTML5Backend}>
        <div className="min-h-screen bg-gray-100">
         <nav className="bg-white shadow-sm">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="flex justify-between h-16">
               <div className="flex">
                 <div className="flex-shrink-0 flex items-center">
                    <h1 className="text-2xl font-bold text-gray-900">API Chaining Dashboard</h1>
                 </div>
               </div>
             </div>
           </div>
         </nav>
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">API Selection</h2>
                    <APISelector onSelectAPI={addApiToChain} />
                  </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Chain Management</h2>
                    <SaveLoadChain chain={apiChain} setChain={setApiChain} />
                    <button
                      className="mt-4 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={executeChain}
                      disabled={apiChain.length === 0 || isLoading}
                    >
                      {isLoading ? 'Executing...' : 'Execute Chain'}
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-6 bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">API Chain</h2>
                  <APIChain 
                    chain={apiChain} 
                    onRemove={removeApiFromChain} 
                    onMove={moveApi}
                    onTransform={openTransformModal}
                  />
                </div>
              </div>
              {isLoading && <LoadingSpinner />}
              {error && <div className="mt-6 bg-red-50 border-l-4 border-red-400 p-4 text-red-700">{error}</div>}
              <DataFlowVisualizer chain={apiChain} results={results} />
              <ResultDisplay results={results} />
            </div>
          </main>
          {showTransformModal && (
            <DataTransformationModal
              onSave={saveTransformation}
              onClose={() => setShowTransformModal(false)}
              currentTransformation={apiChain[currentApiIndex]?.transformation || ''}
            />
          )}
        </div>
      </DndProvider>
    </ErrorBoundary>
  );
}

export default App;