import React from "react";

interface FolderHeaderProps {
  title: string;
  showBackButton: boolean;
  onBack: () => void;
}

const FolderHeader: React.FC<FolderHeaderProps> = ({
  title,
  showBackButton,
  onBack,
}) => {
  return (
    <div className="flex items-center mb-6">
      {showBackButton && (
        <button
          onClick={onBack}
          className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
          aria-label="Go back"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}
      <h2 className="text-2xl font-semibold">{title}</h2>
    </div>
  );
};

export default FolderHeader;
