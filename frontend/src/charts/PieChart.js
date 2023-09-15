import CanvasJSReact from '@canvasjs/react-charts';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
function PieChart({arr,titleName}){
    
    const options = {
        animationEnabled: true,
        exportEnabled: true,
        theme: "dark1", // "light1", "dark1", "dark2"
        title:{
            text: titleName
        },
        data: [{
            type: "pie",
            indexLabel: "{name}: {rate}%",		
            startAngle: -90,
            dataPoints: arr
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