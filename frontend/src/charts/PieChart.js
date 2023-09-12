import CanvasJSReact from '@canvasjs/react-charts';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
function PieChart({rulesCounters}){
    
    const options = {
        animationEnabled: true,
        exportEnabled: true,
        theme: "dark1", // "light1", "dark1", "dark2"
        data: [{
            type: "pie",
            indexLabel: "{rule}: {rate}%",		
            startAngle: -90,
            dataPoints: rulesCounters
        }]}
        return (
            <>
            <div>
                {<CanvasJSChart options = {options} />}
            </div>
            </>
            );
}
export default PieChart;