import logo from './logo.svg';
import './App.css';
import PieChart from './charts/PieChart'
import PerXScatter from './charts/PerXScatter';


const arr= [
  {
      "x": "2023-09-02T18:00:00.000Z",
      "y": 1
  },
  {
      "x": "2023-09-02T18:15:00.000Z",
      "y": 1
  },
  {
      "x": "2023-09-02T18:30:00.000Z",
      "y": 0
  },
  {
      "x": "2023-09-02T18:45:00.000Z",
      "y": 1
  },
  {
      "x": "2023-09-02T19:00:00.000Z",
      "y": 0
  }
]
function App() {
  const divStyle = {
    width: '50%'
  };
  return (
    <>
    <div style={divStyle}>
    <PerXScatter arr={arr}/>
    <PerXScatter arr={arr}/>
    <PerXScatter arr={arr}/>
    </div>
    </>
  );
}

export default App;
