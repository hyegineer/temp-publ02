///////////////////////새로고침 화면 로드//////////////////////////////
function showSpinner() {
    document.getElementsByClassName('layerPopup')[0].style.display='block';
}

function hideSpinner() {
    document.getElementsByClassName('layerPopup')[0].style.display='none';
}

/////////////////////// HeatMap 그리기//////////////////////////////
////uniprotIdArray : 행  gene/ protein 명 배열
////patientsArray : 열 환자 id 배열
////dataArray : 데이터 [[]] 2차원 배열
////heatMapDiv : headmap div id 
////metaArray : meta data 배열 
function paintHeatMap(uniprotIdArray,patientsArray,dataArray,heatMapDiv,metaArray){

    var patientTmp = []

    for(var i=0; i<metaArray.length; i++){
      var tmp = metaArray[i].substr(0,metaArray[i].length-1);
      var tmpArray = tmp.split(',').slice(1,tmp.split(',').length)
      
      for(var j=0; j<patientsArray.length;j++){
        if(tmpArray.indexOf(patientsArray[j])>-1){
          patientTmp.push(tmpArray.indexOf(patientsArray[j]))
        }
      }
    }

    var metaList = []
    if(metaArray !=null && metaArray.length > 0){
        for(var i=0; i<metaArray.length; i++){
            var tmp = metaArray[i].substr(0,metaArray[i].length-1);
            var colValue = tmp.split(',')[0];
            var tmpArray = tmp.split(',').slice(1,tmp.split(',').length)
            var putArray =[];
            for(var j=0;j<patientTmp.length;j++){
              putArray.push(tmpArray[patientTmp[j]]);
            }
            metaList.push({
                  'name':colValue,
                  'array':putArray
            })
            //if(ifMain){
              //let set = new Set(tmpArray);
              //nmfMetaDataJson[colValue] = Array.from(set).sort()
            //}
          }
    }
    
    nmfMetaObj['vectors'] = metaList

    $('#'+heatMapDiv).empty();

    var json = {
      "rows": uniprotIdArray.length,
      "columns": patientsArray.length,
      "seriesArrays": [dataArray],
      "seriesDataTypes": ["Float32"],
      "seriesNames": ["NMF"],
      "rowMetadataModel": {
        "vectors": [{
          "name": "Gene",
          "array": uniprotIdArray
        }]
      },
      "columnMetadataModel": nmfMetaObj
    }

    new morpheus.HeatMap({
      el: $('#'+heatMapDiv),
      dataset: morpheus.Dataset.fromJSON(json),
      colorScheme: { // optional color scheme. default is relative
        type: 'fixed',
        map: [{
          value: 2000,
          color: '#0000ff'
        }, {
          value: 1000,
          color: '#ffffff'
        }, {
          value: 0,
          color: '#ff0000'
        }]
      },
      tools: [{ // optional tools to run at load time
        name: 'Hierarchical Clustering',
        params: {cluster: 'Rows and columns'}
      }]
    });

  }


  /////////////////////// Sample(Patient)리스트 가져오기//////////////////////////////
  function getConcatSampleList(){
    
    var patientsArray = []

    //Patients
    var nmfPat = nmfData[0].substr(0,nmfData[0].length-1);
    patientsArray = patientsArray.concat(nmfPat.split(',').slice(1,nmfPat.split(',').length));

    var acetylPat = acetylData[0].substr(0,acetylData[0].length-1);
    patientsArray = patientsArray.concat(acetylPat.split(',').slice(2,acetylPat.split(',').length));

    var phosphoPat = phosphoData[0].substr(0,phosphoData[0].length-1);
    patientsArray = patientsArray.concat(phosphoPat.split(',').slice(2,phosphoPat.split(',').length));

    var proteinPat = proteinData[0].substr(0,proteinData[0].length-1);
    patientsArray = patientsArray.concat(proteinPat.split(',').slice(2,proteinPat.split(',').length));

    let patSet = new Set(patientsArray);
    patientsArray = Array.from(patSet).sort();

    return patientsArray

  }


  function getConcatGeneList(){

    var geneList = []

    //Genens
    for(var i = 1; i<nmfData.length-1;i++) {
        var tmp = nmfData[i]
        geneList.push(tmp.split(',')[0].split("_")[0])
    }

    for(var i = 1; i<acetylData.length-1;i++) {
        var tmp = acetylData[i]
        geneList.push(tmp.split(',')[1].split("_")[0])
    }

    for(var i = 1; i<phosphoData.length-1;i++) {
        var tmp = phosphoData[i]
        geneList.push(tmp.split(',')[1].split("_")[0])
    }

    for(var i = 1; i<proteinData.length-1;i++) {
        var tmp = proteinData[i]
        geneList.push(tmp.split(',')[1].split("_")[0])
    }

    let patSet = new Set(geneList);
    geneList = Array.from(patSet).sort();

    return geneList

  }


  function getDataArray(){

    var dataList = []

    for(var i = 1; i<nmfData.length-1;i++) {
        var tmp = nmfData[i]
        dataList.push(tmp.split(',').slice(1, tmp.split(',').length))
    }

    for(var i = 1; i<acetylData.length-1;i++) {
        var tmp = acetylData[i]
        dataList.push(tmp.split(',').slice(2, tmp.split(',').length))
    }

    for(var i = 1; i<phosphoData.length-1;i++) {
        var tmp = phosphoData[i]
        dataList.push(tmp.split(',').slice(2, tmp.split(',').length))
    }

    for(var i = 1; i<proteinData.length-1;i++) {
        var tmp = proteinData[i]
        dataList.push(tmp.split(',').slice(2, tmp.split(',').length))
    }

    return dataList

  }


  function getGeneIDList(){


    var uniprotIdArray = []

    for(var i = 1; i<nmfData.length-1;i++) {
        var tmp = nmfData[i]
        uniprotIdArray.push(tmp.split(',')[0])
    }

    for(var i = 1; i<acetylData.length-1;i++) {
        var tmp = acetylData[i]
        uniprotIdArray.push(tmp.split(',')[1])
        
    }

    for(var i = 1; i<phosphoData.length-1;i++) {
        var tmp = phosphoData[i]
        uniprotIdArray.push(tmp.split(',')[1])
    }

    for(var i = 1; i<proteinData.length-1;i++) {
        var tmp = proteinData[i]
        uniprotIdArray.push(tmp.split(',')[1])
    }

    return uniprotIdArray

  }