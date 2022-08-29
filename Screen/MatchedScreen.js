import React from "react";
import {View,Text,Image,TouchableOpacity} from "react-native";
import {useNavigation,useRoute} from "@react-navigation/core";
import tw from "tailwind-rn";
const MatchedScreen=()=>{
    const navigation=useNavigation();
    const {params}=useRoute();
    const {loggedInProfile,userSwiped}=params;
    return (
        <View style={[tw('h-full bg-yellow-500 pt-20'),{opacity:0.89}]}>
         <View style={tw('justify-center px-10 pt-20')}>
            <Image source={{uri:"https://links.papareact.com/mg9"}}
            style={tw("h-20 w-full")} />
            <Text style={tw('text-white text-center mt-5')}>
                you and {userSwiped.displayName} have liked each other
            </Text>
            <View style={tw('flex-row justify-evenly mt-5')}>
                <Image style={tw('h-32 w-32 rounded-full')}
                 source={{
                    uri:loggedInProfile.photoUrl,
                 }}/>
                  <Image style={tw('h-32 w-32 rounded-full')}
                 source={{
                    uri:userSwiped.photoUrl,
                 }}/>

       
            </View>
            <TouchableOpacity style={tw('bg-white m-5 px-10 py-8 rounded-full mt-20')}
        onPress={()=>{
            navigation.goBack();
            navigation.navigate("chart");
        }}>
            <Text style={tw('text-center')}>Send a message </Text>
        </TouchableOpacity>
         </View>
        </View>
    )
}
export default MatchedScreen;