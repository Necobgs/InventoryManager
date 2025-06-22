import { Text, View } from '@/components/Themed';
import useCategory from '@/contexts/CategoryContext';
import { useInventory } from '@/contexts/InventoryContext';
import { useMovements } from '@/contexts/MovementsContext';
import { StyleSheet } from 'react-native';
import { PieChart } from 'react-native-chart-kit';


interface ChartInterfcae{
    name: string,
    value: number,
    color: string,
    legendFontColor: string,
    legendFontSize: number
}

const colors = ['chartreuse','blue','crimson','mediumturquoise','seagreen','orangered','mediumpurple','lightseagreen','gold','teal','darkorange'];

export default function Charts() {
    
    const inventoryContext = useInventory();
    const categoryContext = useCategory();
    const movementsContext = useMovements();
    const categories = categoryContext.findCategoryBy("enabled", true)
    const inventorys = inventoryContext.getInventoryBy("enabled", true);
    const dataIventorys: ChartInterfcae[] = [];
    const dataMovements: ChartInterfcae[] = [];
    const dataCategories: ChartInterfcae[] = [];
    let indexColor = 0;
    let quantity_without_cat = 0;

    if (inventorys[0]) {
        inventorys.map((iv) => {
            dataIventorys.push({
                name: iv.title,
                value: iv.qty_product,
                color: colors[indexColor],
                legendFontColor: colors[indexColor],
                legendFontSize: 15
            })

            const movements = movementsContext.getMovementsBy("id_inventory", iv.id);
            let quantity = 0;

            if (movements[0]) {
                movements.map((mov) => {
                    quantity += mov.quantity;
                })

                dataMovements.push({
                    name: iv.title,
                    value: quantity,
                    color: colors[indexColor],
                    legendFontColor: colors[indexColor],
                    legendFontSize: 15
                })
            }

            if (!iv.category) {
                quantity_without_cat += iv.qty_product;
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
    }

    return (
      <View style={styles.containerCharts}>
        {dataIventorys[0] ?
        <View style={styles.areaChart}>
            <Text style={styles.title}>Quantidade de produtos no estoque</Text>
            <PieChart
            data={dataIventorys}
            width={320}
            height={220}
            chartConfig={{
                color: () => `black`
            }}
            accessor={"value"}
            backgroundColor="rgb(242 242 242)"
            paddingLeft={"15"}
            absolute
            />
        </View> : <Text></Text>}

        {dataMovements[0] ?
        <View style={styles.areaChart}>
            <Text style={styles.title}>Retiradas de estoque por produto</Text>
            <PieChart
            data={dataMovements}
            width={320}
            height={220}
            chartConfig={{
                color: () => `black`
            }}
            accessor={"value"}
            backgroundColor="rgb(242 242 242)"
            paddingLeft={"15"}
            absolute
            />
        </View> : <Text></Text>}

        {dataCategories[0] ?
        <View style={styles.areaChart}>
            <Text style={styles.title}>Quantidade de produtos por categoria</Text>
            <PieChart
            data={dataCategories}
            width={320}
            height={220}
            chartConfig={{
                color: () => `black`
            }}
            accessor={"value"}
            backgroundColor="rgb(242 242 242)"
            paddingLeft={"15"}
            absolute
            />
        </View> : <Text></Text>}
      </View>
    )
}

const styles = StyleSheet.create({
    containerCharts: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        backgroundColor: 'rgb(242, 242, 242)',
        gap: 20,
    },
    areaChart: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        boxShadow: 'rgba(0, 0, 0, 0.3) 0px 1px 3px', 
        padding: 15,
        borderRadius: 10,
        backgroundColor: 'rgb(242 242 242)',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    }
})