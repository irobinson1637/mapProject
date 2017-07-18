function csvParse(callback, year2){ //direction of 1 is country:id

     /* var primeroCountries = [ Nepal = {name : "Nepal", code:524}, Kenya = {name : "Kenya", code:404}, Jordan = {name : "Jordan", code:400}, Afghanistan = {name : "Afghanistan", code:004}];*/
    
   // var primeroCountries = getKey(undefined, 1) ; //is this bad practice
    
    var primeroCountries = getKey();


    d3.csv("/refugeeData2013.csv", function(data){
        var sortedData = [];
        var years = {};
        var yearPointer = data.length-1;
        var yearTracker = 1975;
        
        for (var y=1975; y<=2013; y++){
            years[y] = [];
        }
   
   //Enable for clickable years
   /*   var whileHasRun = false;
        for(var i = 0; i<data.length-1; i++){ //last entry is a blank
              console.log(data[i]);
            while(data[i].Year == year){ //once it gets to the section with the correct year, adds that data to sortedData
                sortedData.push(data[i]);
                i++;
                whileHasRun = true;
            }
            if(whileHasRun)break; //once it's done with that section breaks so that it doesn't have to look through all the data
              //console.log(data.length);
        }   
        */
        
        
        //This is for reversed direction of migration
        /*for(var i = 0; i<data.length; i++){
            var country = data[i]["Country or territory of asylum or residence"]; //gets current country object name
            var origin = data[i]["Country or territory of origin"];
            if(country in primeroCountries){
                primeroCountries[country][origin] = data[i]["Refugees<sup>*</sup>"];
        }else{
            
        }
       
    }*///console.log(data[0]);
    //   for(var p = 0; p<data.length; p++){ //change to sortedData for year by year
        for(var p = 1975; p<=2013; p++){
            
           

            while(data[yearPointer].Year == yearTracker){
                if(yearPointer < 0){break;}

                var country = data[yearPointer]["Country or territory of origin"]; //main object
                var residence = data[yearPointer]["Country or territory of asylum or residence"]; //gets current country object name; attribute

    try{
                    primeroCountries[country][residence] = data[yearPointer]["Refugees<sup>*</sup>"];
            }catch(err){
                
            }
            
                yearPointer--;
                 if(yearPointer < 0){break;}
 
        }
     
            years[yearTracker].push(primeroCountries);
            primeroCountries = getKey();
            yearTracker++;
        }
            
        //console.log(years);

   callback(years, year2);
    
});}