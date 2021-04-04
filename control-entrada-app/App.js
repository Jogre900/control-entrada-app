import * as React from "react";
import { PersistGate } from "redux-persist/integration/react";
import { SplashScreen } from "expo";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { MainNavigator } from "./navigation/main.navigator";
import useLinking from "./navigation/useLinking";
import { Provider } from "react-redux";
import { store, persistor } from "./store";
import { PushNotification } from "./config/PushNotification";
//import OneSignalProvider from "./lib/OneSignal";

const Stack = createStackNavigator();

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const [tokenDevice, setTokenDevice] = React.useState();
  const containerRef = React.useRef();
  const { getInitialState } = useLinking(containerRef);

  // Load any resources or data that we need prior to rendering the app

  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide();

        // Load our initial navigation state
        setInitialNavigationState(await getInitialState());

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          "space-mono": require("./assets/fonts/SpaceMono-Regular.ttf"),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hide();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  } else {
    return (
      <React.Fragment>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <PushNotification {...props}/>
            {/* <OneSignalProvider> */}
            <NavigationContainer>
              <MainNavigator />
            </NavigationContainer>
            {/* </OneSignalProvider> */}
          </PersistGate>
        </Provider>
      </React.Fragment>
      // <View style={styles.container}>
      // {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
      //   <NavigationContainer ref={containerRef} initialState={initialNavigationState}>
      //     <Stack.Navigator>
      //       <Stack.Screen name="root" component={mainNavigator} />
      //     </Stack.Navigator>
      //   </NavigationContainer>

      // </View>
    );
  }
}
