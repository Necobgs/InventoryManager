import DefaultDialog from "@/components/DefaultDialog";
import { FormInput } from "@/components/FormInput";
import { Text, View } from "@/components/Themed";
import { useInventory } from "@/contexts/InventoryContext";
import { useMovements } from "@/contexts/MovementsContext";
import { useUser } from "@/contexts/UserContext";
import { MovementsInterface } from "@/interfaces/MovementsInterface";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import ModalDropdownInventory from '@/components/ModalDropdownInventory';
import * as yup from 'yup';
import MovementsFormType from "@/types/MovementsFormType";
import { useLocalSearchParams, useRouter } from "expo-router";

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
    .nullable()
});

const EditMovements: React.FC = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const MovementsContext = useMovements();
    const inventoryContext = useInventory();
    const router = useRouter();
    const { userLogged } = useUser();
    const moviment = MovementsContext.getMovementsBy("id", +id)?.[0];
    const inventory = inventoryContext.getInventoryBy("id", !moviment?.id_inventory ? 0 : moviment.id_inventory)?.[0];

    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogText, setDialogText] = useState('');

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<MovementsFormType>({
        defaultValues: {
        inventory: {
            id: inventory?.id,
            title: inventory?.title,
        },
        quantity: moviment?.quantity,
        },
        resolver: yupResolver(schema),
    });

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
        const response = MovementsContext.updateMovement(newData);
        setDialogTitle(response.success ? 'Sucesso' : 'Erro');
        setDialogText(response.message);
        setDialogVisible(true);
    };

    const removeMovement = () => {
        const response = MovementsContext.removeMovementById(+id);
        setDialogTitle(response.success ? 'Sucesso' : 'Erro');
        setDialogText(response.message);
        setDialogVisible(true);
        if(response.success) {
            router.navigate("/movements");
        }
    }

    return (
        <View style={styles.container}>
            {!moviment ? 
            <Text>Movimentação não encontrada</Text>:
            <View style={styles.formModal}>

            <FormInput
                control={control}
                name="quantity"
                label="Quantidade em estoque"
            />

            <Text style={{marginBottom:5,marginLeft:5}}>Produto</Text>
            <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between'}}>
            <Controller
                control={control}
                name="inventory"
                render={({ field: { onChange, value } }) => (
                <>
                    <ModalDropdownInventory 
                    data={inventoryContext.inventorys}
                    initialValue={value}
                    onSelect={(inventorySelected)=>onChange(inventorySelected)}/>
                </>
                )}
            />

            <View style={styles.areaButtons}>

                <Button mode="outlined" style={{ width: '45%' }} onPress={handleSubmit(removeMovement)}>
                    Excluir produto
                </Button>
                <Button
                    mode="contained"
                    style={{ width: '45%' }}
                    onPress={handleSubmit(updateMovement)}
                >
                    Salvar alterações
                </Button>
            </View>

            </View>

            <DefaultDialog
                visible={dialogVisible}
                onDismiss={() => setDialogVisible(false)}
                title={dialogTitle}
                text={dialogText}
            />
            </View>}
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