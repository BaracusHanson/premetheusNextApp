import { render, screen } from '@testing-library/react';
import { XPBar } from '@/components/XPBar';
import '@testing-library/jest-dom';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, style, animate }: any) => (
      <div 
        className={className} 
        style={{ ...style, width: animate?.width }} 
        data-testid="motion-bar"
      >
        {children}
      </div>
    ),
  },
}));

describe('XPBar Component', () => {
  it('displays the correct level', () => {
    // 0 XP = Level 1
    render(<XPBar xp={0} />);
    expect(screen.getByText('NIV 1')).toBeInTheDocument();
    expect(screen.getByText('NIV 2')).toBeInTheDocument();
  });

  it('displays correct percentage for 0 XP', () => {
    render(<XPBar xp={0} />);
    expect(screen.getByText('0.0%')).toBeInTheDocument();
  });

  it('displays correct percentage for mid-level XP', () => {
    // 250 XP = 50% of Level 1 (0-500)
    render(<XPBar xp={250} />);
    expect(screen.getByText('50.0%')).toBeInTheDocument();
  });

  it('displays correct percentage for next level XP', () => {
    // 750 XP = Level 2.
    // Level 2 spans 500 to 1000.
    // 750 is 250 into level 2 (50%).
    render(<XPBar xp={750} />);
    expect(screen.getByText('NIV 2')).toBeInTheDocument();
    expect(screen.getByText('NIV 3')).toBeInTheDocument();
    expect(screen.getByText('50.0%')).toBeInTheDocument();
  });
});
