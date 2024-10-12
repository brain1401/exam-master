import type { ReactNode } from "react";

type AnnouncementSectionProps = {
  icon: ReactNode;
  title: string;
  content: string;
  className?: string;
};

export default function AnnouncementSection({
  icon,
  title,
  content,
  className = "",
}: AnnouncementSectionProps) {
  return (
    <div className={`${className}`}>
      <div className="flex items-center space-x-2 mb-2">
        <div className="flex-shrink-0">{icon}</div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
      </div>
      <p className="whitespace-pre-line text-gray-600 dark:text-gray-300 pl-8">
        {content}
      </p>
    </div>
  );
}
