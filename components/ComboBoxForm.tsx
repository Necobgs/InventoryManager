import { Button, HelperText, Text } from "react-native-paper";
import { View } from "./Themed";
import { Controller, Control, FieldErrors, Path } from "react-hook-form";
import ModalDropdown from "./ModalDropdownCategory";
import { StyleProp, ViewStyle } from "react-native";
import useTheme from "@/contexts/ThemeContext";

// Interface base para itens do dropdown
interface DropdownItem {
  id: string | number;
  [key: string]: any;
}

// Tipagem genérica para o formulário e o item do dropdown
interface ComboBoxFormProps<T extends Record<string, any>, U extends DropdownItem> {
  data: U[]; // Lista de opções do dropdown
  control: Control<T>; // Controle do react-hook-form
  name: Path<T>; // Nome do campo no formulário
  label: string; // Rótulo do campo
  errors: FieldErrors<T>; // Erros do formulário
  initialValue?: U | null; // Valor inicial opcional
  containerStyle?: StyleProp<ViewStyle>; // Estilo opcional para o container
  onSelect?: (value: U) => void; // Callback opcional para seleção
  displayKey: keyof U; // Propriedade usada para exibição
}

export default function ComboBoxForm<T extends Record<string, any>, U extends DropdownItem>({
  data,
  control,
  name,
  label,
  errors,
  initialValue,
  containerStyle,
  onSelect,
  displayKey,
}: ComboBoxFormProps<T, U>) {
  const { theme } = useTheme();

  return (
    <View style={{backgroundColor: (theme === "dark" ? "rgb(231, 224, 236)" : "white"), width: "100%", position: "relative", borderRadius: 5}}>
      
      <Text style={{ position: "absolute", top: -6, left: 12, fontSize: 12, color: "rgb(50, 50, 50)", zIndex: 2, paddingRight: 5, paddingLeft: 5, borderRadius: 10, backgroundColor: theme === "dark" ? "rgb(231, 224, 236)" : "white"}}>{label}</Text>

      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <>
            <ModalDropdown
              data={data}
              initialValue={value || initialValue}
              onSelect={(selectedValue) => {
                onChange(selectedValue);
                onSelect?.(selectedValue);
              }}
              displayKey={displayKey}
            />
            {errors[name] && (
              <HelperText type="error">
                {(errors[name]?.message as string) ?? "Este campo é obrigatório"}
              </HelperText>
            )}
          </>
        )}
      />
    </View>
  );
}