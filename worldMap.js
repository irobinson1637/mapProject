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
var margin = {top: 20, right: 5, bottom: 20, left: 5};
var margin2 = {top: 20, right: 5, bottom: 20, left: 5};
var dataSelect = "perCapitaFoodSupply.csv";

function clear(){
              d3.select("body").select(".mapSVG").select(".countries").selectAll("path").style("fill", "black"); 
}

function reDraw(){
    
    var topPanel = d3.select(".divElement").append('svg').attr("width", '100%').attr("height", '27%').attr("class", "panelSVG").attr("fill", "blue");

      topPanel.append("g").attr("class", "xaxis");
      topPanel.append("g").attr("class", "yaxis");
      topPanel.append("defs").append("clipPath").attr("id", "clip");
     // topPanel.attr("transform", "translate(0," + 30 + ")");
    return topPanel;
    
    }
function updateYear(yearChanged){
    console.log('updateYearClale');
    console.log(yearChanged);
    d3.select('.yearText').text(yearChanged);
    
}

function buildMap(countryData){
    var primeCountries = ["ANGOLA", "INDONESIA", "KENYA", "NIGERIA", "NEPAL","JORDAN", "SOUTH SUDAN", "SUDAN", "SIERRA LEONE"]
    var data = []; //convert to object?
    setCountries(primeCountries);

    primeCountries = ["Angola", "Indonesia", "Kenya", "Nigeria", "Nepal","Jordan", "South Sudan", "Sudan", "Sierra Leone"]
        
    var scale = d3.scaleSqrt();
    scale.domain([0, 100]);
    scale.range([0, 90]);
    
    var divElement = d3.select("body").append("div").attr("class", "divElement");

    var countCode;

    
   var svg = divElement.append('svg').attr("x", 0).attr("y", 0).attr("width", '80%').attr("height", '73%').attr("class", "mapSVG");
   svg.append("text").attr("class", "txtField").attr("x", 100).attr("y", 50).text("");
    
   var sidePanel = divElement.append("svg").attr("width", "20%").attr("height", "70%").attr("class", "sidePanel");

    sidePanel.append('text').attr("class", "yearText").attr("x", parseInt(sidePanel.style("width"))/3).attr("y", parseInt(sidePanel.style("height"))/15).style("stroke", "black").text("");
    
    
    var topPanel = reDraw();
      
    graphWidth = parseInt(topPanel.style("width"));
    graphHeight = parseInt(topPanel.style("height"));
    
  
    
    /* sidePanel.attr("class", "yearShow").append("rect")
            .attr("y", 0)
            .attr("height", parseInt(sidePanel.style("height"))/11)
            .attr("width", parseInt(sidePanel.style("width")))
            .attr("rx", 20)
            .attr('ry', 20)
            .style("border", "px")
            .style("stroke-width", "2px");
    */
 
    
    

    sidePanel.append('g').attr("class", "graph").selectAll('rect')
            .data(primeCountries)
            .enter()
            .append('rect')
            .attr("class", "countrySelect")
            .attr("x", margin.right)
            .attr("y", function(d,i){return (i+1)*(parseInt(sidePanel.style("height"))/10)})
            .attr("height", parseInt(sidePanel.style("height"))/11)
            .attr("width", parseInt(sidePanel.style("width")) - margin.right - margin.left)
            .attr("rx", 20)
            .attr('ry', 20)
            .style("border", "2px")
            .style("stroke-width", "2px")
            .style("stroke", "black");

    

    
    sidePanel.select(".graph").selectAll("text")
            .data(primeCountries)
            .enter()
            .append('text')
            .attr("class", "countryLabels")
            .attr("x", parseInt(sidePanel.style("width"))/2)
            .attr("text-anchor", "middle")
            .attr("y", function(d,i){return parseInt((i+1.6)*(parseInt(sidePanel.style("height"))/10)) }) //shift labels down so that they ligne up with les boits
            .style("fill", "black")
            .text(d=>d);
    
   
  
    
    mapWidth = parseInt(svg.style("width"));
    mapHeight = parseInt(svg.style("height"));
    
    svg.attr("style", "outline: thin solid blue;").attr("width", mapWidth).attr("height", mapHeight)
    
    var countries = svg.append("g")
    .attr("class", "countries");

    var movingCircles = svg.append("g")
        .attr("class", "movingCircle");
        
    var staticCircle = svg.append("g")
         .attr("class", "staticCircle");

    var projection = d3.geoPatterson()
    .scale(181, 182)
    .translate([mapWidth/2.5, mapHeight/1.7])
    .precision(0.1);

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
        .style("stroke-linejoin", "round")
        .style("fill", "#a1a1a1")
        .style("stroke", "#0051a8")
        .attr("id",function(d) {
            
            prevCountry = d.id; 
      
            if (primeCountries.indexOf(getKey(d.id,0, true)) > -1 ){
            d3.select(this).style("fill", "red"); //changes color of primero countries

        }
          
            return d.id});
       })
  
})
    
    }

function fillPC(){
    
primeCountriesLower = ["Angola", "Indonesia", "Kenya", "Nigeria", "Nepal","Jordan", "South Sudan", "Sudan", "Sierra Leone"]
 d3.select(".divElement").select(".mapSVG").select(".states").selectAll("path").each(function(d){
        if (primeCountriesLower.indexOf(getKey(d.id,0, true)) > -1 ){
            d3.select(this).style("fill", "red");
        }
        
    });
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
    
    countries.selectAll("path").style("fill", "#a1a1a1");
    fillPC();
    
    
    var selectedCountryObject;
    
    var scale = d3.scaleSqrt();
    
    scale.domain([0, 100]);
    scale.range([0, 90]);
    
    var projection = d3.geoPatterson() //need projection in order to get centroid
    .scale(125)
    .translate([mapWidth/2, mapHeight/1.5])
    .precision(0.1);

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
            countries.selectAll("path").style("fill", "#a1a1a1"); 
            fillPC();
            d3.select(this).style("fill", d3.rgb(100,20,100));
            clearAll();
            selectedCountryObject = d;
            prevCountry = d;
            drawLines(d.id);
            drawBars(d.id, parsed);
            prevCountry = d.id;
            console.log(d);
            //trans(); //commented for faster testing but apparentely redundant
        
        });
    
    d3.select(".sidePanel")
      .selectAll("rect")
      .on("click", function(d){
        d3.select(".sidePanel")
           var countKey = getKey(0, false);
           var country = d;
           countCode = countKey[country].code;
        
       var countElement = countries.selectAll("path")
       .select("[id=" + "'" + countCode.toString() + "'" +"]");
        
        countries.selectAll("path").each(function(d,i){
            if(d.id == countCode){
            
                countries.selectAll("path").style("fill", "#a1a1a1"); 
                fillPC();
                d3.select(this).style("fill", d3.rgb(100,20,100));
                clearAll();
                selectedCountryObject = d;
                prevCountry = d;
                drawLines(d.id);
                drawBars(d.id, parsed);
                prevCountry = d.id;
                console.log(d);

            }
            
        })
     
       
   

    })
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
                    //update(trans()); 
                } 
                

                                      
                                      
                                      })};
        
        function update(callback){
            movingCircles.selectAll("circle").attr("cx", selectedCenter[0]).attr("cy", selectedCenter[1]).on("end", callback);
        };
    

function drawBars(countryID, parsedData){


console.log(parsedData.length);
        d3.select(".panelSVG").remove();
        reDraw();
          for(var y1 = 0; y1<parsedData.length; y1++){
              console.log("y1: " + y1);
              var lowerString = parsedData[y1].key;
              var countryName = getKey(countryID,0, true);
              
            try{
                console.log(dataSelect);
            if(lowerString.toLowerCase() == countryName.toLowerCase()) {
                var numbersOnly = Object.values(parsedData[y1][dataSelect]['values'][0]);
                var keys = Object.keys(parsedData[y1][dataSelect]['values'][0]);
                
                numbersOnly = numbersOnly.slice(0, numbersOnly.length-2); //get's rid of country tag
                keys = keys.slice(0, keys.length-2); //years for axis labels

                var dataStoreFinal = [];
                for(var t =0; t<keys.length; t++){
                    dataStoreFinal.push([keys[t], numbersOnly[t]]);
                }
                console.log(dataStoreFinal);
                
var svg = d3.select(".panelSVG"),
    width = graphWidth;
    height = (2 * graphHeight)/3;
    height2 = graphHeight/4;
console.log("graphHeight: " + graphHeight);

var parseDate = d3.timeParse("%Y");

var x = d3.scaleTime().range([0, width]),
    x2 = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    y2 = d3.scaleLinear().range([height2, 0]);

var xAxis = d3.axisBottom(x),
    xAxis2 = d3.axisBottom(x2),
    yAxis = d3.axisLeft(y);

var brush = d3.brushX()
    .extent([[0, 0], [width, height2]])
    .on("brush end", brushed);
console.log("width: " + width);
console.log(typeof width);
                

var zoom = d3.zoom()
    .scaleExtent([1, Infinity])
    .translateExtent([[0, 0], [width, height]])
    .extent([[0, 0], [width, height]])
    .on("zoom", zoomed);

var area = d3.area()
    .curve(d3.curveMonotoneX)
    .x(function(d) { return x(parseDate(d[0])); })
    .y0(height)
    .y1(function(d) { return y(d[1]); });

var area2 = d3.area()
    .curve(d3.curveMonotoneX)
    .x(function(d) { return x2(parseDate(d[0])); })
    .y0(height2)
    .y1(function(d) { return y2(d[1]); });

svg.select("#clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

var focus = svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + 30 + ")");

var context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left + "," + height + 70 + ")"); //10 px buffer


  x.domain(d3.extent(keys, function(d){return parseDate(d);}));
  y.domain(d3.extent(numbersOnly, function(d){return d;}));
  x2.domain(x.domain());
  y2.domain(y.domain());

  focus.append("path")
      .datum(dataStoreFinal)
      .attr("class", "area")
      .attr("d", area);

  focus.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  focus.append("g")
      .attr("class", "axis axis--y")
      .attr("transform", "translate(0," + graphHeight/10 + ")")
      .call(yAxis);

  context.append("path")
      .datum(dataStoreFinal)
      .attr("class", "area")
      .attr("d", area2);

  context.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height2 + ")");
      //.call(xAxis2);

  context.append("g")
      .attr("class", "brush")
      .call(brush)
      .call(brush.move, x.range());

  /*svg.append("rect")
      .attr("class", "zoom")
      .attr("width", width)
      .attr("height", height)
      .attr("transform", "translate(" + margin.left + "," + (3 * graphHeight)/4 + margin2.top + ")")
      .call(zoom);
      break;*/
};

function brushed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
    
  var s = d3.event.selection || x2.range();
  x.domain(s.map(x2.invert, x2));
  focus.select(".area").attr("d", area);
  focus.select(".axis--x").call(xAxis);
  svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
      .scale(width / (s[1] - s[0]))
      .translate(-s[0], 0));
    
}

function zoomed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
  var t = d3.event.transform;
  x.domain(t.rescaleX(x2).domain()); //resets x domain to match little graph
  focus.select(".area").attr("d", area);
  focus.select(".axis--x").call(xAxis);
  context.select(".brush").call(brush.move, x.range().map(t.invertX, t)); //t.invertX
}
function type(d) {
  d = parseDate(d);
  return d;
}
                
d3.select(".panelSVG").selectAll('rect').data(["undernourishment.csv", "perCapitaFoodSupply.csv", "internetUsers.csv", "poverty.csv"]).enter().append('rect').attr("class", "attributeButtons").attr("x", function(d, i){return i * (graphWidth-margin.left-margin.right)/4 + margin.left}).attr("y", 0).attr("width", 20).attr("height", 20).on("click", function(d){ 
    alert(d);
    dataSelect = d;
    drawBars(prevCountry, parsed);
    });;
     
            }catch(err){
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
            console.log("countryObject:");
            console.log(selectedCountryObject);

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
            
                 d3.select(this).style("fill", d3.rgb(size/4, size/6, size));

         
            svg.append("line")
                .attr("class", "countryLines")
                .attr("x1", center[0]) //change to moveTo if you want selected country to have immigrants coming to it 
                .attr("x2", selectedCenter[0])
                .attr("y1", center[1])
                .attr("y2", selectedCenter[1])
                .style("stroke", "blue")
                .style("stroke-width", size/300)
                .style("opacity", 0.3);
                
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
                .style("fill", d3.rgb(20, 0, 100))
                .on("click", trans()); 

              });
        }
}

    
    
   