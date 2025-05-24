import React, { createContext, useState, useContext } from 'react';

// Initial state
const initialState = {
  selectedBar: 'all', // 'all', 'bar1', 'bar2'
  viewingCuratedMenu: null, // null, 'bar1_curated', 'bar2_curated'
  selectBar: () => {},
  viewCuratedMenu: () => {},
};

export const BarContext = createContext(initialState);

export const BarProvider = ({ children }) => {
  const [selectedBar, setSelectedBar] = useState('all');
  const [viewingCuratedMenu, setViewingCuratedMenu] = useState(null);

  const selectBar = (barId) => {
    setSelectedBar(barId);
    // If a specific bar is selected, clear any curated menu view
    // unless the curated menu belongs to the selected bar (handled in UI or later)
    // For now, simplify: selecting a bar directly clears curated view.
    setViewingCuratedMenu(null); 
  };

  const viewCuratedMenuAction = (curatedMenuId) => {
    setViewingCuratedMenu(curatedMenuId);
    // When a curated menu is viewed, update selectedBar to match the menu's bar
    // e.g., if curatedMenuId is 'bar1_curated', selectedBar becomes 'bar1'
    if (curatedMenuId) {
      if (curatedMenuId.startsWith('bar1')) setSelectedBar('bar1');
      else if (curatedMenuId.startsWith('bar2')) setSelectedBar('bar2');
      else setSelectedBar('all'); // Fallback, though should not happen with valid IDs
    } else {
      // If clearing curated menu, perhaps revert to 'all' or last selected bar.
      // For now, let's set to 'all' if no curated menu.
      setSelectedBar('all');
    }
  };

  return (
    <BarContext.Provider
      value={{
        selectedBar,
        viewingCuratedMenu,
        selectBar,
        viewCuratedMenu: viewCuratedMenuAction, // Renamed to avoid conflict
      }}
    >
      {children}
    </BarContext.Provider>
  );
};

// Custom hook to use the BarContext
export const useBar = () => {
  const context = useContext(BarContext);
  if (context === undefined) {
    throw new Error('useBar must be used within a BarProvider');
  }
  return context;
};
