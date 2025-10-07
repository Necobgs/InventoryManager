import { Text, View } from '@/components/Themed';
import useTheme from '@/contexts/ThemeContext';
import { initCategories, selectCategoriesEnabled } from '@/store/features/categorySlice';
import { initInventorys, selectInventorysEnabled } from '@/store/features/inventorySlice';
import { initMovements, selectMovements } from '@/store/features/movementSlice';
import { initSuppliers, selectSuppliersEnabled } from '@/store/features/supplierSlice';
import { useAppDispatch } from '@/store/hooks';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useSelector } from 'react-redux';

interface ChartInterfcae{
    name: string,
    value: number,
    color: string,
    legendFontColor: string,
    legendFontSize: number
}

const colors = ['chartreuse','blue','crimson','mediumturquoise','seagreen','orangered','mediumpurple','lightseagreen','gold','teal','darkorange'];

export default function Charts() {
    
    const categories = useSelector(selectCategoriesEnabled);
    const suppliers = useSelector(selectSuppliersEnabled);
    const inventorys = useSelector(selectInventorysEnabled);
    const movements_all = useSelector(selectMovements);
    const dataIventorys: ChartInterfcae[] = [];
    const dataExits: ChartInterfcae[] = [];
    const dataEntries: ChartInterfcae[] = [];
    const dataCategories: ChartInterfcae[] = [];
    const dataSuppliers: ChartInterfcae[] = [];
    const dispatch = useAppDispatch();
    const { theme } = useTheme();
    let indexColor = 0;
    let quantity_without_cat = 0;
    let quantity_without_sup = 0;
    const styles = StyleSheet.create({
        containerCharts: {
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            backgroundColor: 'transparent',
            gap: 20,
        },
        areaChart: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
            padding: 15,
            borderRadius: 10,
            backgroundColor: 'transparent',
            boxShadow: theme === "dark" ? "rgba(255, 255, 255, 0.8) 0px 1px 3px" : "rgba(0, 0, 0, 0.3) 0px 1px 3px"
        },
        title: {
            fontSize: 16,
            fontWeight: 'bold',
            color: theme === "dark" ? "rgb(230, 225, 229)" : "black"
        }
    })

    useEffect(() => {
        if (!categories[0]) {
            dispatch(initCategories());
        }
    
        if (!suppliers[0]) {
            dispatch(initSuppliers());
        }

        if (!inventorys[0]) {
            dispatch(initInventorys());
        }

        if (!movements_all[0]) {
            dispatch(initMovements
                ());
        }
    }, [dispatch]);

    if (inventorys[0]) {
        inventorys.map((iv) => {
            dataIventorys.push({
                name: iv.title,
                value: iv.qty_product,
                color: colors[indexColor],
                legendFontColor: colors[indexColor],
                legendFontSize: 15
            })

            const movements = movements_all.filter((mov) => mov.inventory?.id === iv.id);
            let quantity_exit = 0;
            let quantity_entry = 0;

            if (movements[0]) {
                movements.map((mov) => {
                    if (mov.quantity > 0) {
                        quantity_entry += mov.quantity;
                    }
                    else {
                        quantity_exit += mov.quantity;
                    }
                })

                dataEntries.push({
                    name: iv.title,
                    value: quantity_entry,
                    color: colors[indexColor],
                    legendFontColor: colors[indexColor],
                    legendFontSize: 15
                })

                dataExits.push({
                    name: iv.title,
                    value: quantity_exit * -1,
                    color: colors[indexColor],
                    legendFontColor: colors[indexColor],
                    legendFontSize: 15
                })
            }

            if (!iv.category) {
                quantity_without_cat += iv.qty_product;
            }
            
            if (!iv.supplier) {
                quantity_without_sup += iv.qty_product;
            }

            if (colors.length === (indexColor + 1)) {
                indexColor = 0;
            }
            else {
                indexColor += 1;
            }
        })

        indexColor = colors.length - 1;

        dataCategories.push({
            name: "Sem Categoria",
            value: quantity_without_cat,
            color: colors[indexColor],
            legendFontColor: colors[indexColor],
            legendFontSize: 15
        })

        if (categories[0]) {
            categories.map((cat) => {

                if (indexColor === 0) {
                    indexColor = colors.length - 1;
                }
                else {
                    indexColor -= 1;
                }

                let quantity_per_cat = 0;
                inventorys.map((iv) => {

                    if (iv.category?.id === cat.id) {
                        quantity_per_cat += iv.qty_product;
                    }
                })

                dataCategories.push({
                    name: cat.description,
                    value: quantity_per_cat,
                    color: colors[indexColor],
                    legendFontColor: colors[indexColor],
                    legendFontSize: 15
                })
            })
        }

        indexColor = colors.length - 1;

        dataSuppliers.push({
            name: "Sem Fornecedor",
            value: quantity_without_sup,
            color: colors[indexColor],
            legendFontColor: colors[indexColor],
            legendFontSize: 15
        })

        if (suppliers[0]) {
            suppliers.map((sup) => {

                if (indexColor === 0) {
                    indexColor = colors.length - 1;
                }
                else {
                    indexColor -= 1;
                }

                let quantity_per_sup = 0;
                inventorys.map((iv) => {

                    if (iv.supplier?.id === sup.id) {
                        quantity_per_sup += iv.qty_product;
                    }
                })

                dataSuppliers.push({
                    name: sup.name,
                    value: quantity_per_sup,
                    color: colors[indexColor],
                    legendFontColor: colors[indexColor],
                    legendFontSize: 15
                })
            })
        }
    }

    return (
      <View style={styles.containerCharts}>
        {dataIventorys[0] ?
        <View style={styles.areaChart}>
            <Text style={styles.title}>Quantidade de produtos no estoque</Text>
            <PieChart
            data={dataIventorys}
            width={315}
            height={220}
            chartConfig={{
                color: () => `black`
            }}
            accessor={"value"}
            backgroundColor="transparent"
            paddingLeft={"15"}
            absolute
            />
        </View> : <Text></Text>}

        {dataEntries[0] ?
        <View style={styles.areaChart}>
            <Text style={styles.title}>Entradas no estoque</Text>
            <PieChart
            data={dataEntries}
            width={315}
            height={220}
            chartConfig={{
                color: () => `black`
            }}
            accessor={"value"}
            backgroundColor="transparent"
            paddingLeft={"15"}
            absolute
            />
        </View> : <Text></Text>}

        {dataExits[0] ?
        <View style={styles.areaChart}>
            <Text style={styles.title}>Saídas no estoque</Text>
            <PieChart
            data={dataExits}
            width={315}
            height={220}
            chartConfig={{
                color: () => `black`
            }}
            accessor={"value"}
            backgroundColor="transparent"
            paddingLeft={"15"}
            absolute
            />
        </View> : <Text></Text>}

        {dataCategories[0] ?
        <View style={styles.areaChart}>
            <Text style={styles.title}>Quantidade de produtos por categoria</Text>
            <PieChart
            data={dataCategories}
            width={315}
            height={220}
            chartConfig={{
                color: () => `black`
            }}
            accessor={"value"}
            backgroundColor="transparent"
            paddingLeft={"15"}
            absolute
            />
        </View> : <Text></Text>}

        {dataSuppliers[0] ?
        <View style={styles.areaChart}>
            <Text style={styles.title}>Quantidade de produtos por fornecedor</Text>
            <PieChart
            data={dataSuppliers}
            width={315}
            height={220}
            chartConfig={{
                color: () => `black`
            }}
            accessor={"value"}
            backgroundColor="transparent"
            paddingLeft={"15"}
            absolute
            />
        </View> : <Text></Text>}
      </View>
    )
}