import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../supabaseClient';
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
    const fetchStock = async () => {
      let currentBarName = null;
      let stockColumn = '';

      if (selectedBarId === 'bar1') {
        currentBarName = barSpecificDataJson.bar1.barName;
        stockColumn = 'isAvailableBarA';
      } else if (selectedBarId === 'bar2') {
        currentBarName = barSpecificDataJson.bar2.barName;
        stockColumn = 'isAvailableBarB';
      } else {
        // 'all' bars selected, so stock is empty, and name is null
        setBarStock(new Set());
        setSelectedBarName(null);
        return;
      }

      const { data, error } = await supabase
        .from('ingredients')
        .select('id')
        .eq(stockColumn, true);

      if (error) {
        console.error('Error fetching bar stock:', error);
        setBarStock(new Set());
      } else {
        const availableIngredientIds = data.map(ingredient => ingredient.id);
        setBarStock(new Set(availableIngredientIds));
      }
      setSelectedBarName(currentBarName);
    };

    fetchStock();
  }, [selectedBarId]);

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
