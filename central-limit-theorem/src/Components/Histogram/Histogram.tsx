import React, { useEffect, useState, useRef } from 'react';

import './Histogram.css';

type dataPoint = {
  price: number
}
type PropsType = {
  data: dataPoint[]
}


  // set the dimensions and margins of the graph
  



// https://www.d3-graph-gallery.com/graph/histogram_basic.html
const Histogram: React.FC<PropsType> = (props) => {
  const d3 = window.d3;
  const id = `Histogram-${new Date().getTime()}-${Math.round(1000*Math.random())}`;
  const idRef = React.createRef<HTMLDivElement>();
  const [lastProps, setLastProps] = useState<PropsType>(props);
  const [stateData, setStateData] = useState<dataPoint[]>([]);


  const marginRef = useRef({top: 10, right: 30, bottom: 30, left: 40});
  const widthRef = useRef(460 - marginRef.current.left - marginRef.current.right);
  const heighthRef = useRef(460 - marginRef.current.top - marginRef.current.bottom);


  let xAxisRef = useRef<d3.ScaleLinear<number, number>>();
  let yAxisRef = useRef<d3.ScaleLinear<number, number>>();
  let histogramRef = useRef<d3.HistogramGeneratorNumber<number, number>>();
  let svgRef = useRef<any>();

  if(JSON.stringify(lastProps) !== JSON.stringify(props)){
    
    setStateData(stateData => {
      const temp = [...stateData, ...props.data]
      console.log('Registering New Data', temp.length)
      return temp
    })
    setLastProps(props)

  }

  

  /**Setup Histogram - Only called once after first render */
  useEffect(()=>{
    console.log(idRef.current);

    // append the svg object to the body of the page
    svgRef.current = window.d3.select(idRef.current)
                              .append("svg")
                                  .attr("width", widthRef.current + marginRef.current .left + marginRef.current .right)
                                  .attr("height", heighthRef.current  + marginRef.current .top + marginRef.current .bottom)
                              .append("g")
                                .attr("transform", "translate(" + marginRef.current.left + "," + marginRef.current.top + ")");


    // X axis: scale and draw:
    xAxisRef.current = d3.scaleLinear()
                      .domain([0, 1000])     
                      .range([0, widthRef.current]);

    svgRef.current.append("g")
                    .attr("transform", "translate(0," + heighthRef.current + ")")
                    .call(d3.axisBottom(xAxisRef.current));

    // Y axis: scale and draw:
    yAxisRef.current = d3.scaleLinear()
                        .domain([0, 1000])
                        .range([heighthRef.current, 0]);

    svgRef.current.append("g")
                  .call(d3.axisLeft(yAxisRef.current));     


    // set the parameters for the histogram
    histogramRef.current = d3.histogram()
                              .value((d: any) => { return d.price; })   // I need to give the vector of value
                              .domain(xAxisRef.current.domain() as any)       // then the domain of the graphic
                              .thresholds(xAxisRef.current.ticks(70));        // then the numbers of bins
  }, [])


  
  useEffect(()=>{

    console.log('RePlotting...', stateData);

    if(histogramRef.current){
                              
      // And apply this function to data to get the bins
      var bins = histogramRef.current(stateData as any);
      console.log(bins);

      // xAxis.domain([0, d3.max(stateData, (d: any) => { return d.price; })]);   // d3.hist has to be called before the Y axis obviously
      yAxisRef.current && yAxisRef.current.domain([0, d3.max(bins, (d: any) => { return d.length; })]);   // d3.hist has to be called before the Y axis obviously

      console.log(yAxisRef.current && yAxisRef.current.domain())
      console.log(yAxisRef.current && yAxisRef.current)

      // append the bar rectangles to the svg element
      let joins = svgRef.current.selectAll("rect")
                                .data(bins);




      let newJoins = joins.enter()
                                    .append("rect")
                                      .attr("x", 1)
                                      .attr("transform", (d: any) => "translate(" + (xAxisRef.current && xAxisRef.current(d.x0)) + "," + (yAxisRef.current && yAxisRef.current(d.length)) + ")")
                                      .attr("width", (d: any)=> (xAxisRef.current && (xAxisRef.current(d.x1) - xAxisRef.current(d.x0) -1)))
                                      .attr("height", (d: any)=> {console.log(d, d.length, heighthRef.current, yAxisRef.current); return heighthRef.current - (yAxisRef.current ? yAxisRef.current(d.length) : 0)})
                                      .style("fill", "#69b3a2")
                          .merge(joins);//.transition().duration(500);
      console.log(joins)
      console.log(newJoins)
      // newJoins.merge(joins);//.transition().duration(500);
      console.log(joins)
      console.log(newJoins)



      console.log(joins)
      joins.exit()
           .remove();
      console.log(joins)
    }

    return ()=>{}
  }, [stateData]);


  return (
    <div className={`Histogram `} id={id} ref={idRef}>
    </div>
  );
}

export default Histogram;