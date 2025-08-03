import { useEffect, useCallback } from 'react';

interface UseKeyboardProps {
  onNumberPress: (number: number) => void;
  onEnter: () => void;
  onArrowUp: () => void;
  onArrowDown: () => void;
  onEscape: () => void;
}

export const useKeyboard = ({
  onNumberPress,
  onEnter,
  onArrowUp,
  onArrowDown,
  onEscape,
}: UseKeyboardProps) => {
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    event.preventDefault();
    
    // Numbers 0-9
    if (event.key >= '0' && event.key <= '9') {
      const number = parseInt(event.key);
      onNumberPress(number);
      return;
    }

    // Number pad
    if (event.code.startsWith('Numpad')) {
      const match = event.code.match(/Numpad(\d)/);
      if (match) {
        const number = parseInt(match[1]);
        onNumberPress(number);
        return;
      }
    }

    // Special keys
    switch (event.key) {
      case 'Enter':
        onEnter();
        break;
      case 'ArrowUp':
        onArrowUp();
        break;
      case 'ArrowDown':
        onArrowDown();
        break;
      case 'Escape':
        onEscape();
        break;
    }
  }, [onNumberPress, onEnter, onArrowUp, onArrowDown, onEscape]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);
};