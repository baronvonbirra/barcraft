import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

import FeelingLuckyQuiz from './FeelingLuckyQuiz';
import i18n from '../i18n';
import { BarContext } from '../contexts/BarContext';
import { supabase } from '../supabaseClient';

// Mock the supabase client
vi.mock('../supabaseClient');

const theme = {
    colors: {
        surface: '#fff', text: '#000', primary: 'blue', onPrimary: '#fff',
        background: '#f0f0f0', secondary: 'darkblue', onSecondary: '#fff', textOffset: '#666',
    },
    spacing: { small: '0.5rem', medium: '1rem', large: '1.5rem' },
    borderRadius: '4px',
    shadows: { small: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)' },
    fonts: { main: 'sans-serif' },
    typography: { h2Size: '2rem' }
};

const mockCategories = [
  { id: 1, name_en: 'Tropical', name_es: 'Tropical', type: 'theme' },
  { id: 2, name_en: 'Whiskey', name_es: 'Whiskey', type: 'spirit' },
];

const mockCocktail = {
  id: 101, name_en: 'Test Cocktail', name_es: 'Cóctel de prueba',
  image: 'test.jpg', description_en: 'A test drink.', description_es: 'Una bebida de prueba.',
};

const renderQuiz = () => {
  return render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>
        <I18nextProvider i18n={i18n}>
          <BarContext.Provider value={{ selectedBarId: 'bar1' }}>
            <FeelingLuckyQuiz isOpen={true} onClose={() => {}} />
          </BarContext.Provider>
        </I18nextProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
};

describe('FeelingLuckyQuiz', () => {
    const setupMocks = (cocktailResult) => {
    // This object is both chainable and "thenable" (await-able)
    const cocktailQueryMock = {
      contains: vi.fn().mockReturnThis(),
      overlaps: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      // This 'then' property makes the object await-able
      then: function (resolve) {
        resolve(cocktailResult);
      },
    };

    const fromMock = (tableName) => {
      if (tableName === 'categories') {
        return { select: vi.fn().mockResolvedValue({ data: mockCategories, error: null }) };
      }
      if (tableName === 'cocktails') {
        return {
          select: vi.fn().mockReturnValue({
            gt: vi.fn().mockReturnValue(cocktailQueryMock),
          }),
        };
      }
      return { select: vi.fn() };
    };

    supabase.from.mockImplementation(fromMock);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the first question after loading', async () => {
    setupMocks();
    renderQuiz();
    expect(await screen.findByText("What's your vibe today?")).toBeInTheDocument();
  });

  it('moves to the next question after an answer is selected', async () => {
    setupMocks();
    renderQuiz();
    await screen.findByText("What's your vibe today?");
    fireEvent.click(screen.getByText('Tropical'));
    expect(await screen.findByText('Choose your flavor profile:')).toBeInTheDocument();
  });

  it('displays the recommended cocktail after the quiz is completed', async () => {
    setupMocks({ data: [mockCocktail], error: null });
    renderQuiz();

    fireEvent.click(await screen.findByText('Tropical'));
    fireEvent.click(await screen.findByText('Sweet & Indulgent'));
    fireEvent.click(await screen.findByText('Whiskey'));

    expect(await screen.findByText("Here's your match!")).toBeInTheDocument();
    expect(screen.getByText('Test Cocktail')).toBeInTheDocument();
  });

  it('shows a "no match" message if no cocktail is found', async () => {
    setupMocks({ data: [], error: null });
    renderQuiz();

    fireEvent.click(await screen.findByText('Tropical'));
    fireEvent.click(await screen.findByText('Sweet & Indulgent'));
    fireEvent.click(await screen.findByText('Whiskey'));

    expect(await screen.findByText('No cocktails match your choices.')).toBeInTheDocument();
  });

  it('restarts the quiz when the "Retake Quiz" button is clicked', async () => {
    setupMocks({ data: [], error: null });
    renderQuiz();

    fireEvent.click(await screen.findByText('Tropical'));
    fireEvent.click(await screen.findByText('Sweet & Indulgent'));
    fireEvent.click(await screen.findByText('Whiskey'));

    const retakeButton = await screen.findByText('Retake Quiz');
    fireEvent.click(retakeButton);

    expect(await screen.findByText("What's your vibe today?")).toBeInTheDocument();
  });
});
