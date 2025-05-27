import { useEffect, useState } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  queryParam?: string;
  className?: string;
}

export const Tabs = ({ tabs, defaultTab, queryParam = 'tab', className = '' }: TabsProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '');

  // Sync with URL query parameter
  useEffect(() => {
    const tabFromUrl = searchParams.get(queryParam);
    if (tabFromUrl && tabs.some(tab => tab.id === tabFromUrl)) {
      setActiveTab(tabFromUrl);
    } else if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [location.search, queryParam, tabs, defaultTab, searchParams]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set(queryParam, tabId);
    setSearchParams(newSearchParams);
  };

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Tab Buttons */}
      <div
        role="tablist"
        aria-orientation="horizontal"
        className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground mb-4"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`${tab.id}-content`}
            data-state={activeTab === tab.id ? 'active' : 'inactive'}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
              activeTab === tab.id
                ? 'bg-background text-foreground shadow-sm font-semibold border-b-2 border-primary'
                : 'hover:text-foreground/80'
            }`}
            onClick={() => handleTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            role="tabpanel"
            aria-labelledby={`${tab.id}-tab`}
            id={`${tab.id}-content`}
            className={`rounded-lg border bg-card text-card-foreground shadow-sm p-6 ${
              activeTab === tab.id ? 'block' : 'hidden'
            }`}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};