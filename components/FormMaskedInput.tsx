import React from 'react';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { HelperText } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import MaskInput from 'react-native-mask-input';
import useTheme from '@/contexts/ThemeContext';

interface FormMaskedInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  mask: (string | RegExp)[];
  withFormatting?: boolean;
}

export const FormMaskedInput = <T extends FieldValues>({
  control,
  name,
  label,
  mask,
  withFormatting
}: FormMaskedInputProps<T>) => {
  const { theme } = useTheme();
  const defaultStyles = StyleSheet.create({
    container: {
      width: '100%',
      marginBottom: 10,
    },
    input: {
      borderWidth: theme === "dark" ? 0 : 1,
      borderBottomWidth: 1,
      borderRadius: 4,
      padding: 16,
      height: theme === "dark" ? 56 : 50,
      outlineColor: 'rgb(103, 80, 164)',
      color: 'rgb(28, 27, 31)',
      backgroundColor: theme === "dark" ? "rgb(231, 224, 236)" : "white",
      fontSize: 16,
      marginTop: theme === "dark" ? 0 : 6,
      fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
    },
  });

  return (
    <View style={defaultStyles.container}>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            {error && <HelperText type="error">{error.message}</HelperText>}
            <MaskInput
              value={value ?? ''}
              onChangeText={(masked, unmasked) => onChange(withFormatting ? masked : unmasked)}
              mask={mask}
              keyboardType="numeric"
              placeholder={label}
              placeholderTextColor="rgb(73, 69, 79)"
              style={{...defaultStyles.input,  borderColor: error ? 'rgb(179, 38, 30)' : 'rgb(121, 116, 126)',}}
            />
          </>
        )}
      />
    </View>
  );
};
