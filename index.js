const BASE_API_URL = "https://trash-api-tau.vercel.app/api/posts";
const initLocationBtn = document.getElementById("initLocation");
const stopLocationBtn = document.getElementById("stopLocation");
const busesSelect = document.getElementById("buses");
const driverNameLabel = document.querySelector("#driverName");
const userImage = document.querySelector("#userImage");

var buses;
var intervalo;

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

initLocationBtn.addEventListener("click", () => {
  intervalo = setInterval(obtenerUbicacion, 4000);
});

stopLocationBtn.addEventListener("click", () => {
  clearInterval(intervalo);
});

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

function obtenerUbicacion() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (posicion) {
      const latitud = posicion.coords.latitude;
      const longitud = posicion.coords.longitude;
      const ubicacion = {
        lat: latitud,
        lng: longitud,
      };

      actualizarUbicacion(ubicacion);
      initMap(ubicacion);
    });
  } else {
    console.log("Geolocalización no es soportada por este navegador.");
  }
}

function initMap(ubicacion) {
  var mapa = new google.maps.Map(document.getElementById("map"), {
    zoom: 18, // Nivel de zoom
    center: ubicacion, // Centro del mapa
  });

  var svgIcono = {
    url: "https://www.tierra.org/wp-content/themes/tierra.org2015/favicon.ico", // Ruta del archivo SVG
  };

  var marcador = new google.maps.Marker({
    position: ubicacion,
    map: mapa,
    title: "¡Estoy aquí!",
    icon: svgIcono,
  });
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
