import React, { useEffect, useState, useRef } from 'react';

import './Histogram.css';

type dataPoint = {
  price: number
}
type PropsType = {
  data: dataPoint[]
}




// https://www.d3-graph-gallery.com/graph/histogram_basic.html
const Histogram: React.FC<PropsType> = (props) => {
  const d3 = window.d3;
  const id = `Histogram-${new Date().getTime()}-${Math.round(1000*Math.random())}`;
  const idRef = React.createRef<HTMLDivElement>();
  const [lastProps, setLastProps] = useState<PropsType>(props);
  const [stateData, setStateData] = useState<dataPoint[]>([]);
  const [nBins, setNBins] = useState<number>(20);


  const marginRef = useRef({top: 10, right: 30, bottom: 30, left: 40});
  const widthRef = useRef(460 - marginRef.current.left - marginRef.current.right);
  const heighthRef = useRef(460 - marginRef.current.top - marginRef.current.bottom);

  let xAxisRef = useRef<d3.Selection<SVGGElement, unknown, null, undefined>>();
  let xScaleRef = useRef<d3.ScaleLinear<number, number>>();
  let yAxisRef = useRef<d3.Selection<SVGGElement, unknown, null, undefined>>();
  let yScaleRef = useRef<d3.ScaleLinear<number, number>>();
  let svgRef = useRef<d3.Selection<SVGGElement, unknown, null, undefined>>();

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

    !(svgRef.current) && setupGraph();

    // Initialize with 20 bins
    (svgRef.current) && updateGraph(nBins)


  }, [stateData, nBins])








  // A function that builds the graph for a specific value of bin
  var updateGraph = (nBin: number) => {

    // set the parameters for the histogram
    var histogram = d3.histogram()
                        .value(function(d:any) { return d.price; })   // I need to give the vector of value
                        .domain( (xScaleRef.current && xScaleRef.current.domain()) as [number, number])  // then the domain of the graphic
                        .thresholds( (xScaleRef.current && xScaleRef.current.ticks(nBin)) as number[]); // then the numbers of bins

    // And apply this function to data to get the bins
    var bins = histogram(stateData as unknown as Array<number>);



    // Y axis: update now that we know the domain
    yScaleRef.current && yScaleRef.current.domain([0, d3.max(bins, function(d:any) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
    yScaleRef.current && yAxisRef.current && yAxisRef.current.transition()
                                                      .duration(1000)
                                                      .call(d3.axisLeft(yScaleRef.current));

    // Join the rect with the bins data
    var joins:d3.Selection<d3.BaseType, d3.Bin<number, number>, SVGGElement, unknown> | undefined | undefined 
    joins = svgRef.current && svgRef.current.selectAll("rect")
                                            .data(bins)

    // Manage the existing bars and eventually the new ones:
    joins && joins.enter()
                  .append("rect") // Add a new rect for each new elements
                  .merge(joins as any) // get the already existing elements as well
                  .transition() // and apply changes to all of them
                  .duration(1000)
                    .attr("x", 1)
                    .attr("transform", (d:any)=>"translate(" + (xScaleRef.current ? xScaleRef.current(d.x0) : 0) + "," + (yScaleRef.current ? yScaleRef.current(d.length) : 0) + ")")
                    .attr("width",  (d:any)=> (xScaleRef.current ? xScaleRef.current(d.x1) : 20) - (xScaleRef.current ? xScaleRef.current(d.x0) : 0) - 1)
                    .attr("height", (d:any)=> heighthRef.current - (yScaleRef.current ? yScaleRef.current(d.length) : 0))
                    .style("fill", "#69b3a2")


    // If less bar in the new histogram, I delete the ones not in use anymore
    joins && joins.exit()
                  .remove()

  }


  var setupGraph = () => {



    // append the svg object to the body of the page
    !(svgRef.current) && (svgRef.current = d3.select(idRef.current)
                                              .append("svg")
                                                .attr("width", widthRef.current + marginRef.current.left + marginRef.current.right)
                                                .attr("height", heighthRef.current + marginRef.current.top + marginRef.current.bottom)
                                              .append("g")
                                                .attr("transform",
                                                      "translate(" + marginRef.current.left + "," + marginRef.current.top + ")"));
  
    // X axis: scale and draw:
    xScaleRef.current = d3.scaleLinear()
                          .domain([0, 1000])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
                          .range([0, widthRef.current]);
    
    svgRef.current && svgRef.current.append("g")
                                      .attr("transform", "translate(0," + heighthRef.current + ")")
                                      .call(d3.axisBottom(xScaleRef.current));
  
    // Y axis: initialization
    yScaleRef.current = d3.scaleLinear()
                          .range([heighthRef.current, 0]);
    yAxisRef.current = svgRef.current && svgRef.current.append("g");
    
  }


  return (
    <div className="histogram-wrapper">
      <div className={`Histogram `} id={id} ref={idRef}>
      </div>
      <p>
        <label># bins</label>
        <input type="number" min="1" max="100" step="30" value={nBins} onChange={(evt)=>setNBins(parseInt(evt.target.value))} id="nBin"/>
      </p>
    </div>

  );
}

export default Histogram;