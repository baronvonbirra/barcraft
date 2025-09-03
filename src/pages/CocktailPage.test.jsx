import React from 'react';
import { screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../test-utils'; // Using the new test utility
import CocktailPage from './CocktailPage';
import cocktails from '../data/cocktails.json';

const testCocktail = cocktails.find(c => c.id === 'mojito'); // Using a known cocktail

describe('CocktailPage', () => {
  it('renders "cocktail not found" message for a non-existent cocktail', () => {
    renderWithProviders(<CocktailPage />, { route: '/cocktails/non-existent-cocktail' });
    expect(screen.getByText('Cocktail not found.')).toBeInTheDocument();
  });

  describe('AllBarsAvailability Section', () => {
    it('renders correctly when available in Bar A, unavailable in Bar B', () => {
      const providerProps = {
        barContext: {
            barAStock: new Set(testCocktail.ingredients.map(i => i.id)),
            barBStock: new Set(),
        }
      };
      renderWithProviders(<CocktailPage />, {
        route: `/cocktails/${testCocktail.id}`,
        providerProps: providerProps
      });
      expect(screen.getByText(/Level One: Available/i)).toBeInTheDocument();
      expect(screen.getByText(/The Glitch: Unavailable/i)).toBeInTheDocument();
    });

    it('renders correctly when unavailable in Bar A, available in Bar B', () => {
        const providerProps = {
            barContext: {
                barAStock: new Set(),
                barBStock: new Set(testCocktail.ingredients.map(i => i.id)),
            }
          };
      renderWithProviders(<CocktailPage />, {
        route: `/cocktails/${testCocktail.id}`,
        providerProps: providerProps
      });
      expect(screen.getByText(/Level One: Unavailable/i)).toBeInTheDocument();
      expect(screen.getByText(/The Glitch: Available/i)).toBeInTheDocument();
    });

    it('renders correctly when available in both bars', () => {
        const providerProps = {
            barContext: {
                barAStock: new Set(testCocktail.ingredients.map(i => i.id)),
                barBStock: new Set(testCocktail.ingredients.map(i => i.id)),
            }
          };
      renderWithProviders(<CocktailPage />, {
        route: `/cocktails/${testCocktail.id}`,
        providerProps: providerProps
       });
      expect(screen.getByText(/Level One: Available/i)).toBeInTheDocument();
      expect(screen.getByText(/The Glitch: Available/i)).toBeInTheDocument();
    });

    it('renders correctly when unavailable in both bars', () => {
        const providerProps = {
            barContext: {
                barAStock: new Set(),
                barBStock: new Set(),
            }
          };
      renderWithProviders(<CocktailPage />, {
        route: `/cocktails/${testCocktail.id}`,
        providerProps: providerProps
       });
      expect(screen.getByText(/Level One: Unavailable/i)).toBeInTheDocument();
      expect(screen.getByText(/The Glitch: Unavailable/i)).toBeInTheDocument();
    });
  });
});
