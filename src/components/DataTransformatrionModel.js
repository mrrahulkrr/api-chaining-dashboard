// src/components/DataTransformationModal.js
import React, { useState } from 'react';

function DataTransformationModal({ onSave, onClose, currentTransformation }) {
  const [transformation, setTransformation] = useState(currentTransformation);

  const handleSave = () => {
    onSave(transformation);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-bold mb-4">Data Transformation</h3>
        <textarea
          className="w-full h-32 p-2 border rounded"
          value={transformation}
          onChange={(e) => setTransformation(e.target.value)}
          placeholder="Enter your transformation code here. Example: data.map(item => item.id)"
        />
        <div className="mt-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
            onClick={handleSave}
          >
            Save
          </button>
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default DataTransformationModal;