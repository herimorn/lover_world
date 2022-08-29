import { View, Text,Image, TextInput, TouchableOpacity,Platform,useWindowDimensions} from 'react-native'
import React,{useState} from 'react';
import tw from "tailwind-rn";
import useAuth from "../hooks/useAuth";
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebase';

const ModalScreen = () => {
  const navigation=useNavigation();
  const {user}=useAuth();
  const[image,setImage]=useState(null);
  const[job,setJob]=useState(null);
  const[age,setAge]=useState(null);
  const[gender,setGender]=useState(null);
  const updateUserProfile=()=>{
    console.log("pressed");
    setDoc(doc(db,"users",user.uid),{
      id:user.uid,
      displayName:user.displayName,
      photoUrl:image,
      job:job,
      age:age,
      gender:gender,
      timeStamp:serverTimestamp(),
    }).then(()=>{
        navigation.navigate('home');
    }).catch((error)=>{
      alert(error.message);
    })
  };

  return (
    <View style={tw("flex-1 items-center pt-1")}>
      <Image style={tw('h-20 w-full rounded-full')}
      resizeMode="contain"
      source={{uri:"http://clipart-library.com/images/kTKo6q6jc.jpg"}}/>
      <Text style={tw("text-xl text-gray-500 p-2 font-bold")}>welcome {user.displayName}</Text>
      <Text style={tw('text-center p-4 font-bold text-red-400')}>
        1.Step1 upload the profile
      </Text>
      <TextInput placeholder='inter the profile pic url' value={image} onChangeText={text=>setImage(text)}/>
      <Text style={tw('text-center p-4 font-bold text-red-400')}>
        2.Step2 the age
      </Text>
      <TextInput placeholder='inter the age' value={age} onChangeText={text=>setAge(text)}
      keyboardType="numeric"/>
      <Text style={tw('text-center p-4 font-bold text-red-400')}>
        3.step 3 the gender 
      </Text>
      <TextInput placeholder='inter the gender' value={gender} onChangeText={text=>setGender(text)}
      />
      <Text style={tw('text-center p-4 font-bold text-red-400')}>
        4.Step4 the job
      </Text>
      <TextInput placeholder='inter the job' value={job} onChangeText={text=>setJob(text)}/>
      <TouchableOpacity style={tw('w-64 p-3 rounded-xl  bottom-0 bg-red-400')
     } onPress={updateUserProfile}>
        <Text style={tw('text-center text-white text-xl')}>update profile</Text>
      </TouchableOpacity>
    </View>
  )
}

export default ModalScreen