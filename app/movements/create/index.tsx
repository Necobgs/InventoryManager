import DefaultDialog from "@/components/DefaultDialog";
import { FormInput } from "@/components/FormInput";
import { View } from "@/components/Themed";
import { useInventory } from "@/contexts/InventoryContext";
import { useMovements } from "@/contexts/MovementsContext";
import { useUser } from "@/contexts/UserContext";
import { MovementsInterface } from "@/interfaces/MovementsInterface";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import * as yup from 'yup';
import MovementsFormType from "@/types/MovementsFormType";
import ComboBoxForm from "@/components/ComboBoxForm";

const schema = yup.object().shape({
    inventory: yup
    .object({
        id:yup.number().required(),
        title: yup.string().required(),
    })
    .required("selecione um produto")
    .nullable(),
    operation: yup
    .object({
        id:yup.number().required(),
        title: yup.string().required(),
    })
    .required("selecione uma operação")
    .nullable(),
    quantity: yup
    .number()
    .typeError('Quantidade deve ser um número')
    .min(1, 'Não pode ser negativo ou zero')
    .required('Quantidade é obrigatória'),
    qty_product:yup.number().required(),
    price_per_unity:yup.number().required(),
    value:yup.number().required(),
});

const CreateMovements: React.FC = () => {
    const movementsContext = useMovements();
    const inventoryContext = useInventory();
    const { userLogged } = useUser();
    const inventorys = inventoryContext.getInventoryBy("enabled", true);

    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogText, setDialogText] = useState('');

    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm<MovementsFormType>({
        defaultValues: {
        inventory: null,
        operation: {id: 1, title: "Entrada"},
        quantity: 0,
        qty_product: 0,
        price_per_unity: 0,
        value: 0,
        },
        resolver: yupResolver(schema),
    });

    const quantity = watch('quantity');
    const inventorySel = watch('inventory');
    const operationSel = watch("operation");

    useEffect(() => {
        const inventory = inventoryContext.getInventoryBy("id", !inventorySel?.id ? 0 : inventorySel.id)?.[0];

        if (inventory){
            setValue('qty_product', inventory.qty_product);
            setValue('price_per_unity', inventory.price_per_unity);
            setValue('value', inventory.price_per_unity * quantity);
        }
    }, [quantity, inventorySel, operationSel, setValue]);

    const onSubmit = (data: MovementsFormType) => {

        const newData: MovementsInterface = {
            id: 0,
            id_inventory: !data.inventory?.id ? 0 : data.inventory.id,
            id_user: !userLogged?.id ? 0 : userLogged.id,
            quantity: data.operation?.id === 2 ? data.quantity * -1 : data.quantity,
            value: 0,
            price_at_time: 0,
            date: new Date(),
        }
        const response = movementsContext.addMovement(newData);
        setDialogTitle(response.success ? 'Sucesso' : 'Erro');
        setDialogText(response.message);
        setDialogVisible(true);
        if(response.success) reset(); // limpa o formulário
    };

    return (
        <View style={styles.container}>
            <View style={styles.formModal}>

            <ComboBoxForm
                data={[{id: 1, title: "Entrada"},{id: 2, title: "Saída"}]}
                control={control}
                name="operation"
                label="Operação"
                displayKey={'title'}
                errors={errors}
            />

            <ComboBoxForm
                data={inventorys}
                control={control}
                name="inventory"
                label="Produto"
                displayKey={'title'}
                errors={errors}
            />

            <FormInput
                control={control}
                name="quantity"
                label="Quantidade Movimentação"
            />

            <FormInput
                control={control}
                name="qty_product"
                label="Quantidade em Estoque"
                disabled
            />

            <FormInput
                control={control}
                name="price_per_unity"
                label="Preço Unidade"
                isCurrency
                disabled
            />

            <FormInput
                control={control}
                name="value"
                label="Valor Total"
                isCurrency
                disabled
            />

            <Button mode="contained" onPress={handleSubmit(onSubmit)}>
                Cadastar movimentação
            </Button>

            <DefaultDialog
                visible={dialogVisible}
                onDismiss={() => setDialogVisible(false)}
                title={dialogTitle}
                text={dialogText}
            />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    alignItems:'center',
    justifyContent:'center',
    minHeight:'100%',
    backgroundColor:'rgb(242 242 242)',

  },
  fullWidth: {
    width: '100%',
    marginBottom: 10,
  },
  formModal:{
    maxWidth:800,
    width:'98%',
    maxHeight:'100%',
    backgroundColor:'#ffff',
    padding:25,
    borderRadius:10,
    gap:15,
    overflowY: 'auto',
  }
});


export default CreateMovements;