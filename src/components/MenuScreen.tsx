import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ATMScreen } from './ATMScreen';
import { MenuItem, MENU_ITEMS } from '@/types/menu';
import { useSound } from '@/hooks/useSound';
import { useKeyboard } from '@/hooks/useKeyboard';
import { ArrowLeft, ShoppingCart } from 'lucide-react';

interface MenuScreenProps {
  onSelectItem: (item: MenuItem) => void;
  onViewCart: () => void;
  onBack: () => void;
  cartItemCount: number;
  cartTotal: number;
}

export const MenuScreen: React.FC<MenuScreenProps> = ({ 
  onSelectItem, 
  onViewCart, 
  onBack, 
  cartItemCount,
  cartTotal 
}) => {
  const { playBeep, playConfirm } = useSound();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentCategory, setCurrentCategory] = useState<'executivo' | 'adicional'>('executivo');

  const currentItems = MENU_ITEMS.filter(item => item.category === currentCategory);

  useKeyboard({
    onNumberPress: (number) => {
      const item = MENU_ITEMS.find(item => item.id === number);
      if (item) {
        playConfirm();
        onSelectItem(item);
      } else {
        playBeep();
      }
    },
    onEnter: () => {
      if (currentItems[selectedIndex]) {
        playConfirm();
        onSelectItem(currentItems[selectedIndex]);
      }
    },
    onArrowUp: () => {
      playBeep();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : currentItems.length - 1);
    },
    onArrowDown: () => {
      playBeep();
      setSelectedIndex(prev => prev < currentItems.length - 1 ? prev + 1 : 0);
    },
    onEscape: () => {
      playBeep();
      onBack();
    }
  });

  useEffect(() => {
    setSelectedIndex(0);
  }, [currentCategory]);

  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  return (
    <ATMScreen>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <Button 
          variant="atm" 
          size="default"
          onClick={() => { playBeep(); onBack(); }}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </Button>
        
        <h1 className="text-3xl font-bold text-atm-text-bright">
          Cardápio
        </h1>
        
        {cartItemCount > 0 && (
          <Button 
            variant="atm-success" 
            size="default"
            onClick={() => { playBeep(); onViewCart(); }}
            className="flex items-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            Carrinho ({cartItemCount}) - {formatPrice(cartTotal)}
          </Button>
        )}
      </div>

      {/* Category tabs */}
      <div className="flex gap-4 mb-8">
        <Button 
          variant={currentCategory === 'executivo' ? 'atm-primary' : 'atm'}
          size="atm"
          onClick={() => {
            playBeep();
            setCurrentCategory('executivo');
          }}
        >
          Pratos Executivos
        </Button>
        <Button 
          variant={currentCategory === 'adicional' ? 'atm-primary' : 'atm'}
          size="atm"
          onClick={() => {
            playBeep();
            setCurrentCategory('adicional');
          }}
        >
          Adicionais
        </Button>
      </div>

      {/* Menu items */}
      <div className="grid gap-4 max-h-96 overflow-y-auto">
        {currentItems.map((item, index) => (
          <Button
            key={item.id}
            variant={selectedIndex === index ? 'atm-primary' : 'atm'}
            size="atm"
            onClick={() => {
              playConfirm();
              onSelectItem(item);
            }}
            className={`justify-between text-left h-auto py-4 ${
              selectedIndex === index ? 'ring-2 ring-primary' : ''
            }`}
          >
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-3">
                <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                  {item.id}
                </span>
                <span className="font-bold text-lg">{item.name}</span>
              </div>
              {item.description && (
                <p className="text-sm text-muted-foreground mt-1 ml-11">
                  {item.description}
                </p>
              )}
            </div>
            <span className="text-xl font-bold text-success">
              {formatPrice(item.price)}
            </span>
          </Button>
        ))}
      </div>

      {/* Instructions */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>Digite o número do prato ou use as setas ↑↓ e Enter para selecionar</p>
      </div>
    </ATMScreen>
  );
};