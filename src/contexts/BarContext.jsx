import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useTranslation } from 'react-i18next';

const initialState = {
  selectedBarId: 'all',
  barStock: new Set(),
  barAStock: new Set(),
  barBStock: new Set(),
  selectedBarName: null,
  viewingCuratedMenu: null,
  barsData: {},
  selectBar: () => {},
  viewCuratedMenu: () => {},
};

export const BarContext = createContext(initialState);

export const BarProvider = ({ children }) => {
  const { t } = useTranslation();
  const [selectedBarId, setSelectedBarId] = useState('all');
  const [barStock, setBarStock] = useState(new Set());
  const [barAStock, setBarAStock] = useState(new Set());
  const [barBStock, setBarBStock] = useState(new Set());
  const [selectedBarName, setSelectedBarName] = useState(null);
  const [viewingCuratedMenu, setViewingCuratedMenu] = useState(null);

  useEffect(() => {
    const fetchAllStock = async () => {
      const { data, error } = await supabase
        .from('ingredients')
        .select('id, is_available_bar_a, is_available_bar_b');

      if (error) {
        console.error('Error fetching all bar stock:', error);
      } else {
        const barAIds = new Set();
        const barBIds = new Set();
        data.forEach(ingredient => {
          if (ingredient.is_available_bar_a) barAIds.add(ingredient.id);
          if (ingredient.is_available_bar_b) barBIds.add(ingredient.id);
        });
        setBarAStock(barAIds);
        setBarBStock(barBIds);
      }
    };

    fetchAllStock();
  }, []);

  useEffect(() => {
    let currentBarName = null;
    if (selectedBarId === 'bar1') {
      setBarStock(barAStock);
      currentBarName = t('navigation.levelOne');
    } else if (selectedBarId === 'bar2') {
      setBarStock(barBStock);
      currentBarName = t('navigation.theGlitch');
    } else {
      setBarStock(new Set());
      currentBarName = null;
    }
    setSelectedBarName(currentBarName);
  }, [selectedBarId, barAStock, barBStock, t]);

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

export const useBar = () => {
  const context = useContext(BarContext);
  if (context === undefined) {
    throw new Error('useBar must be used within a BarProvider');
  }
  return context;
};
