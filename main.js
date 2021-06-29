// c.f.http://www.nowhere.co.jp/blog/archives/20180705-160052.html

const INITIAL_LOCATION = [35.3328087, 136.8703403];

var mymap = L.map('map');

// 国土地理院のタイルデータを使う
L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png', {
	maxZoom: 18,
  attribution: '<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">国土地理院</a>',
}).addTo(mymap);

// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//   attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
// }).addTo(mymap);

mymap.setView(INITIAL_LOCATION, 13);


// マーカーのurlは以下
// https://unpkg.com/browse/leaflet@1.3.1/dist/images/

// c.f. https://leafletjs.com/examples/geojson/
//fetchAPIで取得する
fetch('main.geojson')
  .then(response => response.json())
  .then(geojson_data => {
    L.geoJson(geojson_data, {
      onEachFeature: function(feature, layer) {
        // プロパティを持っているか？
        if (!(feature.properties)) {
          return;
        }

        if ( feature.properties.hasOwnProperty('subitems') ) {
          var items = '';
          for (let index = 0; index < feature.properties.subitems.length; index++) {
            const element = feature.properties.subitems[index];
            // console.log(element);
            items = items + `<br /><a href="javascript:showPopup('${element.caption}');">${element.caption}</a>`;
          }


          let field = `お店を選択してください<br/>` + items;
                      //  `<a href="javascript:showPopup('${feature.properties.subitems[0].caption}');">${feature.properties.subitems[0].caption}</a>`;
          layer.bindPopup(field, { maxHeight: 200, minWidth: 200 });

        } else {
          let searchUrl = `https://www.google.com/maps/search/?api=1&query=${feature.properties.name}`;
          let mapUrl = `https://www.google.com/maps/search/?api=1&query=${feature.geometry.coordinates[1]}%2C${feature.geometry.coordinates[0]}`;
          let coupon = ['<span class="coupon-all">全店共通券</span>'];
          // 中小店専用券も使えるか？
          if ( feature.properties.coupons.includes("small-medium") ) {
            coupon.push('<span class="coupon-small-medium">中小店専用券</span>')
          }
          let item = feature.properties.item;

          let field = `<span class="store-name">${feature.properties.name}</span><br/>` +
                      `取扱品目:${item}<br/>` +
                      `対応券種<br/>${coupon}<br/>` +
                      `<br/><a target="_blank" href="${searchUrl}">Google検索</a><br/>` +
                      `<a target="_blank" href="${mapUrl}">Googleマップ</a>`;
          
          layer.bindPopup(field);
      
        }

      },
      pointToLayer: (geoJsonPoint, latlng) => {
        // dummy zone is hidden.
        // console.log(geoJsonPoint.properties.name);
        // console.log( geoJsonPoint.properties.isTenant )

        if ( !geoJsonPoint.properties.hasOwnProperty('isTenant') ) {
          return L.marker(latlng);
        } 

        return L.marker(latlng, { interactive: false, opacity: 0 });
      },
    }).addTo(mymap);
  });

// mymap.on('popupopen', function(e) {
//   console.log(e);
//   console.log(e.popup);
// });

var showPopup = (targetName) => {
  // void mymap.eachLayer((l1) => { if(!l1.hasOwnProperty('feature')){ return; } console.log(l1) })
  var execItems = [];

  mymap.eachLayer((layer) => {
//     if ( !execItems ) { execItems = l1 }

    if(layer.options && layer.options.pane === "markerPane") {
      if ( layer.feature.properties.name === targetName ) {
        execItems.push(layer);
      }
    }
    return;
});

  // console.log( execItems )
  execItems[0].openPopup();

}

