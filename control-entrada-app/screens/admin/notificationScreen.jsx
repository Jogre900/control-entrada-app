import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Vibration,
  BackHandler,
} from "react-native";
import Avatar from "../../components/avatar.component";
import { TopNavigation } from "../../components/TopNavigation.component";
import { Header } from "../../components/header.component";
import { routes } from "../../assets/routes";
import { BackAction } from "../../helpers/ui/ui";
import { helpers } from "../../helpers/";
import { API_PORT } from '../../config'
import moment from 'moment'

import { connect } from "react-redux";

const NotificationScreen = ({ navigation, notifications, updateReadNotification }) => {
  //const [notification, setNotification] = useState([]);
  const [selectItem, setSeletedItem] = useState([]);


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

  //CHANGE READ STATUS
  const changeRead = async (notificationId) => {
      try {
          const res = await helpers.changeReadStatus(notificationId)
          if(!res.data.error){
            updateReadNotification(res.data.data)
          }
      } catch (error) {
          console.log(error.message)
      }
  }

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

  return (
    <View styles={styles.container}>
      {selectItem.length > 0 ? (
        <Header
          value={selectItem.length}
          clearAction={clearList}
          //deleteAction={() => deleteZones(selectItem)}
          selectAction={selectAll}
        />
      ) : (
        <TopNavigation
          title="Entradas del Dia"
          leftControl={BackAction(navigation, routes.ADMIN_HOME)}
        />
      )}
      {notifications.length &&
        notifications.map((elem) => (
          <TouchableOpacity
            style={[
              styles.notificationBox,
              { backgroundColor: elem.read === true ? "#fff" : "#09f" },
            ]}
            key={elem.id}
            onPress={() => changeRead(elem.id)}
            // onPress={
            //     selectItem.length > 0
            //       ? () => onLong(elem.id)
            //       : () =>
            //           alert("falta accion")
            //   }
              onLongPress={() => onLong(elem.id)}
              delayLongPress={200}
          >
              <Avatar.Picture 
              size={60}
              uri={`${API_PORT()}/public/imgs/${elem.User.Employee.picture}`}
              />
              <Text>{elem.User.Employee.name} {elem.User.Employee.lastName}</Text>
            <Text>{elem.notification}</Text>
            <Text>{moment(elem.createdAt).fromNow()}</Text>
          </TouchableOpacity>
        ))}
    </View>
  );
};

const mapStateToProps = (state) => ({
  notifications: state.profile.notification,
});

const mapDispatchToProps = (dispatch) => ({
    updateReadNotification(data){
        dispatch({
            type: 'UPDATE_READ',
            payload: data
        })
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(NotificationScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
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
