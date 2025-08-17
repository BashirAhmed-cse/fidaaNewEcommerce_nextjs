import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-white bg-opacity-50 text-center space-y-3">
      <Loader className="animate-spin text-gray-600" size={40} />
      <p className="text-gray-500 text-sm">Loading...</p>
    </div>
  );
}
