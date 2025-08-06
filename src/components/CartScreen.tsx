import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ATMScreen } from './ATMScreen';
import { CartItem } from '@/types/menu';
import { useSound } from '@/hooks/useSound';
import { useKeyboard } from '@/hooks/useKeyboard';
import { ArrowLeft, Trash2, Plus, Minus } from 'lucide-react';

interface CartScreenProps {
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: number, quantity: number) => void;
  onRemoveItem: (itemId: number) => void;
  onConfirmOrder: () => void;
  onBack: () => void;
  onContinueShopping: () => void;
}

export const CartScreen: React.FC<CartScreenProps> = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onConfirmOrder,
  onBack,
  onContinueShopping
}) => {
  const { playBeep, playConfirm, playError } = useSound();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  useKeyboard({
    onNumberPress: (number) => {
      playBeep();
      if (number >= 1 && number <= cartItems.length) {
        setSelectedIndex(number - 1);
      }
    },
    onEnter: () => {
      if (cartItems.length === 0) return;
      
      if (selectedIndex < cartItems.length) {
        // Remove item
        playError();
        onRemoveItem(cartItems[selectedIndex].id);
        if (selectedIndex >= cartItems.length - 1) {
          setSelectedIndex(Math.max(0, cartItems.length - 2));
        }
      }
    },
    onArrowUp: () => {
      playBeep();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : cartItems.length - 1);
    },
    onArrowDown: () => {
      playBeep();
      setSelectedIndex(prev => prev < cartItems.length - 1 ? prev + 1 : 0);
    },
    onEscape: () => {
      playBeep();
      onBack();
    }
  });

  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      playError();
      onRemoveItem(itemId);
    } else {
      playBeep();
      onUpdateQuantity(itemId, newQuantity);
    }
  };

  if (cartItems.length === 0) {
    return (
      <ATMScreen className="flex flex-col items-center justify-center text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-atm-text-bright mb-4">
            Carrinho Vazio
          </h1>
          <p className="text-xl text-muted-foreground">
            Adicione itens ao seu pedido para continuar
          </p>
        </div>

        <div className="space-y-4">
          <Button 
            variant="cart-orange" 
            size="atm-xl"
            onClick={() => { playBeep(); onContinueShopping(); }}
          >
            Continuar Comprando
          </Button>
          
          <Button 
            variant="cart-orange" 
            size="atm"
            onClick={() => { playBeep(); onBack(); }}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Button>
        </div>
      </ATMScreen>
    );
  }

  return (
    <ATMScreen>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <Button 
          variant="cart-orange" 
          size="default"
          onClick={() => { playBeep(); onBack(); }}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </Button>
        
        <h1 className="text-3xl font-bold text-atm-text-bright">
          Seu Pedido
        </h1>
        
        <Button 
          variant="cart-orange" 
          size="default"
          onClick={() => { playBeep(); onContinueShopping(); }}
        >
          Continuar Comprando
        </Button>
      </div>

      {/* Cart items */}
      <div className="space-y-4 max-h-80 overflow-y-auto mb-8">
        {cartItems.map((item, index) => (
          <div
            key={item.id}
            className={`bg-card border-2 rounded-lg p-4 transition-all ${
              selectedIndex === index 
                ? 'border-primary bg-primary/10' 
                : 'border-border'
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <h3 className="font-bold text-lg text-foreground">{item.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {formatPrice(item.price)} cada
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="cart-orange"
                    size="icon"
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className="h-8 w-8"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  
                  <span className="w-12 text-center font-bold text-lg">
                    {item.quantity}
                  </span>
                  
                  <Button
                    variant="cart-orange"
                    size="icon"
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="h-8 w-8"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="text-right min-w-[100px]">
                  <div className="font-bold text-lg text-success">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
                
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => {
                    playError();
                    onRemoveItem(item.id);
                  }}
                  className="h-8 w-8"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total and actions */}
      <div className="border-t-2 border-border pt-6">
        <div className="flex justify-between items-center mb-6">
          <span className="text-2xl font-bold text-foreground">Total:</span>
          <span className="text-3xl font-bold text-success">
            {formatPrice(total)}
          </span>
        </div>

        <div className="flex gap-4 justify-center">
          <Button 
            variant="cart-orange" 
            size="atm-xl"
            onClick={() => { playConfirm(); onConfirmOrder(); }}
            className="flex-1 max-w-md"
          >
            Confirmar Pedido
          </Button>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 text-center text-sm text-muted-foreground">
        <p>Use os botões + e - para alterar quantidades • Enter para remover item selecionado</p>
      </div>
    </ATMScreen>
  );
};