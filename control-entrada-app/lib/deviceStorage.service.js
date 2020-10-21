import { AsyncStorage } from "react-native";

const DeviceStorageService = {
  //_storeData
  setValue: async (item, value) => {
    try {
      //JSON.stringify(UID123_object)
      console.log("Done Set===", value);
      await AsyncStorage.setItem(item, value);
      return true;
    } catch (e) {
      // save error
      console.log("AsyncStore Error Set: " + e.message, item);
      return false;
    }
  },

  //_retrieveData
  getValue: async (item) => {
    try {
      const value = await AsyncStorage.getItem(item);
      if (value !== null) {
        return value;
      }
      return null;
    } catch (e) {
      console.log("AsyncStore Error Get: " + e.message, item);
      return null;
    }
  },

  removeValue: async (item) => {
    try {
      await AsyncStorage.removeItem(item);
      return true;
    } catch (e) {
      // remove error
      console.log("AsyncStore Error Remove: " + e.message, item);
      return false;
    }
  },

  clear: async () => {
    try {
      await AsyncStorage.clear();
      console.log("AsyncStore Remove All");
      return true;
    } catch (e) {
      // remove error
      console.log("AsyncStore Error Remove All:" + e.message);
      return false;
    }
  },
};

export default DeviceStorageService;

/**
 * EJEMPLO DE USO
importar el componente
  import DeviceStorage from "lib/deviceStorage.service";


Para guardar un valor 
  DeviceStorage.setValue('TOKEN_USER', data.login.token);
-en caso que quieras mandar un array u objeto
  DeviceStorage.setValue(
      'LIST_CONTRACT',
      JSON.stringify(arrayContract)
    );


Para obtener el valor
  DeviceStorage.getValue('TOKEN_USER')

Para remover uno en particular 
  DeviceStorage.removeValue('TOKEN_USER');

Para limpiar toda la memoria
  DeviceStorage.clear();

para 
*/
