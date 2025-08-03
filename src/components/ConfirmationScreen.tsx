import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ATMScreen } from './ATMScreen';
import { Order } from '@/types/menu';
import { useSound } from '@/hooks/useSound';
import { CheckCircle, Printer, Home } from 'lucide-react';

interface ConfirmationScreenProps {
  order: Order;
  onNewOrder: () => void;
  onPrintReceipt?: () => void;
}

export const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({
  order,
  onNewOrder,
  onPrintReceipt
}) => {
  const { playConfirm } = useSound();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    playConfirm();
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onNewOrder();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onNewOrder, playConfirm]);

  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <ATMScreen className="text-center">
      {/* Success icon */}
      <div className="flex justify-center mb-8">
        <CheckCircle className="w-24 h-24 text-success animate-pulse-glow" />
      </div>

      {/* Success message */}
      <h1 className="text-4xl font-bold text-success mb-4">
        Pedido Confirmado!
      </h1>
      
      <div className="bg-card border-2 border-success rounded-lg p-6 mb-8 max-w-2xl mx-auto">
        <div className="text-left space-y-4">
          {/* Order details */}
          <div className="border-b border-border pb-4">
            <h2 className="text-xl font-bold text-atm-text-bright mb-2">
              Padoca da Kamila - Pedido #{order.id}
            </h2>
            <p className="text-sm text-muted-foreground">
              {formatDate(order.timestamp)} às {formatTime(order.timestamp)}
            </p>
          </div>

          {/* Items */}
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex-1">
                  <span className="font-medium">{item.quantity}x {item.name}</span>
                </div>
                <span className="font-bold">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="border-t border-border pt-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total:</span>
              <span className="text-success text-2xl">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="space-y-4 mb-8">
        <div className="flex gap-4 justify-center">
          {onPrintReceipt && (
            <Button 
              variant="atm" 
              size="atm"
              onClick={onPrintReceipt}
              className="flex items-center gap-2"
            >
              <Printer className="w-5 h-5" />
              Imprimir Comprovante
            </Button>
          )}
          
          <Button 
            variant="atm-primary" 
            size="atm"
            onClick={onNewOrder}
            className="flex items-center gap-2"
          >
            <Home className="w-5 h-5" />
            Novo Pedido
          </Button>
        </div>
      </div>

      {/* Auto redirect message */}
      <div className="text-sm text-muted-foreground">
        <p>Voltando ao início automaticamente em {countdown} segundos</p>
        <p className="mt-2">Obrigado pela preferência!</p>
      </div>
    </ATMScreen>
  );
};