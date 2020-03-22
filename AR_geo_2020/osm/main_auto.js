// ------------------- DATA ---------------------
// https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html
let somePlaces = [
  {
    name: 'ENSAAMA DSACOM',
    lonlat: [2.295264, 48.833733],
    scale: 3,
  },
]

let etiennePlaces = [
  { lonlat:[2.295307, 48.833190] }, // cour angle Sud-Est
]

// -------------------- FCT : INIT -------------------
let lonlat = [2.058521, 48.920380];

function init() {

  // https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html
  let url = [
    "https://a.tile.openstreetmap.org/${z}/${x}/${y}.png",
    "https://b.tile.openstreetmap.org/${z}/${x}/${y}.png",
    "https://c.tile.openstreetmap.org/${z}/${x}/${y}.png",
  ]

getFirstPos();

  map = new OpenLayers.Map("basicMap")

  let mapnik         = new OpenLayers.Layer.OSM('lol', url)
  let fromProjection = new OpenLayers.Projection("EPSG:4326")   // Transform from WGS 1984
  let toProjection   = new OpenLayers.Projection("EPSG:900913") // to Spherical Mercator Projection
  let position       = new OpenLayers.LonLat(...lonlat).transform( fromProjection, toProjection)
  let zoom           = 18

  map.addLayer(mapnik)
  map.setCenter(position, zoom )

  var markers = new OpenLayers.Layer.Markers( "Markers" )
  map.addLayer(markers)

  // for (let place of somePlaces) {
  //   let position = new OpenLayers.LonLat(...place.lonlat).transform( fromProjection, toProjection)
  //   markers.addMarker(new OpenLayers.Marker(position))
  // }

/*
  for (let place of etiennePlaces) {
    let position = new OpenLayers.LonLat(...place.lonlat).transform(fromProjection, toProjection)
    markers.addMarker(new OpenLayers.Marker(position))
  }
*/

  followUser({ markers, fromProjection, toProjection })

}

// ------------------- FCT : FOLLOW USER --------------------
function followUser({ markers, fromProjection, toProjection }) {

  function success(pos) {

    let { longitude, latitude } = pos.coords
    console.log(`user position: (${longitude.toFixed(6)}, ${latitude.toFixed(6)})`)

    // http://dev.openlayers.org/docs/files/OpenLayers/Marker-js.html
    let size = new OpenLayers.Size(21,25)
    let offset = new OpenLayers.Pixel(-(size.w/2), -size.h)
    let icon = new OpenLayers.Icon('img/marker-green.png', size, offset)

    let position = new OpenLayers.LonLat(longitude, latitude).transform(fromProjection, toProjection)
    markers.addMarker(new OpenLayers.Marker(position, icon))
  }

  function error(err) {
      console.warn('ERROR(' + err.code + '): ' + err.message)
  }

  const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
  }

  const id = navigator.geolocation.watchPosition(success, error, options)

}

// ------------------- FCT : getFirstPos --------------------
      let trouve = false;
      function getFirstPos() {
        console.log("coucou");
          while(!trouve) {
            geoFindMe();
          }
      }

      function geoFindMe() {

        function success(position) {
          lonlat[1]  = position.coords.latitude;
          lonlat[0] = position.coords.longitude;
          console.log("trouve"+lonlat[1]+lonlat[0]);
          trouve = true;
        }

        function error() {
          console.log('Unable to retrieve your location');
        }

        if (!navigator.geolocation) {
          console.log("Geolocation is not supported by your browser");
        } else {
          console.log('Locating…');
          navigator.geolocation.getCurrentPosition(success, error,{
            enableHighAccuracy : false,
            maximumAge: 0,
            timeout: 5000
          });
        }

      }

// --------------------------
init()
