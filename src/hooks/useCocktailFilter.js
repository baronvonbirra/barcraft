import { useState, useMemo, useCallback } from 'react'; // Added useCallback
import { useBar } from '../contexts/BarContext';
import bar1StockData from '../data/bar1_stock.json';
import bar2StockData from '../data/bar2_stock.json';
import barSpecificData from '../data/bar_specific_data.json';

export const useCocktailFilter = (allCocktails) => {
  const [baseSpirit, setBaseSpirit] = useState('');
  const [includeIngredients, setIncludeIngredients] = useState([]);
  const [excludeIngredients, setExcludeIngredients] = useState([]);
  const [flavorProfile, setFlavorProfile] = useState([]);
  const [difficulty, setDifficulty] = useState('');
  const [tags, setTags] = useState([]);
  const [thematic, setThematic] = useState([]); // Added thematic state
  const [glassType, setGlassType] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // Added search term state

  const { selectedBar, viewingCuratedMenu } = useBar();

  // Memoize current bar stock to avoid recalculating on every render
  const currentBarStockSet = useMemo(() => {
    let stock = [];
    if (selectedBar === 'bar1') {
      stock = bar1StockData.ingredientsAvailable;
    } else if (selectedBar === 'bar2') {
      stock = bar2StockData.ingredientsAvailable;
    }
    // Assuming stock is now an array of IDs and IDs are consistently cased.
    return new Set(stock); 
  }, [selectedBar]);
  
  const isCocktailMakeable = useCallback((cocktailIngredients) => {
    if (selectedBar === 'all' && !viewingCuratedMenu) return true; // Always makeable if no bar selected
    if (!cocktailIngredients || cocktailIngredients.length === 0) return true; // No ingredients needed

    // If a curated menu is viewed, availability still depends on the *associated* bar's stock.
    // The selectedBar state is correctly set by BarContext when viewing a curated menu.
    const stockToCheck = currentBarStockSet;
    if (stockToCheck.size === 0 && (selectedBar === 'bar1' || selectedBar === 'bar2')) {
        // A specific bar is selected, but its stock appears empty or wasn't loaded for currentBarStockSet.
        // This implies the bar cannot make anything that requires ingredients.
        return cocktailIngredients.length === 0;
    }
     if (stockToCheck.size === 0 && selectedBar === 'all') { // No bar selected, so can't check against specific stock
        return true; // Effectively, consider it makeable from a "general" perspective
    }


    return cocktailIngredients.every(ingObj => {
      if (!ingObj.isEssential) return true; // Optional ingredients don't break makeability
      return stockToCheck.has(ingObj.id); // Check ID for essential ingredients
    });
  }, [selectedBar, viewingCuratedMenu, currentBarStockSet]);


  const getIngredientAvailability = useCallback((cocktailIngredients) => {
    const availability = {};
    if (!cocktailIngredients || cocktailIngredients.length === 0) return availability;

    const stockToCheck = currentBarStockSet;
    const allAvailable = selectedBar === 'all' || (stockToCheck.size === 0 && selectedBar !== 'all');


    cocktailIngredients.forEach(ingObj => {
      // If no specific bar is selected (all bars), consider all ingredients as "available" for UI indication purposes
      // or if a bar is selected but has no stock (stockToCheck.size === 0), also treat as generally available for UI
      if (selectedBar === 'all') {
        availability[ingObj.id] = true; 
      } else if (stockToCheck.size === 0 && (selectedBar === 'bar1' || selectedBar === 'bar2')) {
        // Specific bar selected but no stock, so nothing is available unless it's not essential
        availability[ingObj.id] = !ingObj.isEssential;
      }
      else {
        availability[ingObj.id] = stockToCheck.has(ingObj.id);
      }
    });
    return availability;
  }, [selectedBar, currentBarStockSet]);


  const filteredCocktails = useMemo(() => {
    let cocktails = [...allCocktails];

    // Apply standard filters
    if (baseSpirit) cocktails = cocktails.filter(c => c.baseSpiritCategory?.toLowerCase() === baseSpirit.toLowerCase());
    if (difficulty) cocktails = cocktails.filter(c => c.difficulty?.toLowerCase() === difficulty.toLowerCase());
    if (glassType) {
      cocktails = cocktails.filter(c => {
        const filterValue = glassType.toLowerCase(); // Lowercase the filter target once
        if (Array.isArray(c.glass)) {
          // If c.glass is an array, check if any element in the array matches filterValue
          return c.glass.some(g => g.toLowerCase() === filterValue);
        } else if (typeof c.glass === 'string') {
          // If c.glass is a string, check if it matches filterValue
          return c.glass.toLowerCase() === filterValue;
        }
        return false; // Return false if c.glass is not an array or string (or is null/undefined)
      });
    }
    // Updated ingredient filters to use ID and isEssential
    if (includeIngredients.length > 0) {
      cocktails = cocktails.filter(c => 
        includeIngredients.every(selIngId => 
          c.ingredients.some(ingObj => ingObj.id === selIngId) // Assuming includeIngredients now stores IDs
        )
      );
    }
    if (excludeIngredients.length > 0) {
      cocktails = cocktails.filter(c => 
        !excludeIngredients.some(selIngId => 
          c.ingredients.some(ingObj => ingObj.id === selIngId) // Assuming excludeIngredients now stores IDs
        )
      );
    }
    if (flavorProfile.length > 0) cocktails = cocktails.filter(c => flavorProfile.every(selFlavor => c.flavorProfile?.some(fp => fp.toLowerCase().includes(selFlavor.toLowerCase()))));
    if (tags.length > 0) cocktails = cocktails.filter(c => tags.every(selTag => c.tags?.some(tag => tag.toLowerCase().includes(selTag.toLowerCase()))));
    // Added thematic categories filter
    if (thematic.length > 0) {
      cocktails = cocktails.filter(c =>
        c.thematicCategories && c.thematicCategories.some(ct => thematic.includes(ct))
      );
    }

    // Apply bar-specific filtering (which cocktails are *listed*)
    if (viewingCuratedMenu) {
      const barKey = viewingCuratedMenu.startsWith('bar1') ? 'bar1' : 'bar2';
      const curatedIds = barSpecificData[barKey]?.curatedCocktailIds || [];
      cocktails = cocktails.filter(c => curatedIds.includes(c.id));
      // After filtering for curated, we then check if they are makeable by the selected bar (which is set by viewingCuratedMenu)
      cocktails = cocktails.filter(c => isCocktailMakeable(c.ingredients));

    } else if (selectedBar === 'bar1' || selectedBar === 'bar2') {
      // Filter by what the selected bar can make
      cocktails = cocktails.filter(c => isCocktailMakeable(c.ingredients));
    }

    // Apply search term filter (after other filters)
    if (searchTerm) {
      cocktails = cocktails.filter(cocktail =>
        cocktail.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        // Search term can still check ingredient names for user convenience
        cocktail.ingredients.some(ing => ing.name.toLowerCase().includes(searchTerm.toLowerCase())) || 
        (cocktail.tags && cocktail.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }

    return cocktails;
  }, [
    allCocktails, baseSpirit, includeIngredients, excludeIngredients,
    flavorProfile, difficulty, tags, glassType, thematic, searchTerm, // Added thematic and searchTerm to dependency array
    selectedBar, viewingCuratedMenu, isCocktailMakeable
  ]);

  const resetFilters = () => {
    setBaseSpirit('');
    setIncludeIngredients([]);
    setExcludeIngredients([]);
    setFlavorProfile([]);
    setDifficulty('');
    setTags([]);
    setThematic([]);
    setGlassType('');
    setSearchTerm(''); // Reset search term
  };

  return {
    filteredCocktails,
    baseSpirit, setBaseSpirit,
    includeIngredients, setIncludeIngredients,
    excludeIngredients, setExcludeIngredients,
    flavorProfile, setFlavorProfile,
    difficulty, setDifficulty,
    tags, setTags,
    thematic, setThematic,
    glassType, setGlassType,
    searchTerm, setSearchTerm, // Added searchTerm and setSearchTerm
    resetFilters,
    getIngredientAvailability,
    isCocktailMakeable,
    // Exposing currentBarStockSet might be useful for debugging or advanced UI
    // currentBarStock: currentBarStockSet (consider if needed for direct UI use)
  };
};
