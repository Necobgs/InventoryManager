import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

interface ThemeContextType{
    theme: string,
    alterTheme: () => null;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProviderContext(
    {children}: {children:React.ReactNode}
){
    const [theme,setTheme] = useState<string>("light");

    useEffect(() => {
        async function loadData() {
          const themeStorage = await getThemeStorage();
          setTheme(themeStorage);
        }
        loadData();
    },[]);

    function alterTheme() {
        setTheme((oldTheme)=>{
            const newTheme = oldTheme == "light" ? "dark" : "light";
            setThemeStorage(newTheme);
            return newTheme;
        });
        return null;
    }

    async function setThemeStorage(newTheme: string) {
        await AsyncStorage.setItem("theme", newTheme);
    }

    async function getThemeStorage(): Promise<string> {
        return await AsyncStorage.getItem("theme") ?? "light";
    }

    return (
    <ThemeContext.Provider value={{theme,alterTheme}}>
        {children}
    </ThemeContext.Provider>
    )
}

export default function useTheme(){
    const context = useContext(ThemeContext)
    if(!context) throw Error("Contexto de tema não encontrado")
    return context;
}
