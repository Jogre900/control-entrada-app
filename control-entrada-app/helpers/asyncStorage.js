import AsyncStorage from "@react-native-community/async-storage";

export const storage = {
    setItem: async function(key, value){
        let item = await AsyncStorage.setItem(key, value)
        if(item) return true
    },
    getItem: async function(key){
        let item = await AsyncStorage.getItem(key)
        if(item) return item
    },
    removeItem: async function(key){
        let item = await AsyncStorage.removeItem(key)
        if(item) return true
    }
}