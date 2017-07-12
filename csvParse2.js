function csvParse(callback){ //direction of 1 is country:id
    console.log("runnign");
     /* var primeroCountries = [ Nepal = {name : "Nepal", code:524}, Kenya = {name : "Kenya", code:404}, Jordan = {name : "Jordan", code:400}, Afghanistan = {name : "Afghanistan", code:004}];*/
    
   // var primeroCountries = getKey(undefined, 1) ; //is this bad practice
    
    var primeroCountries = getKey();


    d3.csv("/refugeeData2013.csv", function(data){
        var sortedData = [];
        
        for(var i = 0; i<data.length; i++){ //extracts 2013 data
            if(data[i].Year != 2013){
                data.splice(i, data.length-i);
                break;
            }
            
        }
     //   var primeroNames = ["Nepal", "Kenya", "Jordan", "Afghanistan"];
        
      
        
        for(var i = 0; i<data.length; i++){
            var country = data[i]["Country or territory of asylum or residence"]; //gets current country object name
            var origin = data[i]["Country or territory of origin"];
            if(country in primeroCountries){
                primeroCountries[country][origin] = data[i]["Refugees<sup>*</sup>"];
        }else{
            //primeroCountries[country].refugees = 0;
        }
         //console.log(primeroCountries);
    
    }
       
          
          

   callback(primeroCountries);
    
});}