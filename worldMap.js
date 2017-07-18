//TODO: Add slider for different years
//Integrate other data
//work on dynamically pulling data
   

var year = 0;
var parsed;
var graphWidth = 900;
var mapWidth;
var mapHeight;
var graphWidth;
var graphHeight;

function clear(){
              d3.select("body").select(".mapSVG").select(".countries").selectAll("path").style("fill", "black"); 
}


function buildMap(countryData){

    var data = []; //convert to object?
    setCountries(["ANGOLA", "INDONESIA", "KENYA", "NIGERIA", "NEPAL","JORDAN", "SOUTH SUDAN", "SUDAN", "SIERRA LEONE"]);

    var scale = d3.scaleSqrt();
    scale.domain([0, 100]);
    scale.range([0, 90]);
    
    
  var sidePanel = d3.select("body").append('svg').attr("width", '100%').attr("height", '22%').attr("class", "panelSVG");/*.append("rect").attr("x", 40)
            .attr("y", -10)
            .attr("width", 30)
            .attr("height", 50)
            .style("fill", d3.rgb(0,70,200));*/
    
    graphWidth = parseInt(sidePanel.style("width"));
    graphHeight = parseInt(sidePanel.style("height"));
    

    
   var svg = d3.select("body").append('svg').attr("width", '100%').attr("height", '68%').attr("class", "mapSVG");
   svg.append("text").attr("class", "txtField").attr("x", 100).attr("y", 50).text("i");
    
    mapWidth = parseInt(svg.style("width"));
    mapHeight = parseInt(svg.style("height"));
    
    var countries = svg.append("g")
    .attr("class", "countries");

    var movingCircles = svg.append("g")
        .attr("class", "movingCircle");
        
    var staticCircle = svg.append("g")
         .attr("class", "staticCircle");

    var projection = d3.geoPatterson()
    .scale(130)
    .translate([mapWidth/2, mapHeight/2])
    .precision(0.01);

    var path = d3.geoPath()
    .projection(projection);
    svg.append("path") //adds the grid
    .datum(d3.geoGraticule10())
    .attr("class", "graticule")
    .attr("d", path);
    
    var collectedData = coagData(["undernourishment.csv", "perCapitaFoodSupply.csv", "internetUsers.csv", "poverty.csv"], data, 0, 
    function(dat){
    dat.pop(); // removes unecessary country tag
    parsed = dat;


    d3.json("https://d3js.org/world-50m.v1.json", function(error, world){
        if (error) throw error;
        countries.attr("class", "states")
        .selectAll("path")
        .data(topojson.feature(world, world.objects.countries).features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("id",function(d) {prevCountry = d.id; return d.id})
        .style("stroke-linejoin", "round");
       });
        
   
})
    }

function updateMap(countryData, year){
    var svg = d3.select(".mapSVG");
    var panelSVG = d3.select(".panelSVG");
    svg.select(".txtField").text(year);
    var moveTo; //will later store coordinates of end country    
    var centroid;
    var selectedCenter;
    var prevCountry;
    var center;
    var countryCounter = 0;
    var countryChecker = 0;
    var key = {"United States":840}  
    var dataSet = countryData[year]; 
    var graphScale = d3.scaleLinear();
    var barPadding = 1;
    var leftMargin = 45;
    var bottomMargin = 25;
    
    graphScale.domain([0, 2400]);
    graphScale.range([0, 75]);

    var countries = svg.select(".states");
    countries.selectAll("path").style("fill", "black"); 
    var selectedCountryObject;
    
    var scale = d3.scaleSqrt();
    
    scale.domain([0, 100]);
    scale.range([0, 90]);
    
    var projection = d3.geoPatterson() //need projection in order to get centroid
    .scale(130)
    .translate([mapWidth/2, mapHeight/2])
    .precision(0.01);

    var path = d3.geoPath()
    .projection(projection);
    var movingCircles = svg.select(".movingCircle");
    var staticCircle = svg.select(".staticCircle");

    function clearAll(){
        svg.selectAll("line").remove();
        svg.selectAll("circle").remove();
        svg.selectAll("rect").remove();
        svg.select(".movingCircle").selectAll("circle").remove();
        svg.select(".staticCircle").selectAll("circle").remove();

    }

    clearAll(); 
    
        countries//.attr("class", "states")
        .selectAll("path")
        .on("click", function(d){
            countries.selectAll("path").style("fill", "black"); 
            d3.select(this).style("fill", d3.rgb(100,20,100));
            clearAll();
            selectedCountryObject = d;
            console.log("d");
            console.log(d);
            console.log("data");
            console.log(d.data);
            prevCountry = d;
            drawLines(d.id);
            drawBars(d.id, parsed);
            prevCountry = d.id;
            //trans(); //commented for faster testing but apparentely redundant
        
        });


        function trans(){
            movingCircles.selectAll("circle")
                .transition()
                .duration(3000)
                .attr("cx", d => d[0])//moveTo
                .attr("cy", d => d[1])
                .on('end', function(d){
                countryChecker++;

                if (countryCounter == countryChecker && countryCounter != 0){ //checks if all circles have been transformed before updating
                    // && to exclude initial case where both countryChecker and countryCounter are zero
                    //console.log("update");
                    countryChecker--; //to negate the ++ that will happen above, since this is now a repeat
                    update(trans()); 
                } 
                

                                      
                                      
                                      })};
        
        function update(callback){
            movingCircles.selectAll("circle").attr("cx", selectedCenter[0]).attr("cy", selectedCenter[1]).on("end", callback);
        };
        
         function drawBars(countryID, parsedData){

          for(var y1 = 0; y1<parsedData.length; y1++){
              var lowerString = parsedData[y1].key;
              console.log(parsedData[y1]);
              var countryName = getKey(countryID,0, true);
              console.log(countryName.toLowerCase());
               console.log(lowerString.toLowerCase());
              try{
            if(lowerString.toLowerCase() == countryName.toLowerCase()) {
                var numbersOnly = Object.values(parsedData[y1]['perCapitaFoodSupply.csv']['values'][0]);
                var keys = Object.keys(parsedData[y1]['perCapitaFoodSupply.csv']['values'][0]);
                
                numbersOnly = numbersOnly.slice(0, numbersOnly.length-2); //get's rid of country tag
                keys = keys.slice(0, keys.length-2); //years for axis labels
                
                d3.select(".panelSVG").selectAll("rect").remove();
                
                
                d3.select(".panelSVG").selectAll("rect")
                .data(numbersOnly)
                .enter()
                .append("rect") 
                    .attr("x", function(d, i){return leftMargin-10+(i * (graphWidth / numbersOnly.length) + (graphWidth / numbersOnly.length - barPadding) / 2);})
                    .attr("y", d => (graphHeight-graphScale(d))-40)
                    .attr("height", function(d){ 
                    return graphScale(d)+14;
                    })
                    .attr("width", function(d, i){ return graphWidth / numbersOnly.length - (barPadding)})
                    .style("fill", function(d) {
					return "rgb(0, 0, " + (d * 10) + ")";
                })
                
                
    var x = d3.scaleLinear()
          .domain(d3.extent(keys, d => d))
          .range([leftMargin, graphWidth]);
    
    var y = d3.scaleLinear()
          .domain(d3.extent(numbersOnly, d => d))
          .range([graphHeight-(bottomMargin), 0]);
                
        var xAxis = d3.axisBottom(x).ticks(50);
        var yAxis = d3.axisLeft(y);
        var gHeight = graphHeight - bottomMargin;
                
      panelSVG.append("g")
      .attr("transform", "translate(0,"+ gHeight +")")
      .call(xAxis);
                                
      panelSVG.append("g")
      .attr("transform", "translate("+leftMargin+",0)")
      .call(yAxis);

             
                break;
            }}catch(err){
                console.log(err);
                alert("No country found with id: " + countryID);//no country with corresponding id; path mixup
                break;
            }
    } 
    
    };

        
        function drawLines(countryID){
            countryCounter = 0; //reset
            countryChecker = 0; //reset
            
          
            var selectedCountry = dataSet[getKey(countryID, 0, true)]; //this is actually the object
         
            selectedCenter = path.centroid(selectedCountryObject);

            countries.selectAll("path").filter(function(d){
        
            var currentCountryRefugees = dataSet[0][getKey(countryID, 0, true)][getKey(d.id,0,true)]
                
                if( typeof currentCountryRefugees == "undefined" ||  currentCountryRefugees == 0){ //filters out countries that no refugees from seectedCountry have gone to
                return false;
            }
                
            countryCounter++;
            return true;
                                                
                                                })
        .each(function (d,i){//loops through every country

            center = path.centroid(d); //cetnroid equal to center of each country
          //for intial setup when there is no selected country

          
            if(typeof center == 'undefined'){center = [0,0]};
            if(typeof selectedCenter == 'undefined'){selectedCenter = [0,0]};
           
            var currentID = d.id;
            //var index = dataSet.findIndex(countr => countr.code == d.id); //finds index of country with said iso 3-letter code

                
                var temp = dataSet[0][getKey(countryID, 0, true)]; //selects selected country object
            
                 try{
                var size = temp[getKey(d.id,0,true)]; //as it loops through each country, get's the data associated with the attribute of selected country associated with that country
           
                 }catch(err){
                     //console.log( dataSet);
                    //  console.log("cnt: ");
                   //  console.log(getKey(countryID, 0, true));
                    
                 }
                    size = scale(size);
            
                 d3.select(this).style("fill", d3.rgb(size, 0, 0));

         
            svg.append("line")
                .attr("class", "countryLines")
                .attr("x1", center[0]) //change to moveTo if you want selected country to have immigrants coming to it 
                .attr("x2", selectedCenter[0])
                .attr("y1", center[1])
                .attr("y2", selectedCenter[1])
                .style("stroke", "red")
                .style("stroke-width", size/200)
                .style("opacity", 0.5);
                
                
            
           /* 
             staticCircle.append("circle")
                .attr("cx", center[0])
                .attr("cy", center[1])
                .attr("r",size/200)
                .style("fill", "none");
                
            staticCircle.append("circle")
                .attr("cx", selectedCenter[0])
                .attr("cy", selectedCenter[1])
                .attr("r",size/200)
                .style("fill", "none");
            
            movingCircles.append("circle")
                .datum(center)
                .attr("cx", selectedCenter[0])
                .attr("cy", selectedCenter[1])
                .attr("r",size/200)
                .style("fill", d3.rgb(100, 0, 20));
                .on("click", trans()) */

              });
        }
}
    
    
   