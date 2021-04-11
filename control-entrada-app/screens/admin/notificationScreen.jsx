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
import { TopNavigation } from "../../components/TopNavigation.component";
import { Header } from "../../components/header.component";
import { routes } from "../../assets/routes";
import { BackAction } from "../../helpers/ui/ui";
import { helpers } from "../../helpers/";
import { API_PORT } from "../../config";
import moment from "moment";

import { connect } from "react-redux";

const NotificationScreen = ({
  navigation,
  login,
  saveNotification,
  notifications,
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
    let route, params;
    console.log("TARGET ID-- ONPRESS NOTI SCREEN--",targetId);

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
    navigation.navigate(route, {id: targetId})
    // changeRead(notificationId, notification);
    // .then(() => navigation.navigate(route, targetId));
  };
  //CHANGE READ STATUS
  const changeRead = async (notificationId, notification) => {
    const prueba = [];
    prueba.push(notification);
    updateReadNotification(prueba);
    try {
      const res = await helpers.changeReadStatus(notificationId);
      if (!res.data.error) {
        alert("exito!");
        // updateReadNotification(res.data.data);
      }
      if (res.data.error) {
        revertReadUpdate(prueba);
      }
    } catch (error) {
      alert("Ocurrio un Error!");
      revertReadUpdate(prueba);
      console.log(error.message);
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

  const renderItem = ({ item }) => {
    console.log(item)
    return (
      <TouchableOpacity
        style={[
          styles.notificationBox,
          { 
            backgroundColor: item.read === true ? "#fff" : "#09f",
            flexDirection: 'row',
            alignItems: 'center'
        },
        ]}
        onPress={() => onPressHandler(item)}
        // onPress={
        //     selectItem.length > 0
        //       ? () => onLong(item.id)
        //       : () =>
        //           alert("falta accion")
        //   }
        onLongPress={() => onLong(item.id)}
        delayLongPress={200}
      >
        <View style={{
          backgroundColor: 'red',
          flex: 1
        }}>

        <Avatar.Picture
          size={60}
          uri={`${API_PORT()}/public/imgs/${item.nuevaKey.picture}`}
          />
          </View>
      <View style={{
        backgroundColor: 'yellow',
        flex: 3
      }}>

        <Text>{item.notification}</Text>
        <Text>{moment(item.createdAt).fromNow()}</Text>
      </View>
      </TouchableOpacity>
    );
  };

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
      <TouchableOpacity>
        <Text>Marcar todas como leidas</Text>
      </TouchableOpacity>
      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={({ id }) => id}
          onRefresh={refresh}
          refreshing={refreshing}
        />
      ) : (
        // notifications.map((elem) => (
        // <TouchableOpacity
        //   style={[styles.notificationBox, { backgroundColor: elem.read === true ? "#fff" : "#09f" }]}
        //   key={elem.id}
        //   onPress={() => onPressHandler(elem)}
        //   // onPress={
        //   //     selectItem.length > 0
        //   //       ? () => onLong(elem.id)
        //   //       : () =>
        //   //           alert("falta accion")
        //   //   }
        //   onLongPress={() => onLong(elem.id)}
        //   delayLongPress={200}
        // >
        //   <Avatar.Picture size={60} uri={`${API_PORT()}/public/imgs/${elem.nuevaKey.picture}`} />

        //   <Text>{elem.notification}</Text>
        //   <Text>{moment(elem.createdAt).fromNow()}</Text>
        // </TouchableOpacity>

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
  },
  notificationBox: {
    borderBottomWidth: 0.5,
    borderColor: "grey",
    paddingVertical: 5,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  notificationSub: {
    fontSize: 16,
  },
});
