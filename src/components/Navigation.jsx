import React, { useState, useEffect, useRef } from 'react';
import { MAIN_TABS, SECONDARY_TABS } from '../constants';

const Navigation = ({ tab, setTab, showAddForm, setShowAddForm }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleTabClick = (tabId) => {
    if (tabId === 'more') {
      setShowDropdown(!showDropdown);
    } else {
      setTab(tabId);
      setShowDropdown(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Main Navigation - Minimalist */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-3 sm:px-6">
          <div className="flex items-center justify-center py-3 sm:py-4">
            {/* Navigation Items with Add Button in Center */}
            <div className="flex items-center justify-center w-full max-w-md">
              {/* Left Tabs */}
              <div className="flex items-center gap-1">
                {MAIN_TABS.slice(0, 2).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`flex flex-col items-center gap-1 px-2 sm:px-3 py-2 rounded-2xl transition-all duration-200 ${
                      tab === item.id
                        ? "text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                  >
                    <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
                      <span className="text-sm sm:text-lg">{item.icon}</span>
                    </div>
                    <span className={`text-xs font-medium transition-colors duration-200 ${
                      tab === item.id ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"
                    }`}>
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Add Button - Center */}
              <button
                onClick={() => setShowAddForm(true)}
                className="mx-2 sm:mx-4 w-14 h-14 sm:w-16 sm:h-16 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
              >
                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>

              {/* Right Tabs */}
              <div className="flex items-center gap-1">
                {MAIN_TABS.slice(2).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`flex flex-col items-center gap-1 px-2 sm:px-3 py-2 rounded-2xl transition-all duration-200 ${
                      tab === item.id
                        ? "text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                  >
                    <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
                      <span className="text-sm sm:text-lg">{item.icon}</span>
                    </div>
                    <span className={`text-xs font-medium transition-colors duration-200 ${
                      tab === item.id ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"
                    }`}>
                      {item.label}
                    </span>
                  </button>
                ))}
                
                {/* More Button */}
                <button
                  onClick={() => handleTabClick('more')}
                  className={`flex flex-col items-center gap-1 px-2 sm:px-3 py-2 rounded-2xl transition-all duration-200 ${
                    showDropdown
                      ? "text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
                    <span className="text-sm sm:text-lg">⋯</span>
                  </div>
                  <span className={`text-xs font-medium transition-colors duration-200 ${
                    showDropdown ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"
                  }`}>
                    Thêm
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div 
          ref={dropdownRef}
          className="fixed bottom-20 right-4 z-40 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 min-w-[200px]"
        >
          {SECONDARY_TABS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                tab === item.id ? 'bg-gray-100 dark:bg-gray-700' : ''
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className={`text-sm font-medium ${
                tab === item.id 
                  ? 'text-gray-900 dark:text-gray-100' 
                  : 'text-gray-700 dark:text-gray-300'
              }`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      )}

    </>
  );
};

export default Navigation;