import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { getCachedData, setCachedData } from '../utils/cache';

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
  const [selectedBarId, setSelectedBarId] = useState('all');
  const [barStock, setBarStock] = useState(new Set());
  const [barAStock, setBarAStock] = useState(new Set());
  const [barBStock, setBarBStock] = useState(new Set());
  const [selectedBarName, setSelectedBarName] = useState(null);
  const [viewingCuratedMenu, setViewingCuratedMenu] = useState(null);
  const [barsData, setBarsData] = useState({});

  useEffect(() => {
    const cacheDuration = 3600 * 1000; // 1 hour

    const fetchAllStock = async () => {
      const cacheKey = 'ingredientCache';
      const cached = getCachedData(cacheKey, cacheDuration);
      if (cached) {
        setBarAStock(new Set(cached.barAIds));
        setBarBStock(new Set(cached.barBIds));
        return;
      }

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
        setCachedData(cacheKey, { barAIds: Array.from(barAIds), barBIds: Array.from(barBIds) });
      }
    };

    const fetchBarsData = async () => {
      const cacheKey = 'bars_data';
      const cached = getCachedData(cacheKey, cacheDuration);
      if (cached) {
        setBarsData(cached);
        return;
      }

      const { data: bars, error: barsError } = await supabase.from('bars').select('*');
      if (barsError) {
        console.error('Error fetching bars:', barsError);
        return;
      }

      const { data: curated, error: curatedError } = await supabase.from('curated_cocktails').select('*');
      if (curatedError) {
        console.error('Error fetching curated cocktails:', curatedError);
        return;
      }

      const newBarsData = {};
      for (const bar of bars) {
        newBarsData[bar.id] = {
          barName: bar.name,
          curatedMenuName: bar.curated_menu_name,
          curatedCocktailIds: curated.filter(c => c.bar_id === bar.id).map(c => c.cocktail_id),
        };
      }
      setBarsData(newBarsData);
      setCachedData(cacheKey, newBarsData);
    };

    fetchAllStock();
    fetchBarsData();
  }, []);

  useEffect(() => {
    let currentBarName = null;
    if (selectedBarId === 'bar1') {
      setBarStock(barAStock);
      currentBarName = barsData.bar1?.barName || null;
    } else if (selectedBarId === 'bar2') {
      setBarStock(barBStock);
      currentBarName = barsData.bar2?.barName || null;
    } else {
      setBarStock(new Set());
      currentBarName = null;
    }
    setSelectedBarName(currentBarName);
  }, [selectedBarId, barAStock, barBStock, barsData]);

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
        barsData,
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
