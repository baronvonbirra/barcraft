import React, { useState, useEffect, useMemo } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { supabase } from '../supabaseClient';
import bcrypt from 'bcryptjs';
import { useTranslation } from 'react-i18next';
import { generateShoppingList, getCocktailStockStatus } from '../utils/inventoryUtils';

const PageWrapper = styled.div`
  padding: 1rem;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  text-align: center;
  color: ${({ theme }) => theme.colors.primary};
`;

const ControlsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const SearchInput = styled.input`
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 1rem;
  width: 250px;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 1rem;
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
`;

const CategoryGroup = styled.div`
  margin-bottom: 2rem;
`;

const CategoryTitle = styled.h2`
  color: ${({ theme }) => theme.colors.secondary};
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
`;

const IngredientList = styled.ul`
  list-style: none;
  padding: 0;
`;

const IngredientItem = styled.li`
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 1rem;
  align-items: center;
  padding: 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  transition: background-color 0.2s ease;

  &:nth-child(odd) {
    background-color: ${({ theme }) => theme.colors.surface};
  }
`;

const StarButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: ${({ theme, isSelected }) => (isSelected ? theme.colors.primary : theme.colors.border)};
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const IngredientName = styled.span`
  font-size: 1.1rem;
`;

const ToggleSwitchLabel = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 34px;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }

  input:checked + .slider {
    background-color: ${({ theme }) => theme.colors.primary};
  }

  input:checked + .slider:before {
    transform: translateX(26px);
  }
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 300px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const Input = styled.input`
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
`;

const Button = styled.button`
  padding: 0.75rem;
  font-size: 1rem;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
`;

const TabButton = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
  cursor: pointer;
  border: none;
  background-color: transparent;
  color: ${({ theme, active }) => (active ? theme.colors.primary : theme.colors.textOffset)};
  border-bottom: 3px solid ${({ theme, active }) => (active ? theme.colors.primary : 'transparent')};
  margin-bottom: -2px;
  transition: all 0.3s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const WorkbenchContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-top: 1rem;

  @media (min-width: 992px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Panel = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: fit-content;
`;

const ShoppingListTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  color: ${({ theme }) => theme.colors.text};
  background-color: #1a1a1a; /* Dark theme */
  border: 1px solid #333;

  th, td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #333;
  }

  th {
    background-color: #252525;
    color: ${({ theme }) => theme.colors.primary};
    text-transform: uppercase;
    font-size: 0.85rem;
    letter-spacing: 1px;
  }
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
  background-color: ${({ status, theme }) =>
    status === 'Missing' ? 'rgba(211, 47, 47, 0.2)' : 'rgba(255, 193, 7, 0.2)'};
  color: ${({ status, theme }) =>
    status === 'Missing' ? '#ff5252' : '#ffc107'};
`;

const WarningIcon = styled.span`
  color: #ffc107;
  margin-left: 0.5rem;
  font-size: 1.2rem;
  cursor: help;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.textOffset};
  opacity: 0.6;

  svg {
    font-size: 4rem;
    margin-bottom: 1rem;
  }
`;

const GlobalPrintStyle = createGlobalStyle`
  @media print {
    body * {
      visibility: hidden;
    }
    #printable-shopping-list, #printable-shopping-list * {
      visibility: visible;
    }
    #printable-shopping-list {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      color: black !important;
      background-color: white !important;
    }
    #printable-shopping-list table {
      background-color: white !important;
      color: black !important;
      border: 1px solid #ccc !important;
    }
    #printable-shopping-list th, #printable-shopping-list td {
      border-bottom: 1px solid #ccc !important;
    }
    #printable-shopping-list h2, #printable-shopping-list h3 {
      color: black !important;
    }
    .no-print {
      display: none !important;
    }
  }
`;

const AdminPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [selectedBar, setSelectedBar] = useState('bar1'); // Default to first bar's ID
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stock'); // 'stock', 'curated', or 'workbench'
  const [bars, setBars] = useState([]);
  const [cocktails, setCocktails] = useState([]);
  const [curatedCocktails, setCuratedCocktails] = useState([]);
  const [selectedCuratedBar, setSelectedCuratedBar] = useState('');
  const [loadingCurated, setLoadingCurated] = useState(false);
  const [cocktailOfTheWeek, setCocktailOfTheWeek] = useState(null);
  const [selectedWorkbenchCocktails, setSelectedWorkbenchCocktails] = useState([]);
  const [workbenchSearchTerm, setWorkbenchSearchTerm] = useState('');
  const { t } = useTranslation();

  // Mapping from bar ID to Supabase column name for stock
  const barIdToColumn = {
    bar1: 'is_available_bar_a',
    bar2: 'is_available_bar_b',
  };

  useEffect(() => {
    if (isLoggedIn) {
      const staticBars = [
        { id: 'bar1', name: t('navigation.levelOne') },
        { id: 'bar2', name: t('navigation.theGlitch') },
      ];
      setBars(staticBars);
      if (staticBars.length > 0) {
        if (!selectedBar) setSelectedBar(staticBars[0].id);
        if (!selectedCuratedBar) setSelectedCuratedBar(staticBars[0].id);
      }
    }
  }, [isLoggedIn, t]);

  useEffect(() => {
    if (isLoggedIn && (activeTab === 'stock' || activeTab === 'workbench')) {
      fetchIngredients();
    }
  }, [isLoggedIn, activeTab]);

  useEffect(() => {
    if (isLoggedIn && (activeTab === 'curated' || activeTab === 'workbench')) {
      fetchCocktails();
      if(selectedCuratedBar) {
          fetchCuratedCocktails(selectedCuratedBar);
          fetchCocktailOfTheWeek(selectedCuratedBar);
      }
    }
  }, [isLoggedIn, activeTab, selectedCuratedBar]);

  const fetchCocktails = async () => {
    setLoadingCurated(true);
    const { data, error } = await supabase
      .from('cocktails')
      .select('id, name_en, name_es, ingredients')
      .order('name_en', { ascending: true });

    if (error) {
      console.error('Error fetching cocktails:', error);
      setCocktails([]);
    } else {
      const processedCocktails = data.map(c => ({
        ...c,
        name: c.name_en || c.name_es,
      }));
      setCocktails(processedCocktails);
    }
    setLoadingCurated(false);
  };

  const fetchIngredients = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('ingredients')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching ingredients:', error);
    } else {
      setIngredients(data);
    }
    setLoading(false);
  };

  const fetchCocktailOfTheWeek = async (barId) => {
    const { data, error } = await supabase
      .from('cocktail_of_the_week')
      .select('cocktail_id')
      .eq('bar_id', barId)
      .single();

    if (error && error.code !== 'PGRST116') { // Ignore 'single row not found' error
      console.error('Error fetching cocktail of the week:', error);
    } else {
      setCocktailOfTheWeek(data ? data.cocktail_id : null);
    }
  };

  const fetchCuratedCocktails = async (barId) => {
    const { data, error } = await supabase
      .from('curated_cocktails')
      .select('cocktail_id')
      .eq('bar_id', barId);

    if (error) console.error('Error fetching curated cocktails:', error);
    else setCuratedCocktails(data.map(c => c.cocktail_id));
  };

  const handleToggleCurated = async (cocktailId) => {
    const isCurated = curatedCocktails.includes(cocktailId);
    let error;

    if (isCurated) {
      // Remove from curated list
      const response = await supabase
        .from('curated_cocktails')
        .delete()
        .match({ bar_id: selectedCuratedBar, cocktail_id: cocktailId });
      error = response.error;
      if (error) {
        console.error('Error removing curated cocktail:', error);
        alert('Failed to remove curated cocktail. Please check permissions and try again.');
      } else {
        setCuratedCocktails(curatedCocktails.filter(id => id !== cocktailId));
        localStorage.removeItem('bars_data');
        localStorage.removeItem('bars_data_timestamp');
      }
    } else {
      // Add to curated list
      const response = await supabase
        .from('curated_cocktails')
        .insert([{ bar_id: selectedCuratedBar, cocktail_id: cocktailId }]);
      error = response.error;
      if (error) {
        console.error('Error adding curated cocktail:', error);
        alert('Failed to add curated cocktail. Please check permissions and try again.');
      } else {
        setCuratedCocktails([...curatedCocktails, cocktailId]);
        localStorage.removeItem('bars_data');
        localStorage.removeItem('bars_data_timestamp');
      }
    }
  };

  const handleSetCocktailOfTheWeek = async (cocktailId) => {
    const newCocktailOfTheWeek = cocktailOfTheWeek === cocktailId ? null : cocktailId;

    // Always clear the existing cocktail of the week for the bar first
    const { error: deleteError } = await supabase
      .from('cocktail_of_the_week')
      .delete()
      .match({ bar_id: selectedCuratedBar });

    if (deleteError) {
      console.error('Error clearing cocktail of the week:', deleteError);
      alert('Error updating cocktail of the week. Please try again.');
      return;
    }

    // If we are setting a new cocktail of the week (not just clearing)
    if (newCocktailOfTheWeek) {
      const { error: insertError } = await supabase
        .from('cocktail_of_the_week')
        .insert([{ bar_id: selectedCuratedBar, cocktail_id: newCocktailOfTheWeek }]);

      if (insertError) {
        console.error('Error setting cocktail of the week:', insertError);
        alert('Error setting new cocktail of the week. Please try again.');
        // If the insert fails, revert the state back to the old value
        setCocktailOfTheWeek(cocktailOfTheWeek);
      } else {
        // On successful insert, update the state
        setCocktailOfTheWeek(newCocktailOfTheWeek);
        localStorage.removeItem('bars_data');
        localStorage.removeItem('bars_data_timestamp');
      }
    } else {
      // If we are just clearing it, update the state
      setCocktailOfTheWeek(null);
      localStorage.removeItem('bars_data');
      localStorage.removeItem('bars_data_timestamp');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('admin_settings')
      .select('password_hash')
      .eq('id', 1);

    if (fetchError) {
      setError('Could not verify password. Please try again.');
      console.error('Error fetching admin password:', fetchError);
      return;
    }

    if (!data || data.length !== 1) {
        setError('Admin configuration error. Expected 1 admin setting, found ' + (data ? data.length : 0) + '.');
        console.error('Admin configuration error: Expected 1 admin setting, found ' + (data ? data.length : 0));
        return;
    }

    const { password_hash } = data[0];
    const isValid = await bcrypt.compare(password, password_hash);

    if (isValid) {
      setIsLoggedIn(true);
    } else {
      setError('Incorrect password.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleClearCache = () => {
    localStorage.removeItem('ingredientCache');
    localStorage.removeItem('ingredientCacheTimestamp');
    alert('Ingredient cache has been cleared.');
  };

  const handleToggleWorkbenchSelection = (cocktailId) => {
    setSelectedWorkbenchCocktails(prev =>
      prev.includes(cocktailId)
        ? prev.filter(id => id !== cocktailId)
        : [...prev, cocktailId]
    );
  };

  const shoppingList = useMemo(() => {
    const selectedCocktailsData = cocktails.filter(c => selectedWorkbenchCocktails.includes(c.id));
    return generateShoppingList(selectedCocktailsData, ingredients, selectedBar);
  }, [selectedWorkbenchCocktails, cocktails, ingredients, selectedBar]);

  const handleCopyToClipboard = () => {
    const selectedBarData = bars.find(b => b.id === selectedBar);
    const barName = selectedBarData ? selectedBarData.name : selectedBar;
    let text = `Shopping List - ${barName}\n\n`;

    Object.entries(shoppingList).forEach(([category, items]) => {
      text += `[${category}]\n`;
      items.forEach(item => {
        text += `- ${item.name} (${item.status})\n`;
      });
      text += '\n';
    });

    navigator.clipboard.writeText(text).then(() => {
      alert('Shopping list copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredWorkbenchCocktails = useMemo(() => {
    return cocktails.filter(c =>
      c.name.toLowerCase().includes(workbenchSearchTerm.toLowerCase())
    );
  }, [cocktails, workbenchSearchTerm]);

  const handleToggle = async (ingredientId, currentStatus) => {
    const columnName = barIdToColumn[selectedBar];
    if (!columnName) {
      console.error('Invalid bar selected:', selectedBar);
      alert('An error occurred. Invalid bar selection.');
      return;
    }

    const { error } = await supabase
      .from('ingredients')
      .update({ [columnName]: !currentStatus })
      .eq('id', ingredientId);

    if (error) {
      console.error('Error updating ingredient:', error);
      alert('Failed to update ingredient. Check console for details.');
    } else {
      setIngredients(prevIngredients =>
        prevIngredients.map(ing =>
          ing.id === ingredientId ? { ...ing, [columnName]: !currentStatus } : ing
        )
      );
      // Invalidate cache
      localStorage.removeItem('ingredientCache');
      localStorage.removeItem('ingredientCacheTimestamp');
    }
  };

  const filteredIngredients = useMemo(() => {
    return ingredients.filter(ingredient =>
      ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [ingredients, searchTerm]);

  const groupedIngredients = useMemo(() => {
    return filteredIngredients.reduce((acc, ingredient) => {
      const category = ingredient.category || 'Ingredients List';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(ingredient);
      return acc;
    }, {});
  }, [filteredIngredients]);

  if (!isLoggedIn) {
    return (
      <PageWrapper>
        <LoginForm onSubmit={handleLogin}>
          <Title>Admin Login</Title>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit">Login</Button>
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        </LoginForm>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <GlobalPrintStyle />
      <Title>Admin Panel</Title>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <Button onClick={handleLogout}>Logout</Button>
        <Button onClick={handleClearCache}>Clear Ingredient Cache</Button>
      </div>

      <TabContainer>
        <TabButton active={activeTab === 'stock'} onClick={() => setActiveTab('stock')}>
          Stock Management
        </TabButton>
        <TabButton active={activeTab === 'curated'} onClick={() => setActiveTab('curated')}>
          Curated Cocktails
        </TabButton>
        <TabButton active={activeTab === 'workbench'} onClick={() => setActiveTab('workbench')}>
          Inventory Workbench
        </TabButton>
      </TabContainer>

      {activeTab === 'stock' && (
        <>
          <ControlsWrapper>
            <Select value={selectedBar} onChange={(e) => setSelectedBar(e.target.value)}>
              {bars.map(bar => (
                <option key={bar.id} value={bar.id}>{bar.name}</option>
              ))}
            </Select>
            <SearchInput
              type="text"
              placeholder="Search ingredients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </ControlsWrapper>

          {loading ? <p>Loading ingredients...</p> : (
            Object.entries(groupedIngredients)
              .sort(([catA], [catB]) => catA.localeCompare(catB))
              .map(([category, ingredients]) => (
                <CategoryGroup key={category}>
                  <CategoryTitle>{category}</CategoryTitle>
                  <IngredientList>
                    {ingredients.map(ingredient => {
                      const columnName = barIdToColumn[selectedBar];
                      const isChecked = columnName ? ingredient[columnName] : false;
                      return (
                        <IngredientItem key={ingredient.id}>
                          <IngredientName>{ingredient.name}</IngredientName>
                          <ToggleSwitchLabel>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggle(ingredient.id, isChecked)}
                              disabled={!columnName}
                            />
                            <span className="slider"></span>
                          </ToggleSwitchLabel>
                        </IngredientItem>
                      );
                    })}
                  </IngredientList>
                </CategoryGroup>
              ))
          )}
        </>
      )}

      {activeTab === 'curated' && (
        <>
          <ControlsWrapper>
            <Select value={selectedCuratedBar} onChange={(e) => setSelectedCuratedBar(e.target.value)}>
              {bars.map(bar => (
                <option key={bar.id} value={bar.id}>{bar.name}</option>
              ))}
            </Select>
          </ControlsWrapper>
          {loadingCurated ? <p>Loading...</p> : (
            <>
              <CategoryTitle>Curated Cocktails & Cocktail of the Week</CategoryTitle>
              <IngredientList>
                {cocktails.sort((a, b) => a.name.localeCompare(b.name)).map(cocktail => (
                  <IngredientItem key={cocktail.id}>
                    <IngredientName>{cocktail.name}</IngredientName>
                    <ToggleSwitchLabel>
                      <input
                        type="checkbox"
                        checked={curatedCocktails.includes(cocktail.id)}
                        onChange={() => handleToggleCurated(cocktail.id)}
                      />
                      <span className="slider"></span>
                    </ToggleSwitchLabel>
                    <StarButton
                      isSelected={cocktailOfTheWeek === cocktail.id}
                      onClick={() => handleSetCocktailOfTheWeek(cocktail.id)}
                    >
                      ★
                    </StarButton>
                  </IngredientItem>
                ))}
              </IngredientList>
            </>
          )}
        </>
      )}
      {activeTab === 'workbench' && (
        <>
          <ControlsWrapper>
            <Select value={selectedBar} onChange={(e) => setSelectedBar(e.target.value)}>
              {bars.map(bar => (
                <option key={bar.id} value={bar.id}>{bar.name}</option>
              ))}
            </Select>
            <SearchInput
              type="text"
              placeholder="Search cocktails..."
              value={workbenchSearchTerm}
              onChange={(e) => setWorkbenchSearchTerm(e.target.value)}
            />
          </ControlsWrapper>

          <WorkbenchContainer>
            <Panel>
              <CategoryTitle>Select Cocktails</CategoryTitle>
              {loadingCurated ? <p>Loading cocktails...</p> : (
                <IngredientList style={{ maxHeight: '600px', overflowY: 'auto' }}>
                  {filteredWorkbenchCocktails.map(cocktail => {
                    const status = getCocktailStockStatus(cocktail, ingredients, selectedBar);
                    return (
                      <IngredientItem key={cocktail.id}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <input
                            type="checkbox"
                            checked={selectedWorkbenchCocktails.includes(cocktail.id)}
                            onChange={() => handleToggleWorkbenchSelection(cocktail.id)}
                            style={{ marginRight: '1rem', width: '20px', height: '20px', cursor: 'pointer' }}
                          />
                          <IngredientName>{cocktail.name}</IngredientName>
                          {!status.isMakeable && (
                            <WarningIcon title={`${status.missingCount} missing ingredients`}>
                              !
                            </WarningIcon>
                          )}
                        </div>
                      </IngredientItem>
                    );
                  })}
                </IngredientList>
              )}
            </Panel>

            <Panel>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <CategoryTitle style={{ marginBottom: 0 }}>Shopping List</CategoryTitle>
                {selectedWorkbenchCocktails.length > 0 && Object.keys(shoppingList).length > 0 && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button onClick={handleCopyToClipboard} style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>Copy</Button>
                    <Button onClick={handlePrint} style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>Print</Button>
                  </div>
                )}
              </div>

              {selectedWorkbenchCocktails.length === 0 ? (
                <EmptyState>
                  <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</span>
                  <p>Select cocktails to analyze stock requirements.</p>
                </EmptyState>
              ) : Object.keys(shoppingList).length === 0 ? (
                <EmptyState>
                  <p>All ingredients for selected cocktails are in stock! 🎉</p>
                </EmptyState>
              ) : (
                <div id="printable-shopping-list">
                  <h2 className="only-print" style={{ display: 'none' }}>
                    Shopping List - {selectedBar === 'bar1' ? t('navigation.levelOne') : t('navigation.theGlitch')}
                  </h2>
                  <ShoppingListTable>
                    <thead>
                      <tr>
                        <th>Ingredient</th>
                        <th>Category</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(shoppingList).map(([category, items]) => (
                        <React.Fragment key={category}>
                          {items.map(item => (
                            <tr key={item.id}>
                              <td>{item.name}</td>
                              <td>{item.category}</td>
                              <td>
                                <StatusBadge status={item.status}>{item.status}</StatusBadge>
                              </td>
                            </tr>
                          ))}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </ShoppingListTable>
                  <style>{`
                    @media print {
                      .only-print {
                        display: block !important;
                        margin-bottom: 1rem;
                      }
                    }
                  `}</style>
                </div>
              )}
            </Panel>
          </WorkbenchContainer>
        </>
      )}
    </PageWrapper>
  );
};

export default AdminPage;
