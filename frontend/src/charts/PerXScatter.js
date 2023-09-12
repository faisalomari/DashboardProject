import CanvasJSReact from '@canvasjs/react-charts';
import { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;


function PerXScatter({arr}){

    useEffect(() => {
        arr.map((ele)=>(ele["x"]=new Date(ele["x"])));
      }, []);

      const [chartType, setChartType] = useState("scatter");

      const options = {
        theme: "light1",
        animationEnabled: true,
        zoomEnabled: true,
        axisX: {
            title:"the time",
            crosshair: {
                enabled: true,
                snapToDataPoint: true
            }
        },
        axisY:{
            title: "number of occurrences",
            crosshair: {
                enabled: true,
                snapToDataPoint: true
            }
        },
        data: [{
            type: chartType,
            markerSize: 15,
            toolTipContent: "number of occurrences: {y}",
            dataPoints: arr
        }]
    }
        return (
            <>
             <select onChange={(event) => {
    setChartType(event.target.value)}}>
             <option value="scatter">scatter</option>
             <option value="spline">spline</option>
             </select>
            <div>
                {<CanvasJSChart options = {options} />}
            </div>
            </>
            );
}
export default PerXScatter;