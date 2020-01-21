// https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html
let somePlaces = [
  {
    name: 'ENSAAMA DSACOM',
    lonlat: [2.295264, 48.833733],
    scale: 3,
  },
  {
    name: 'ENSAAMA cour centrale',
    lonlat: [2.295328, 48.833342],
    scale: 3,
  },
]

let etiennePlaces = [
  { lonlat:[2.295307, 48.833190] }, // cour angle Sud-Est
  { lonlat:[2.295618, 48.833346] }, // cour angle Nord-Est
  { lonlat:[2.295012, 48.833399] }, // hall
  { lonlat:[2.295270, 48.833720] }, // Violette = terrasse 107
  { lonlat:[2.295298, 48.833338] }, // centre cour
  { lonlat:[2.295176, 48.833534] }, // Chloé : palier relation internationales
  { lonlat:[2.295488, 48.833449] }, // couloir devant 108
  { lonlat:[2.295284, 48.833466] }, // cage escalier principal
  { lonlat:[2.294903, 48.833488] }, // pont
  { lonlat:[2.295354, 48.833618] }, // Milène = salle 107
  { lonlat:[2.295085, 48.833255] }, // couloir Sud
]

function init() {

  // https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html
  let url = [
    "https://a.tile.openstreetmap.org/${z}/${x}/${y}.png",
    "https://b.tile.openstreetmap.org/${z}/${x}/${y}.png",
    "https://c.tile.openstreetmap.org/${z}/${x}/${y}.png",
  ]

  map = new OpenLayers.Map("basicMap")
  let lonlat         = [2.295680, 48.833062]
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

  for (let place of etiennePlaces) {
    let position = new OpenLayers.LonLat(...place.lonlat).transform(fromProjection, toProjection)
    markers.addMarker(new OpenLayers.Marker(position))
  }

  followUser({ markers, fromProjection, toProjection })

}

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

init()
