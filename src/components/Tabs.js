"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Tabs({ tabs, defaultTab, onChange }) {
  const [selectedTab, setSelectedTab] = useState(defaultTab);
  const [openDropdown, setOpenDropdown] = useState(null);
  const router = useRouter();

  const handleSelect = (tab) => {
    if (tab.dropdown) {
      // toggle dropdown for this tab
      setOpenDropdown(openDropdown === tab.value ? null : tab.value);
    } else {
      setSelectedTab(tab.value);
      if (onChange) onChange(tab.value);
      if (tab.href) router.push(tab.href);
    }
  };

  const handleDropdownSelect = (parentTab, item) => {
    setSelectedTab(item.value);
    setOpenDropdown(null);
    if (onChange) onChange(item.value);
    if (item.href) router.push(item.href);
  };

  return (
    <div className={`grid grid-cols-${tabs.length} relative`}>
      {tabs.map((tab, idx) => (
        <div
          key={idx}
          className={`h-12 line-clamp-2 rounded-t-lg px-2 cursor-pointer 
            ${selectedTab === tab.value ? "bg-tab-selected" : "bg-tab-default"}`}
          onClick={() => handleSelect(tab)}
        >
          {tab.label}
          {/* Dropdown menu */}
          {tab.dropdown && openDropdown === tab.value && (
            <div className="fixed mt-2 bg-gray-700 text-white rounded shadow-lg z-50">
              {tab.dropdown.map((item, i) => (
                <div
                  key={i}
                  className="px-4 py-2 hover:bg-gray-600 cursor-pointer"
                  onClick={() => handleDropdownSelect(tab, item)}
                >
                  {item.label}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
