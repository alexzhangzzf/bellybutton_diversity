function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samplesData = data.samples;
    
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleArray = samplesData.filter(sampleObj=> sampleObj.id == sample);
    console.log(sampleArray);

    // g1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var metaArray = metadata.filter(sampleObj => sampleObj.id == sample);


    //  5. Create a variable that holds the first sample in the array.
    var sampleChosen = sampleArray[0];
    console.log(sampleChosen);

    // g2. Create a variable that holds the first sample in the metadata array.
    
    var metaSample = metaArray[0];
    console.log(metaSample);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var sampleOtuIds = sampleChosen.otu_ids;
    var sampleOtuLabels = sampleChosen.otu_labels;
    var sampleValues = sampleChosen.sample_values;
    console.log(sampleOtuIds);
    console.log(sampleOtuLabels);
    console.log(sampleValues);

    // g3. Create a variable that holds the washing frequency.
    var washFreq = parseFloat(metaSample.wfreq);
    console.log(washFreq);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = sampleOtuIds.slice(0,10).map(id=>`OTU ${id}`).reverse();
    var xvalues = sampleValues.slice(0,10).reverse();
    var textLabels = sampleOtuLabels.slice(0,10).reverse();
    console.log(yticks)
        
    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: xvalues,
      y: yticks,
      text: textLabels,
      type:"bar",
      orientation:'h'
    }
      
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: {text:"<b>Top 10 Bacteria Culture Found</b>"},
      paper_bgcolor : 'rgb(0,0,0,0)',
      plot_bgcolor: 'rgb(0,0,0,0)',
      font: {
        size: 14,
        color: '#191970'}
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: sampleOtuIds,
      y: sampleValues,
      text:sampleOtuLabels,
      mode: 'markers',
      marker: {
        color: sampleOtuIds,
        size: sampleValues,
        colorscale: 'Portland'
      },
      type: 'scatter'
    }];
  
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: {text:'<b>Bacteria Cultures Per Sample</b>'},
      xaxis: { title:'OTU ID'},
      autosize: true,
      paper_bgcolor : 'rgb(0,0,0,0)',
      plot_bgcolor: 'rgb(0,0,0,0)',
      font: {
        size: 14,
        color: '#191970'}

    };
  
    var bubbleConfig = {responsive: true};

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout, bubbleConfig); 

    // g4. Create the trace for the gauge chart.
    var gaugeData = [{
      value: washFreq,
      type: "indicator",
      mode: "gauge+number",
      title: { text: "<b> Belly Button Washing Frequency </b><br>Scrubs per Week"},
      gauge: {
        axis:{ range:[0,10], tickcolor: "black"},
        bar: { color: "black"},
        bgcolor: "white",
        bordercolor:"gray",
        steps: [
          {range:[0,2], color:"red"},
          {range:[2,4], color:"orange"},
          {range:[4,6], color:"yellow"},
          {range:[6,8], color:"forestgreen"},
          {range:[8,10], color:"darkgreen"},
        ]
      }
    }];
    
    // g5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 500, height:400, 
      margin: {t:0, b:0},
      autosize: true,
      paper_bgcolor : 'rgb(0,0,0,0)',
      plot_bgcolor: 'rgb(0,0,0,0)',
      font: {
        size: 14,
        color: '#191970'}
    };

    // g6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });

};
