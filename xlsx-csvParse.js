/*d3.text("/refugeeTestData.csv", function(data){
    
    alert("alert");
    console.log("ue");
    console.log(d3.csvParseRows(data));
    console.log("yep");
    return(data);
    
})
*/
function to_csv(workbook) {
	var result = {};
	workbook.SheetNames.forEach(function(sheetName) {
		var roa = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
        console.log(roa);
        console.log("roa");
		if(roa.length > 0){
			result[sheetName] = roa;
		}
	});
	return result;
}

function xlsxParse(url){

var oReq = new XMLHttpRequest();
oReq.open("GET", url, true);
oReq.responseType = "arraybuffer";
    
oReq.onload = function(e){
    var arraybuffer = oReq.response;
    
    /* Data to binary string*/
    var data = new Uint8Array(arraybuffer);
    var arr = new Array();
    for(var i = 0; i != data.length; i++) arr[i] = String.fromCharCode(data[i]);
    var bstr = arr.join("");
    
    var workbook = XLSX.read(bstr, {type:"binary"});
    console.log(to_csv(workbook));
 
    
}
    oReq.send();
}