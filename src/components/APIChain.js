// src/components/APIChain.js
import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

const DraggableAPI = ({ api, index, onRemove, onMove, onTransform }) => {
  const [, drag] = useDrag({
    type: 'API',
    item: { index },
  });

  const [, drop] = useDrop({
    accept: 'API',
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        onMove(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div ref={(node) => drag(drop(node))} className="flex items-center bg-white p-4 rounded-md shadow mb-2">
      <div className="flex-grow">
        <strong className="text-gray-900">{api.name}</strong> <span className="text-gray-500">({api.method})</span>
        {api.paramName && (
          <span className="ml-2 text-sm text-gray-600">
            Param: {api.paramName} ← {api.paramValue}
          </span>
        )}
        {api.transformation && (
          <span className="ml-2 text-sm text-blue-600">
            (Transformation applied)
          </span>
        )}
      </div>
      <button
        onClick={() => onTransform(index)}
        className="ml-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded text-xs"
      >
        Transform
      </button>
      <button
        onClick={() => onRemove(index)}
        className="ml-2 bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded text-xs"
      >
        Remove
      </button>
    </div>
  );
};

function APIChain({ chain, onRemove, onMove, onTransform }) {
  return (
    <div>
      {chain.length === 0 ? (
        <p className="text-gray-500 italic">No APIs in the chain yet. Add some using the form above.</p>
      ) : (
        <div>
          {chain.map((api, index) => (
            <DraggableAPI
              key={index}
              api={api}
              index={index}
              onRemove={onRemove}
              onMove={onMove}
              onTransform={onTransform}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default APIChain;