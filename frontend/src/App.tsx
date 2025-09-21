import React from 'react';
import { FileText } from "lucide-react";
import UploadFile from "./components/UploadFile";
import AskQuestion from "./components/AskQuestion";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Document Q&A
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your documents and chat with AI. Get instant answers with conversation history.
          </p>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <UploadFile />
          </div>
          
          {/* Chat Section */}
          <div className="lg:col-span-2">
            <AskQuestion />
          </div>
        </div>
        
        
      </div>
    </div>
  );
}

export default App;