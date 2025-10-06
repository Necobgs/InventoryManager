import DefaultDialog from "@/components/DefaultDialog";
import { FormInput } from "@/components/FormInput";
import { View } from "@/components/Themed";
import { MovementForm } from "@/interfaces/MovementInterface";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import * as yup from 'yup';
import MovementsFormType from "@/types/MovementsFormType";
import ComboBoxForm from "@/components/ComboBoxForm";
import { useAppDispatch } from "@/store/hooks";
import { useSelector } from "react-redux";
import { selectUserLogged } from "@/store/features/userSlice";
import { editInventory, initInventorys, selectInventorys, selectInventorysEnabled } from "@/store/features/inventorySlice";
import { addMovement } from "@/store/features/movementSlice";

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
    const userLogged = useSelector(selectUserLogged);
    const inventorys_all = useSelector(selectInventorys);
    const inventorys = useSelector(selectInventorysEnabled);
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
        const inventory = inventorys_all.find(i => i.id === inventorySel?.id);

        if (inventory){
            setValue('qty_product', inventory.qty_product);
            setValue('price_per_unity', inventory.price_per_unity);
            setValue('value', inventory.price_per_unity * quantity);
        }
    }, [quantity, inventorySel, operationSel, setValue, inventorys_all]);

    useEffect(() => {
        if (!inventorys[0]) {
            dispatch(initInventorys());
        }
    }, [dispatch]);
      
    const onSubmit = async (data: MovementsFormType) => {

        const inventory_data_original = inventorys_all.find(i => i.id === inventorySel?.id) || null;
        const user = userLogged ? userLogged : null;

        const newData: MovementForm = {
            inventory: inventory_data_original,
            user: user || null,
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

        if ((newData.quantity < 0) && (inventory_data.qty_product < Math.abs(newData.quantity))) {
            setDialogTitle('Erro');
            setDialogText('Não há estoque suficiente para efetuar a saída deste produto');
            showDialog();
            return;
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

        newData.value = inventory_data.price_per_unity * Math.abs(newData.quantity);
        newData.price_at_time = inventory_data.price_per_unity;
        newData.inventory = inventory_data;

        try {
            await dispatch(addMovement(newData)).unwrap();
            setDialogTitle('Sucesso');
            setDialogText('Movimentação cadastrada com sucesso!');
        reset();
            } catch (error: any) {
            setDialogTitle('Erro');
            setDialogText(error?.message || 'Erro ao cadastrar movimentação');
        }
        showDialog();
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