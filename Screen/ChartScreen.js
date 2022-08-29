import { View, Text,SafeAreaView} from 'react-native'
import React from 'react'
import tw from 'tailwind-rn';
import Header from '../components/Header';
import ChatList from '../components/ChatList';

export default function ChartScreen() {
  return (
    <SafeAreaView style={tw('justify-center items-center')}>
      <Header title="chat"/>
      <ChatList/>
    </SafeAreaView>
  )
}