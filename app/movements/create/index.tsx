import DefaultDialog from "@/components/DefaultDialog";
import { FormInput } from "@/components/FormInput";
import { View } from "@/components/Themed";
import { MovementForm } from "@/interfaces/MovementInterface";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "react-native-paper";
import * as yup from 'yup';
import MovementsFormType from "@/types/MovementsFormType";
import ComboBoxForm from "@/components/ComboBoxForm";
import { useAppDispatch } from "@/store/hooks";
import { useSelector } from "react-redux";
import { selectUserLogged } from "@/store/features/userSlice";
import { initInventorysComboBox, selectInventorysComboBox } from "@/store/features/inventorySlice";
import { addMovement, selectMovementError } from "@/store/features/movementSlice";
import { globalStyles } from "@/styles/globalStyles";
import useTheme from "@/contexts/ThemeContext";

const schema = yup.object().shape({
    inventory: yup
    .object({
        id:yup.number().required(),
        title: yup.string().required(),
    })
    .required("selecione um item")
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
    const inventorys = useSelector(selectInventorysComboBox);
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
      
    const onSubmit = async (data: MovementsFormType) => {

        if (!data.inventory) {
            setDialogTitle('Erro');
            setDialogText('Item deve ser informado!'); 
            showDialog();
            return;
        }

        const newData: MovementForm = {
            inventory: data.inventory,
            user: userLogged,
            quantity: data.operation?.id === 2 ? data.quantity * -1 : data.quantity,
            movement_value: 0,
            price_at_time: 0,
        }

        try {
            await dispatch(addMovement(newData)).unwrap();
            setDialogTitle('Sucesso');
            setDialogText('Movimentação cadastrada com sucesso!');
            showDialog();
        reset();
            } catch (error: any) {
            setIsError(true);
        }
    };

    useEffect(() => {
        const inventory = inventorys.find(i => i.id === inventorySel?.id);

        if (inventory){
            setValue('qty_product', inventory.qty_product);
            setValue('price_per_unity', inventory.price_per_unity);
            setValue('value', inventory.price_per_unity * quantity);
        }
    }, [quantity, inventorySel, operationSel, setValue, inventorys]);

    useEffect(() => {
        dispatch(initInventorysComboBox({title: '', description: '', enabled: true}));
    }, [dispatch]);

    useEffect(() => {

      if (isError) {
        setDialogTitle('Erro');
        setDialogText(error  || 'Erro ao cadastrar movimentação');
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

export default CreateMovements;