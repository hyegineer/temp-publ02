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
function paintHeatMap(uniprotIdArray,patientsArray,dataArray,heatMapDiv,metaArray,linkArray){

  var patientTmp = []

  //debugger;

  for(var i=0; i<metaArray.length; i++){
    var tmp = metaArray[i].substr(0,metaArray[i].length-1);
    var tmpArray = tmp.split(',').slice(1,tmp.split(',').length)
    
    for(var j=0; j<patientsArray.length;j++){
      var paiTmp = patientsArray[j].substr(0,patientsArray[j].length-1)+'T';
      if(tmpArray.indexOf(paiTmp)>-1){
        patientTmp.push(tmpArray.indexOf(paiTmp));
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
          if(colValue=='Sample.ID'){
            metaList.push({
              'name':colValue,
              'array':patientsArray
            })
          }else{
            metaList.push({
              'name':colValue,
              'array':putArray
            })
          }
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
      },{
        "name": "Link",
        "array": linkArray
      }]
    },
    "columnMetadataModel": nmfMetaObj
  }

  var comMorpheus = new morpheus.HeatMap({
    el: $('#'+heatMapDiv),
    dataset: morpheus.Dataset.fromJSON(json),
    colorScheme: { // optional color scheme. default is relative
      type: 'fixed',
      map: [{
        value: -12,
        color: '#0000ff'
      }, {
        value: 0,
        color: '#ffffff'
      }, {
        value: 12,
        color: '#ff0000'
      }]
    },
    //showRowNumber: true,
    tools: [{ // optional tools to run at load time
      //name: 'Hierarchical Clustering',
      //params: {cluster: 'Rows and columns'}
    }],
    menu:toolbarMenu
  });

  return comMorpheus;

}



/////////////////////// Legend popup//////////////////////////////

function DrawLegendPopup(colorMap){
  
  if(myPopup!=null){
    myPopup.close();
  }
  
  myPopup = window.open('', 'Legend', 'height=600, width=1200, scrollbars=yes');
  var htmlStr="<div><table><tr>";
  var substr="";
  var i = 1;
  $.map(colorMap, function(k, v){
      htmlStr += "<td style='text-align: center;'>"+k.key+"</td>";
      var newArr = $.map(k.value,function(key,value){return key});
      var subArr = $.map(newArr[0],function(key,value){return key});
      substr += "<td style='height: fit-content;'><table border='1px solid #ccc' cellspacing='0' cellpadding='0' style='margin: auto;'>";
      $.map(subArr,function(key,value){
        substr += "<tr><td bgcolor='"+key.value+"' height='15' width='15'></td>"+
          "<td>"+key.key+"</td></tr>";
      });
      substr += "</table></td>";
      if(i%8==0){
        htmlStr +="</tr><tr>";
        htmlStr += substr;
        substr = "";
        htmlStr +="</tr><tr>";
      }
      i++;
  });
  htmlStr += substr;
  htmlStr += "</tr><tr></table></div>";

  myPopup.document.write(htmlStr);
  myPopup.focus()   
}


/////////////////////// Sample(Patient)리스트 가져오기//////////////////////////////
function getConcatSampleList(){
  
  var patientsArray = []
  //Patients
  var nmfPat = nmfData[0].substr(0,nmfData[0].length-1);
  patientsArray = patientsArray.concat(nmfPat.split(',').slice(4,nmfPat.split(',').length));

  return patientsArray

}


function getConcatGeneList(){

  var geneList = []

  //Genens
  for(var i = 1; i<nmfData.length-1;i++) {
      var tmp = nmfData[i]
      geneList.push(tmp.split(',')[3].split("_")[0])
  }

  let patSet = new Set(geneList);
  geneList = Array.from(patSet).sort();

  return geneList

}


function getDataArray(){

  var dataList = []

  for(var i = 1; i<nmfData.length-1;i++) {
      var tmp = nmfData[i]
      dataList.push(tmp.split(',').slice(4, tmp.split(',').length))
  }

  return dataList

}


function getGeneIDList(){


  var uniprotIdArray = []

  for(var i = 1; i<nmfData.length-1;i++) {
      var tmp = nmfData[i]
      uniprotIdArray.push(tmp.split(',')[3])
  }

  return uniprotIdArray

}


function getRowGeneList(){

  var uniprotIdArray = []
  for(var i = 1; i<nmfData.length-1;i++) {
      var tmp = nmfData[i].split(",");
      if(tmp[0] == 'RNA'){
        uniprotIdArray.push(tmp[3] +"_g")
      } else if(tmp[0] == 'PROTEIN'){
        uniprotIdArray.push(tmp[3] +"_p ("+ tmp[1]+")")
      } else {
        uniprotIdArray.push(tmp[3])
      }
      
  }
  return uniprotIdArray

}


function getUniprotIDList(geneList){

  var uniprotIdArray = []
  for(var i= 0 ; i<geneList.length ; i++){
    var tmp = nmfData[i+1].split(',');
    uniprotIdArray.push(geneList[i]+"="+tmp[1].split('_')[0])
  }

  return uniprotIdArray
}