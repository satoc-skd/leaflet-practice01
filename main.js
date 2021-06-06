// c.f.http://www.nowhere.co.jp/blog/archives/20180705-160052.html

var mymap = L.map('map');

// 国土地理院のタイルデータを使う
L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png', {
	maxZoom: 18,
  attribution: '<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">国土地理院</a>',
}).addTo(mymap);

// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//   attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
// }).addTo(mymap);

mymap.setView([35.204794, 139.025357], 13);


// マーカーのurlは以下
// https://unpkg.com/browse/leaflet@1.3.1/dist/images/

var geojson_data = [
	{
  	type: "FeatureCollection",
    features: [
      {
      	type: "Feature",
        properties: {
	      	name: "箱根神社",
        },
        geometry: {
        	type: "Point",
          coordinates: [139.025357, 35.204794]
        }
      },
      {
      	type: "Feature",
        properties: {
	      	name: "箱根関所跡",
        },
        geometry: {
        	type: "Point",
          coordinates: [139.026346, 35.192362]
        }
      },
      {
      	type: "Feature",
        properties: {
	      	name: "箱根峠",
        },
        geometry: {
        	type: "Point",
          coordinates: [139.014074, 35.182194]
        }
      },
    ]
  }
];


// c.f. https://leafletjs.com/examples/geojson/
L.geoJson(geojson_data, {
	onEachFeature: function(feature, layer) {
  	// プロパティを持っているか？
    if (!(feature.properties)) {
    	return;
    }
    let searchUrl = `https://www.google.com/maps/search/?api=1&query=${feature.properties.name}`;
    let mapUrl = `https://www.google.com/maps/search/?api=1&query=${feature.geometry.coordinates[1]}%2C${feature.geometry.coordinates[0]}`;
    
    let field = `施設名:${feature.properties.name}<br/>` +
                 `<a target="_blank" href="${searchUrl}">Google検索</a><br/>` +
                 `<a target="_blank" href="${mapUrl}">Googleマップ</a>`;
    
		layer.bindPopup(field);
}
}).addTo(mymap);

