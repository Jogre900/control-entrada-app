import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";

const element1 = () => {
  return (
    <View>
      <View>
        <Text>Jose del Corral</Text>
      </View>
      <View>
        <Text>19222907</Text>
      </View>
      <View>
        <Text>Apt 104</Text>
      </View>
      <View>
        <Text>10:00 am</Text>
      </View>
      <View>
        <Text>10:00 pm</Text>
      </View>
    </View>
  );
};

const element2 = () => {
  return (
    <View style={{ flexDirection: "row" }}>
      <View>
        <View>
          <Text>Jose del Corral</Text>
        </View>
        <View>
          <Text>19222907</Text>
        </View>
        <View>
          <Text>987654</Text>
        </View>
      </View>
      <View>
        <Text>Foto</Text>
      </View>
    </View>
  );
};

const { width } = Dimensions.get("window");

export const ProfileComponent = () => {
  const [activeTab, setActiveTab] = React.useState('0');
  

  const [xTabOne, setXTabOne] = React.useState();
  const [xTabTwo, setXTabTwo] = React.useState();
  
  const translateTab = new Animated.Value(0);
  const translateContent1 = new Animated.Value(0);
  const translateContent2 = new Animated.Value(width);

  const animatedOverlay = (tabCoor, tabActive) => {
    //setActiveTab(tabActive)
    Animated.spring(translateTab, {
      toValue: tabCoor,
      duration: 500,
      speed: 12,
      bounciness: 5,
    }).start();
    if (tabActive == 0) {
      
      Animated.parallel([
        Animated.spring(translateContent1, {
          toValue: 0,
          duration: 500,
        }).start(),
        Animated.spring(translateContent2, {
          toValue: width,
          duration: 500,
          speed: 12,
          
          bounciness: 5,
        }).start(),
      ]);
      //setActiveTab1({color: 'orange'})
      //setActiveTab2({color: 'grey'})
    } else {
      
      Animated.parallel([
        Animated.spring(translateContent1, {
          toValue: -width,
          duration: 500,
        }).start(),
        Animated.spring(translateContent2, {
          toValue: 0,
          duration: 500,
          speed: 12,
          
          bounciness: 5,
        }).start(),
      ]);
      //setActiveTab2({color: 'orange'})
      //setActiveTab1({color: 'grey'})
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          backgroundColor: "teal",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Foto de Perfil</Text>
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ width: "90%", marginLeft: "auto", marginRight: "auto" }}>
          <View
            style={{
              flexDirection: "row",
              height: 50,
              position: "relative",
            }}
          >
            <Animated.View
              style={{
                //backgroundColor: "blue",
                height: "100%",
                width: "50%",
                position: "absolute",
                top: 0,
                left: 0,
                borderColor: "orange",
                borderBottomWidth: 2,
                transform: [
                  {
                    translateX: translateTab,
                  },
                ],
              }}
            />
            <TouchableOpacity
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                //borderBottomWidth: 1,
                borderColor: "grey",
              }}
              onLayout={(event) => {
                setXTabOne(event.nativeEvent.layout.x);
              }}
              onPress={() => {
                animatedOverlay(xTabOne, 0);
              }}
            >
              <Text style={{ color: activeTab === '0' ? 'orange' : 'grey' }}>
                Tab One
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                //borderBottomWidth: 1,
                borderColor: "grey",
              }}
              onLayout={(event) => {
                setXTabTwo(event.nativeEvent.layout.x);
              }}
              onPress={() => {
                animatedOverlay(xTabTwo, 1);
              }}
            >
              <Text style={{ color: activeTab === '1' ? 'orange' : 'grey'}}>
                Tab Two
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal={true}>
            <Animated.View
              style={{
                transform: [
                  {
                    translateX: translateContent1,
                  },
                ],
              }}
            >
              {element1()}
            </Animated.View>
            <Animated.View
              style={{
                transform: [
                  {
                    translateX: translateContent2,
                  },
                ],
              }}
            >
              {element2()}
            </Animated.View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
};
