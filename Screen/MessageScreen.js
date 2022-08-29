import { View, Text,SafeAreaView, TextInput, Button, Platform,Keyboard, FlatList } from 'react-native'
import React, { useEffect } from 'react'
import Header from '../components/Header'
import getMatchedUserInfo from '../lib/getMatchedUserInfo'
import useAuth from '../hooks/useAuth'
import { useRoute } from '@react-navigation/native'
import tw from "tailwind-rn";
import { useState} from 'react'
import { KeyboardAvoidingView, TouchableWithoutFeedback } from "react-native";
import SenderMessage from '../components/SenderMessage ';
import ReceiverMessage from '../components/ReceiverMessage';
import { addDoc,collection, onSnapshot, orderBy, serverTimestamp,query,doc} from 'firebase/firestore';
import { db } from '../firebase'


const MessageScreen = () => {
    const {user}=useAuth();
    //console.log(matchDetails);
    const {params}=useRoute();
    const[messages,setMessages]=useState([]);
    const {matchDetails}=params;
    const[input,setInput]=useState('');
       useEffect(()=>{
        onSnapshot(
            query(
                collection(db,'matches',matchDetails.id,'messages'),
                orderBy("timestamp","desc")
          ),
          (snapshot)=>setMessages(
            snapshot.docs.map((doc)=>(
                {
                    id:doc.id,
                    ...doc.data(),
                }
            ))
          )
        )

       },[matchDetails,db]);
    const sendMessage=()=>{
        addDoc(collection(db,'matches',matchDetails.id,'messages'),{
            timestamp:serverTimestamp(),
            userId:user.uid,
            displayName:user.displayName,
            photoUrl:matchDetails.users[user.uid].photoUrl,
            message:input,
        })
        setInput("");
    }
    console.log(messages);
  return (
    <SafeAreaView style={tw('flex-1')}>
        <Header title={getMatchedUserInfo(matchDetails?.users,user.uid).displayName} callEnabled/>
      <KeyboardAvoidingView
      behavior={Platform.OS==="ios"?"padding":"height"}
      style={tw('flex-1')}
      KeyboardVerticalOffset={10}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
         <FlatList
          data={messages}
          inverted={-1}
          style={tw("pl-4")}
          keyExtractor={(item)=>item.id}
          
          renderItem={({item:message})=>
          message.userId===user.uid?(
            <SenderMessage key={message.id} message={message}/>
            
          ):(
            
            <ReceiverMessage key={message.id} message={message}/>
            
          )
        }
         />

        </TouchableWithoutFeedback>
        
     
        <View
      style={tw('flex-row justify-between items-center bg-white border-t border-gray-200 px-5 py-2')}>
        <TextInput style={tw("h-10 text-lg")}
        placeholder="send message..."
        onChangeText={setInput}
        onSubmitEditing={sendMessage}
        value={input}
          />
          <Button title="send" color="chocolate" onPress={sendMessage}/>
      </View>
      </KeyboardAvoidingView>
      
    </SafeAreaView>
  )
}

export default MessageScreen