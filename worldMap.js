function buildMap(countryData){

    var height = 600;
    var width = 900;
    var moveTo; //will later store coordinates of end country    
    var key = {"United States":840}    


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



    d3.json("https://d3js.org/world-50m.v1.json", function(error, world){
        if (error) throw error;

        var countries = svg.append("g") //builds map
        .attr("class", "states")
        .selectAll("path")
        .data(topojson.feature(world, world.objects.countries).features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("id",d => d.id)
        .on("click", function(d){console.log(d.id)});



        var border = svg.append("path") //creates white borders
        .datum(topojson.mesh(world, world.objects.countries, function(a, b){ return a !== b;}))
        .attr("class", "boundary")
        .attr("d", path);

        var movingCircles = svg.append("g")
        .attr("class", "movingCircle");
        
         var staticCircle = svg.append("g")
         .attr("class", "staticCircle");


        var dataSet = countryData; //passed in parsed data from csvParse2

        d3.selectAll("path")
        .each(function (d,i){
            var centroid = path.centroid(d); //cetnroid equal to center of each country

            var index = dataSet.findIndex(countr => countr.code == d.id); //finds index of country with said iso 3-letter code

            if(typeof dataSet[index] != 'undefined'){ //checks if it is a primero country

            var size = dataSet[index]["United States"]; //sets size equal to immigration to US
                

            }else{
            var size = 0;
            }
         console.log(getKey("188"));
            var state = d3.select("[id='076']");
            moveTo = path.centroid(state.datum());

            svg.append("line")
                .datum(centroid)
                .attr("x1", centroid[0])
                .attr("x2", moveTo[0])
                .attr("y1", centroid[1])
                .attr("y2", moveTo[1])
                .style("stroke", "red")
                .style("stroke-width", size/300);
            
            svg.append("rect")
                .attr("x", 50)
                .attr("y", 50)
                .attr("height", 50)
                .attr("width", 50)
                .style("fill", "blue");

            movingCircles.append("circle")
                .datum(centroid)
                .attr("cx", centroid[0])
                .attr("cy", centroid[1])
                .attr("r",size/200)
                .style("fill", "red");
                //.on("click", trans());
          
           
            staticCircle.append("circle")
                .datum(centroid)
                .attr("cx", centroid[0])
                .attr("cy", centroid[1])
                .attr("r",size/200)
                .style("fill", "red");
                
            staticCircle.append("circle")
                .attr("cx", moveTo[0])
                .attr("cy", moveTo[1])
                .attr("r",size/200)
                .style("fill", "red");
      
              });

        function trans(){
            console.log("transformation called");
            movingCircles.selectAll("circle")
                .transition()
                .duration(3000)
                .attr("cx", moveTo[0])
                .attr("cy", moveTo[1])
                .on('end', function(d){
                if (Math.round(d[0]) == 492 && Math.round(d[1]) == 244){ //hack to see if it's last element, otherwise can't figure out how to only call this for the last circle 
                    update(trans()); 
                } 
                
                console.log("d: " + Math.round(d[0]) + "also d: " + Math.round(d[1]));

                                      
                                      
                                      
                                      
                                      })};
        
        function update(callback){
            console.log("update");
            movingCircles.selectAll("circle").transition().duration(0).delay(3000).attr("cx", d => d[0]).attr("cy", d => d[1]).on("end", callback);
            };
        function drawLine(){
            
        }

        d3.select(window).on("load", trans());   
    }
           );
       };





