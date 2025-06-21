import React, { useState } from 'react';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { HelperText, TextInput } from 'react-native-paper';
import { StyleSheet, View, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { formatCurrency } from '@/common/FormatCurrency';
import { parseCurrency } from '@/common/PasseCurrency';

interface FormInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  multiline?: boolean;
  disabled?: boolean;
  isCurrency?: boolean;
  isPassword?: boolean;
  styles?: {
    container?: StyleProp<ViewStyle>;
    input?: StyleProp<TextStyle>;
  };
}

export const FormInput = <T extends FieldValues>({
  control,
  name,
  label,
  keyboardType = 'default',
  multiline = false,
  disabled = false,
  isCurrency = false,
  isPassword = false,
  styles = {},
}: FormInputProps<T>) => {

  const [showPassword,setShowPassword] = useState(false);
  
  function handlerPassword(){

    setShowPassword((oldValue)=>!oldValue)
  }


  return (
  <View style={styles.container ?? defaultStyles.container}>
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <>
          {error && <HelperText type="error">{error.message}</HelperText>}
          <TextInput
            label={label}
            mode="outlined"
            keyboardType={keyboardType}
            multiline={multiline}
            numberOfLines={multiline ? 5 : 1}
            style={styles.input ?? defaultStyles.input}
            secureTextEntry={isPassword && !showPassword}
            right={isPassword && <TextInput.Icon icon={!showPassword ? "eye" : "eye-off"} onPress={handlerPassword}/>}
            value={
              isCurrency && typeof value === 'number'
                ? formatCurrency(value)
                : value != null
                ? String(value)
                : ''
            }
            onBlur={onBlur}
            onChangeText={
                disabled
                ? undefined
                : (text: string) => {
                    if (isCurrency) {
                        const parsed = parseCurrency(text);
                        onChange(parsed);
                    } else {
                        onChange(text);
                    }
                    }
            }

            error={!!error}
            disabled={disabled}
            accessible
            accessibilityLabel={label}
          />
        </>
      )}
    />
  </View>
)};

const defaultStyles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 10,
  },
  input: {
    // estilos default opcionais
  },
});
