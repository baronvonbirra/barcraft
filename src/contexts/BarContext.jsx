import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import barSpecificDataJson from '../data/bar_specific_data.json';

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
    const CACHE_KEY = 'ingredientCache';
    const CACHE_TIMESTAMP_KEY = 'ingredientCacheTimestamp';
    const CACHE_DURATION_MS = 60 * 60 * 1000;

    const fetchAllStock = async () => {
      const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
      const cachedData = localStorage.getItem(CACHE_KEY);

      if (cachedTimestamp && cachedData && (Date.now() - parseInt(cachedTimestamp, 10) < CACHE_DURATION_MS)) {
        console.log("Loading ingredients from cache.");
        const parsedData = JSON.parse(cachedData);
        const barAIds = new Set(parsedData.barAIds);
        const barBIds = new Set(parsedData.barBIds);
        setBarAStock(barAIds);
        setBarBStock(barBIds);
        return;
      }

      console.log("Fetching ingredients from Supabase.");
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

        const cacheData = {
          barAIds: Array.from(barAIds),
          barBIds: Array.from(barBIds)
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
        localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
      }
    };
    fetchAllStock();
  }, []);

  useEffect(() => {
    const fetchBarsData = async () => {
      const { data: curated, error: curatedError } = await supabase.from('curated_cocktails').select('*');
      if (curatedError) {
        console.error('Error fetching curated cocktails:', curatedError);
        return;
      }

      const newBarsData = {};
      for (const barId in barSpecificDataJson) {
        newBarsData[barId] = {
          ...barSpecificDataJson[barId],
          curatedCocktailIds: curated.filter(c => c.bar_id === barId).map(c => c.cocktail_id),
        };
      }
      setBarsData(newBarsData);
    };
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
