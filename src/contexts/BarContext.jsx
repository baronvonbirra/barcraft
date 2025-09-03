import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import barSpecificDataJson from '../data/bar_specific_data.json';

// Initial state
const initialState = {
  selectedBarId: 'all', // 'all', 'bar1', 'bar2'
  barStock: new Set(), // Set of available ingredient IDs for the selected bar
  barAStock: new Set(), // Stock for Bar A
  barBStock: new Set(), // Stock for Bar B
  selectedBarName: null, // Name of the selected bar
  viewingCuratedMenu: null, // null, 'bar1_curated', 'bar2_curated'
  selectBar: () => {},
  viewCuratedMenu: () => {},
};

export const BarContext = createContext(initialState);

export const BarProvider = ({ children }) => {
  const [selectedBarId, setSelectedBarId] = useState('all');
  const [barStock, setBarStock] = useState(new Set());
  const [barAStock, setBarAStock] = useState(new Set());
  const [barBStock, setBarBStock] = useState(new Set());
  const [selectedBarName, setSelectedBarName] = useState(null);
  const [viewingCuratedMenu, setViewingCuratedMenu] = useState(null);

  // Fetch all stock data on initial load
  useEffect(() => {
    const fetchAllStock = async () => {
      const { data, error } = await supabase
        .from('ingredients')
        .select('id, isAvailableBarA, isAvailableBarB');

      if (error) {
        console.error('Error fetching all bar stock:', error);
      } else {
        const barAIds = new Set();
        const barBIds = new Set();
        data.forEach(ingredient => {
          if (ingredient.isAvailableBarA) barAIds.add(ingredient.id);
          if (ingredient.isAvailableBarB) barBIds.add(ingredient.id);
        });
        setBarAStock(barAIds);
        setBarBStock(barBIds);
      }
    };
    fetchAllStock();
  }, []);

  // Update the currently selected bar's stock when selection changes
  useEffect(() => {
    let currentBarName = null;
    if (selectedBarId === 'bar1') {
      setBarStock(barAStock);
      currentBarName = barSpecificDataJson.bar1.barName;
    } else if (selectedBarId === 'bar2') {
      setBarStock(barBStock);
      currentBarName = barSpecificDataJson.bar2.barName;
    } else {
      setBarStock(new Set());
      currentBarName = null;
    }
    setSelectedBarName(currentBarName);
  }, [selectedBarId, barAStock, barBStock]);

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
        barAStock,
        barBStock,
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
