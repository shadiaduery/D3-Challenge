
// Create multiple functions that update different parts 
//of the graph on clicking on a label

// x-axis 
function renderXAxes(updatedXScale, xAxis) {
    var bottomAxis = d3.axisBottom(updatedXScale);
    xAxis.transition().duration(1000).call(bottomAxis);
    return xAxis;
}

// y-axis
function renderYAxes(updatedYScale, yAxis) {
    var leftAxis = d3.axisleft(updatedYScale);
    yAxis.transition().duration(1000).call(leftAxis);
    return yAxis;
}

// x-scale
function xScale(data, chosenXAxis, chartWidth) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.max(data, d => d[chosenXAxis])])
        .range([0, chartWidth]);
    return xLinearScale;
}

// y-scale
function yScale(data, chosenYAxis, chartHeight) {
    var yLinearScale = d3.scaleLinear()
        .domain([d3.max(data, d => d[chosenYAxis])])
        .range([chartWidth, 0]);
    return yLinearScale;
}
// circles
function renderCircles(circlesGroup, updatedXScale, updatedYScale, chosenXAxis, chosenYAxis) {
    circlesGroup.transition().duration(1000)
        .attr("cx", d => updatedXScale(d[chosenXAxis]))
        .attr("cy", d => updatedYScale(d[chosenYAxis]));
    return circlesGroup;
}

// text
function renderText(circlesText, updatedXScale, updatedYScale, chosenXAxis, chosenYAxis) {
    circlesText.transition().duration(1000)
        .attr("x", d => updatedXScale(d[chosenXAxis]))
        .attr("y", d => updatedYScale(d[chosenYAxis]));
    return circlesText;
}

// ToolTip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, circleText) {
    // x-axis
    if (chosenXAxis === "poverty") {
        var xlabel = "Poverty: ";
    }
    else if (chosenXAxis === "income") {
        var xlabel = "Median Income: "
    }
    else {
        var xlabel = "Age: "
    }
    // y-axis
    if (chosenYAxis === "healthcare") {
        var ylabel = "Lacks Healthcare: ";
    }
    else if (chosenYAxis === "smokes") {
        var ylabel = "Smokes: "
    }
    else {
        var ylabel = "Obesity: "
    }
    // Define tooltip
    var toolTip = d3.tip().offset([120, -60]).attr("class", "d3-tip")
        .html(function (d) {
            if (chosenXAxis === "age") {
                return (`${d.state}<hr>${xlabel}${d[chosenXAxis]}<br>${ylabel}${d[chosenYAxis]}%`)
            }
            else {
                return (`${d.state}<hr>${xlabel}${d[chosenXAxis]}%<br>${ylabel}${d[chosenYAxis]}%`);
            }
        });
    circlesGroup.call(toolTip);

    circlesGroup
        .on("mouseover", function (data) {
            toolTip.show(data, this);
        })
        .on("mouseout", function (data) {
            toolTip.hide(data, this);
        })
    circlesText
        .on("mouseover", function (data) {
            toolTip.show(data, this);
        })
        .on("mouseout", function (data) {
            toolTip.hide(data);
        })
    return circlesGroup;
}

var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function makeResponsive() {
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
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight + 40);

// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
var chartGroup = svg.append("g")
    // <g transform = "translate (30,30)></g>"
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// * STEP # 2: Access the Data 
//===========================================================
// Access data from data.csv file
d3.csv("assets/data/data.csv").then(function (healthriskdata) {
    var data = healthriskdata;
    console.log(data);

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
        .domain([8.5, (data[chosenXAxis])])
        .range([0, chartWidth]);

    var yScale = d3.scaleLinear()
        .domain([3.5, (data[chosenYAxis])])
        .range([chartHeight, 0]);

    //Create axis
    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);

    //Append axis to the chartGroup
    var xAxis = chartGroup.append("g").attr("transform", `translate(0, ${chartHeight})`).call(bottomAxis);

    // Append two SVG group elements to the chartGroup area,
    // and create the bottom and left axes inside of them
    var yAxis = chartGroup.append("g").call(leftAxis);

    // * STEP # 5: Create the Actual Chart
    //Make Circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("g")
        .attr("cx", d => xScale(d[chosenXAxis]))
        .attr("cy", d => yScale(d[chosenYAxis]))
        .attr("r", 10)
        .attr("fill", "lightblue")
        .attr("opacity", ".6")
        .attr("stroke-width", "1")
        .attr("stroke", "white")
        .classed("circleselectionactive", true);

    var circlesText = circlesGroup.select("g")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("x", d => xScale(d[chosenXAxis]))
        .attr("y", d => yScale(d[chosenYAxis]))
        .attr("dy", -375)
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .attr("fill", "black")
        .classed("textselection", true);

    // Create a group for 3 x-axis labels
    var xLabelsGroup = chartGroup.append("g")

    var Label_Poverty = xLabelsGroup.append("text")
        .attr("transform", `translate(${chartWidth / 2.5}, ${chartHeight + chartMargin.top + 25})`)
        .attr("class", "axisText")
        .attr("value", "poverty")
        .text("In Poverty (%)")
        .classed("active", true);

    var Label_Age = xLabelsGroup.append("text")
        .attr("transform", `translate(${chartWidth / 2.5}, ${chartHeight + chartMargin.top + 25})`)
        .attr("class", "axisText")
        .attr("dy", "1.2em")
        .attr("value", "age")
        .text("Age (median)")
        .classed("inactive", true);

    var Label_Income = xLabelsGroup.append("text")
        .attr("transform", `translate(${chartWidth / 2.5}, ${chartHeight + chartMargin.top + 25})`)
        .attr("class", "axisText")
        .attr("dy", "2.3em")
        .attr("value", "income")
        .text("Household Income")
        .classed("inactive", true);

    // Create a group for 3 y-axis labels
    var yLabelsGroup = chartGroup.append("g");

    var Label_Healthcare = yLabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - 50)
        .attr("x", 0 - 250)
        .attr("dy", "1em")
        .attr("value", "healthcare")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)")
        .classed("active", true);

    var Label_Smokes = yLabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - 50)
        .attr("x", 0 - 250)
        .attr("dy", "-0.5em")
        .attr("value", "smokes")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)")
        .classed("inactive", true);

    var Label_Obesity = yLabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - 50)
        .attr("x", 0 - 250)
        .attr("dy", "-1.8em")
        .attr("value", "obesity")
        .attr("class", "axisText")
        .text("Obesity (%)")
        .classed("inactive", true);


    // STEP # 6: Initialize Tooltip
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function (d) {

            var toolTip = d3.select("body")
                .append("div")
                .attr("class", "tooltip");

            circlesGroup = toolTip(circlesGroup, chosenYAxis, chosenYAxis);

            // event listener for x labels
            xLabelsGroup.selectAll("text").on("click", function () {
                chosenXAxis = d3.select(this).attr("value");

                xLinearScale = xScale(data, chosenXAxis, chartWidth);

                xAxis = renderXAxes(xLinearScale, xAxis)


                if (chosenXAxis === "age") {
                    Label_Poverty
                        .classed("active", false)
                        .classed("inactive", true);
                    Label_Age
                        .classed("active", true)
                        .classed("inactive", false);
                    Label_Income
                        .classed("active", true)
                        .classed("inactive", false);
                }
                else if (chosenXAxis === "income") {
                    Label_Poverty
                        .classed("active", false)
                        .classed("inactive", true);
                    Label_Age
                        .classed("active", false)
                        .classed("inactive", true);
                    Label_Income
                        .classed("active", true)
                        .classed("inactive", false);
                }
                else {
                    Label_Poverty
                        .classed("active", true)
                        .classed("inactive", false);
                    Label_Age
                        .classed("active", false)
                        .classed("inactive", true);
                    Label_Income
                        .classed("active", false)
                        .classed("inactive", true);
                }
            })
                });
    // Y event listener for y labels
    yLabelsGroup.selectAll("text").on("click", function () {

        chosenYAxis = d3.select(this).attr("value");

        yLinearScale = yScale(data, chosenYAxis, chartHeight)

        yAxis = renderYAxes(yLinearScale, yAxis);


        if (chosenXAxis === "smokes") {
            Label_Healthcare
                .classed("active", false)
                .classed("inactive", true);
            Label_Smokes
                .classed("active", true)
                .classed("inactive", false);
            Label_Obesity
                .classed("active", true)
                .classed("inactive", false);
        }
        else if (chosenXAxis === "obesity") {
            Label_Healthcare
                .classed("active", false)
                .classed("inactive", true);
            Label_Smokes
                .classed("active", false)
                .classed("inactive", true);
            Label_Obesity
                .classed("active", true)
                .classed("inactive", false);
        }
        else {
            Label_Healthcare
                .classed("active", true)
                .classed("inactive", false);
            Label_Smokes
                .classed("active", false)
                .classed("inactive", true);
            Label_Obesity
                .classed("active", false)
                .classed("inactive", true);
        }
        // Update circles with new y values.
        circle = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
        // Update circles text with new values.
        circlesText = renderText(circlesText, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
        // Update tool tips with new info.
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circle, circleText);
    });

});
// });
// });
