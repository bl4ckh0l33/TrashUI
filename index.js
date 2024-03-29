const BASE_API_URL = "https://trash-api-tau.vercel.app/api/posts";
const initLocationBtn = document.getElementById("initLocation");
const stopLocationBtn = document.getElementById("stopLocation");
const busesSelect = document.getElementById("buses");
const driverNameLabel = document.querySelector("#driverName");
const userImage = document.querySelector("#userImage");

var svgBus = "./bus.svg";

var buses;
var intervalo1;
var intervalo2;

var coordenadas1 = {
  lat: 0,
  lng: 0,
};
var coordenadas2 = {
  lat: 0,
  lng: 0,
};

//funcion para selecionar buses
busesSelect.addEventListener("change", () => {
  driverNameLabel.textContent = `${
    buses.filter((el) => el.busPlate === Number(busesSelect.value))[0].firstname
  } ${
    buses.filter((el) => el.busPlate === Number(busesSelect.value))[0].lastname
  }`;
  userImage.src = `${
    buses.filter((el) => el.busPlate === Number(busesSelect.value))[0].image
  }`;
});
//boton de inicializar el recorrido con un intervalo de 2 segundos
initLocationBtn.addEventListener("click", () => {
  intervalo1 = setInterval(getLatLngAndUpdateDB, 1000);
  intervalo2 = setInterval(getLatLngAndUpdateMap, 500);
});
//para detener el recorrido
stopLocationBtn.addEventListener("click", () => {
  clearInterval(intervalo1);
  clearInterval(intervalo2);
});
//actualizar la ubicacion constantemente del camion
function actualizarUbicacion(datos) {
  // BASE_API_URL a la que enviar la solicitud POST

  // Opciones de configuración para la solicitud Fetch
  const opciones = {
    method: "PUT", // Método de la solicitud
    headers: {
      "Content-Type": "application/json", // Tipo de contenido que estás enviando (JSON en este caso)
    },
    body: JSON.stringify(datos), // Convertir los datos a formato JSON y enviarlos en el cuerpo de la solicitud
  };

  // Realizar la solicitud Fetch
  fetch(`${BASE_API_URL}/${Number(busesSelect.value)}`, opciones)
    .then((response) => {
      // Verificar el estado de la respuesta
      if (!response.ok) {
        throw new Error("Error al enviar los datos.");
      }
      return response.json(); // Convertir la respuesta a JSON si es necesario
    })
    .then((data) => {
      // Hacer algo con la respuesta recibida
      console.log("Respuesta del servidor:", data);
    })
    .catch((error) => {
      // Manejar errores
      console.error("Error:", error);
    });
}

//la funcion de obtener ubicacion del camion recolector con su latitud y longitud
function getLatLngAndUpdateDB() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (posicion) {
      const latitud = posicion.coords.latitude;
      const longitud = posicion.coords.longitude;

      if (coordenadas1.lat != latitud || coordenadas1.lng != longitud) {
        coordenadas1 = {
          lat: latitud,
          lng: longitud,
        };
        actualizarUbicacion(coordenadas1); // Actualiza en DB la ubicacion del bus
      }
    });
  } else {
    console.log("Geolocalización no es soportada por este navegador.");
  }
}

function getLatLngAndUpdateMap() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (posicion) {
      const latitud = posicion.coords.latitude;
      const longitud = posicion.coords.longitude;

      if (coordenadas2.lat != latitud || coordenadas2.lng != longitud) {
        coordenadas2 = {
          lat: latitud,
          lng: longitud,
        };
        actualizarMapa(coordenadas2);
      }
    });
  } else {
    console.log("Geolocalización no es soportada por este navegador.");
  }
}

// Inicializar el mapa de Google fuera de la función initMap
var mapa = null;
var marcador = null;
// funcion para inicializar el mapa 
function initMap() {
  // Si el mapa aún no se ha inicializado, inicialízalo
  console.log("mapa", mapa);
  if (mapa === null) {
    mapa = new google.maps.Map(document.getElementById("map"), {
      zoom: 18, // Nivel de zoom
    });
  }
}
//funcion para que el mapa se vaya actualizando constantemente el camion avanza
function actualizarMapa(ubicacion) {
  // Inicializar el mapa si aún no se ha inicializado
  initMap();

  // Centrar el mapa en la nueva ubicación
  mapa.setCenter(ubicacion);

  // Crear o mover el marcador a la nueva ubicación
  if (marcador === null) {
    // Crear un nuevo marcador si no existe
    console.log("creando marcador cuando no existe");
    marcador = new google.maps.Marker({
      position: ubicacion,
      map: mapa,
      title: "¡Estoy aquí!",
      icon: {
        url: svgBus,
        scaledSize: new google.maps.Size(80, 80), // Tamaño personalizado
      },
    });
  } else {
    // Mover el marcador a la nueva ubicación si ya existe
    if (mapa && ubicacion) {
      console.log("actualizando la ubicacion del marcador");
      marcador.setPosition(ubicacion);
    }
  }
}

function getBuses() {
  fetch(BASE_API_URL)
    .then((response) => {
      // Verificar el estado de la respuesta
      if (!response.ok) {
        throw new Error("Error al obtener los datos.");
      }
      return response.json(); // Convertir la respuesta a JSON si es necesario
    })
    .then((data) => {
      // Hacer algo con la respuesta recibida
      buses = data;
      console.log(buses);
      let options = buses.map((el) => {
        return `<option value=${el.busPlate} >Bus: ${el.busPlate} | Chofer: ${el.firstname} ${el.lastname}</option>`;
      });
      busesSelect.innerHTML += options;
    })
    .catch((error) => {
      // Manejar errores
      console.error("Error:", error);
    });
}

getBuses();
