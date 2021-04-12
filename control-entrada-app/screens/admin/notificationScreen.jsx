import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Vibration,
  BackHandler,
  FlatList,
} from "react-native";
import Avatar from "../../components/avatar.component";
import { MainButton } from "../../components/mainButton.component";
import { TopNavigation } from "../../components/TopNavigation.component";
import { Header } from "../../components/header.component";
import { routes } from "../../assets/routes";
import { BackAction } from "../../helpers/ui/ui";
import { helpers } from "../../helpers/";
import { API_PORT } from "../../config";
import { NotificationCard } from '../../components/notificationCard'
import moment from "moment";

import { connect } from "react-redux";

const NotificationScreen = ({
  navigation,
  login,
  saveNotification,
  notifications,
  notificationNotRead,
  updateReadNotification,
  revertReadUpdate,
}) => {
  //const [notification, setNotification] = useState([]);
  //console.log("NOTIFI FROM REDUX--", notifications)
  const [selectItem, setSeletedItem] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  //REQUEST ALL NOTIFICATION
  const requestNotification = async () => {
    setLoading(true);
    try {
      const res = await helpers.fetchNotificationNotRead(profile.id);
      if (!res.data.error) {
        setLoading(false);
        saveNotificationNotRead(res.data.data);
      }
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };

  //ONPRESSHANDLRES
  const onPressHandler = (notification) => {
    const { id: notificationId, notificationType, targetId } = notification;
    let route
    console.log("TARGET ID-- ONPRESS NOTI SCREEN--", targetId);

    switch (notificationType) {
      case "ENTRY":
      case "DEPARTURE":
        route = routes.DETAIL_VIEW;
        break;
      case "CREATE_ZONE":
        route = routes.ZONE_DETAIL;
        break;
      case "DELETE_ZONE":
        route = routes.ZONES;
      case "CREATE_DESTINY":
        route = routes.ZONES;
      case "DELETE_DESTINY":
        route = routes.ZONES;
        break;
      default:
        break;
    }
    //navigation.navigate(route, { id: targetId });
    navigation.navigate(route, { id: targetId });
    changeRead(notificationId, notification);
  };
  //CHANGE READ STATUS
  const changeRead = async (notificationId, notification) => {
    if(notification.read === true){
      return
    }else{
      //<--- introducimos el obj notification en un array para redux
    const prueba = [];
    prueba.push(notification);
    updateReadNotification(prueba);
    //----->
    try {
      const res = await helpers.changeReadStatus(notificationId);
      if (!res.data.error) {
        alert("exito!");
        
      }
      if (res.data.error) {
        alert("Oh no! algo salio mal :(");
        revertReadUpdate(prueba);
      }
    } catch (error) {
      alert("Ocurrio un Error!");
      revertReadUpdate(prueba);
      console.log(error.message);
    }
    }
  };

  const changeReadAll = async (notificationArray) => {
    if (notifications.length <= 0) {
      return;
    } else if(notificationNotRead.length === 0){
      return
    }else{
      //<---- redux recive un array con el obj notificationes ---->
      updateReadNotification(notificationArray);
      //<---- extraemos los id de las notificaciones para mandarlos al endpoint
      let idArray = [];
      notificationArray.map(({ id }) => idArray.push(id));
      //----->
      try {
        const res = await helpers.changeReadStatus(idArray);
        if (!res.data.error) {
          alert("exito!");
        }
        if (res.data.error) {
          //<--- en caso de error revertimos el optimist update --->
          alert("Oh no! algo salio mal :(");
          console.log(res.data);
          revertReadUpdate(notificationArray);

        }
      } catch (error) {
        //<--- en caso de error revertimos el optimist update --->
        alert("Ocurrio un Error!");
        revertReadUpdate(notificationArray);
        console.log(error.message);
      }
    }
  };

  //ONLONGPRESS
  const onLong = (id) => {
    if (selectItem.includes(id)) {
      setSeletedItem((value) => value.filter((elem) => elem !== id));
      return;
    }
    Vibration.vibrate(100), setSeletedItem(selectItem.concat(id));
  };

  const clearList = () => setSeletedItem([]);

  const selectAll = () => {
    let array = [];
    visits.map(({ id }) => array.push(id));
    setSeletedItem(array);
  };

  //   useEffect(() => {
  //       requestNotification()
  //   }, [])

  

  const refresh = async () => {
    setRefreshing(true);
    try {
      const res = await helpers.fetchNotification(login.userId);
      if (!res.data.error) {
        saveNotification(res.data.data);
        setRefreshing(false);
      }
    } catch (error) {
      setRefreshing(false);
    }
  };
  return (
    <View style={styles.container}>
      {selectItem.length > 0 ? (
        <Header
          value={selectItem.length}
          clearAction={clearList}
          //deleteAction={() => deleteZones(selectItem)}
          selectAction={selectAll}
        />
      ) : (
        <TopNavigation
          title="Notificaciones"
          leftControl={BackAction(navigation, routes.ADMIN_HOME)}
        />
      )}
      <MainButton
        onPress={() => changeReadAll(notifications)}
        title="Marcar todo como leído"
        outline
        style={{marginVertical:5}}
      />

      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={({item}) => <NotificationCard onPress={onPressHandler} item={item}/>}
          keyExtractor={({ id }) => id}
          onRefresh={refresh}
          refreshing={refreshing}
        />
      ) : (
        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        >
          <Text>Estas al día</Text>
        </View>
      )}
    </View>
  );
};

const mapStateToProps = (state) => ({
  notifications: state.profile.notification,
  notificationNotRead: state.profile.notificationNotRead,
  login: state.profile.login,
});

const mapDispatchToProps = (dispatch) => ({
  saveNotification(notifications) {
    dispatch({
      type: "SAVE_NOTI",
      payload: notifications,
    });
  },
  updateReadNotification(data) {
    dispatch({
      type: "UPDATE_READ",
      payload: data,
    });
  },
  revertReadUpdate(data) {
    dispatch({
      type: "REVERT_READ",
      payload: data,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(NotificationScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
