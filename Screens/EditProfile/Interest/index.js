import {ArrowLeft2} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  useWindowDimensions,
} from 'react-native';
import { HttpClient } from '../../../Api/config';
import Button from '../../../StyledComponents/Button';
import {theme} from '../../../theme';

const Interest = ({back, sendData, alreadySelected}) => {
  const [interestes,setInterestes] =useState([])
  const {height} = useWindowDimensions();
  
  const handleGetInterest = async()=>{
    try {
    const response = await HttpClient.get('interest') 
    setInterestes(response.data.data)
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(()=>{
    handleGetInterest()
  },[])
  const [selectedInterest, setSelectedInterest] = useState(alreadySelected);

  const handleItem = item => {
    if (!selectedInterest.includes(item)) {
      setSelectedInterest([...selectedInterest, item]);
    } else {
      let index = selectedInterest.findIndex(i => item === i);
      setSelectedInterest([
        ...selectedInterest.slice(0, index),
        ...selectedInterest.slice(index + 1, selectedInterest.length),
      ]);
    }
  };
  return (
    <View
      style={{
        flexDirection: 'column',
        minHeight: height - 40,
      }}>
      <TouchableOpacity onPress={() => back()}>
        <ArrowLeft2 size="25" color="#ffffff" />
      </TouchableOpacity>
      <Text style={styles.heading}>Choose your interests</Text>
      <Text style={styles.desc}>
        Get video recommendations that you like and are interested in
      </Text>
      <View style={styles.interests}>
        {interestes.length > 0 && interestes.map((item, index) => (
          <View style={{marginHorizontal: 6}} key={index}>
           {item.trim().length > 0 && <Button
              mode="contained"
              primary
              style={[
                styles.buttonStyle,
                !selectedInterest.includes(item) && {
                  backgroundColor: '#2F2F2F',
                },
              ]}
              onPress={() => handleItem(item)}
              labelStyle={styles.buttonLabel}>
              {item}
            </Button>}
          </View>
        ))}
      </View>
      <Button
        mode="contained"
        primary
        style={{marginTop: 'auto'}}
        onPress={() => {
          sendData(selectedInterest), back();
        }}
        labelStyle={{fontSize: 16}}>
        Done
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 30,
    fontFamily: theme.fonts.bold.fontFamily,
    color: '#fff',
    marginVertical: 10,
    lineHeight: 40,
  },
  desc: {
    color: '#ffffff77',
    fontSize: 16,
    lineHeight: 24,
  },
  interests: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 20,
    // justifyContent: 'space-between'
  },
  buttonStyle: {
    height: 36,
  },
  buttonLabel: {
    fontSize: 14,
    lineHeight: 14,
  },
});

export default Interest;
