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
import { editMovement, initMovements, removeMovement, selectMovements } from "@/store/features/movementSlice";
import { editInventory, initInventorys, selectInventorys, selectInventorysEnabled } from "@/store/features/inventorySlice";
import { useAppDispatch } from "@/store/hooks";
import { selectUserLogged } from "@/store/features/userSlice";
import { globalStyles } from "@/styles/globalStyles";

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
    const inventorys_all = useSelector(selectInventorys);
    const inventorys = useSelector(selectInventorysEnabled);
    const inventory = inventorys_all.find(i => i.id === movement?.inventory?.id);
    const dispatch = useAppDispatch();

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
            id: inventory?.id,
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

    useEffect(() => {
        const inventory_sel_obj = inventorys_all.find(i => i.id === inventorySel?.id);

        if (inventory_sel_obj){
            setValue('qty_product', inventory_sel_obj.qty_product);
            setValue('price_per_unity', inventory_sel_obj.price_per_unity);
            setValue('value', inventory_sel_obj.price_per_unity * quantity);
        }

    }, [quantity, inventorySel, operationSel, setValue, inventorys_all]);


    const updateMovement = async(data: MovementsFormType) => {

        if (!movement) {
            setDialogTitle('Erro');
            setDialogText('Movimentação inexistente!');
            showDialog();
            return;
        }

        const inventory_data_original = inventorys_all.find(i => i.id === inventorySel?.id) || null;
        const user = userLogged ? userLogged : null;

        const newData: MovementInterface = {
            id: +id,
            inventory: inventory_data_original,
            user: user,
            quantity: data.operation?.id === 2 ? data.quantity * -1 : data.quantity,
            value: 0,
            price_at_time: 0,
            date: new Date(),
        }

        const inventory_data = inventory_data_original ? {...inventory_data_original} : null;

        if (!inventory_data) {
            setDialogTitle('Erro');
            setDialogText('Produto inexistente!'); 
            showDialog();
            return;
        }

        if (movement.inventory?.id === inventory_data.id) {
            if (movement.quantity !== newData.quantity) {

                let vqty_product = inventory_data.qty_product - movement.quantity;
                vqty_product += newData.quantity;

                if (vqty_product < 0) {
                    setDialogTitle('Erro');
                    setDialogText('Não há estoque suficiente para movimentar este produto'); 
                    showDialog();
                    return;
                }

                inventory_data.qty_product = vqty_product;
                inventory_data.stock_value = inventory_data.qty_product * inventory_data.price_per_unity;

                try {
                    await dispatch(editInventory(inventory_data)).unwrap();
                } catch (error: any) {
                    setDialogTitle('Erro');
                    setDialogText(error?.message || 'Erro ao alterar inventório');
                    showDialog();
                    return;
                }
            }
        } else {
            if ((newData.quantity < 0) && (inventory_data.qty_product < Math.abs(newData.quantity))) {
                setDialogTitle('Erro');
                setDialogText('Não há estoque suficiente para efetuar a saída deste produto');
                showDialog();
                return;
            }

            const oldIventory_original = inventorys_all.find(i => i.id === movement.inventory?.id);
            const oldIventory = oldIventory_original ? {...oldIventory_original} : null;

            if (oldIventory) {

                let vqty_product = oldIventory.qty_product - movement.quantity;

                if (vqty_product < 0) {
                    setDialogTitle('Erro');
                    setDialogText('Não é possível realizar essa movimentação, pois a quantidade do produto antigo ficará negativa');
                    showDialog();
                    return;
                }

                oldIventory.qty_product = vqty_product;
                oldIventory.stock_value = oldIventory.qty_product * oldIventory.price_per_unity;

                try {
                    await dispatch(editInventory(oldIventory)).unwrap();
                } catch (error: any) {
                    setDialogTitle('Erro');
                    setDialogText(error?.message || 'Erro ao alterar inventório antigo');
                    showDialog();
                    return;
                }
            }

            inventory_data.qty_product += newData.quantity;
            inventory_data.stock_value = inventory_data.qty_product * inventory_data.price_per_unity;

            try {
                await dispatch(editInventory(inventory_data)).unwrap();
            } catch (error: any) {
                setDialogTitle('Erro');
                setDialogText(error?.message || 'Erro ao alterar inventório');
                showDialog();
                return;
            }
        }

        movement.value = inventory_data.price_per_unity * Math.abs(newData.quantity);
        movement.price_at_time = inventory_data.price_per_unity;
        movement.inventory = inventory_data;

        try {
            await dispatch(editMovement(newData)).unwrap();
            setDialogTitle('Sucesso');
            setDialogText('Movimentação alterada com sucesso!');
            } catch (error: any) {
            setDialogTitle('Erro');
            setDialogText(error?.message || 'Erro ao alterar movimentação');
        }
        showDialog();
    };

    const removeMovementFunc = async(data: MovementsFormType) => {

        if (!movement) {
            setDialogTitle('Erro');
            setDialogText('Movimentação inexistente!');
            showDialog();
            return;
        }

        const inventory_data_original = inventorys_all.find(i => i.id === inventorySel?.id) || null;
        const user = userLogged ? userLogged : null;

        const newData: MovementInterface = {
            id: +id,
            inventory: inventory_data_original,
            user: user,
            quantity: data.operation?.id === 2 ? data.quantity * -1 : data.quantity,
            value: 0,
            price_at_time: 0,
            date: new Date(),
        }

        const inventory_data = inventory_data_original ? {...inventory_data_original} : null;

        if (inventory_data) {
            let vqty_product = inventory_data.qty_product - movement.quantity;

            if (vqty_product < 0) {
                return { message: "Não há estoque suficiente para excluir essa movimentação", success: false};
            }

            inventory_data.qty_product = vqty_product;
            inventory_data.stock_value = inventory_data.qty_product * inventory_data.price_per_unity;

            try {
                await dispatch(editInventory(inventory_data)).unwrap();
            } catch (error: any) {
                setDialogTitle('Erro');
                setDialogText(error?.message || 'Erro ao alterar inventório');
                showDialog();
                return;
            }
        }

        try {
            await dispatch(removeMovement(newData)).unwrap();
            dispatch(initMovements());
            router.navigate("/(tabs)/movements");
            } catch (error: any) {
            setDialogTitle('Erro');
            setDialogText(error?.message || 'Erro ao remover movimentação');
        }
        showDialog();
    }

    useEffect(() => {
        if (!inventorys[0]) {
            dispatch(initInventorys());
        }
    }, [dispatch]);

    return (
        <View style={globalStyles.container}>
            <View style={globalStyles.formModal}>

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