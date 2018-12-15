reader = new FileReader();
reader.onload = function (event) {
    try{
        file_data = event.target.result;
        text = atob(file_data.split(',')[1]);
        json = JSON.parse(text);
        update_layer(json);
    } catch (err) {
        console.log('неверный формат');
    }
  };

function update_style(id, color, weight, opacity) {
    var feature = (json.features || [json])[id]
    if (feature.style) {
        feature.style.color = color;
        feature.style.weight = weight;
        feature.style.opacity = opacity;
    } else {
        feature.style = {};
        feature.style.color = color;
        feature.style.weight = weight;
        feature.style.opacity = opacity;
    }
    (json.features || [json])[id] = feature;
    update_layer(json);
}

function update_layer(json_file){
    try{
        userLayer.remove();
    } catch (err) {
    }
    userLayer = L.geoJSON.css(json_file, { onEachFeature: function(feature, layer){

            var id = (json.features || [json]).indexOf(feature)
            var style = feature.style || "No-style";
            var color = style.color || "#ffffff";
            var weight = style.weight || 1;
            var opacity = style.opacity || 1;
            layer.bindPopup(`
                <table>
                    <tr>
                        <td colspan="2">Стиль объекта №${id}</td>
                    </tr>
                    <tr>
                        <td>цвет заливки</td>
                        <td><input type="color" value="${color}" id="color"></input></td>
                    </tr>
                    <tr>
                        <td>Размер границы</td>
                        <td><input type="number" step="0.1" value="${weight}" id="weight"></input></td>
                    </tr>
                    <tr>
                        <td>Непрозрачность границы</td>
                        <td><input type="number" step="0.01" min="0.01" max="1" value="${opacity}" id="opacity"></input></td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <button onclick='update_style(${id},document.getElementById("color").value,document.getElementById("weight").value,document.getElementById("opacity").value)'>Применить</button>
                        </td>
                    </tr>
                </table>
            `);
        }
    })
    userLayer.addTo(map);
}

"fill-opacity"

window.addEventListener("dragover",function(e){
    e = e || event;
    e.preventDefault();
},false);

window.addEventListener("drop",function(e){
    e = e || event;
    e.preventDefault();
    file = e.dataTransfer.files[0]
    reader.readAsDataURL(file);
},false);

var map = L.map('map').setView([60,30], 9);

L.esri.basemapLayer("Topographic").addTo(map);

var downloadControl = L.Control.extend({
    options: {
        position: 'topleft'
    },
    onAdd: function (map) {
        var container = L.DomUtil.create('div', ' download-control leaflet-bar leaflet-control leaflet-control-custom');
        container.innerHTML = '&#10515;';
        container.onclick = function(){
            try {
                download(json);
            } catch (error) {
            }
        };
        return container;
    },
})
map.addControl(new downloadControl());