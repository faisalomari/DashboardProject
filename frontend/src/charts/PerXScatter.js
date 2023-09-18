import CanvasJSReact from '@canvasjs/react-charts';
import { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import React from 'react';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;


function PerXScatter({ arr, typeName }) {
    const [chartType, setChartType] = useState("scatter");

    const options = {
        theme: "light1",
        animationEnabled: true,
        zoomEnabled: true,
        axisX: {
            title: "Period",
            crosshair: {
                enabled: true,
                snapToDataPoint: true
            }
        },
        axisY: {
            title: `Count Of ${typeName}`,
            crosshair: {
                enabled: true,
                snapToDataPoint: true
            }
        },
        title: {
            text: typeName + " Occurrences"
        },
        data: [{
            type: chartType,
            markerSize: 15,
            toolTipContent: `Count Of${typeName}: {y}`,
            dataPoints: arr
        }]
    }
    return (
        <>
            <div style={{ textAlign: 'center', boxShadow: '0,0,30px rgba(0,0,0,0.9)' }}>
                <select onChange={(event) => {
                    setChartType(event.target.value)
                }} style={{ width: '200px', height: '40px', margin: '8px' }}>
                    <option value="scatter">Scatter</option>
                    <option value="spline">Spline</option>
                </select>
                <div>
                    {<CanvasJSChart options={options} />}
                </div>
            </div>
        </>
    );
}
export default PerXScatter;