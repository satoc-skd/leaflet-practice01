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

// Locate
var optionLocate = {
  position: 'topleft',
  strings: {
      title: "現在地を表示",
      popup: "いまここ"
  },
  locateOptions: {
    maxZoom: 16
  }
};

var lc = L.control.locate(optionLocate).addTo(mymap);

// マップ表示時に現在地を取得
lc.start();


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

        if ( feature.properties.hasOwnProperty('tenants') ) {
          var items = '';
          for (let index = 0; index < feature.properties.tenants.length; index++) {
            const element = feature.properties.tenants[index];
            // console.log(element);
            items = items + `<br /><a href="javascript:showPopup('${element.caption}');">${element.caption}</a>`;
          }


          let field = `お店を選択してください<br/>` + items;
                      //  `<a href="javascript:showPopup('${feature.properties.tenants[0].caption}');">${feature.properties.tenants[0].caption}</a>`;
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

        // テナント入りしてない店舗のみピン表示する。
        if ( !geoJsonPoint.properties.hasOwnProperty('parent') ) {
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
  var execItems = null;

  mymap.eachLayer((layer) => {
    // 既に見つかった場合はこれ以上処理しない。
    if ( execItems ) { return; }

    // markerPane 以外を取り除く
    if ( !layer.options.hasOwnProperty('pane') ) { return; }
    if ( layer.feature.properties.name !== targetName ) { return; }

    execItems = layer;

    return;
  });

  // 見つかった場合、ポップアップ表示する
  if ( execItems ) { execItems.openPopup(); }

}

