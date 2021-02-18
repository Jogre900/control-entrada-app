import {useState, useEffect} from 'react'
import { Vibration } from 'react-native'

export const OnLongPress = ({id}) => {
    console.log("HOOKS------",id)
    const [selectItem, setSeletedItem] = useState([]);
  const [changeStyle, setChangeStyle] = useState(false);
    
  const onLong = () => {
    if (selectItem.includes(id)) {
      setSeletedItem((value) => value.filter((elem) => elem !== id));
      //hideCheckMark();
      return;
    }
    Vibration.vibrate(100),
      setSeletedItem(selectItem.concat(id)),
      //showCheckMark();
    setChangeStyle(!changeStyle);
  };
  useEffect(() => {
      onLong()
  }, [id])
  return {selectItem, setSeletedItem}
}
