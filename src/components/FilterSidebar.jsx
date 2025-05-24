import React, { useMemo } from 'react';
import styled from 'styled-components';
// We will pass down cocktailsData and categoriesData as props later.
// For now, let's assume they are available or mocked if needed for development.
// import cocktailsData from '../data/cocktails.json'; // For deriving options
// import categoriesData from '../data/categories.json'; // For category options
import SurpriseMeButton from './SurpriseMeButton'; // Import the new button

// Assume useCocktailFilter hook is correctly imported from ../hooks/useCocktailFilter
// For the subtask, the worker can assume the hook is available and works as specified.

const SidebarWrapper = styled.aside`
  padding: ${props => props.theme.spacing.medium};
  background-color: ${props => props.theme.colors.surface};
  border-right: 1px solid ${props => props.theme.colors.border};
  min-width: 250px; // Example width
  max-width: 300px;
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.medium};
  color: ${props => props.theme.colors.text}; // Ensure text is visible in dark theme
  height: 100vh; // Example: make it full height
  overflow-y: auto;

  h3 {
    color: ${props => props.theme.colors.secondary};
    margin-bottom: ${props => props.theme.spacing.small};
  }

  label {
    display: block;
    margin-bottom: ${props => props.theme.spacing.xs};
    font-size: 0.9rem;
    color: ${props => props.theme.colors.textOffset};
  }

  select, input[type="text"] {
    width: 100%;
    padding: ${props => props.theme.spacing.small};
    border-radius: ${props => props.theme.borderRadius};
    border: 1px solid ${props => props.theme.colors.border};
    background-color: ${props => props.theme.colors.background}; // Darker input background
    color: ${props => props.theme.colors.text};
    margin-bottom: ${props => props.theme.spacing.small};
  }
  
  // Basic styling for multi-select checkboxes if we use them
  .checkbox-group {
    max-height: 150px;
    overflow-y: auto;
    border: 1px solid ${props => props.theme.colors.border};
    padding: ${props => props.theme.spacing.small};
    border-radius: ${props => props.theme.borderRadius};
    background-color: ${props => props.theme.colors.background};
  }

  .checkbox-item label {
    font-size: 0.85rem;
    color: ${props => props.theme.colors.text};
    margin-bottom: 0;
  }
   .checkbox-item input {
    margin-right: ${props => props.theme.spacing.small};
  }
`;

const FilterSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.medium};
`;

const Button = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.onPrimary};
  border: none;
  padding: ${props => props.theme.spacing.small} ${props => props.theme.spacing.medium};
  border-radius: ${props => props.theme.borderRadius};
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  width: 100%;
  margin-top: ${props => props.theme.spacing.small};

  &:hover {
    background-color: ${props => props.theme.colors.secondary};
  }

  &.reset {
    background-color: ${props => props.theme.colors.surface};
    color: ${props => props.theme.colors.text};
    border: 1px solid ${props => props.theme.colors.border};
    &:hover {
      background-color: ${props => props.theme.colors.background};
    }
  }
`;

// Helper to get unique values for select options
const getUniqueValues = (items, key, subKey = null) => {
  if (!items) return [];
  const valueSet = new Set();
  items.forEach(item => {
    if (subKey && item[key]) { // e.g., ingredients: item.ingredients (array) -> ing.name
      item[key].forEach(subItem => {
        if (subItem && subItem[subKey]) valueSet.add(subItem[subKey]);
      });
    } else if (item[key]) { // e.g., tags: item.tags (array of strings)
      if (Array.isArray(item[key])) {
        item[key].forEach(val => valueSet.add(val));
      } else { // e.g., glass: item.glass (string)
         valueSet.add(item[key]);
      }
    }
  });
  return Array.from(valueSet).sort();
};


const FilterSidebar = ({
  allCocktails, // from cocktails.json
  categories, // from categories.json
  filters, // { baseSpirit, includeIngredients, ... } from useCocktailFilter
  setters, // { setBaseSpirit, setIncludeIngredients, ... } from useCocktailFilter
  resetFilters, // from useCocktailFilter
  filteredCocktailsForSurprise // Pass the filtered list for the button
}) => {

  const uniqueIngredients = useMemo(() => getUniqueValues(allCocktails, 'ingredients', 'name'), [allCocktails]);
  const uniqueFlavorProfiles = useMemo(() => getUniqueValues(allCocktails, 'flavorProfile'), [allCocktails]);
  const uniqueTags = useMemo(() => getUniqueValues(allCocktails, 'tags'), [allCocktails]);
  const uniqueGlassTypes = useMemo(() => getUniqueValues(allCocktails, 'glass'), [allCocktails]);
  const difficulties = ['Easy', 'Medium', 'Hard']; // Static list

  // Handler for multi-select checkboxes
  const handleMultiSelectChange = (setter, currentValues, value) => {
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    setter(newValues);
  };
  
  if (!filters || !setters || !resetFilters) {
    // This component expects filter state and setters to be passed as props
    // This can happen if the parent component hasn't initialized useCocktailFilter yet
    // Or if they are not passed down correctly.
    // Render nothing or a loading state, or an error.
    // For now, let's return null to avoid runtime errors if props are missing.
    console.warn("FilterSidebar: filters, setters, or resetFilters prop is missing.");
    return null; 
  }


  return (
    <SidebarWrapper>
      <h3>Filter Cocktails</h3>

      <FilterSection>
        <label htmlFor="baseSpirit">Base Spirit/Category:</label>
        <select
          id="baseSpirit"
          value={filters.baseSpirit}
          onChange={(e) => setters.setBaseSpirit(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories && categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </FilterSection>

      <FilterSection>
        <label>Include Ingredients:</label>
        <div className="checkbox-group">
          {uniqueIngredients.map(ing => (
            <div key={ing} className="checkbox-item">
              <input
                type="checkbox"
                id={`include-${ing}`}
                value={ing}
                checked={filters.includeIngredients.includes(ing)}
                onChange={() => handleMultiSelectChange(setters.setIncludeIngredients, filters.includeIngredients, ing)}
              />
              <label htmlFor={`include-${ing}`}>{ing}</label>
            </div>
          ))}
        </div>
      </FilterSection>

      <FilterSection>
        <label>Exclude Ingredients:</label>
         <div className="checkbox-group">
          {uniqueIngredients.map(ing => (
            <div key={ing} className="checkbox-item">
              <input
                type="checkbox"
                id={`exclude-${ing}`}
                value={ing}
                checked={filters.excludeIngredients.includes(ing)}
                onChange={() => handleMultiSelectChange(setters.setExcludeIngredients, filters.excludeIngredients, ing)}
              />
              <label htmlFor={`exclude-${ing}`}>{ing}</label>
            </div>
          ))}
        </div>
      </FilterSection>

      <FilterSection>
        <label>Flavor Profile:</label>
        <div className="checkbox-group">
          {uniqueFlavorProfiles.map(flavor => (
            <div key={flavor} className="checkbox-item">
              <input
                type="checkbox"
                id={`flavor-${flavor}`}
                value={flavor}
                checked={filters.flavorProfile.includes(flavor)}
                onChange={() => handleMultiSelectChange(setters.setFlavorProfile, filters.flavorProfile, flavor)}
              />
              <label htmlFor={`flavor-${flavor}`}>{flavor}</label>
            </div>
          ))}
        </div>
      </FilterSection>

      <FilterSection>
        <label htmlFor="difficulty">Difficulty:</label>
        <select
          id="difficulty"
          value={filters.difficulty}
          onChange={(e) => setters.setDifficulty(e.target.value)}
        >
          <option value="">All Difficulties</option>
          {difficulties.map(diff => (
            <option key={diff} value={diff}>{diff}</option>
          ))}
        </select>
      </FilterSection>

      <FilterSection>
        <label>Tags:</label>
        <div className="checkbox-group">
          {uniqueTags.map(tag => (
            <div key={tag} className="checkbox-item">
              <input
                type="checkbox"
                id={`tag-${tag}`}
                value={tag}
                checked={filters.tags.includes(tag)}
                onChange={() => handleMultiSelectChange(setters.setTags, filters.tags, tag)}
              />
              <label htmlFor={`tag-${tag}`}>{tag}</label>
            </div>
          ))}
        </div>
      </FilterSection>

      <FilterSection>
        <label htmlFor="glassType">Glass Type:</label>
        <select
          id="glassType"
          value={filters.glassType}
          onChange={(e) => setters.setGlassType(e.target.value)}
        >
          <option value="">All Glass Types</option>
          {uniqueGlassTypes.map(glass => (
            <option key={glass} value={glass}>{glass}</option>
          ))}
        </select>
      </FilterSection>

      <Button type="button" className="reset" onClick={resetFilters}>
        Reset Filters
      </Button>
      <SurpriseMeButton 
        filteredCocktails={filteredCocktailsForSurprise} 
        // currentFiltersActive can be derived or passed if needed by SurpriseMeButton
      />
      {/* "Apply Filters" button can be added here if instant updates are not desired */}
    </SidebarWrapper>
  );
};

export default FilterSidebar;
