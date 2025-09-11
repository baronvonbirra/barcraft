import { useState, useMemo, useCallback } from 'react';
import { useBar } from '../contexts/BarContext';

export const useCocktailFilter = (allCocktails) => {
  const [baseSpirit, setBaseSpirit] = useState('');
  const [includeIngredients, setIncludeIngredients] = useState([]);
  const [excludeIngredients, setExcludeIngredients] = useState([]);
  const [flavorProfile, setFlavorProfile] = useState([]);
  const [difficulty, setDifficulty] = useState('');
  const [tags, setTags] = useState([]);
  const [thematic, setThematic] = useState([]);
  const [glassType, setGlassType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { selectedBarId, viewingCuratedMenu, barStock, barsData } = useBar();

  const currentBarStockSet = barStock;
  
  const isCocktailMakeable = useCallback((cocktailIngredients) => {
    if (selectedBarId === 'all' && !viewingCuratedMenu) return true;
    if (!cocktailIngredients || cocktailIngredients.length === 0) return true;

    const stockToCheck = currentBarStockSet;
    if (stockToCheck.size === 0 && (selectedBarId === 'bar1' || selectedBarId === 'bar2')) {
        return !cocktailIngredients.some(ing => ing.isEssential);
    }
     if (stockToCheck.size === 0 && selectedBarId === 'all') {
        return true;
    }


    return cocktailIngredients.every(ingObj =>
      ingObj.isEssential === false || stockToCheck.has(ingObj.id)
    );
  }, [selectedBarId, viewingCuratedMenu, currentBarStockSet]);


  const getIngredientAvailability = useCallback((cocktailIngredients) => {
    const availability = {};
    if (!cocktailIngredients || cocktailIngredients.length === 0) return availability;

    const stockToCheck = currentBarStockSet;

    cocktailIngredients.forEach(ingObj => {
      if (selectedBarId === 'all') {
        availability[ingObj.id] = true; 
      } else if (stockToCheck.size === 0 && (selectedBarId === 'bar1' || selectedBarId === 'bar2')) {
        availability[ingObj.id] = !ingObj.isEssential;
      }
      else {
        availability[ingObj.id] = stockToCheck.has(ingObj.id);
      }
    });
    return availability;
  }, [selectedBarId, currentBarStockSet]);


  const filteredCocktails = useMemo(() => {
    let cocktails = [...allCocktails];

    if (baseSpirit) cocktails = cocktails.filter(c => c.base_spirit_category_id?.toLowerCase() === baseSpirit.toLowerCase());
    if (difficulty) cocktails = cocktails.filter(c => c.difficulty?.toLowerCase() === difficulty.toLowerCase());
    if (glassType) {
      cocktails = cocktails.filter(c => {
        const filterValue = glassType.toLowerCase();
        if (Array.isArray(c.glass)) {
          return c.glass.some(g => g.toLowerCase() === filterValue);
        } else if (typeof c.glass === 'string') {
          return c.glass.toLowerCase() === filterValue;
        }
        return false;
      });
    }
    if (includeIngredients.length > 0) {
      cocktails = cocktails.filter(c => 
        includeIngredients.every(selIngId => 
          c.ingredients.some(ingObj => ingObj.id === selIngId)
        )
      );
    }
    if (excludeIngredients.length > 0) {
      cocktails = cocktails.filter(c => 
        !excludeIngredients.some(selIngId => 
          c.ingredients.some(ingObj => ingObj.id === selIngId)
        )
      );
    }
    if (flavorProfile.length > 0) cocktails = cocktails.filter(c => flavorProfile.every(selFlavor => c.flavorProfile?.some(fp => fp.toLowerCase().includes(selFlavor.toLowerCase()))));
    if (tags.length > 0) cocktails = cocktails.filter(c => tags.every(selTag => c.tags?.some(tag => tag.toLowerCase().includes(selTag.toLowerCase()))));
    if (thematic.length > 0) {
      cocktails = cocktails.filter(c =>
        c.thematicCategories && c.thematicCategories.some(ct => thematic.includes(ct))
      );
    }

    if (viewingCuratedMenu) {
      const barKey = viewingCuratedMenu.startsWith('bar1') ? 'bar1' : 'bar2';
      const curatedIds = barsData[barKey]?.curatedCocktailIds || [];
      cocktails = cocktails.filter(c => curatedIds.includes(c.id));
      cocktails = cocktails.filter(c => isCocktailMakeable(c.ingredients));

    } else if (selectedBarId === 'bar1' || selectedBarId === 'bar2') {
      cocktails = cocktails.filter(c => isCocktailMakeable(c.ingredients));
    }

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
    flavorProfile, difficulty, tags, glassType, thematic, searchTerm,
    selectedBarId, viewingCuratedMenu, isCocktailMakeable
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
    setSearchTerm('');
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
    searchTerm, setSearchTerm,
    resetFilters,
    getIngredientAvailability,
    isCocktailMakeable,
  };
};
