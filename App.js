import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity,TextInput } from 'react-native';
import axios from 'axios';
import {useState} from 'react';
import Icon from 'react-native-vector-icons/Feather';

export default function App() {
    const [busqueda,setBusqueda] = useState("");
    const [nombreProvincia,setNombreProvincia] = useState("");
    const [iconoClima,setIconoClima] = useState("");
    const [descripcionClima,setDescripcionClima] = useState("Busca el nombre de la provincia para obtener su pronóstico meteorológico.");
    const [temperatura,settemperatura] = useState("");
    const [tempMinMax,settempMinMax] = useState("");

    const provincias = [
        { "córdoba": "14" }, { "sevilla": "41" }, { "almería": "04" }, { "huelva": "21" },
        { "cádiz": "11" }, { "málaga": "29" }, { "granada": "18" }, { "jaén": "23" },
        { "cordoba": "14" }, { "sevilla": "41" }, { "almeria": "04" }, { "huelva": "21" },
        { "cadiz": "11" }, { "malaga": "29" }, { "granada": "18" }, { "jaen": "23" }
    ]

    const infoClima = async(provincia)=>{
        try{
            //obtengo la key y el value del elemento del array cuyo key
            //corresponde a la info buscada (provincia)
            var resultado = provincias.find(obj => obj.hasOwnProperty(provincia))
            const [nombreProvincia, codigoProvincia] = Object.entries(resultado)[0];

            const response = await axios.get("https://www.el-tiempo.net/api/json/v2/provincias/"+codigoProvincia+"/municipios");
            //dentro de response.data.ciudades encontrar cual es la capital
            const ciudad = response.data.municipios.find((municipios) => municipios.NOMBRE_PROVINCIA === municipios.NOMBRE);

            //obtengo la informacion del municipio capital
            const climaCapital = await axios.get("https://www.el-tiempo.net/api/json/v2/provincias/"+codigoProvincia+"/municipios/"+ciudad.COD_GEO);
            setNombreProvincia(climaCapital.data.municipio.NOMBRE_PROVINCIA);
            setDescripcionClima(climaCapital.data.stateSky.description);
            settemperatura(climaCapital.data.temperatura_actual+"ºC");
            settempMinMax(climaCapital.data.temperaturas.min+"/"+climaCapital.data.temperaturas.max+"ºC");
        }catch(error){
            alert("Ha habido un error: "+error);
        }
    }

    const buscar = () => {
        if(busqueda.trim() !== ""){
            if(provincias.find(obj => obj.hasOwnProperty(busqueda.toLowerCase()))){
                infoClima(busqueda);
            }else{
                setNombreProvincia("");
                settemperatura("");
                settempMinMax("");
                setDescripcionClima("Busca el nombre de la provincia para obtener su pronóstico meteorológico.");
            }
        }
    }


  return (
    <View style={styles.container}>
      <Text style={styles.appTitle}>Aplicacion del tiempo</Text>
      <View style={styles.buscador}>
          <TextInput
                style={styles.input}
                placeholder="Ejemplo: Córdoba"
                placeholderTextColor="gray"  // Color del texto de placeholder
                value={busqueda} // El valor del TextInput es el contenido de `texto`
                onChangeText={setBusqueda} // Actualiza `texto` cuando el usuario escribe
          />
          <TouchableOpacity style={styles.buscar} onPress={buscar}><Text style={styles.text}>Buscar</Text></TouchableOpacity>
      </View>
      <Text style={styles.nombreProvincia}>{nombreProvincia}</Text>
      <Text style={styles.temperatura}>{temperatura}</Text>
      <Text style={styles.text}>{descripcionClima}</Text>
      <Text style={styles.text}>{tempMinMax}</Text>

      <TouchableOpacity style={styles.updateButton}>
        <Text style={styles.text} onPress={()=>{nombreProvincia!=""?infoClima(nombreProvincia.toLowerCase()):""}}>Actualizar clima</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2B4B6F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appTitle: {
    color: 'white',
    width: '100%',
    position: 'absolute',
    top: '10%',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 0.5,
    paddingVertical: 10,
  },
  nombreProvincia: {      // Nuevo estilo para el nombre de la provincia
    color: 'white',
    fontSize: 20,         // Tamaño tipo h3
    fontWeight: '500',
    textAlign: 'center',
    marginVertical: 10,
    textTransform: 'capitalize', // Primera letra en mayúscula
  },
  text: {
    padding: 5,
    textAlign: 'center',
    color: 'white',
  },
  temperatura: {
    color: 'white',
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  updateButton: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 25,
    padding: 10,
    width: 250,
    position: 'absolute',  // Posicionamiento absoluto
    bottom: 40,           // Distancia desde el bottom
  },
  buscador: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    position: 'absolute',
    top: 150,
  },
  input: {
    backgroundColor: 'white',
    width: '70%',
    height: 35,
    borderRadius: 25,
    padding: 5,
    paddingLeft: 15,
  },
  buscar: {
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    width: '15%',
  },
});