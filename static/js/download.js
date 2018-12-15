function download(json) {
    var createObjectURL = (window.URL || window.webkitURL || {}).createObjectURL || function(){};
    var blob = null;
    var content = JSON.stringify(json);
    var mimeString = "application/octet-stream";
    window.BlobBuilder = window.BlobBuilder ||
                         window.WebKitBlobBuilder ||
                         window.MozBlobBuilder ||
                         window.MSBlobBuilder;


    if(window.BlobBuilder){
       var bb = new BlobBuilder();
       bb.append(content);
       blob = bb.getBlob(mimeString);
    }else{
       blob = new Blob([content], {type : mimeString});
    }
    var url = createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url
    a.download = "styled_file.geojson";
    a.target = '_blank';
    a.click();
};