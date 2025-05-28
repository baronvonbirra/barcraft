import React, { useMemo, useState } from 'react'; // Ensure useState is imported
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
  color: ${props => props.theme.colors.text};
  /* height: 100vh; removed */
  /* overflow-y: auto; removed */

  h3 {
    color: ${props => props.theme.colors.primary}; // Changed to primary
    margin-bottom: ${props => props.theme.spacing.small};
  }

  label {
    display: block;
    margin-bottom: ${props => props.theme.spacing.xs};
    font-size: 0.9rem;
    color: ${props => props.theme.colors.textOffset};
    font-family: ${({ theme }) => theme.fonts.main};
  }

  select, input[type="text"], .checkbox-group {
    width: 100%;
    padding: ${props => props.theme.spacing.small};
    border-radius: ${props => props.theme.borderRadius};
    border: 1px solid ${props => props.theme.colors.border};
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    font-family: ${({ theme }) => theme.fonts.main};
    margin-bottom: ${props => props.theme.spacing.medium}; /* Consistent margin */
    transition: border-color 0.3s ease, box-shadow 0.3s ease;

    &:focus {
      border-color: ${props => props.theme.colors.primary};
      box-shadow: 0 0 0 2px rgba(${props => props.theme.colors.primary}, 0.2); // Simulating theme.fn.rgba
      outline: none;
    }
  }
  
  .checkbox-group {
    max-height: 150px;
    overflow-y: auto;
    position: relative; // Add this
    /* background-color is inherited or already set, ensure it's not transparent */
  }

  .checkbox-item {
    display: flex;
    align-items: center;
    margin-bottom: ${props => props.theme.spacing.xs};
  }

  .checkbox-item input[type="checkbox"] {
    margin-right: ${props => props.theme.spacing.small};
    width: auto; /* Override width: 100% for checkbox itself */
    margin-bottom: 0; /* Override general input margin */
    accent-color: ${props => props.theme.colors.primary}; /* Style the checkmark color */
  }

  .checkbox-item label {
    font-size: 0.9rem; /* Updated from 0.85rem for better readability */
    color: ${props => props.theme.colors.text};
    margin-bottom: 0; /* Labels inside checkbox items don't need bottom margin */
    font-weight: normal; /* Ensure it's not bold if there's any global bolding */
  }
`;

const FilterSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.medium};
`;

const StickySearchInput = styled.input`
  position: sticky;
  top: 0;
  background-color: ${({ theme }) => theme.colors.surface || '#fff'}; // Match checkbox-group or sidebar bg
  z-index: 10; // Ensure it's above checkbox items
  width: calc(100% - 2 * ${({ theme }) => theme.spacing.small}); // Adjust width to account for parent padding
  padding: ${({ theme }) => theme.spacing.small}; // Keep consistent padding
  margin: 0 auto ${({ theme }) => theme.spacing.small} auto; // Center and provide bottom margin
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  display: block; // Ensure it takes up its own line

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(${props => props.theme.colors.primaryRGB || '0,123,255'}, 0.2);
    outline: none;
  }
`;

const Button = styled.button`
  /* Generic Button styles - can be extracted to a common Button.jsx later */
  font-family: ${({ theme }) => theme.fonts.main};
  padding: ${({ theme }) => theme.spacing.small} ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.small};
  font-weight: 600;
  text-transform: uppercase; // Optional, for more "designed" feel

  /* Primary button style (used by SurpriseMeButton if it were styled here) */
  &.primary {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.onPrimary};
    border: 1px solid transparent;
    &:hover, &:focus {
      background-color: ${({ theme }) => theme.colors.secondary};
      color: ${({ theme }) => theme.colors.onSecondary};
      box-shadow: ${({ theme }) => theme.shadows.small};
      outline: 2px solid ${({ theme }) => theme.colors.secondary};
      outline-offset: 2px;
    }
  }

  /* Ghost button style for Reset Filters */
  &.reset {
    background-color: transparent;
    color: ${({ theme }) => theme.colors.primary};
    border: 1px solid ${({ theme }) => theme.colors.primary};
    &:hover, &:focus {
      background-color: ${({ theme }) => theme.colors.primary};
      color: ${({ theme }) => theme.colors.onPrimary};
      box-shadow: ${({ theme }) => theme.shadows.small};
      outline: 2px solid ${({ theme }) => theme.colors.primary};
      outline-offset: 2px;
    }
  }
`;

// Helper to get unique values for select options
const getUniqueValues = (items, key, subKey = null) => {
  if (!items) return [];
  const valueMap = new Map(); // Use a Map to store unique objects by ID

  items.forEach(item => {
    if (subKey && item[key]) { // e.g., ingredients: item.ingredients (array)
      item[key].forEach(subItem => {
        // If subKey is 'name', we assume subItem is an object like { id: '...', name: '...' }
        // and we want to store the whole object, ensuring uniqueness by id.
        if (subKey === 'name' && subItem && subItem.id && subItem.name) {
          if (!valueMap.has(subItem.id)) {
            valueMap.set(subItem.id, { id: subItem.id, name: subItem.name });
          }
        } else if (subItem && subItem[subKey]) { // Original logic for other subKey extractions
          // This branch might need to be revisited if other subKey extractions are needed.
          // For now, the primary concern is ingredient objects.
          // To keep original behavior for non-ingredient cases (though not explicitly used in current problem):
           if (!valueMap.has(subItem[subKey])) { // Fallback to value itself as key if not object with id
            valueMap.set(subItem[subKey], subItem[subKey]);
           }
        }
      });
    } else if (item[key]) { // e.g., tags: item.tags (array of strings) or item.glass (string)
      if (Array.isArray(item[key])) {
        item[key].forEach(val => {
          if (!valueMap.has(val)) valueMap.set(val, val);
        });
      } else { // e.g., glass: item.glass (string)
        if (!valueMap.has(item[key])) valueMap.set(item[key], item[key]);
      }
    }
  });

  // For ingredients (identified by subKey === 'name'), we sort by name.
  // For others, we sort by the value itself.
  const sortedValues = Array.from(valueMap.values());
  if (subKey === 'name') {
    // Ensure all elements are objects with a name property before sorting
    if (sortedValues.every(val => typeof val === 'object' && val !== null && 'name' in val)) {
      sortedValues.sort((a, b) => a.name.localeCompare(b.name));
    }
    // If not all are objects with 'name', implies mixed types or different structure,
    // potentially log a warning or handle as per broader application needs.
    // For this specific task, we expect objects with 'name'.
  } else {
    // Attempt to sort, works best if values are consistently strings or numbers.
    // If mixed types that can't be compared, sort might be unpredictable.
    try {
      sortedValues.sort((a, b) => String(a).localeCompare(String(b)));
    } catch (e) {
      // console.error("Could not sort values:", e);
      // Fallback or no sort if complex types are mixed without a clear sorting strategy
    }
  }
  return sortedValues;
};


const FilterSidebar = ({
  allCocktails, // from cocktails.json
  categories, // from categories.json
  thematicCategories, // New prop for thematic categories
  filters, // { baseSpirit, includeIngredients, ... } from useCocktailFilter
  setters, // { setBaseSpirit, setIncludeIngredients, ... } from useCocktailFilter
  resetFilters, // from useCocktailFilter
  filteredCocktailsForSurprise, // Pass the filtered list for the button
  id // Destructure the id prop
}) => {
  const [includeIngredientSearchTerm, setIncludeIngredientSearchTerm] = useState('');
  const [excludeIngredientSearchTerm, setExcludeIngredientSearchTerm] = useState('');

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
    <SidebarWrapper id={id}> {/* Apply the id to the SidebarWrapper */}
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
        <label htmlFor="includeIngredients">Include Ingredients:</label> {/* This label is for the whole group */}
        <div className="checkbox-group">
          <StickySearchInput
            type="text"
            id="includeIngredientSearch" // Keep ID for potential label association if needed
            placeholder="Search to include..."
            value={includeIngredientSearchTerm}
            onChange={(e) => setIncludeIngredientSearchTerm(e.target.value)}
          />
          {uniqueIngredients
            .filter(ingObj => ingObj.name.toLowerCase().includes(includeIngredientSearchTerm.toLowerCase()))
            .map(ingObj => (
            <div key={ingObj.id} className="checkbox-item">
              <input
                type="checkbox"
                id={`include-${ingObj.id}`}
                value={ingObj.id} // Use ID for the value
                checked={filters.includeIngredients.includes(ingObj.id)} // Check against ID
                onChange={() => handleMultiSelectChange(setters.setIncludeIngredients, filters.includeIngredients, ingObj.id)} // Pass ID to handler
              />
              <label htmlFor={`include-${ingObj.id}`}>{ingObj.name}</label> {/* Display name */}
            </div>
          ))}
        </div>
      </FilterSection>

      <FilterSection>
        <label htmlFor="excludeIngredients">Exclude Ingredients:</label>
         <div className="checkbox-group">
          <StickySearchInput
            type="text"
            id="excludeIngredientSearch"
            placeholder="Search to exclude..."
            value={excludeIngredientSearchTerm}
            onChange={(e) => setExcludeIngredientSearchTerm(e.target.value)}
          />
          {uniqueIngredients
            .filter(ingObj => ingObj.name.toLowerCase().includes(excludeIngredientSearchTerm.toLowerCase()))
            .map(ingObj => (
            <div key={ingObj.id} className="checkbox-item">
              <input
                type="checkbox"
                id={`exclude-${ingObj.id}`}
                value={ingObj.id} // Use ID for the value
                checked={filters.excludeIngredients.includes(ingObj.id)} // Check against ID
                onChange={() => handleMultiSelectChange(setters.setExcludeIngredients, filters.excludeIngredients, ingObj.id)} // Pass ID to handler
              />
              <label htmlFor={`exclude-${ingObj.id}`}>{ingObj.name}</label> {/* Display name */}
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

      {/* New Thematic Categories Filter Section START */}
      <FilterSection>
        <label>Thematic Categories:</label>
        {/* Ensure thematicCategories prop is checked for existence before mapping */}
        {thematicCategories && thematicCategories.length > 0 && (
          <div className="checkbox-group">
            {thematicCategories.map(theme => (
              <div key={theme.id} className="checkbox-item">
                <input
                  type="checkbox"
                  id={`theme-${theme.id}`}
                  value={theme.id}
                  // Assuming filters.thematic exists and is an array
                  checked={filters.thematic && filters.thematic.includes(theme.id)}
                  onChange={() => handleMultiSelectChange(setters.setThematic, filters.thematic || [], theme.id)}
                />
                <label htmlFor={`theme-${theme.id}`}>{theme.name}</label>
              </div>
            ))}
          </div>
        )}
      </FilterSection>
      {/* New Thematic Categories Filter Section END */}

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
