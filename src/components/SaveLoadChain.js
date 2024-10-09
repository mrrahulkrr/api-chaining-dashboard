import React, { useState } from 'react';
import ConfirmationDialog from './ConfirmationDialog';

function SaveLoadChain({ chain, setChain }) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [pendingAction, setPendingAction] = useState(null);

  const saveChain = () => {
    const chainName = prompt("Enter a name for this chain:");
    if (chainName) {
      const savedChains = JSON.parse(localStorage.getItem('savedChains') || '{}');
      savedChains[chainName] = chain;
      localStorage.setItem('savedChains', JSON.stringify(savedChains));
      alert(`Chain "${chainName}" saved successfully!`);
    }
  };

  const loadChain = () => {
    const savedChains = JSON.parse(localStorage.getItem('savedChains') || '{}');
    const chainNames = Object.keys(savedChains);
    if (chainNames.length === 0) {
      alert("No saved chains found.");
      return;
    }
    const selectedChain = prompt(`Enter the name of the chain to load:\n${chainNames.join(", ")}`);
    if (selectedChain && savedChains[selectedChain]) {
      setConfirmationMessage("This will replace your current chain. Are you sure you want to continue?");
      setPendingAction(() => () => {
        setChain(savedChains[selectedChain]);
        localStorage.setItem('apiChain', JSON.stringify(savedChains[selectedChain]));
        alert(`Chain "${selectedChain}" loaded successfully!`);
      });
      setShowConfirmation(true);
    } else if (selectedChain) {
      alert(`Chain "${selectedChain}" not found.`);
    }
  };

  const exportChain = () => {
    const dataStr = JSON.stringify({ version: "1.0", chain });
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'api_chain.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importChain = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const importedData = JSON.parse(e.target.result);
          if (importedData.version !== "1.0" || !Array.isArray(importedData.chain)) {
            throw new Error("Invalid chain structure");
          }
          setConfirmationMessage("This will replace your current chain. Are you sure you want to continue?");
          setPendingAction(() => () => {
            setChain(importedData.chain);
            localStorage.setItem('apiChain', JSON.stringify(importedData.chain));
            alert('Chain imported successfully!');
          });
          setShowConfirmation(true);
        } catch (error) {
          alert('Error importing chain. Please make sure it\'s a valid JSON file with the correct structure.');
        }
      };
      reader.readAsText(file);
    }
  };

  const mergeChain = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const importedData = JSON.parse(e.target.result);
          if (importedData.version !== "1.0" || !Array.isArray(importedData.chain)) {
            throw new Error("Invalid chain structure");
          }
          const mergedChain = [...chain, ...importedData.chain];
          setChain(mergedChain);
          localStorage.setItem('apiChain', JSON.stringify(mergedChain));
          alert('Chain merged successfully!');
        } catch (error) {
          alert('Error merging chain. Please make sure it\'s a valid JSON file with the correct structure.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleConfirm = () => {
    if (pendingAction) {
      pendingAction();
    }
    setShowConfirmation(false);
    setPendingAction(null);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setPendingAction(null);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Chain Management</h2>
      <div className="flex flex-wrap gap-4">
        <Button onClick={saveChain} className="bg-green-500 hover:bg-green-600">
          Save Chain
        </Button>
        <Button onClick={loadChain} className="bg-yellow-500 hover:bg-yellow-600">
          Load Chain
        </Button>
        <Button onClick={exportChain} className="bg-blue-500 hover:bg-blue-600">
          Export Chain
        </Button>
        <FileButton onChange={importChain} className="bg-purple-500 hover:bg-purple-600">
          Import Chain
        </FileButton>
        <FileButton onChange={mergeChain} className="bg-indigo-500 hover:bg-indigo-600">
          Merge Chain
        </FileButton>
      </div>
      <ConfirmationDialog
        isOpen={showConfirmation}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        message={confirmationMessage}
      />
    </div>
  );
}

const Button = ({ children, className, ...props }) => (
  <button
    className={`text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out ${className}`}
    {...props}
  >
    {children}
  </button>
);

const FileButton = ({ children, className, ...props }) => (
  <label className={`text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out cursor-pointer ${className}`}>
    {children}
    <input
      type="file"
      accept=".json"
      className="hidden"
      {...props}
    />
  </label>
);

export default SaveLoadChain;