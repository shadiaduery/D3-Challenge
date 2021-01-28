
// * STEP 1: Define the "Work Area"
//==============================================

// Define SVC are dimensions
var svgWidth = 960;
var svgHeight = 500;

// Define the chart's marging as an object
var chartMargin = {
    top: 20,
    right: 40,
    bottom: 100,
    left: 100
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select html id where svg will be located, "#scatter", and append the svg to it, and set the dimensions of it
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
var chartGroup = svg.append("g")
    // <g transform = "translate (30,30)></g>"
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);


// * STEP # 2: Access the Data 
//===========================================================

// Access data from data.csv file
d3.csv("assets/data/data.csv").then(function (healthriskdata) {
    var data = healthriskdata;
    console.log(data)

    // STEP # 3: Prepare the Data (clean and/or filter)
    //============================================================

    //Get data from data.csv file and transform strings into integers if needed
    data.forEach((d) => {
        d.age = +d.age;
        d.smokes = +d.smokes;
        d.healthcare = +d.healthcare;
        d.poverty = +d.poverty;
        d.abbr = d.abbr;
        d.income = +d.income;
        d.obesity = +d.obesity;
    });

    // STEP # 4: Create Scales and Axes    

    //Create scales for X and Y
    // Chart 1: Poverty vs Healthcare
    var xScale = d3.scaleLinear()
        .domain([8.5, d3.max(data, d => d.poverty)])
        .range([0, chartWidth]);

    var yScale = d3.scaleLinear()
        .domain([3.5, d3.max(data, d => d.healthcare)])
        .range([chartHeight, 0]);


    //Create axis
    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);

    //Append axis to the chartGroup
    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    // Append two SVG group elements to the chartGroup area,
    // and create the bottom and left axes inside of them
    chartGroup.append("g")
        .call(leftAxis);

    // * STEP # 5: Create the Actual Chart

    //Make Circles
   chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.poverty))
        .attr("cy", d => yScale(d.healthcare))
        .attr("r", 10)
        .attr("fill", "lightblue")
        .attr("opacity", ".6")
        .attr("stroke-width", "1")
        .attr("stroke", "white");

    chartGroup.select("g")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("x", d => xScale(d.poverty))
        .attr("y", d => yScale(d.healthcare))
        .attr("dy", -375)
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .attr("fill", "black");

    //Make labels for the healthrisk graph
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - 50)
        .attr("x", 0 - 250)
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");

    chartGroup.append("text")
        .attr("transform", `translate(${chartWidth / 2.5}, ${chartHeight + chartMargin.top + 25})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");

})



    // // Step 1: Initialize Tooltip
    // var toolTip = d3.tip()
    //     .attr("class", "tooltip")
    //     .offset([80, -60])
    //     .html(function(d) {

    // var toolTip = d3.select("body")
    //     .append("div")
    //     .attr("class", "tooltip");

    // function onMouseover(d) {
    //     toolTip.style("display", "block");
    //     toolTip.html(`<strong>${d.poverty}</strong>`)
    //         .style("left", d3.event.pageX + "px")
    //         .style("top", d3.event.pageY + "px");
    // }

    // function onMouseout(d) {
    //     toolTip.style("display", "none");
    // }

    // circlesGroup1.on("mouseover", onMouseover).on("mouseout", onMouseout);
