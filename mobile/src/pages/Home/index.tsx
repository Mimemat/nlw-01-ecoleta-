import React, {useState, useEffect} from 'react';
import { Feather as Icon  } from '@expo/vector-icons';
import { View, ImageBackground, Image, StyleSheet, Text, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';


interface IBGEUFResponse {
  sigla: string;
}

const Home = () => {
  const[ufs, setUfs] = useState<string[]>([])
  const[selectedUf, setSelectedUf] = useState('')
  const[selectedCity, setSelectedCity] = useState('')
  const[cities, setCities] = useState([])

  const navigation = useNavigation()

  function handleNavigationPoints() {
    if(selectedUf === null || selectedCity === null){
      Alert.alert('Preecha todos os campos')
    }
    else{
    navigation.navigate('Points', {
      uf: selectedUf,
      city: selectedCity
    })
    }
  }

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
        const ufInitials = response.data.map(estado => estado.sigla)
        setUfs(ufInitials);
  })
  }, [])


  useEffect(() =>{
    axios
    .get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
    .then(response =>{
        const cityName = response.data.map(city => city.nome)
        setCities(cityName)
    })
}, [selectedUf])

  return (
  <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
     <ImageBackground source={require('../../assets/home-background.png')} 
     style={styles.container}
     imageStyle={{ width: 274, height: 368 }}
     >
         <View style={styles.main} >
          <Image source={require('../../assets/logo.png')} />
          <View>
          <Text style={styles.title}>Seu marketplace de coleta de resíduos.</Text>  
          <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
          </View>  
         </View>
          <View style={styles.footer}>
          <View style={styles.input} >
          <RNPickerSelect 
          onValueChange={(value) => setSelectedUf(value)} 
          placeholder={{label: "Selecione sua UF", value: null}}
          items={ufs.map(uf =>{
            return(
              {
                label:uf, value: uf
              }
            )
          })}
          />
          </View>
          <View style={styles.input} >
          <RNPickerSelect 
          onValueChange={(value) => setSelectedCity(value)} 
          placeholder={{label: "Selecione sua Cidade", value: null}}
          items={cities.map(city =>{
            return(
              {
                label:city, value: city
              }
            )
          })}
          />
          </View>       
            <RectButton style={styles.button} onPress={handleNavigationPoints}>
              <View style={styles.buttonIcon}>
                <Text>
                  <Icon name="arrow-right" color="#FFF" size={24} />
                </Text>
              </View>
              <Text style={styles.buttonText}>
                Entrar
              </Text>
            </RectButton>
          </View>


     </ImageBackground>
  </KeyboardAvoidingView>
  )
}

 
const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32,
    },
  
    main: {
      flex: 1,
      justifyContent: 'center',
    },
  
    title: {
      color: '#322153',
      fontSize: 32,
      fontFamily: 'Ubuntu_700Bold',
      maxWidth: 260,
      marginTop: 64,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 16,
      fontFamily: 'Roboto_400Regular',
      maxWidth: 260,
      lineHeight: 24,
    },
  
    footer: {},
  
    select: {},
  
    input: {
      backgroundColor: '#FFF',
      borderRadius: 10,
      marginBottom: 8,
      paddingHorizontal: 24,
      alignItems: 'center',
      fontSize: 16,
    },
  
    button: {
      backgroundColor: '#34CB79',
      height: 60,
      flexDirection: 'row',
      borderRadius: 10,
      overflow: 'hidden',
      alignItems: 'center',
      marginTop: 8,
    },
  
    buttonIcon: {
      height: 60,
      width: 60,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    buttonText: {
      flex: 1,
      justifyContent: 'center',
      textAlign: 'center',
      color: '#FFF',
      fontFamily: 'Roboto_500Medium',
      fontSize: 16,
    }
  });

export default Home;