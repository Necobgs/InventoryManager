// components/DefaultDialog.tsx
import React from 'react';
import { Dialog, Portal, Button, Text } from 'react-native-paper';
import { PaperProvider } from 'react-native-paper';


interface DefaultDialogProps {
  visible: boolean;
  onDismiss: () => void;
  title: string;
  text: string;
}

const DefaultDialog: React.FC<DefaultDialogProps> = ({ visible, onDismiss, title, text }) => (
  <PaperProvider>
  <Portal>
    <Dialog visible={visible} onDismiss={onDismiss}>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Content>
        <Text>{text}</Text>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={onDismiss}>OK</Button>
      </Dialog.Actions>
    </Dialog>
  </Portal>
  </PaperProvider>
);

export default DefaultDialog;
