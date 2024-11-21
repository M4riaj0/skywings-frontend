import { useState } from "react";
import axios from "axios";

interface UploadFilesProps {
  onUpload?: (url: string) => void;
}

const UploadFiles: React.FC<UploadFilesProps> = ({ onUpload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("upload_preset", "n2r9qvxu");

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dmmnud7ix/upload`,
        formData
      );
      const uploadedUrl = response.data.secure_url;

      if (onUpload) {
        onUpload(uploadedUrl);
      }
    } catch (error) {
      console.error("Error uploading the file", error);
    }
  };

  return (
    <div className="flex items-center justify-between w-full space-x-2 mt-4">
      <input
        type="file"
        onChange={handleFileChange}
        className="p-2 border border-gray-300 rounded w-full max-w-full"
        accept=".jpg,.jpeg,.png"
        data-max-size="5242880" // 5MB in bytes
      />
      <button
        type="button"
        onClick={handleUpload}
        className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 whitespace-nowrap"
      >
        Añadir
      </button>
    </div>
  );
};

export default UploadFiles;
