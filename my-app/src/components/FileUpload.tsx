import { useState } from "react";

type FileUploadProps = {
  onFileUpload: (data: File) => Promise<void>; // Ensure it returns a Promise
};

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Loader state

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (file) {
      setLoading(true); // Show loader
      try {
        await onFileUpload(file); // Wait for API response
      } finally {
        setLoading(false); // Hide loader after response
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 rounded-xl border-2 border-dashed border-[#3c4753] px-6 py-14 mb-10">
      <p className="text-white text-lg font-bold leading-tight tracking-[-0.015em] max-w-[480px] text-center">
        Drag and drop your resume here
      </p>
      <input
        type="file"
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#293038] text-white text-sm font-bold leading-normal tracking-[0.015em]"
      >
        <span className="truncate">Browse</span>
      </label>

      {file && (
        <button
          onClick={handleUpload}
          className="mt-4 px-6 py-2 bg-blue-600 rounded-xl text-white flex items-center justify-center"
          disabled={loading} // Disable button when loading
        >
          {loading ? (
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
          ) : (
            "Upload"
          )}
        </button>
      )}
    </div>
  );
};

export default FileUpload;
