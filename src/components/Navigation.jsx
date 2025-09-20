import React, { useState, useRef, useEffect } from 'react';
import { MAIN_TABS, SECONDARY_TABS } from '../constants';

const Navigation = ({ tab, setTab, showAddForm, setShowAddForm }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTabClick = (tabId) => {
    if (tabId === 'more') {
      setShowDropdown(!showDropdown);
    } else {
      setTab(tabId);
      setShowDropdown(false);
    }
  };

  return (
    <>
      {/* Main Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-2">
          <div className="relative">
            {/* Floating Add Button */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8 z-40">
              <button
                onClick={() => setShowAddForm(true)}
                className="w-16 h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <svg className="w-7 h-7 transition-transform duration-300 group-hover:rotate-90 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            {/* Navigation Items */}
            <div className="flex items-center justify-around pt-4 pb-2">
              {MAIN_TABS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 ${
                    tab === item.id
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    tab === item.id
                      ? "bg-blue-100 shadow-sm scale-110"
                      : "hover:bg-gray-100"
                  }`}>
                    <span className="text-xl">{item.icon}</span>
                  </div>
                  <span className={`text-xs font-medium transition-colors duration-300 ${
                    tab === item.id ? "text-blue-600" : "text-gray-500"
                  }`}>
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Dropdown Menu */}
      {showDropdown && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-35 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowDropdown(false)}
          />
          
          {/* Dropdown Content */}
          <div 
            ref={dropdownRef}
            className="fixed bottom-24 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-40 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-4 duration-300"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Tính năng khác</h3>
                <button
                  onClick={() => setShowDropdown(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {SECONDARY_TABS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`flex flex-col items-center gap-3 p-4 rounded-xl text-sm transition-all duration-200 ${
                      tab === item.id
                        ? "bg-blue-50 text-blue-600 border-2 border-blue-200 shadow-sm"
                        : "text-gray-700 hover:bg-gray-50 border-2 border-transparent hover:border-gray-200"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
                      tab === item.id ? "bg-blue-100 scale-110" : "bg-gray-100"
                    }`}>
                      <span className="text-xl">{item.icon}</span>
                    </div>
                    <span className="font-medium text-center leading-tight">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navigation;