import CanvasJSReact from '@canvasjs/react-charts';
import { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;


function PerXScatter({arr,typeName}){

    /*useEffect(() => {
        {arr.map((ele)=>(ele["x"]=new Date(ele["x"])));}
      }, []);*/

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
            title: `number of ${typeName}`,
            crosshair: {
                enabled: true,
                snapToDataPoint: true
            }
        },
        data: [{
            type: chartType,
            markerSize: 15,
            toolTipContent: `numner of${typeName}: {y}`,
            dataPoints: arr
        }]
    }
        return (
            <>
             <select onChange={(event) => {
    setChartType(event.target.value)}} style={{ width: '200px', height: '40px' }}>
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