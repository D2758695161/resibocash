// Utility functions for testing

export const formatCurrency = (amount: number): string => {
  return '$' + amount.toFixed(2);
};

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

describe('formatCurrency', () => {
  it('formats whole numbers', () => {
    expect(formatCurrency(100)).toBe('$100.00');
  });

  it('formats decimals', () => {
    expect(formatCurrency(99.9)).toBe('$99.90');
  });

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });
});

describe('validateEmail', () => {
  it('accepts valid emails', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user.name@domain.co')).toBe(true);
  });

  it('rejects invalid emails', () => {
    expect(validateEmail('notanemail')).toBe(false);
    expect(validateEmail('@nodomain.com')).toBe(false);
  });
});

describe('truncateText', () => {
  it('keeps short text unchanged', () => {
    expect(truncateText('Hi', 10)).toBe('Hi');
  });

  it('truncates long text', () => {
    expect(truncateText('Hello World', 8)).toBe('Hello...');
  });
});
