function csvParse(callback){
    console.log("runnign");
      var primeroCountries = [ Nepal = {name : "Nepal", code:524}, Kenya = {name : "Kenya", code:404}, Jordan = {name : "Jordan", code:400}, Afghanistan = {name : "Afghanistan", code:004}];
    
    d3.csv("/refugeeData2013.csv", function(data){
        var sortedData = [];
        
        for(var i = 0; i<data.length; i++){ //extracts 2013 data
            if(data[i].Year != 2013){
                data.splice(i, data.length-i);
                break;
            }
            
        }
        var primeroNames = ["Nepal", "Kenya", "Jordan", "Afghanistan"];
        
      
        
        for(var i = 0; i<data.length; i++){
            for (var r = 0; r<primeroNames.length; r++){
                var country = data[i]["Country or territory of asylum or residence"] //gets current country object name
                
                if (data[i]["Country or territory of origin"] == primeroNames[r]){ //if it is a primero country 
                    
                    primeroCountries[r][country] = data[i]["Refugees<sup>*</sup>"];
                } 
            }
            
        }
         
    
    }
       
          
          );

   callback(primeroCountries);
    
}