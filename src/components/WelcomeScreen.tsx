import React from 'react';
import { Button } from '@/components/ui/button';
import { ATMScreen } from './ATMScreen';
import { useSound } from '@/hooks/useSound';

interface WelcomeScreenProps {
  onStartOrder: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartOrder }) => {
  const { playBeep } = useSound();

  const handleStart = () => {
    playBeep();
    onStartOrder();
  };

  return (
    <ATMScreen className="flex flex-col items-center justify-center text-center">
      {/* Logo area */}
      <div className="mb-12 animate-fade-in">
        <div className="w-32 h-32 mx-auto mb-6 flex items-center justify-center shadow-glow animate-pulse-glow">
          <img src="/src/assets/logo.svg" alt="Padoca da Kamila" className="w-full h-full" />
        </div>
        <h1 className="text-5xl font-bold text-atm-text-bright mb-4">
          Padoca da Kamila
        </h1>
        <p className="text-2xl text-muted-foreground">
          Padaria e Confeitaria
        </p>
      </div>

      {/* Welcome message */}
      <div className="mb-12 space-y-4">
        <h2 className="text-3xl font-semibold text-foreground">
          Bem-vindo ao Autoatendimento
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Faça seu pedido de forma rápida e prática
        </p>
      </div>

      {/* Start button */}
      <Button 
        variant="atm-primary" 
        size="atm-xl"
        onClick={handleStart}
        className="animate-fade-in"
      >
        Iniciar Pedido
      </Button>

      {/* Instructions */}
      <div className="mt-12 text-sm text-muted-foreground space-y-2">
        <p>• Use o mouse ou navegue com as setas do teclado</p>
        <p>• Digite o número da opção ou pressione Enter para selecionar</p>
        <p>• Pressione ESC para voltar ao menu anterior</p>
      </div>
    </ATMScreen>
  );
};