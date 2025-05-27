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
    return new Set(stock.map(ing => ing.toLowerCase()));
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


    return cocktailIngredients.every(ingObj =>
      stockToCheck.has(ingObj.name.toLowerCase())
    );
  }, [selectedBar, viewingCuratedMenu, currentBarStockSet]);


  const getIngredientAvailability = useCallback((cocktailIngredients) => {
    const availability = {};
    if (!cocktailIngredients || cocktailIngredients.length === 0) return availability;

    const stockToCheck = currentBarStockSet;

    // If no specific bar is selected, assume all ingredients are "available" from a general view.
    // Or, if a bar is selected but has no stock defined for some reason.
    const allAvailable = selectedBar === 'all' || stockToCheck.size === 0;

    cocktailIngredients.forEach(ingObj => {
      if (allAvailable && selectedBar === 'all') {
        availability[ingObj.name] = true;
      } else {
        availability[ingObj.name] = stockToCheck.has(ingObj.name.toLowerCase());
      }
    });
    return availability;
  }, [selectedBar, currentBarStockSet]);


  const filteredCocktails = useMemo(() => {
    let cocktails = [...allCocktails];

    // Apply standard filters
    if (baseSpirit) cocktails = cocktails.filter(c => c.baseSpiritCategory?.toLowerCase() === baseSpirit.toLowerCase());
    if (difficulty) cocktails = cocktails.filter(c => c.difficulty?.toLowerCase() === difficulty.toLowerCase());
    if (glassType) cocktails = cocktails.filter(c => c.glass?.toLowerCase().includes(glassType.toLowerCase()));
    if (includeIngredients.length > 0) cocktails = cocktails.filter(c => includeIngredients.every(selIng => c.ingredients.some(ingObj => ingObj.name.toLowerCase().includes(selIng.toLowerCase()))));
    if (excludeIngredients.length > 0) cocktails = cocktails.filter(c => !excludeIngredients.some(selIng => c.ingredients.some(ingObj => ingObj.name.toLowerCase().includes(selIng.toLowerCase()))));
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
