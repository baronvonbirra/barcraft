import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { supabase } from '../supabaseClient';
import bcrypt from 'bcryptjs';

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
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  transition: background-color 0.2s ease;

  &:nth-child(odd) {
    background-color: ${({ theme }) => theme.colors.surface};
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


const AdminPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [selectedBar, setSelectedBar] = useState('isAvailableBarA');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn) {
      fetchIngredients();
    }
  }, [isLoggedIn]);

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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('admin_settings')
      .select('password_hash')
      .eq('id', 1)
      .single();

    if (fetchError || !data) {
      setError('Could not verify password. Please try again.');
      console.error('Error fetching admin password:', fetchError);
      return;
    }

    const { password_hash } = data;
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

  const handleToggle = async (ingredientId, currentStatus) => {
    const { error } = await supabase
      .from('ingredients')
      .update({ [selectedBar]: !currentStatus })
      .eq('id', ingredientId);

    if (error) {
      console.error('Error updating ingredient:', error);
      alert('Failed to update ingredient. Make sure you are logged in.');
    } else {
      setIngredients(prevIngredients =>
        prevIngredients.map(ing =>
          ing.id === ingredientId ? { ...ing, [selectedBar]: !currentStatus } : ing
        )
      );
    }
  };

  const filteredIngredients = useMemo(() => {
    return ingredients.filter(ingredient =>
      ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [ingredients, searchTerm]);

  const groupedIngredients = useMemo(() => {
    return filteredIngredients.reduce((acc, ingredient) => {
      const category = ingredient.category || 'Uncategorized';
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
      <Title>Admin - Stock Management</Title>
      <Button onClick={handleLogout} style={{ marginBottom: '1rem' }}>Logout</Button>

      <ControlsWrapper>
        <Select value={selectedBar} onChange={(e) => setSelectedBar(e.target.value)}>
          <option value="isAvailableBarA">Bar A</option>
          <option value="isAvailableBarB">Bar B</option>
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
              {ingredients.map(ingredient => (
                <IngredientItem key={ingredient.id}>
                  <IngredientName>{ingredient.name}</IngredientName>
                  <ToggleSwitchLabel>
                    <input
                      type="checkbox"
                      checked={ingredient[selectedBar]}
                      onChange={() => handleToggle(ingredient.id, ingredient[selectedBar])}
                    />
                    <span className="slider"></span>
                  </ToggleSwitchLabel>
                </IngredientItem>
              ))}
            </IngredientList>
          </CategoryGroup>
        ))
      )}
    </PageWrapper>
  );
};

export default AdminPage;
