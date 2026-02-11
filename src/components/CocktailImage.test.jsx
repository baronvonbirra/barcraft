import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CocktailImage from './CocktailImage';
import React from 'react';

describe('CocktailImage', () => {
  const SUPABASE_STORAGE_URL = 'https://lgiwnmlsggwvgvocsgbs.supabase.co/storage/v1/object/public/cocktails';

  it('handles legacy path format correctly', () => {
    const legacyPath = 'src/assets/cocktails/agua-del-guadalhorce.png';
    render(<CocktailImage src={legacyPath} alt="Test Image" />);
    const img = screen.getByAltText('Test Image');
    expect(img.src).toBe(`${SUPABASE_STORAGE_URL}/agua-del-guadalhorce.png`);
  });

  it('handles bare filename correctly', () => {
    const bareFilename = 'agua-del-guadalhorce.png';
    render(<CocktailImage src={bareFilename} alt="Test Image" />);
    const img = screen.getByAltText('Test Image');
    expect(img.src).toBe(`${SUPABASE_STORAGE_URL}/agua-del-guadalhorce.png`);
  });

  it('handles filenames with spaces correctly (currently failing?)', () => {
    const filenameWithSpaces = 'old fashioned.png';
    render(<CocktailImage src={filenameWithSpaces} alt="Test Image" />);
    const img = screen.getByAltText('Test Image');
    console.log('img.src:', img.src);
    // Currently it likely produces .../old fashioned.png which might be what we see in img.src in jsdom
    // but we want it to be encoded
    expect(img.src).toContain('old%20fashioned.png');
  });

  it('handles null src correctly', () => {
    render(<CocktailImage src={null} alt="Test Image" />);
    const img = screen.getByAltText('Test Image');
    expect(img.src).toBe(`${SUPABASE_STORAGE_URL}/placeholder.jpg`);
  });

  it('handles full URL correctly (currently failing?)', () => {
    const fullUrl = 'https://example.com/my-cocktail.png';
    render(<CocktailImage src={fullUrl} alt="Test Image" />);
    const img = screen.getByAltText('Test Image');
    expect(img.src).toBe(fullUrl);
  });
});
