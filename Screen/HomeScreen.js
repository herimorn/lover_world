import { View, Text, Button, SafeAreaView, TouchableOpacity,Image,StyleSheet} from 'react-native'
import React, { useEffect, useLayoutEffect,useRef, useState} from 'react'
import tw from 'tailwind-rn';
import { useNavigation } from '@react-navigation/native';
import {AntDesign,Entypo,Ionicons} from "@expo/vector-icons";
import useAuth from '../hooks/useAuth';
import Swiper from "react-native-deck-swiper";
import { onSnapshot ,doc, collection,setDoc,getDocs,query,where,getDoc,serverTimestamp} from 'firebase/firestore';
import generateId from "../lib/generateId";
import {db} from "../firebase";

const Dummy_Data=[
  {
    id:123,
    firstName:'furaha',
    lastName:"juma",
    age:27,
    occupation:"dance",
    photoURL:"https://images.unsplash.com/photo-1570915226741-cc7d678ad7ce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTl8fGJsYWNrJTIwZ2lybHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
  },
  {
    id:124,
    firstName:'jolie',
    lastName:"christon",
    age:23,
    occupation:"designer",
    photoURL:"https://images.unsplash.com/photo-1631168228401-c37875b22ee8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fGJsYWNrJTIwZ2lybHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
  },
  {
    id:124,
    firstName:'herimorn',
    lastName:"christon",
    age:23,
    occupation:"designer",
    photoURL:"https://lh3.googleusercontent.com/5hmRarP096e2maXlKl8rigy1hlDVUSvPSUYd9HuCB6dLMLhySIOXzYUtidlT4xJSrAa8wQufoYE10g-Y7aZQNKj0D1vdc0o-6EAOVbiiWJ29GnMnOmReONtnBQZyXB2e7k6X62dTqiUWN9ox8j85t4q9BbpfyfxiEUaa6GwZYxnokyETiWdmJT3pNjQRX5QZaGHkVHo0kKU9Qws_JnQGScxKwCQzdXpvFi7Kuju3QwVG_i4VanDZ7C2Mf31xoBfYR5wPry3EmqZRC1mSJwmovw4Rq0Q-WxPLP0MWNALjkCrqZPXVuM_Aw51B6aG2k0LRIhbG9lmUbUYXXVRcmmDNHw2JvpOG5w3CzpzKgnYJ3GOnfNEAZAeSU_M8qOL6qbExDU0fZwb1mDw5hscKccKUlo7ZvDehp1R_N_w2AJ5qaRCQxLcW5F3P9mQzqmCewRVKrk8615MYvBij7mclqbeFUUjJqlvZDM7AcKirSITM9LJfC4V8eB9IMBIfMy-bofeEmnpfVMCkFs92mIISZJyAFOdDPYfHMbuVCB4aSooZtFnwN25RrXASXbh-rtTq2XV8Tx_5FXR4XkZCn0Bg8OLt2mQG8irT2CXq9f6OSD3gVSqqZSynYvb83UK-gWna9ackmvHmp249kcEY4PY8fWx9QhV-ZrQlBg3qi16MZ6C0VqnHZ0dOoBCrHwWnFn_WeFimGsvVatLq2WQfZDRjcwdRgn5kigum_k_pdVa9Ed6Spc0JCeI65vgDPZ3EiOE=w469-h625-no?authuser=0",
  },
];
export default function HomeScreen() {
  const navigate=useNavigation();
 const {user,logout} =useAuth();
 const swipeRef=useRef(null);
 const[profiles,setProfiles]=useState([]);
 useLayoutEffect(()=>
 onSnapshot(doc(db,"users",user.uid),
 (snapshot)=>{
       if(!snapshot.exists()){
        navigate.navigate('modal')
       }
 }),
 [])
useEffect(()=>{
 
  let unsub;
 const fetchCards= async()=>{
  const passes= await getDocs(collection(db,"users",user.uid,"passes")).then(
    (snapshot)=>snapshot.docs.map((doc)=>doc.id)
  );
  const swipes= await getDocs(collection(db,"users",user.uid,"swipes")).then(
    (snapshot)=>snapshot.docs.map((doc)=>doc.id)
  );
  const passedUserIds=passes.length>0 ? passes:["test"];
  const swipedUserIds=swipes.length>0 ?swipes:["test"];
      unsub=onSnapshot(query(collection(db,"users"),where("id","not-in",[...passedUserIds,...swipedUserIds])),
      snapshot=>{
        setProfiles(
          snapshot.docs.filter(doc=>doc.id!==user.uid).map(doc=>({
            id:doc.id,
            ...doc.data()
          }))
        )
      })
 }
 fetchCards();
 return unsub;
},[db])

const swipeLeft=(cardIndex)=>{
  if(!profiles[cardIndex]) return;
  const userSwiped=profiles[cardIndex];
  console.log(`you swipped pass on ${userSwiped.displayName}`);
  setDoc(doc(db,"users",user.uid,'passes',userSwiped.id),
  userSwiped)

}
const swipeRight=async(cardIndex)=>{
  if(!profiles[cardIndex]) return;
  const userSwiped=profiles[cardIndex];
  const loggedInProfile= await (await getDoc(doc(db,"users",user.uid))).data();
  console.log(loggedInProfile);
  //checking if the user swipped on you...
  getDoc(doc(db,"users",userSwiped.id,'swipes',user.uid)).then((documentSnapshot)=>{
      if(documentSnapshot.exists()){
        //user has matched with you before you matched with them..
        //create a match
        console.log(`hooray,you matched with ${userSwiped.displayName}`)
        setDoc(doc(db,"users",user.uid,"swipes",userSwiped.id),
        userSwiped);
        //create the match
        setDoc(doc(db,"matches",generateId(user.uid,userSwiped.id)),{
          users:{
                [user.uid]:loggedInProfile, 
                [userSwiped.id]:userSwiped
          },
          usersMatched:[user.uid,userSwiped.id],
          timestamp:serverTimestamp(),
        });
        navigate.navigate("Match",{
          loggedInProfile,
          userSwiped,
        });
      }else{
        //user swiped as the first interaction between the two or didnt get swipped on...
        console.log(`you swipped pass on ${userSwiped.displayName}`);
        setDoc(doc(db,"users",user.uid,"swipes",userSwiped.id),
        userSwiped)
      }
  })



}
  return (
   
    <SafeAreaView style={tw("flex-1")}>
      {/*header */}
      <View style={tw("items-center relative")}>
      <TouchableOpacity style={tw("absolute left-5 top-3")} onPress={logout}>
       <Image  style={tw('h-10 w-10 rounded-full')}source={{uri:user.photoURL}}/>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>navigate.navigate("modal")}>
      <Image  style={tw('h-14 w-14 rounded-full')}source={{uri:"https://cdn.vectorstock.com/i/thumb-large/80/68/film-movie-polygon-abstract-logo-vector-4068068.webp"}}/>
      </TouchableOpacity>
      <TouchableOpacity style={tw("absolute right-5 top-3")}>
        <Ionicons name="chatbubble-sharp" size={30} color="#B22222" onPress={()=>navigate.navigate("chart")}/>
      </TouchableOpacity>
      </View>
     
      {/*end of header */}
      {/*cards */}
      <View style={tw("flex-1 -mt-6")}>
      <Swiper
       ref={swipeRef}
        containerStyle={{backgroundColor:"transparent"}}
         cards={profiles}
         stackSize={5}
         cardIndex={0}
         verticalSwipe={false}
         animateCardOpacity
         onSwipedLeft={(cardIndex)=>{
        
           swipeLeft(cardIndex);
           console.log("swipe pass");
         }}
         onSwipedRight={
          (cardIndex)=>{
            swipeRight(cardIndex);
            //console.log("swipe match")
          }
         }
         backgroundColor={"4fd09"}
         overlayLabels={
          {
            left:{
              title:"NOPE",
              style:{
                label:{
                  textAlign:"right",
                  color:"red",
                },
              },
            },
            right:{
              title:"MATCH",
              style:{
                label:{
                  textAlign:"left",
                  color:"#4ded30",
                },
              },
            },

          }
         }
         renderCard={(card)=> card ?(
      
          <View key={card.id} style={tw(' relative bg-white h-3/4 rounded-xl')}>
            <Image style={tw(" absolute top-0 h-full w-full rounded-xl")} source={{uri:card.photoUrl}}/>
            <View style={[tw(" absolute bottom-0 flex-row items-center bg-white w-full h-20 justify-between px-6 py-6"),styles.cardShadow]}>
              <View>
                <Text style={tw('text-xl font-bold')}>{card.displayName}</Text>
                <Text>{card.job}</Text>
              </View>
              <Text>{card.gender}</Text>
              <Text style={tw('text-2xl font-bold')}>{card.age}</Text>
            
            </View>
          </View>
  ):(
    <View
      style={[tw('relative bg-white h-3/4 rounded-xl justify-center items-center'),
      styles.cardShadow,]}>
      <Text style={tw('font-bold pb-5')}>no more profile</Text>
      <Image style={tw('h-20 w-full')}
      height={60}
      width={60}
      source={{uri:"https://links.papareact.com/6gb"}}/>
    </View>
  )}
      />
      </View>
      
      {/*end of the cards*/}
      <View style={tw('flex flex-row justify-evenly')}>
        <TouchableOpacity style={tw('items-center justify-center rounded-full w-16 h-16 bg-red-200')}
        onPress={()=>swipeRef.current.swipeLeft()}>
          <Entypo name="cross" size={24} color="red"/>
        </TouchableOpacity>
        <TouchableOpacity style={tw('items-center justify-center rounded-full w-16 h-16 bg-green-200')}
         onPress={()=>swipeRef.current.swipeRight()}>
          <AntDesign name="heart" size={24} color="green"/>
        </TouchableOpacity>

      </View>
     
  </SafeAreaView>
  );
};
const styles=StyleSheet.create({
  cardShadow:{
    shadowColor:"#000",
    shadowOffset:{
      width:0,
      height:1,
    },
    shadowOpacity:0.2,
    shadowRadius:1.41,
    elevation:2,
  },
})