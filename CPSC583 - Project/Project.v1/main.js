/**
 * KNOWN ISSUES TO FIX
 *1. Y-axis labels not joined with graph
 * 3. fertility data not reflected on y-axis properly
 * 3. ease(bounce) not working
 *
 */

/**
 * Call our functions on window load event
 */


window.onload = function(){
    setup();
}

/**
 * Global variables
 */
var _data_life;
var _data_fertility;

var _data_africa_life;
var _vis;   // the svg container where we will draw our visualization
var _vis_width = 0;     // dimensions of the visualization
var _vis_height = 0;

var _vis2;
var _vis2_width = 0;
var _vis2_height = 0;

const PADDING_FOR_LABELS = 150;

/**
* Function setup: sets up our visualization environment.
* You can change the code to not have static paths and elementID's
*/
function setup(){
    loadData("life_expectancy_data_csv.csv", "fertility_rate_data_csv.csv", "africa_scatterplot.csv");
    _vis = document.getElementById("vis");
     _vis = d3.select("#vis");
    // grab our container's dimension
    _vis_width = d3.select("#vis").node().getBoundingClientRect().width;
    _vis_height = d3.select("#vis").node().getBoundingClientRect().height;

    _vis2 = document.getElementById("vis2");
    _vis2 = d3.select("#vis2");
    // grab our container's dimension
    _vis2_width = d3.select("#vis2").node().getBoundingClientRect().width;
    _vis2_height = d3.select("#vis2").node().getBoundingClientRect().height;
}

/**
 * Function loadData: loads data from a given CSV file path/url
 * @param path string location of the CSV data file
 */

function loadData(path1, path2, path3){

    Promise.all([d3.csv(path1), d3.csv(path2), d3.csv(path3)]).then(function(arrValues){
            console.log(arrValues);

            _data_life = arrValues[0];
            setupLifeBars(_data_life);

            _data_fertility = arrValues[1];
            setUpFertilityBars(_data_fertility);

            _data_africa_life = arrValues[2];

    });


}

/**
 * Function setupBars: sets up rectangles to represent each data point in our dataset
 */


function setupLifeBars(_data_life) {
    console.log(_data_life);
    console.log(_vis_height);
    // divide the height of our vis to the number of rows
    var y_pad = Math.floor(_vis_height / _data_life.length);
    var spacing = 0;

    console.log(_data_life);

    var xScale_L = d3.scaleLinear()
        .domain([0, 100-1]) //input
        .range([0, _vis_width/2.4]); //output

    /**Function is not being used at the moment
    var line = d3.line()
        .x(function(d,i){
            return xScale_L(i);
        })
        .curve(d3.curveMonotoneX());//apply smoothing of line
    **/

    var lifeBarGroup = _vis.selectAll("g.life-bar")
        .data(_data_life)
        .enter()
        .append("g")
        .attr("class", "life-bar")
        .attr("transform", "");

    lifeBarGroup
        //.selectAll("rect")
        .append("rect")
        .attr("id", function (d, i) {
            return "row_L_" + i;
        })
        .attr("rx", 12)
        .attr("ry", 12)
        .attr("x", (_vis_width / 2) * 1.20)
        .attr("y", (d, i) => i * y_pad)
        .attr("height", 25)
        .attr("width", y_pad/2)
        .attr("style", "fill:#66FCF1");



    lifeBarGroup
        .append("text")
        .text(function (d) {
            return d.Country;
        })

        .attr("y", function (d, i) {
            if (i === 0) {
                return spacing += 30;
            } else {
                return spacing += 66;
            }

        })
        .attr("x", _vis_width/1.98)
        .attr("style", "@import url('https://fonts.googleapis.com/css?family=Roboto|Roboto+Slab')")
        .attr("style", "fill: white; text-anchor: middle; font-size: 20px; font-family: 'Roboto Slab', serif;");

    //Call the x-axis
    lifeBarGroup
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate("+((_vis_width/2)*1.2)+","+(_vis_height-15) + ")")
        .attr("style", "font-size: 8px")
        .call(d3.axisBottom(xScale_L)); //Create an axis component with d3

    // console.log(lifeBarGroup.select(".x axis"));
    //
    // lifeBarGroup
    //     .append("g")
    //     .attr("class", "x-axis-label")
    //     .attr("transform", "translate("+((_vis_width/2)*1.5)+","+(_vis_height + 10) + ")")
    //     .append("text")
    //     .text("Life Expectancy")
    //     .style("fill", "white")
    //     .style("font-size", "20px");

    let body = d3.select("body")
        .append("p")
        .text("Life Expectancy")
        .style("position", "absolute")
        .style("top", function(d){
            console.log((parseInt(d3.select("#vis").attr("margin-left"))));
            return ((_vis_height-25) + (parseInt(d3.select("#vis").style("margin-left"))) * 2) + "px";
        })
        .style("left", function(d){
            return (((_vis_width/2)*1.5) + (parseInt(d3.select("#vis").style("margin-top"))) * 3) + "px";
        })
        .style("font-size", "20px");
        //.style("margin", "5px")
        //.style("padding", "5px");

    d3.select("body")
        .append("p")
        .text("Fertility Rate")
        .style("position", "absolute")
        .style("top", function(d){
            console.log((parseInt(d3.select("#vis").attr("margin-left"))));
            return ((_vis_height-25) + (parseInt(d3.select("#vis").style("margin-left"))) * 2) + "px";
        })
        .style("left", function(d){
            return ((_vis_width/6) + (parseInt(d3.select("#vis").style("margin-top"))) * 3) + "px";
        })
        .style("font-size", "20px");
        //.style("margin", "5px")
        //.style("padding", "5px");

    /**This function causes the yellow bars in set up mode to not appear**/
  /*  lifeBarGroup
        .append("path")
        .datum(_data_life) //Binds data to the line
        .attr("class", "line") //Assign a class for the styling
        .attr("d", line); //Calls the line generator
   */

}
    /**
     * Function setupBars: sets up rectangles to represent each data point in our dataset
     */

    function setUpFertilityBars(_data_fertility) {
        var y_pad = Math.floor(_vis_height / _data_fertility.length);

        var xScale_F = d3.scaleLinear()
            .domain([0, 8]) //input
            .range([(_vis_width/2.4),0]); //output

        /**Function is not being called at the moment
        var line = d3.line()
            .x(function(d,i){
                return xScale_L(i);
            })
            .curve(d3.curveMonotoneX());//apply smoothing of line
        **/
        var fertilityBarGroup = _vis.selectAll("g.fertility-bar")
            .data(_data_fertility)
            .enter()
            .append("g")
            .attr("class", "fertility-bar")
            .attr("transform", "");

        fertilityBarGroup
            .append("rect")
            .attr("id", function (d, i) {
                return "row_F_" + i;
            })
            .attr("rx", 12)
            .attr("ry", 12)
            .attr("x", (_vis_width /2.4-33))
            // .attr("x", function(d, i){
            //     return xScale_F(i)
            // })
            .attr("y", (d, i) => i * y_pad)
            .attr("height", 25)
            .attr("width", y_pad /2)
            .attr("style", "fill:#45A29E");

        fertilityBarGroup
            .append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0,"+(_vis_height-15) + ")")
            .attr("style", "font-size: 8px")
            .call(d3.axisBottom(xScale_F)); //Create an axis component with d3

    }

    /**
     * Function changeBarHeights: changes the heights of the bars in our visualization with values
     * from a given data attribute
     * @param attr the data attribute containing the value to be applied to each bar's height
     * @param maxAttrValue the maximum value the attribute can have
     * assume the min value is 0
     */
    function changeBarLengthLife(attr, maxAttrValue) {
        console.log("In changing bar lengths for life data");


        _vis.selectAll("g.life-bar")
            .data(_data_life)
            .select("rect")
            .transition()
            .duration(1000)
            .ease(d3.easeBounce)
            .attr("width", function(d, i) {
                return mapValue(_data_life[i][attr], 0, maxAttrValue, 0, (_vis_width/2) - PADDING_FOR_LABELS);
            })

        _vis.selectAll("g.life-bar")
            .append("svg:title")
            .text(function(d, i){
                console.log("hover " + _data_life[i][attr]);
                return _data_life[i][attr];
            });

    }

    /**
     * Function changeBarHeights: changes the heights of the bars in our visualization with values
     * from a given data attribute
     * @param attr the data attribute containing the value to be applied to each bar's height
     * @param maxAttrValue the maximum value the attribute can have
     * assume the min value is 0
     */
    function changeBarLengthFertility(attr, maxAttrValue) {
       var xScale_F = d3.scaleLinear()
           .domain([0, 8]) //input
           .range([(_vis_width/2.4),0]); //output

        _vis.selectAll("g.fertility-bar")
            .data(_data_fertility)
            .select("rect")
            .transition()
            .duration(1000)
            .ease(d3.easeBounce)
            .attr("width", function(d, i) {
                return mapValue(_data_fertility[i][attr], 0, maxAttrValue, 0, (_vis_width/2) - PADDING_FOR_LABELS);
            });

        _vis.selectAll("g.fertility-bar").select("rect")
            .attr("transform", function(d){
                // let new_x = _vis_width - d3.select(this).select("rect").attr("width");
                // let transform = `translate(${((_vis_width /3)+(_vis_width/2))}, 0) scale(-1,1)`;
                // (_vis_width/2)*1.2)
                let transform = `translate(${_vis_width - ((_vis_width/2)*1.2) + (_vis_width/2.4)}, 0) scale(-1,1)`;
                return transform;
            });

        _vis.selectAll("g.fertility-bar")
            .append("svg:title")
            .text(function(d, i){
                console.log("hover " + _data_fertility[i][attr]);
                return _data_fertility[i][attr];
            });
    }


    /**
     * Function maps a value from an old range of values to a new range
     * @param value the number to be remapped to a given range
     * @param origMin the minimum value of the original range
     * @param origMax the maximum value of the original range
     * @param newMin the minimum value of the new range
     * @param newMax the maximum value of the new range
     */
    function mapValue(value, origMin, origMax, newMin, newMax) {
        return (value - origMin) * (newMax - newMin) / (origMax - origMin) + newMin;
    }

