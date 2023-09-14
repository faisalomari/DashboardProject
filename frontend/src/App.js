import logo from './logo.svg';
import './App.css';
import PieChart from './charts/PieChart'
import PerXScatter from './charts/PerXScatter';
import MsgTable from './helpComps/MsgTable';

const arr= [
  {
    "x": "2023-09-02T18:00:00.093Z",
    "y": 1
},
{
    "x": "2023-09-02T18:15:00.093Z",
    "y": 1
},
{
    "x": "2023-09-02T18:30:00.093Z",
    "y": 1
},
{
    "x": "2023-09-02T18:45:00.093Z",
    "y": 2
},
{
    "x": "2023-09-02T19:00:00.093Z",
    "y": 1
}
]
const msgs=[
  {
    "message": "TRACE [main] org.apache.hadoop.mapreduce.v2.app.MRAppMaster: Created MRApp",
    "date": "2023-09-02T19:00:01.093Z"
},
{
    "message": "warn [main] org.apache.hadoop.mapreduce.v2.app.MRAppMaster: Created MRApp",
    "date": "2023-09-02T18:55:01.093Z"
},
{
    "message": "INFO [main] org.apache.hadoop.mapreduce.v2.app.MRAppMaster: Created MRApp",
    "date": "2023-09-02T18:45:01.093Z"
},
{
    "message": "EXECPTION [main] org.apache.hadoop.mapreduce.v2.app.MRAppMaster: Created MRApp",
    "date": "2023-09-02T18:30:01.093Z"
},
{
    "message": "FATAL [main] org.apache.hadoop.mapreduce.v2.app.MRAppMaster: Created MRApp",
    "date": "2023-09-02T18:15:01.093Z"
},
{
    "message": "INFO [main] org.apache.hadoop.mapreduce.v2.app.MRAppMaster: Created MRApp",
    "date": "2023-09-02T18:00:00.093Z"
}
]
let arr2=[
  {
    "y": 2,
    "name": "Application Events",
    "rate": "33.33"
},
{
    "y": 2,
    "name": "Error",
    "rate": "33.33"
},
{
    "y": 1,
    "name": "Warning",
    "rate": "16.67"
},
{
    "y": 1,
    "name": "All",
    "rate": "16.67"
}
]
function App() {
  const divStyle = {
    width: '50%'
  };
  return (
    <>
    <div style={divStyle}>
    <MsgTable msgs={msgs}/>
    <PerXScatter arr={arr}/>
    <PieChart arr={arr2}/>
    </div>
    </>
  );
}

export default App;
