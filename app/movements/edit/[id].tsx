import DefaultDialog from "@/components/DefaultDialog";
import { FormInput } from "@/components/FormInput";
import { Text, View } from "@/components/Themed";
import { useInventory } from "@/contexts/InventoryContext";
import { useMovements } from "@/contexts/MovementsContext";
import { useUser } from "@/contexts/UserContext";
import { MovementsInterface } from "@/interfaces/MovementsInterface";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import ModalDropdownInventory from '@/components/ModalDropdownInventory';
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
        quantity: movement?.quantity,
        qty_product: !inventory?.qty_product || !movement?.quantity ? 0 : inventory.qty_product + movement.quantity,
        price_per_unity: inventory?.price_per_unity,
        value: !inventory?.price_per_unity || !movement?.quantity ? 0 : inventory.price_per_unity * movement.quantity,
        },
        resolver: yupResolver(schema),
    });

    const quantity = watch('quantity');
    const inventorySel = watch('inventory');
    
    useEffect(() => {
        const inventory_obj_sel = inventoryContext.getInventoryBy("id", !inventorySel?.id ? 0 : inventorySel.id)?.[0];

        if (inventory_obj_sel){

            if (inventory_obj_sel.id === inventory.id) {
                setValue('qty_product', inventory_obj_sel.qty_product + movement.quantity);
            }
            else {
                setValue('qty_product', inventory_obj_sel.qty_product);
            }

            setValue('price_per_unity', inventory_obj_sel.price_per_unity);
            setValue('value', inventory_obj_sel.price_per_unity * quantity);
        }
    }, [quantity, inventorySel, setValue]);

    const updateMovement = (data: MovementsFormType) => {

        const newData: MovementsInterface = {
            id: +id,
            id_inventory: !data?.inventory?.id ? 0 : data.inventory.id,
            id_user: !userLogged?.id ? 0 : userLogged.id,
            quantity: data.quantity,
            value: 0,
            price_at_time: 0,
            date: new Date(),
        }
        const response = movementsContext.updateMovement(newData);
        setDialogTitle(response.success ? 'Sucesso' : 'Erro');
        setDialogText(response.message);
        setDialogVisible(true);
    };

    const removeMovement = () => {
        const response = movementsContext.removeMovementById(+id);
        setDialogTitle(response.success ? 'Sucesso' : 'Erro');
        setDialogText(response.message);
        setDialogVisible(true);
        if(response.success) {
            router.navigate("/movements");
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.formModal}>

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
                label="Quantidade Movementação"
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
                label="Preço por unidade"
                isCurrency
                disabled
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
                    Excluir movementação
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
    backgroundColor:'#ffff',
    padding:25,
    borderRadius:10,
    gap:15}
});


export default EditMovements;