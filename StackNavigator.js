import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './Screen/HomeScreen'
import ChartScreen from './Screen/ChartScreen';
import LoginScreen from './Screen/LoginScreen';
import MatchedScreen from './Screen/MatchedScreen';
import useAuth from './hooks/useAuth';
import ModalScreen from './Screen/ModalScreen';
import MessageScreen from './Screen/MessageScreen';
// import { useNavigation } from '@react-navigation/native';
 
const Stack=createNativeStackNavigator();
export default function StackNavigator() {
  const  {user} = useAuth();
  return(
    <Stack.Navigator>
      {user? (
        <>
        <Stack.Group>
      <Stack.Screen name='home' component={HomeScreen}/>
       <Stack.Screen name='chart' component={ChartScreen}/>
       <Stack.Screen name='message' component={MessageScreen}/>
       </Stack.Group>
       <Stack.Group screenOptions={{presentation:"modal"}}>
       <Stack.Screen name='modal' component={ModalScreen}/>
       </Stack.Group>
       <Stack.Group screenOptions={{presentation:"transparentModal"}}>
       <Stack.Screen name='Match' component={MatchedScreen}/>
       </Stack.Group>
       </> 
       ) :(
        <Stack.Screen name='login' component={LoginScreen}/>
       )}
     </Stack.Navigator> 
   ); 
};