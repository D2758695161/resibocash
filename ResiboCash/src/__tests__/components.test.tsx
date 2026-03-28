import React from 'react';

// Mock components for testing
export const MockButton = ({ title, onPress }: { title: string; onPress?: () => void }) => (
  <button onClick={onPress} data-testid="mock-button">{title}</button>
);

export const MockCard = ({ children }: { children: React.ReactNode }) => (
  <div data-testid="mock-card">{children}</div>
);

describe('MockButton', () => {
  it('renders with title', () => {
    const { getByTestId } = render(<MockButton title="Test" />);
    expect(getByTestId('mock-button').textContent).toBe('Test');
  });

  it('calls onPress when clicked', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(<MockButton title="Click" onPress={onPress} />);
    getByTestId('mock-button').click();
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

describe('MockCard', () => {
  it('renders children', () => {
    const { getByTestId } = render(<MockCard><span>Hello</span></MockCard>);
    expect(getByTestId('mock-card').textContent).toBe('Hello');
  });
});
