import { View, Text } from 'react-native'
import * as Google from "expo-google-app-auth";
import React, { createContext, useContext, useState,useEffect, useMemo } from 'react'
import { create } from 'tailwind-rn'
import {auth} from "../firebase";

import{
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut} from "@firebase/auth";
const AuthContext= createContext({});
const config={
  iosClientId:'722741879764-a43uegvrb2p7nccsqas4vnb76t33jv9j.apps.googleusercontent.com',
  androidClientId:'722741879764-rt1qfhi1dshmnvccs9cjm5r74gqngo55.apps.googleusercontent.com',

  scopes:["profile","email"],
  Permissions:["public_profile","email","gender","location"],
};

export const AuthProvider = ({children}) => {
  const[error,setError]=useState(null);
  const[user,setUser]=useState(null);
  const[loadingInitial,setLoadingInitial]=useState(true);
  const[loading,setLoading]=useState(false)
  useEffect(() =>
  onAuthStateChanged(auth,(user)=>{
      if(user){
        setUser(user);
      }else{
        setUser(null);
      }
      setLoadingInitial(false);
    }),
   []);
  
 
 const logout=()=>{
    setLoading(true);
    signOut(auth).catch((error)=>setError(error)).finally(()=>setLoading(false))
 };
  const sigInWithGoogle= async()=>{
    setLoading(true)
 await Google.logInAsync(config).then(async(logInResult)=>
 {
  if(logInResult.type ==='success'){
    const {idToken,accessToken} = logInResult;
    const credential =  GoogleAuthProvider.credential(idToken,accessToken);
  

    await signInWithCredential(auth,credential);

 }
 return Promise.reject();
}).catch(error=>setError(error)).finally(
  ()=>setLoading(false)
); 
};
const memoedValue=useMemo(()=>({
  user,
sigInWithGoogle,
loading,
error,
logout,
}),[user,loading,error])
  return (
    <AuthContext.Provider value={memoedValue}
    > 
      {!loadingInitial && children}
    </AuthContext.Provider>

  )
};
export default function useAuth(){
  return useContext(AuthContext);

}
