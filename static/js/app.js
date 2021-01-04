d3.json("/static/js/samples.json").then( data=>{
    // Appending People ID's to DropDown
    d3.select("#selDataset").selectAll("option").data(data.names).enter().append("option").text(data=>data).attr("value", data=>data);
    //Setting Default
    var CurrentValue = d3.select("#selDataset").property("value");
    optionChanged(CurrentValue);
});

//Grab new data from drop down and calling BarChart Function to Graph
optionChanged=(NewDropDownValue)=> {
    d3.json("/static/js/samples.json").then( data=>{
        for(let i=0; i<data.samples.length; i++){
            if(data.samples[i].id === NewDropDownValue){
                var sample_values = data.samples[i].sample_values;
                var otu_ids = data.samples[i].otu_ids;
                var otu_labels = data.samples[i].otu_labels;
                updatePlotly(sample_values, otu_ids, otu_labels);
                BubbleChart(otu_ids, sample_values, otu_labels);
            }
        }
        for(let j=0; j<data.metadata.length; j++){
            if(data.metadata[j].id.toString() === NewDropDownValue){
                console.log(data.metadata[j]);
                var metadata_id = data.metadata[j].id;
                var metadata_ethnicity = data.metadata[j].ethnicity;
                var metadata_gender = data.metadata[j].gender;
                var metadata_age = data.metadata[j].age;
                var metadata_location = data.metadata[j].location;
                var metadata_bbtype = data.metadata[j].bbtype;
                var metadata_wfreq = data.metadata[j].wfreq;
                DisplayData(metadata_id, metadata_ethnicity, metadata_gender, metadata_age, metadata_location, metadata_bbtype, metadata_wfreq);
            }
        }
    });
}

// Graphing Bar Chart
updatePlotly=(xVals, yVals, hoveritems)=> {
    var listInit = [];
    for (let j=0; j < xVals.length; j++){
        listInit.push({'yVals': "OTU "+yVals[j], 'xVals': xVals[j], 'hoveritems':  hoveritems[j]});
    }
    var BarChartList = listInit.sort((a, b) => b.xVals - a.xVals).slice(0, 10).reverse();
    var data = [{
        type: 'bar',
        x: BarChartList.map(object => object.xVals),
        y: BarChartList.map(object => object.yVals),
        orientation: 'h',
        text: BarChartList.map(object => object.hoveritems)
    }];
  
  Plotly.newPlot('bar', data);
}
// Graphing Bubble Chart
BubbleChart=(xVals, yVals, labels)=> {
    var BubbleChartList = [];
    for (let j=0; j < xVals.length; j++){
        BubbleChartList.push({'xVals':xVals[j], 'yVals': yVals[j], 'labels': labels[j]});
    }
    var trace1 = {
        x: BubbleChartList.map(object => object.xVals),
        y: BubbleChartList.map(object => object.yVals),
        mode: 'markers',
        marker: {
            size: BubbleChartList.map(object => object.yVals),
            color: BubbleChartList.map(object => object.xVals),
            line: {
                color: 'black',
                width: 1.5
            }
        },
        text: BubbleChartList.map(object => object.labels)
    };
    var data = [trace1];
    var layout = {
        title: 'Marker Size',
        showlegend: false,
        height: 600,
        width: 1200
    };
    Plotly.newPlot('bubble', data, layout);
}
// Displaying metadata

DisplayData=(id, ethnicity, gender, age, location, bbtype, wfreq)=>{
    let DisplayItem = d3.select("#sample-metadata");
    DisplayItem.html("");
    let item = DisplayItem.append("ul").style("padding-inline-start", 0+"px");
    item.append("li").text(`ID: ${id}`).style("list-style", "none");
    item.append("li").text(`Ethnicity: ${ethnicity}`).style("list-style", "none");
    item.append("li").text(`Gender: ${gender}`).style("list-style", "none");
    item.append("li").text(`Age: ${age}`).style("list-style", "none");
    item.append("li").text(`Location: ${location}`).style("list-style", "none");
    item.append("li").text(`Bbtype: ${bbtype}`).style("list-style", "none");
    item.append("li").text(`Wfreq: ${wfreq}`).style("list-style", "none");
}
