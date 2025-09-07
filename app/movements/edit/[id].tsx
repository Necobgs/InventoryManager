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
import { useLocalSearchParams, useRouter } from "expo-router";
import ComboBoxForm from "@/components/ComboBoxForm";

const schema = yup.object().shape({
    quantity: yup
    .number()
    .typeError('Quantidade deve ser um número')
    .min(1, 'Não pode ser negativo ou zero')
    .required('Quantidade é obrigatória'),
    operation: yup
    .object({
        id:yup.number().required(),
        title: yup.string().required(),
    })
    .required("selecione uma operação")
    .nullable(),
    inventory: yup
    .object({
        id:yup.number().required(),
        title: yup.string().required(),
    })
    .required("selecione uma categoria")
    .nullable(),
    qty_product:yup.number().required(),
    price_per_unity:yup.number().required(),
    value:yup.number().required(),
});

const EditMovements: React.FC = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const movementsContext = useMovements();
    const inventoryContext = useInventory();
    const router = useRouter();
    const { userLogged } = useUser();
    const movement = movementsContext.getMovementsBy("id", +id)?.[0];
    const inventory = inventoryContext.getInventoryBy("id", !movement?.id_inventory ? 0 : movement.id_inventory)?.[0];
    const inventorys = inventoryContext.getInventoryBy("enabled", true);

    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogText, setDialogText] = useState('');
    const [alterInventory, setAlterInventory] = useState(false);
    const [alterPrice, setAlterPrice] = useState(false);
    const [disablePrice, setDisablePrice] = useState(false);

    const showDialog = () => {
    
        setDialogVisible(true);

        setTimeout(() => {
        setDialogVisible(false);
        }, 4000);
    };

    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm<MovementsFormType>({
        defaultValues: {
        inventory: {
            id: inventory?.id,
            title: inventory?.title,
        },
        operation: movement?.quantity > 0 ? {id: 1, title: "Entrada"} : {id: 2, title: "Saída"},
        quantity: Math.abs(movement?.quantity),
        qty_product: !inventory?.qty_product ? 0 : inventory.qty_product,
        price_per_unity: movement?.quantity > 0 ? movement?.price_at_time : inventory?.price_per_unity,
        value: !inventory?.price_per_unity || !movement?.quantity ? 0 : inventory.price_per_unity * Math.abs(movement.quantity),
        },
        resolver: yupResolver(schema),
    });

    const price_per_unity = watch('price_per_unity');
    const quantity = watch('quantity');
    const inventorySel = watch('inventory');
    const operationSel = watch("operation");

    useEffect(() => {
        setAlterPrice(true);
    }, [price_per_unity]);
    
    useEffect(() => {
        setAlterInventory(true);
    }, [inventorySel]);

    useEffect(() => {
        const inventory_obj_sel = inventoryContext.getInventoryBy("id", !inventorySel?.id ? 0 : inventorySel.id)?.[0];

        if (inventory_obj_sel){

            if (operationSel?.id === 2 || (quantity === 0 && !alterPrice) || alterInventory) {
                setValue('price_per_unity', inventory.price_per_unity);
                setValue('value', inventory.price_per_unity * quantity);
                setDisablePrice(true);
            }
            else {
                setValue('price_per_unity', price_per_unity);
                setValue('value', price_per_unity * quantity);
                setDisablePrice(false);
            }
        }

        setAlterPrice(false);
        setAlterInventory(false);
    }, [quantity, inventorySel, operationSel, price_per_unity, setValue]);

    const updateMovement = (data: MovementsFormType) => {

        const newData: MovementsInterface = {
            id: +id,
            id_inventory: !data?.inventory?.id ? 0 : data.inventory.id,
            id_user: !userLogged?.id ? 0 : userLogged.id,
            quantity: data.operation?.id === 2 ? data.quantity * -1 : data.quantity,
            value: 0,
            price_at_time: 0,
            date: new Date(),
        }
        const response = movementsContext.updateMovement(newData);
        setDialogTitle(response.success ? 'Sucesso' : 'Erro');
        setDialogText(response.message);
        showDialog();
    };

    const removeMovement = () => {
        const response = movementsContext.removeMovementById(+id);
        setDialogTitle(response.success ? 'Sucesso' : 'Erro');
        setDialogText(response.message);
        showDialog();

        if(response.success) {
            router.navigate("/(tabs)/movements");
            return;
        }
    }

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
                label="Quantidade em estoque atual"
                disabled
            />

            <FormInput
                control={control}
                name="price_per_unity"
                label="Preço por unidade"
                isCurrency
                disabled={disablePrice}
            />

            <FormInput
                control={control}
                name="value"
                label="Novo Valor Total"
                isCurrency
                disabled
            />

            <View style={styles.areaButtons}>
                <Button mode="outlined" style={{ width: '45%' }} onPress={handleSubmit(removeMovement)}>
                    Excluir movimentação
                </Button>
                <Button
                    mode="contained"
                    style={{ width: '45%' }}
                    onPress={handleSubmit(updateMovement)}
                >
                    Salvar alterações
                </Button>
            </View>

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
  areaButtons:{ 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginTop: 15 
  },
  formModal:{
    maxWidth:800,
    width:'98%',
    maxHeight:'100%',
    minHeight: 'auto',
    backgroundColor:'#ffff',
    padding:25,
    borderRadius:10,
    gap:15,
    overflowY: 'auto',
  }
});


export default EditMovements;