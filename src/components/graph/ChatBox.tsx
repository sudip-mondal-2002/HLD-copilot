import { TextField } from '@mui/material';
import React from 'react';
import { useHldGenerator } from '@/hooks/useHldGenerator';

export const ChatBox = () => {
  const [chatMessage, setChatMessage] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { chat } = useHldGenerator();
  return (
    <TextField
      fullWidth={true}
      margin={'normal'}
      placeholder={'Tell how do you like it?'}
      label={'Chat with the Bot'}
      value={chatMessage}
      disabled={isLoading}
      helperText={isLoading ? 'Loading...' : 'Press Enter to send'}
      onChange={e => {
        setChatMessage(e.target.value);
      }}
      onKeyDownCapture={async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
          setIsLoading(true);
          await chat(chatMessage);
          setChatMessage('');
          setIsLoading(false);
        }
      }}
    />
  );
};
