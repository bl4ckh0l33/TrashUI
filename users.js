const BASE_API_URL = "https://trash-api-tau.vercel.app/api/posts";
const busesSelect = document.getElementById("buses");
const driverNameLabel = document.querySelector("#driverName");
const userImage = document.querySelector("#userImage");

var buses;

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

// Establecer un umbral de proximidad en metros
var umbralProximidad = 50; // Por ejemplo, 50 metros

// Audio
const audio = document.getElementById("alerta");
const player = document.getElementById("player");

player.addEventListener("click", () => {
  setInterval(consultarUbicacion, 4000);
});

// Función para calcular la distancia entre dos coordenadas en metros
function calcularDistancia(coord1, coord2) {
  return google.maps.geometry.spherical.computeDistanceBetween(coord1, coord2);
}

// Función para verificar la proximidad y mostrar una alerta si es necesario
function verificarProximidad(ubicacionActual) {
  // Calcular la distancia entre la ubicación actual y la ubicación objetivo
  var distancia = calcularDistancia(ubicacionActual, ubicacionObjetivo);

  // Verificar si la distancia es menor que el umbral de proximidad
  if (distancia < umbralProximidad) {
    // Mostrar una alerta
    console.log("¡Estás cerca de la ubicación objetivo!");
    audio.play();
  }
}

// Inicializar el mapa de Google fuera de la función initMap
var mapa = null;
var marcador = null;
var ubicacionObjetivo = new google.maps.LatLng(40.7128, -74.006);
var ubicacionActual = new google.maps.LatLng(40.7128, -74.006);

function consultarUbicacion() {
  // Realizar la solicitud Fetch
  fetch(`${BASE_API_URL}/${Number(busesSelect.value)}`)
    .then((response) => {
      // Verificar el estado de la respuesta
      if (!response.ok) {
        throw new Error("Error al enviar los datos.");
      }
      return response.json(); // Convertir la respuesta a JSON si es necesario
    })
    .then((data) => {
      console.log("data", data);
      navigator.geolocation.getCurrentPosition((posicion) => {
        ubicacionActual = new google.maps.LatLng(
          posicion.coords.latitude,
          posicion.coords.longitude
        );
      });

      ubicacionObjetivo = new google.maps.LatLng(data.lat, data.lng);
      verificarProximidad(ubicacionActual);
      // Hacer algo con la respuesta recibida
      const ubicacion = {
        lat: data.lat,
        lng: data.lng,
      };
      actualizarMapa(ubicacion);
      return true;
    })
    .catch((error) => {
      // Manejar errores
      console.error("Error:", error);
    });
}

function initMap() {
  // Si el mapa aún no se ha inicializado, inicialízalo
  console.log("mapa", mapa);
  if (mapa === null) {
    mapa = new google.maps.Map(document.getElementById("map"), {
      zoom: 18, // Nivel de zoom
    });
  }
}

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
    });
  } else {
    console.log(mapa.marker);
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
