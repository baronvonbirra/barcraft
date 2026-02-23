/**
 * Generates a shopping list of missing ingredients for a selection of cocktails.
 *
 * @param {Array} selectedCocktails - Array of cocktail objects with an ingredients property.
 * @param {Array} allIngredients - Array of ingredient objects from the inventory.
 * @param {string} barId - The ID of the bar (e.g., 'bar1', 'bar2').
 * @returns {Object} - Missing ingredients grouped by category.
 */
export const generateShoppingList = (selectedCocktails, allIngredients, barId) => {
  const barIdToColumn = {
    bar1: 'is_available_bar_a',
    bar2: 'is_available_bar_b',
  };
  const stockColumn = barIdToColumn[barId];

  if (!stockColumn) return {};

  const requiredIngredientsInfo = new Map(); // id -> { name }
  selectedCocktails.forEach(cocktail => {
    if (cocktail.ingredients && Array.isArray(cocktail.ingredients)) {
      cocktail.ingredients.forEach(ing => {
        if (ing.id) {
          if (!requiredIngredientsInfo.has(ing.id)) {
            requiredIngredientsInfo.set(ing.id, { name: ing.name });
          }
        }
      });
    }
  });

  const ingredientMap = allIngredients.reduce((acc, ing) => {
    acc[ing.id] = ing;
    return acc;
  }, {});

  const missingIngredients = [];
  requiredIngredientsInfo.forEach((info, id) => {
    const ing = ingredientMap[id];
    if (!ing || !ing[stockColumn]) {
      missingIngredients.push({
        id,
        name: ing ? ing.name : info.name,
        category: ing ? (ing.category || 'Ingredients') : 'Other',
        status: !ing ? 'Missing' : 'Out of Stock'
      });
    }
  });

  // Sort by name
  missingIngredients.sort((a, b) => a.name.localeCompare(b.name));

  // Group by category
  return missingIngredients.reduce((acc, ing) => {
    const category = ing.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(ing);
    return acc;
  }, {});
};

/**
 * Checks if a cocktail has any missing or out-of-stock ingredients.
 *
 * @param {Object} cocktail - The cocktail object.
 * @param {Array} allIngredients - Array of ingredient objects from the inventory.
 * @param {string} barId - The ID of the bar.
 * @returns {Object} - { isMakeable: boolean, missingCount: number }
 */
export const getCocktailStockStatus = (cocktail, allIngredients, barId) => {
  const barIdToColumn = {
    bar1: 'is_available_bar_a',
    bar2: 'is_available_bar_b',
  };
  const stockColumn = barIdToColumn[barId];
  if (!stockColumn || !cocktail.ingredients || !Array.isArray(cocktail.ingredients)) {
    return { isMakeable: true, missingCount: 0 };
  }

  const ingredientMap = allIngredients.reduce((acc, ing) => {
    acc[ing.id] = ing;
    return acc;
  }, {});

  let missingCount = 0;
  cocktail.ingredients.forEach(ing => {
    const stockIng = ingredientMap[ing.id];
    if (!stockIng || !stockIng[stockColumn]) {
      missingCount++;
    }
  });

  return {
    isMakeable: missingCount === 0,
    missingCount
  };
};
