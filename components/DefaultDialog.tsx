// components/DefaultDialog.tsx
import useTheme from '@/contexts/ThemeContext';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Dialog, Portal, Button, Text } from 'react-native-paper';
import { PaperProvider } from 'react-native-paper';


interface DefaultDialogProps {
  visible: boolean;
  onDismiss: () => void;
  title: string;
  text: string;
}

const DefaultDialog: React.FC<DefaultDialogProps> = ({ visible, onDismiss, title, text }) => {
  return (
    <PaperProvider>
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
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
};

const styles = StyleSheet.create({
  dialog: {
    position: 'fixed',
    top: 80,
    marginLeft: 0,
    marginRight: 0,
    left: 20,
    right: 20,
  }
});

export default DefaultDialog;
