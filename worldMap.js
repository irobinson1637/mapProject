function buildMap(countryData){

    var height = 600;
    var width = 900;
    var moveTo; //will later store coordinates of end country    
    var centroid;
    var selectedCountry;
    var selectedCenter;
    var key = {"United States":840}    

    var scale = d3.scaleSqrt();
    scale.domain([0, 100]);
    scale.range([0, 90]);
    
    
    var svg = d3.select("body")
    .append("svg")
    .attr("height", height)
    .attr("width", width);

    var countries = svg.append("g")
    .attr("class", "countries");


    var projection = d3.geoPatterson()
    .scale(200)
    .translate([width/2-30, height/2+30])
    .precision(0.01);

    var path = d3.geoPath()
    .projection(projection);

    svg.append("path") //adds the grid
    .datum(d3.geoGraticule10())
    .attr("class", "graticule")
    .attr("d", path);
    
    var dataSet = countryData; 



    d3.json("https://d3js.org/world-50m.v1.json", function(error, world){
        if (error) throw error;

        var countries = svg.append("g"); //builds map
        
        countries.attr("class", "states")
        .selectAll("path")
        .data(topojson.feature(world, world.objects.countries).features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("id",d => d.id)
        .style("stroke-linejoin", "round")
        .on("click", function(d){
            d3.select(this).style("fill", d3.rgb(100,20,100));
            selectedCountry = d;
            drawLines(d.id);
        
        });

        var border = svg.append("g");
        border.append("path") //creates white borders
        .datum(topojson.mesh(world, world.objects.countries, function(a, b){ return a !== b;}))
        .attr("class", "boundary");
        //.attr("d", path);

        var movingCircles = svg.append("g")
        .attr("class", "movingCircle");
        
         var staticCircle = svg.append("g")
         .attr("class", "staticCircle");


        //passed in parsed data from csvParse2

        

        function trans(){
            movingCircles.selectAll("circle")
                .transition()
                .duration(3000)
                .attr("cx", d => d[0])//moveTo
                .attr("cy", d => d[1])
                .on('end', function(d){
                console.log("ended");
                if (Math.round(d[0]) == 492 && Math.round(d[1]) == 244){ //hack to see if it's last element, otherwise can't figure out how to only call this for the last circle 
                    update(trans()); 
                } 
                

                                      
                                      
                                      })};
        
        function update(callback){
            console.log("update");
            console.log("sel: "+ selectedCenter);
            movingCircles.selectAll("circle").transition().duration(0).delay(3000).attr("cx", selectedCenter[0]).attr("cy", selectedCenter[1]).on("end", callback);
            };
        
        function drawLines(countryID){
          
        svg.selectAll("line").remove();
        svg.selectAll("circle").remove();
        svg.select("rect").remove();
            
        svg.selectAll("path")
        .each(function (d,i){
           
            console.log("d");
            console.log(i);
            var center = path.centroid(d); //cetnroid equal to center of each country
            
            selectedCenter = path.centroid(selectedCountry);
            
            console.log("selecetedCenter: " + selectedCenter);
            console.log(center);
            var currentID = d.id;
            //var index = dataSet.findIndex(countr => countr.code == d.id); //finds index of country with said iso 3-letter code

                
                var temp = dataSet[getKey(countryID, 0, true)]; //selects selected country object
            
                 
                var size = temp[getKey(d.id,0,true)]; //as it loops through each country, get's the data associated with the attribute of selected country associated with that country
            
                if (typeof size == 'undefined'){ //better wat to do this without wasting memory by assigning size a value just to reassign it to 0
                    size = 0;
                }else{
                    size = scale(size);
                }

                 d3.select(this).style("fill", d3.rgb(size, 0, 0));

            //var state = d3.select("[id='"+countryID+"']"); 
            //moveTo = path.centroid(state.datum());
            
            svg.append("line")
                .attr("class", "countryLines")
                .attr("x1", center[0]) //change to moveTo if you want selected country to have immigrants coming to it 
                .attr("x2", selectedCenter[0])
                .attr("y1", center[1])
                .attr("y2", selectedCenter[1])
                .style("stroke", "red")
                .style("stroke-width", size/300)
                .style("opacity", 0.2);
            
            svg.append("rect")
                .attr("class", "lonely-square")
                .attr("x", 10)
                .attr("y", 10)
                .attr("width", 20) 
                .attr("height", 20)
                .style("fill", "blue")
                .on("click", function(d){
                    console.log("clicked!");
                trans();
                });
                
            
          
            staticCircle.append("circle")
                .attr("cx", center[0])
                .attr("cy", center[1])
                .attr("r",size/200)
                .style("fill", "red");
                
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
                //.on("click", trans());
              
      
              });
        }

       
    }
           );
       };





