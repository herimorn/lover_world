import { View, Text, Button,ImageBackground, TouchableOpacity } from 'react-native';
import React, { useLayoutEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import tw from "tailwind-rn";


export default function LoginScreen() {
  const {sigInWithGoogle,loading}=useAuth();
  const navigation=useNavigation();
  useLayoutEffect(()=>{
     navigation.setOptions({
      headerShown:false,
     })
  },[])
  return (
    <View style={tw("flex-1")}>
      <ImageBackground
      resizeMode='cover'
      style={tw("flex-1")}
      source={{uri:"https://images.pexels.com/photos/2249172/pexels-photo-2249172.jpeg?auto=compress&cs=tinysrgb&w=600"}}>
        <TouchableOpacity style={[tw("absolute bottom-40 w-52 bg-white p-4 rounded-2xl"),{marginHorizontal:'25%'}]}
        onPress={
          sigInWithGoogle
         }>
         <Text style={tw("text-center font-bold text-yellow-500")}> sign in to lovers world</Text>
         </TouchableOpacity>
      </ImageBackground>
    </View> 
  )
}