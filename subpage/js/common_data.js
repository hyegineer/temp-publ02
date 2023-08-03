var baseURL = "http://127.0.0.1:5500/";

var nmfMetaData = ['Subtype','Subtype Core','Subtype Membership','Histology','Age','Sex','Smoking','TNM stage','Pathologic-N',
'Adjuvant Treatment','Recurrence Status','TIL pattern','Immune Cluster','Whole Genome Doubling','TP53','Other Tumor Suppressor genes',
'EGFR','Other Oncogene Alteration']

var nmfMetaOrder = {
    "Subtype":1,
    "Subtype Core":2,
    "Subtype Membership":3,
    "Histology":4,
    "Age":5,
    "Sex":6,
    "Smoking":7,
    "TNM stage":8,
    "Pathologic-N":9,
    "Adjuvant Treatment":10,
    "Recurrence Status":11,
    "TIL pattern":12,
    "Immune Cluster":13,
    "Whole Genome Doubling":14,
    "TP53":15,
    "Other Tumor Suppressor genes":16,
    "EGFR":17,
    "Other Oncogene Alteration":18
}

var nmfMetaDataJson = {
    "Subtype":[],
    "Subtype Core":[],
    "Subtype Membership":[],
    "Histology":[],
    "Age":[],
    "Sex":[],
    "Smoking":[],
    "TNM stage":[],
    "Pathologic-N":[],
    "Adjuvant Treatment":[],
    "Recurrence Status":[],
    "TIL pattern":[],
    "Immune Cluster":[],
    "Whole Genome Doubling":[],
    "TP53":[],
    "Other Tumor Suppressor genes":[],
    "EGFR":[],
    "Other Oncogene Alteration":[]
}

var nmfMetaObj = {
    "vectors" :[]
  }
