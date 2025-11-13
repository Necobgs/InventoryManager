import DefaultDialog from "@/components/DefaultDialog";
import { FormInput } from "@/components/FormInput";
import { View } from "@/components/Themed";
import { MovementInterface } from "@/interfaces/MovementInterface";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "react-native-paper";
import * as yup from 'yup';
import MovementsFormType from "@/types/MovementsFormType";
import { useLocalSearchParams, useRouter } from "expo-router";
import ComboBoxForm from "@/components/ComboBoxForm";
import { useSelector } from "react-redux";
import { editMovement, removeMovement, selectMovementError, selectMovements } from "@/store/features/movementSlice";
import { initInventorysComboBox, selectInventorysComboBox } from "@/store/features/inventorySlice";
import { useAppDispatch } from "@/store/hooks";
import { selectUserLogged } from "@/store/features/userSlice";
import { globalStyles } from "@/styles/globalStyles";
import useTheme from "@/contexts/ThemeContext";

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
    const router = useRouter();
    const userLogged = useSelector(selectUserLogged);
    const movements = useSelector(selectMovements);
    const movement = movements.find(m => m.id === +id);
    const inventorys = useSelector(selectInventorysComboBox);
    const [inventory, setInventory] = useState(movement?.inventory);
    const dispatch = useAppDispatch();
    const { theme } = useTheme();
    const error = useSelector(selectMovementError);
    const [isError, setIsError] = useState(false);

    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogText, setDialogText] = useState('');

    const showDialog = () => {
    
        setDialogVisible(true);

        setTimeout(() => {
        setDialogVisible(false);
        }, 4000);
    };

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<MovementsFormType>({
        defaultValues: {
        inventory: {
            id: inventory?.id ,
            title: inventory?.title,
        },
        operation: movement?.quantity ? (movement?.quantity > 0 ? {id: 1, title: "Entrada"} : {id: 2, title: "Saída"}) : {id: 2, title: "Saída"},
        quantity: movement?.quantity ? Math.abs(movement?.quantity) : 0,
        qty_product: !inventory?.qty_product ? 0 : inventory.qty_product,
        price_per_unity: movement?.quantity ? (movement?.quantity > 0 ? movement?.price_at_time : inventory?.price_per_unity) : 0,
        value: !inventory?.price_per_unity || !movement?.quantity ? 0 : inventory.price_per_unity * Math.abs(movement.quantity),
        },
        resolver: yupResolver(schema),
    });

    const quantity = watch('quantity');
    const inventorySel = watch('inventory');
    const operationSel = watch("operation");

    const updateMovement = async(data: MovementsFormType) => {

        if (!movement) {
            setDialogTitle('Erro');
            setDialogText('Movimentação inexistente!');
            showDialog();
            return;
        }

        const newData: MovementInterface = {
            id: +id,
            inventory: data.inventory,
            user: userLogged,
            quantity: data.operation?.id === 2 ? data.quantity * -1 : data.quantity,
            movement_value: 0,
            price_at_time: 0,
        }

        try {
            await dispatch(editMovement(newData)).unwrap();
            setDialogTitle('Sucesso');
            setDialogText('Movimentação alterada com sucesso!');
            showDialog();
            } catch (error: any) {
            setIsError(true);
        }
    };

    const removeMovementFunc = async(data: MovementsFormType) => {

        if (!movement) {
            setDialogTitle('Erro');
            setDialogText('Movimentação inexistente!');
            showDialog();
            return;
        }

        const newData: MovementInterface = {
            id: +id,
            inventory: data.inventory,
            user: userLogged,
            quantity: data.operation?.id === 2 ? data.quantity * -1 : data.quantity,
            movement_value: 0,
            price_at_time: 0,
        }

        try {
            await dispatch(removeMovement(newData)).unwrap();
            router.navigate("/(tabs)/movements");
            } catch (error: any) {
            setIsError(true);

        }
    }

    useEffect(() => {
        const inventory_sel_obj = inventorys.find(i => i.id === inventorySel?.id);

        if (inventory_sel_obj){
            setValue('qty_product', inventory_sel_obj.qty_product);
            setValue('price_per_unity', inventory_sel_obj.price_per_unity);
            setValue('value', inventory_sel_obj.price_per_unity * quantity);
        }

    }, [quantity, inventorySel, operationSel, setValue, inventorys]);

    useEffect(() => {
        dispatch(initInventorysComboBox({title: '', description: '', enabled: true}));
    }, [dispatch]);

    useEffect(() => {
        const inventory_obj = inventorys.find(i => i.id === movement?.inventory?.id);

        if (inventory_obj?.enabled) {
            setInventory(inventory_obj)
        }
    }, [inventorys])

    useEffect(() => {

      if (isError) {
        setDialogTitle('Erro');
        setDialogText(error  || 'Erro ao alterar ou remover movimentação');
        showDialog();
        setIsError(false);
      }

    }, [error, isError]);

    return (
        <View style={globalStyles.container}>
            <View style={{...globalStyles.formModal, backgroundColor: theme === "dark" ? "rgb(210, 210, 210)" : "white"}}>

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
                label="Item"
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
                disabled={true}
            />

            <FormInput
                control={control}
                name="value"
                label="Novo Valor Total"
                isCurrency
                disabled
            />

            <View style={globalStyles.areaButtons}>
                <Button mode="outlined" style={{ width: '45%' }} onPress={handleSubmit(removeMovementFunc)}>
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

export default EditMovements;