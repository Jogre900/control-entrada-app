//import * as firebase from 'firebase'
import firebase from './firebase'

const FireMethods = {
    saveName(userId, name) {
        let entranceName = `/users/${userId}/entrance/name`
        return firebase.database().ref(entranceName).push(name)
    },
    saveLastName(userId, lastName){
        let entranceLastName = `/users/${userId}/entrance/lastName`
        return firebase.database().ref(entranceLastName).push(lastName)
    },
    saveDni(userId, dni){
        let entranceDni = `/users/${userId}/entrance/dni`
        return firebase.database().ref(entranceDni).push(dni)
    },
    saveDestiny(userId, destiny){
        let entranceDestiny = `/users/${userId}/entrance/destiny`
        return firebase.database().ref(entranceDestiny).push(destiny)
    } 
}

module.exports = FireMethods