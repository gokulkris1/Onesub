
import { describe, it, expect } from '@jest/globals';
import { formatCurrency } from '../utils'; // Assuming utils.ts is in the root directory

describe('formatCurrency', () => {
  it('formats USD correctly with default settings (two decimal places for cents)', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });

  it('formats USD with no cents correctly (omits .00)', () => {
    expect(formatCurrency(1234)).toBe('$1,234');
  });
  
  it('formats USD with .00 cents correctly (omits .00)', () => {
    expect(formatCurrency(1234.00)).toBe('$1,234');
  });

  it('formats EUR correctly (two decimal places for cents)', () => {
    const formattedEUR = formatCurrency(1234.56, 'EUR');
    // Check for Euro symbol and correct formatting.
    // Note: Symbol placement and exact format might vary slightly by JS environment/locale data version.
    // Using a regex to be more flexible with symbol.
    expect(formattedEUR).toMatch(/€\s*1,234\.56|1,234\.56\s*€|EUR\s*1,234\.56/);
  });
  
  it('formats EUR with no cents correctly (omits .00)', () => {
    const formattedEUR = formatCurrency(1234, 'EUR');
    expect(formattedEUR).toMatch(/€\s*1,234|1,234\s*€|EUR\s*1,234/);
  });

  it('handles zero amount correctly', () => {
    expect(formatCurrency(0)).toBe('$0');
  });
  
  it('handles zero amount with EUR correctly', () => {
    const formattedEUR = formatCurrency(0, 'EUR');
    expect(formattedEUR).toMatch(/€\s*0|0\s*€|EUR\s*0/);
  });

  it('handles small decimal amounts correctly', () => {
    expect(formatCurrency(0.50)).toBe('$0.50');
  });
  
  it('handles very small decimal amounts that might round weirdly without proper minimumFractionDigits', () => {
    expect(formatCurrency(0.05)).toBe('$0.05');
  });

  it('handles amounts with one decimal place, ensuring two are shown', () => {
    expect(formatCurrency(10.5)).toBe('$10.50');
  });
});