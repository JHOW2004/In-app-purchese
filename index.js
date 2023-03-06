import React, {useState, useEffect} from "react"
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, Image, ScrollView, Platform, Alert } from "react-native"
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from "expo-linear-gradient";
import { collection,  getFirestore, addDoc } from "firebase/firestore";
import Purchases from "react-native-purchases";
import { getAuth } from "firebase/auth";

import styles from "./style"

export default function Hotmart ({navigation}) {
    
    const auth = getAuth();
    const user = auth.currentUser;

    const [produto, setProduto] = useState(null)
    const [email, setEmail] = useState("")
    const [controle, setControle] =  useState(0)

    useEffect(() => {
        if (user !== null) {
            user.providerData.forEach((profile) => {
                setEmail(profile.email)
            });
        } 
    },[]);
    
    useEffect(() => {
            Purchases.setDebugLogsEnabled(true)
            Purchases.configure({apiKey: "appl_tNjFEiJGEGpZydLcnrLRQjakWAd"});
            setControle(1)
    },[email])

    const getPackages = async () => {
        try {
          const offerings = await Purchases.getOfferings();
          if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
            setProduto(offerings.current.availablePackages);
          }
        } catch (e) {
          Alert.alert('Error getting offers', e.message);
        }
      };

      useEffect (() => {
        getPackages();
      },[controle])

      console.log(produto)


      const buy = async () =>{
        try {
            const {customerInfo} = await Purchases.purchasePackage(pack);
            if (typeof customerInfo.entitlements.active.pro !== "undefined") {
                Alert.alert("¡Compra realizada con éxito!", "")

                const db = getFirestore();
                const docRef = await addDoc(collection(db, "Compra"), {
                    Email: email
                });

                navigation.goBack()
            }
          } catch (e) {
            if (!e.userCancelled) {
              console.log(e)
              Alert.alert("¡Error al realizar compra!", "")
            }
          }
      }
    
        return (
            <SafeAreaView style={{ backgroundColor: '#054A59', }}>
                <View>
                <LinearGradient style={{  borderTopLeftRadius: 70, borderTopRightRadius: 70}}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 0 }}
                        colors={['#021D24', '#03303B', '#044352', '#055669', '#07768F',]}>
                <ScrollView>
                <StatusBar barStyle="light-content" backgroundColor="#054A59" />
                    
                   
                    <Animatable.View style={styles.divImg}
                    animation="fadeInDown"
                    >
                        <Image style={styles.img} source={{
                            uri: 'https://firebasestorage.googleapis.com/v0/b/teste-5e945.appspot.com/o/Logos%2FCurso.png?alt=media&token=6b251262-008b-4a89-9d2c-ecba45cb9c8f',
                        }} />
                    </Animatable.View>

                    {/* botões de ação do usuario*/}
                    
                        {produto &&
                            produto.availablePackages.map(pack => {
                                <View style={{ alignContent: 'center', alignItems: 'center', alignSelf: 'center', justifyContent: 'center' }} key ={pack.identifier}>
                                    <View style={{margin: 15}}>
                                    <Text style={{color: '#FFF', textAlign: 'center', fontSize: 20, marginBottom: 10, fontWeight: 'bold'}}>Descripción:</Text>
                                        <Text style={{color: '#FFF', textAlign: 'center', fontSize: 14}}>En este curso será posible aprender diversas técnicas que un dentista podrá aplicar en su día a día para mejorar sus atenciones</Text>
                                    </View>
                                        <Text style={{fontWeight: 'bold', fontSize: 30, color: '#FFF', marginTop: 10}}>Precio:</Text>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text style={{fontSize: 40, color: '#FFF', marginTop: 7}}>{pack.product.price_string}</Text>
                                    </View>
                                    <Text style={{fontSize: 14, color: '#FFF', margin: 13, textAlign: 'center'}}>La renovación no es automática, tiene una duración de 12 meses. Después de comprar el acceso al curso en hotmart se activará dentro de 7 días por nuestro equipo de soporte</Text>
                                
                                
                                        <View style={{alignContent: 'center', alignItems: 'center', marginTop: 30}}>
                                            <Text style={{textAlign: 'center', fontSize: 20, color: '#FFF',}}>Detalles</Text>
                                        </View>
                            
                                        <View style={{alignItems: 'center', alignSelf: 'center', justifyContent: 'center', marginTop: 7}}>
                                            <Text style={{color: '#FFF', fontSize: 12, textAlign: 'center'}}>El pago se cargará a su cuenta de ID de Apple en el momento de la compra. La suscripción se puede cancelar en un periodo de 24 en la parte de suscripciones de apple.</Text>
                                        </View>
                                    
                                    <TouchableOpacity style={{ backgroundColor: '#06BA84', width: 160, height: 60, marginTop: 45, borderRadius: 30, marginBottom: 30 }}
                                        onPress={buy}
                                    >
                                        <View style={{alignContent: 'center', alignItems: 'center', marginTop: 15}}>
                                            <Text style={{textAlign: 'center', fontSize: 17, color: '#FFF', fontWeight: 'bold'}}>Comprar</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            })
                    }
               
                      
                    <View style={{height: 50}}>
                    </View>
                </ScrollView>
                </LinearGradient>
                </View>
            </SafeAreaView>

        );
    }

