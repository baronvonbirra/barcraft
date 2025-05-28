import React, { createContext, useState, useContext, useEffect } from 'react';
import bar1StockData from '../data/bar1_stock.json';
import bar2StockData from '../data/bar2_stock.json';
import barSpecificDataJson from '../data/bar_specific_data.json';

// Initial state
const initialState = {
  selectedBarId: 'all', // 'all', 'bar1', 'bar2'
  barStock: new Set(), // Set of available ingredient IDs for the selected bar
  selectedBarName: null, // Name of the selected bar
  viewingCuratedMenu: null, // null, 'bar1_curated', 'bar2_curated'
  selectBar: () => {},
  viewCuratedMenu: () => {},
};

export const BarContext = createContext(initialState);

export const BarProvider = ({ children }) => {
  const [selectedBarId, setSelectedBarId] = useState('all');
  const [barStock, setBarStock] = useState(new Set());
  const [selectedBarName, setSelectedBarName] = useState(null);
  const [viewingCuratedMenu, setViewingCuratedMenu] = useState(null);

  useEffect(() => {
    let availableIngredientIds = [];
    let currentBarName = null; // Initialize to null
    let currentStockData = [];

    if (selectedBarId === 'bar1') {
      currentStockData = bar1StockData; // bar1StockData is the new array structure
      currentBarName = barSpecificDataJson.bar1.barName;
    } else if (selectedBarId === 'bar2') {
      currentStockData = bar2StockData; // bar2StockData is the new array structure
      currentBarName = barSpecificDataJson.bar2.barName;
    }

    if (currentStockData && currentStockData.length > 0) {
      availableIngredientIds = currentStockData
        .filter(ingredient => ingredient.isAvailable)
        .map(ingredient => ingredient.id);
    }

    setBarStock(new Set(availableIngredientIds));
    setSelectedBarName(currentBarName); // currentBarName will be null if no specific bar is selected
  }, [selectedBarId]); // bar1StockData & bar2StockData are stable JSON imports, no need to add to deps

  const selectBar = (barId) => {
    setSelectedBarId(barId);
    setViewingCuratedMenu(null); 
  };

  const viewCuratedMenuAction = (curatedMenuId) => {
    setViewingCuratedMenu(curatedMenuId);
    if (curatedMenuId) {
      if (curatedMenuId.startsWith('bar1')) setSelectedBarId('bar1');
      else if (curatedMenuId.startsWith('bar2')) setSelectedBarId('bar2');
      else setSelectedBarId('all'); 
    } else {
      setSelectedBarId('all');
    }
  };

  return (
    <BarContext.Provider
      value={{
        selectedBarId,
        barStock,
        selectedBarName,
        viewingCuratedMenu,
        selectBar,
        viewCuratedMenu: viewCuratedMenuAction,
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
