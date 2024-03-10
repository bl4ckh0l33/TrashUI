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
      // Hacer algo con la respuesta recibida
      const ubicacion = {
        lat: data.lat,
        lng: data.lng,
      };
      initMap(ubicacion);
    })
    .catch((error) => {
      // Manejar errores
      console.error("Error:", error);
    });
}

setInterval(consultarUbicacion, 4000);

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
