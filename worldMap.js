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

function reDraw(){
    
    var topPanel = d3.select(".divElement").append('svg').attr("width", '90%').attr("height", '35%').attr("class", "panelSVG").attr("fill", "blue");
    
    
      topPanel.append("g").attr("class", "xaxis");
      topPanel.append("g").attr("class", "yaxis");
      topPanel.append("defs").append("clipPath").attr("id", "clip");
      topPanel.attr("transform", "translate(0," + 30 + ")");
    
    return topPanel;
    
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

    
   var svg = divElement.append('svg').attr("width", '70%').attr("height", '100%').attr("class", "mapSVG");
   svg.append("text").attr("class", "txtField").attr("x", 100).attr("y", 50).text("");
    
    
   var sidePanel = divElement.append("svg").attr("width", "30%").attr("height", "100%").attr("class", "sidePanel");
    
    var topPanel = reDraw();
      
    graphWidth = parseInt(topPanel.style("width"));
    graphHeight = parseInt(topPanel.style("height"));
    
    sidePanel.append('g').attr("class", "graph").selectAll('rect')
            .data(primeCountries)
            .enter()
            .append('rect')
            .attr("class", "countrySelect")
            .attr("x", 0)
            .attr("y", function(d,i){return i*(parseInt(sidePanel.style("height"))/9)})
            .attr("height", parseInt(sidePanel.style("height"))/9)
            .attr("width", parseInt(sidePanel.style("width")))
            .style("stroke", "black");
    

    
    sidePanel.select(".graph").selectAll("text")
            .data(primeCountries)
            .enter()
            .append('text')
            .attr("class", "countryLabels")
            .attr("x", parseInt(sidePanel.style("width"))/2)
            .attr("text-anchor", "middle")
            .attr("y", function(d,i){return parseInt((i+0.6)*(parseInt(sidePanel.style("height"))/9)) }) //shift labels down so that they ligne up with les boits
            .style("fill", "white")
            .text(d=>d);
    
   
  
    
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
           var countKey = getKey(0, false);
           var country = d;
           countCode = countKey[country].code;
        
       var countElement = countries.selectAll("path")
       .select("[id=" + "'" + countCode.toString() + "'" +"]");
        
        countries.selectAll("path").each(function(d,i){
            if(d.id == countCode){
            
                countries.selectAll("path").style("fill", "black"); 
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
                    update(trans()); 
                } 
                

                                      
                                      
                                      })};
        
        function update(callback){
            movingCircles.selectAll("circle").attr("cx", selectedCenter[0]).attr("cy", selectedCenter[1]).on("end", callback);
        };
    
    
    
    
    
    
    
        
      /*   function drawBars(countryID, parsedData){

          for(var y1 = 0; y1<parsedData.length; y1++){
              var lowerString = parsedData[y1].key;
              var countryName = getKey(countryID,0, true);
     
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
    
      panelSVG.select(".xaxis")
      .attr("transform", "translate(0,"+ gHeight +")")
      .call(xAxis);
         
      panelSVG.select(".yaxis")
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
    */
   
    function drawBars(countryID, parsedData){
console.log(parsedData.length);
        d3.select(".panelSVG").remove();
        reDraw();

          for(var y1 = 0; y1<parsedData.length; y1++){
              console.log("y1: " + y1);
              var lowerString = parsedData[y1].key;
              var countryName = getKey(countryID,0, true);
              
            try{
                console.log(lowerString);
                console.log(countryName);
            if(lowerString.toLowerCase() == countryName.toLowerCase()) {
                var numbersOnly = Object.values(parsedData[y1]['perCapitaFoodSupply.csv']['values'][0]);
                var keys = Object.keys(parsedData[y1]['perCapitaFoodSupply.csv']['values'][0]);
                
                numbersOnly = numbersOnly.slice(0, numbersOnly.length-2); //get's rid of country tag
                keys = keys.slice(0, keys.length-2); //years for axis labels

                var dataStoreFinal = [];
                for(var t =0; t<keys.length; t++){
                    dataStoreFinal.push([keys[t], numbersOnly[t]]);
                }
                console.log(dataStoreFinal);
                
var svg = d3.select(".panelSVG"),
    margin = {top: 5, right: 5, bottom: 20, left: 50},
    margin2 = {top: 5, right: 5, bottom: 20, left: 50},
    width = graphWidth;
    height = (3 * graphHeight)/4;
    height2 = graphHeight/4;

var parseDate = d3.timeParse("%Y");

var x = d3.scaleTime().range([0, width]),
    x2 = d3.scaleTime().range([0, width-graphWidth/3]),
    y = d3.scaleLinear().range([height, 0]),
    y2 = d3.scaleLinear().range([height2, 0]);

var xAxis = d3.axisBottom(x),
    xAxis2 = d3.axisBottom(x2),
    yAxis = d3.axisLeft(y);

var brush = d3.brushX()
    .extent([[0, 0], [width, height2]])
    .on("brush end", brushed);

var zoom = d3.zoom()
    .scaleExtent([1, Infinity])
    .translateExtent([[0, 0], [width, height]])
    .extent([[0, 0], [width, height]])
    .on("zoom", zoomed);

var area = d3.area()
    .curve(d3.curveMonotoneX)
    .x(function(d) { return x(d[0]); })
    .y0(height)
    .y1(function(d) { return y(d[1]); });

var area2 = d3.area()
    .curve(d3.curveMonotoneX)
    .x(function(d) { return x2(d[0]); })
    .y0(height2)
    .y1(function(d) { return y2(d[1]); });

svg.select("#clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

var focus = svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + 0 + ")");

var context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left + "," + (3 * graphHeight)/4 + margin2.top + ")");


  x.domain([1961, 2011]);
  y.domain([1500, 3000]);
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
      .attr("transform", "translate(0," + height2 + ")")
      .call(xAxis2);

  context.append("g")
      .attr("class", "brush")
      .call(brush)
      .call(brush.move, x.range());

  svg.append("rect")
      .attr("class", "zoom")
      .attr("width", 40)
      .attr("height", height)
      .attr("transform", "translate(" + margin.left + "," + (3 * graphHeight)/4 + margin2.top + ")")
      .call(zoom);
      break;
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
            
                 d3.select(this).style("fill", d3.rgb(size, 0, 0));

         
            svg.append("line")
                .attr("class", "countryLines")
                .attr("x1", center[0]) //change to moveTo if you want selected country to have immigrants coming to it 
                .attr("x2", selectedCenter[0])
                .attr("y1", center[1])
                .attr("y2", selectedCenter[1])
                .style("stroke", "red")
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
                .style("fill", d3.rgb(100, 0, 20))
                .on("click", trans()); 

              });
        }
}

    
    
   