import React, { useState, useCallback, useEffect } from 'react';
import { WelcomeScreen } from './WelcomeScreen';
import { MenuScreen } from './MenuScreen';
import { CartScreen } from './CartScreen';
import { ConfirmationScreen } from './ConfirmationScreen';
import { MenuItem, CartItem, Order } from '@/types/menu';
import { useToast } from '@/hooks/use-toast';

type Screen = 'welcome' | 'menu' | 'cart' | 'confirmation';

export const ATMSystem: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const { toast } = useToast();

  // Reset system on page load
  useEffect(() => {
    document.body.style.cursor = 'default';
    document.body.style.fontSize = '18px';
  }, []);

  const generateOrderId = () => {
    return Date.now().toString().slice(-6);
  };

  const addToCart = useCallback((item: MenuItem) => {
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });

    toast({
      title: "Item adicionado!",
      description: `${item.name} foi adicionado ao carrinho`,
      duration: 2000,
    });
  }, [toast]);

  const updateQuantity = useCallback((itemId: number, quantity: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  }, []);

  const removeFromCart = useCallback((itemId: number) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
    
    toast({
      title: "Item removido",
      description: "Item removido do carrinho",
      duration: 2000,
    });
  }, [toast]);

  const calculateTotal = useCallback(() => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cartItems]);

  const confirmOrder = useCallback(() => {
    const order: Order = {
      id: generateOrderId(),
      items: [...cartItems],
      total: calculateTotal(),
      timestamp: new Date()
    };

    setCurrentOrder(order);
    setCurrentScreen('confirmation');
    
    toast({
      title: "Pedido confirmado!",
      description: `Pedido #${order.id} realizado com sucesso`,
      duration: 3000,
    });
  }, [cartItems, calculateTotal, toast]);

  const startNewOrder = useCallback(() => {
    setCartItems([]);
    setCurrentOrder(null);
    setCurrentScreen('welcome');
  }, []);

  const printReceipt = useCallback(() => {
    if (currentOrder) {
      // Simulate printing
      const printContent = `
        ========================================
        PADOCA DA KAMILA - PEDIDO #${currentOrder.id}
        ========================================
        ${currentOrder.timestamp.toLocaleString('pt-BR')}
        
        ${currentOrder.items.map(item => 
          `${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}`
        ).join('\n')}
        
        ----------------------------------------
        TOTAL: R$ ${currentOrder.total.toFixed(2)}
        ========================================
        Obrigado pela preferência!
      `;
      
      console.log(printContent);
      
      toast({
        title: "Comprovante enviado",
        description: "Comprovante enviado para impressão",
        duration: 2000,
      });
    }
  }, [currentOrder, toast]);

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = calculateTotal();

  switch (currentScreen) {
    case 'welcome':
      return (
        <WelcomeScreen 
          onStartOrder={() => setCurrentScreen('menu')} 
        />
      );

    case 'menu':
      return (
        <MenuScreen
          onSelectItem={addToCart}
          onViewCart={() => setCurrentScreen('cart')}
          onBack={() => setCurrentScreen('welcome')}
          cartItemCount={cartItemCount}
          cartTotal={cartTotal}
        />
      );

    case 'cart':
      return (
        <CartScreen
          cartItems={cartItems}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          onConfirmOrder={confirmOrder}
          onBack={() => setCurrentScreen('menu')}
          onContinueShopping={() => setCurrentScreen('menu')}
        />
      );

    case 'confirmation':
      return currentOrder ? (
        <ConfirmationScreen
          order={currentOrder}
          onNewOrder={startNewOrder}
          onPrintReceipt={printReceipt}
        />
      ) : null;

    default:
      return null;
  }
};