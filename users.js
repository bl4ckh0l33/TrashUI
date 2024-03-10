// Establecer un umbral de proximidad en metros
var umbralProximidad = 10; // Por ejemplo, 10 metros

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
  }
}

// Inicializar el mapa de Google fuera de la función initMap
var mapa = null;
var marcador = null;
var ubicacionObjetivo = new google.maps.LatLng(40.7128, -74.006);
var ubicacionActual = new google.maps.LatLng(40.7128, -74.006);

function consultarUbicacion() {
  // BASE_API_URL a la que enviar la solicitud POST
  const BASE_API_URL = "https://trash-api-tau.vercel.app/api/posts/1";

  // Realizar la solicitud Fetch
  fetch(BASE_API_URL)
    .then((response) => {
      // Verificar el estado de la respuesta
      if (!response.ok) {
        throw new Error("Error al enviar los datos.");
      }
      return response.json(); // Convertir la respuesta a JSON si es necesario
    })
    .then((data) => {
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
    })
    .catch((error) => {
      // Manejar errores
      console.error("Error:", error);
    });
}

setInterval(consultarUbicacion, 4000);

function initMap() {
  // Si el mapa aún no se ha inicializado, inicialízalo
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
    marcador = new google.maps.Marker({
      position: ubicacion,
      map: mapa,
      title: "¡Estoy aquí!",
    });
  } else {
    // Mover el marcador a la nueva ubicación si ya existe
    mapa.marker.setPosition(ubicacion);
  }
}
