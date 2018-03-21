var g;
first = 1;

function init() {
  console.log("inside init - plotly1.js")
  console.log("first=", first)

  document.getElementById("selection").addEventListener("change", e => render(e.target.value, false))
  render(document.getElementById("selection").value, true)

  }

  function updatePlotly(newdata, first) { //Plotly.restyle only update traces objects. 
    if (first) {
      var layout = {
        title: "% Sample values of OTU_IDs for selected sample BB_XXX",
        height: 400,
        width: 600
        };
      Plotly.newPlot("pie", [{
        type: 'pie',
        values: newdata.values.slice(0, 10),
        labels: newdata.labels.slice(0, 10)
      }], layout);
    } else {

      var PIE = document.getElementById("pie");
      Plotly.restyle(PIE, {
        values: [newdata.values.slice(0,10)],
        labels: [newdata.labels.slice(0,10)]
      }, 0);
    }
  }

  function updateBubblePlotly(newdata, first) { //Ploty.restyle only update traces objects. 
    if (first) {
      var bubble_data = [{
        type: "scatter",
        mode: "markers",
        x: newdata.labels.slice(0, 100),
        y: newdata.values.slice(0, 100),
        marker: {
          size: newdata.values,
          sizemode: 'area',
          color: ['red', 'green', 'blue', 'orange', 'brown', 'purple', 'black', 'yellow', 'red', 'green', 'blue', 'orange']
        }
      }];
          
      var bubble_layout = {
        title: "OTU IDs vs Sample values for the selected sample",
        height: 400,
        width: 600,
        xaxis: {
          title: 'OTU IDs',
          titlefont: {
            family: 'Cambria',
            size: 18,
            color: 'blue'
          }
        },
        yaxis: {
          title: 'Sample Values',
          titlefont: {
            family: 'Cambria',
            size: 18,
            color: 'blue'
          }
        }
      };
 
        Plotly.newPlot("bubble-chart", bubble_data, bubble_layout);
      } else {

        var BUBBLE = document.getElementById("bubble-chart");
        Plotly.restyle(BUBBLE, {
          y: [newdata.values.slice(0, 100)],
          x: [newdata.labels.slice(0, 100)]
      }, 0);
    }
  }

  function render(sampleID, first) {
    Promise.all([
      fetch(`/metadata/${sampleID}`).then(x => x.json()), //@app.route('/metadata/<sample>')
      fetch(`/wfreq/${sampleID}`).then(x => x.json()),    //@app.route('/wfreq/<sample>')
      fetch(`/samples/${sampleID}`).then(x => x.json())  //@app.route('/samples/<sample>')
    ]).then(function (a) {  //'a' = array of results of 3 promises above
        console.log("a[0]=", a[0])
        console.log("a[1]=", a[1])
        console.log("a[2]=", a[2])
        var list = document.getElementById('meta') //prints to webpage due to "meta" html tag
        list.innerHTML = "",  //clears list of the previous content from webpage before printing below
        console.log("after innerHTML")
        for (var x in a[0]) {   //This is for @app.route('/metadata/<sample>')
          var listElement = document.createElement('li')
          listElement.innerText = `${x}: ${a[0][x]}`
          list.appendChild(listElement)
          console.log("after appendChild")
          }
        // var s1 = "new" ; var s2 = `This is ${s} toy`; //back-ticks only; not quotes
        // console.log(s2) produces "This is new toy"
        // ${} is a way of printing a variable inside a string without using "" and +
      

        //PIE CHART CODE STARTS//

        var data = {
          values: a[2][0].sample_values,
          labels: a[2][0].otu_id,
        }    

        updatePlotly(data, first);
        updateBubblePlotly(data, first)

       // PIE CHART CODE ENDS//

       // WASH FREQ DIAL CODE STARTS //
        // document.getElementById("gauge").innerHTML = "Washing Frequency =" + a[1]
        if (first){
          g = new JustGage({
            id: "gauge",
            value: a[1],
            min: 0,
            max: 10,
            title: "Wash Frequency: 0-3 low | 4-6 ok | 7-10 Good"
          });
        } else{
          g.refresh(a[1], 10)
        }
            
        console.log(Object.keys(g))
        // WASH FREQ DIAL CODE ENDS //
        })
    }
  
init();


