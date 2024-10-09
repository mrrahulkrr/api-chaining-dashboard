import React from 'react';

function DataFlowVisualizer({ chain, results }) {
  return (
    <div className="mt-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Data Flow Visualization</h2>
      <div className="space-y-6">
        {chain.map((api, index) => (
          <div key={index} className="relative">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">{api.name}</h3>
              </div>
              <div className="px-4 py-3 space-y-2">
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="font-medium text-gray-600">Method:</div>
                  <div className="col-span-2 text-gray-800">{api.method}</div>
                  <div className="font-medium text-gray-600">URL:</div>
                  <div className="col-span-2 text-gray-800 break-all">{api.url}</div>
                  {api.paramName && (
                    <>
                      <div className="font-medium text-gray-600">Parameter:</div>
                      <div className="col-span-2 text-gray-800">
                        {api.paramName} ← {api.paramValue}
                        {index > 0 && <span className="text-gray-500 ml-1">(from previous response)</span>}
                      </div>
                    </>
                  )}
                  {api.transformation && (
                    <>
                      <div className="font-medium text-gray-600">Transformation:</div>
                      <div className="col-span-2 text-blue-600">Applied</div>
                    </>
                  )}
                </div>
              </div>
            </div>
            {index < chain.length - 1 && (
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-4 w-0.5 h-8 bg-gray-300"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DataFlowVisualizer;