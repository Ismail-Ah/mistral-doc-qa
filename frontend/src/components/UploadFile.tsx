import { useState, type ChangeEvent } from "react";
import { Upload, FileText, CheckCircle, AlertCircle, File, X } from "lucide-react";
import { uploadFile } from "../api";

interface UploadedFile {
  id: number;
  name: string;
  size: number;
  uploadedAt: Date;
}

function UploadFile() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<"success" | "error" | "">("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setMessage("");

    try {
      await uploadFile(file);
      setMessage("success");

      // Add to uploaded files list
      const newFile: UploadedFile = {
        id: Date.now(),
        name: file.name,
        size: file.size,
        uploadedAt: new Date(),
      };
      setUploadedFiles((prev) => [...prev, newFile]);
      setFile(null);

      // Clear input
      const fileInput = document.getElementById("file-upload") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (err) {
      console.error(err);
      setMessage("error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;
    if (selectedFile) {
      setFile(selectedFile);
      setMessage("");
    }
  };

  const removeUploadedFile = (fileId: number) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
          <Upload className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Upload Document</h2>
          <p className="text-sm text-gray-500">Upload files to chat about them</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* File Upload Area */}
        <div className="relative">
          <input
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
            accept=".pdf,.doc,.docx,.txt"
          />
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
          >
            <FileText className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-600">
              {file ? file.name : "Click to select a document"}
            </span>
            <span className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX, TXT</span>
          </label>
        </div>

        {/* Upload Button */}
        {file && (
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload Document
              </>
            )}
          </button>
        )}

        {/* Status Message */}
        {message && (
          <div
            className={`flex items-center gap-2 p-4 rounded-xl ${
              message === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="font-medium">
              {message === "success" ? "File uploaded successfully!" : "Upload failed. Please try again."}
            </span>
          </div>
        )}

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700">Uploaded Files</h3>
            {uploadedFiles.map((uploadedFile) => (
              <div key={uploadedFile.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <File className="w-5 h-5 text-blue-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{uploadedFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(uploadedFile.size)} • {uploadedFile.uploadedAt.toLocaleTimeString()}
                  </p>
                </div>
                <button
                  onClick={() => removeUploadedFile(uploadedFile.id)}
                  className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadFile;
