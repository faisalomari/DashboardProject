import { useEffect,useState } from "react";
import Select from 'react-select';
import '../helpCompsCss/dashboardCss.css'
import '../helpCompsCss/charts.css'
import PieChart from '../charts/PieChart'
import PerXScatter from '../charts/PerXScatter';
import MsgTable from './MsgTable';

function Dashboard()
{
       
    /*This Object will send To BackEnd.
        When The Page uploaded this obj will contain => {file_name: last file uploaded to the system, rules:[all rules], 
            From:oldest date, To: earliest date}
        otherwise, the user will choose a file, rules and dates
    */
    const[fileObj,setFileObj] = useState({
        file_name: '',
        rules : [],
        from: '',
        to: ''
    }); 
    
    /*
    Get Files Name Orderd by the date,
    the orderdfiles param is an array that contain the names of the files,
    filesAppear is a param that tell us if there is a files in the system.
    */
    const[filesAppear, setFilesAppear] = useState(false);
    const[orderdfiles, setOrderdfile] = useState ([]);
    const[dataFromBack,setDataFromBack] = useState([]);
    const getFilenames = async() => {
        try {
            const response = await fetch("http://localhost:5000/reports/")
            const jsonData = await response.json();
            if (jsonData.type  === 'empty'){setFilesAppear(true);}
            if (jsonData.type  === 'success') {
                setOrderdfile(jsonData.files);
                setFileObj((state) =>{
                    return{
                        ...state,
                        file_name:jsonData.files[0],
                    };
                });
            }
        } catch (err) {
            console.error(err.message);
        }
    }
    useEffect(()=> {
        getFilenames();
    }, []);


    /*
    get all Rules, oldest and earliest dates for specific file
    */
    const[first,setFirst] = useState(false);
    const getRulesAndDates = async() =>
    {
        try{
            const response = await fetch("http://localhost:5000/reports/"+fileObj.file_name);
            const jsonData = await response.json(); 
            if(jsonData.type === 'success')
            {
                setFileObj((state) => {
                    return{
                      ...state,
                      rules: jsonData.rules,
                      from: jsonData.From,
                      to: jsonData.To
                    };    
                });
                if (!first){setFirst(true);}
            }
        }catch(err){
            console.error(err.message);
        }
    }
    
    useEffect(()=> {
        if(fileObj.file_name !== '')
        {
            getRulesAndDates();
            setRuleSelected([]);
            setFromDate('');
            setToDate('');
        }
        
    }, [fileObj.file_name]);
    
    useEffect(()=> {
        if(first)
        {
            postHandlingData();
        }
    }, [first]);

    /*
    A function that update the file name that selected from the user to anlayze
    */
    const updateFileName = (event) =>
    {
        const name = event.target.name;
        const val = event.target.value;
        setFileObj((state)=> 
            {
                return{...state, [name] : val}
            });
    }

    /*
    rules and dates selected by the client
    */
    const[rulesSelected,setRuleSelected] = useState([]);
    const rulesOptions = (Array.isArray(fileObj.rules) && fileObj.rules.length > 0) && fileObj.rules.map((rule)=>({
        label: rule,
        value:rule
    }));
    const handleChange = (selectedValues) => {
        setRuleSelected(selectedValues);
    };
    const[fromDate,setFromDate] = useState('');
    const[toDate,setToDate] = useState('');
    const[sub,setSub]=useState(0);


    /*
    Handling and Post Data After the Client Filter and Submit
    */
    const submHandler = async (event) =>{

        event.preventDefault();
        if(rulesSelected.length > 0){
            let a = [];
            for(let i=0; i < rulesSelected.length; i++){a[i] = rulesSelected[i].label;}
            setFileObj((state) => {
                return{
                    ...state,
                    rules: a
                }
            });
        }
        if (fromDate !== '' && toDate !== '')
        {
            let d1 = convertStringDate(fromDate);
            let d2 = convertStringDate(toDate);
            let fromLimit = convertStringDate(fileObj.from);
            let toLimit = convertStringDate(fileObj.to);
            if (d1 >= fromLimit && d1 <= toLimit && d2 >= fromLimit && d2 <= toLimit && d1 <= d2)
            {
                setFileObj((state) => {
                    return{
                        ...state,
                        from: fromDate,
                        to: toDate
                    }
                });
            }
            else{
                alert("Invalid Dates Submitted, Try Again with Another Dates!");
                return;
            }   
        }
        if (fromDate !== '' && toDate === ''){
            let d1 = convertStringDate(fromDate);
            let fromLimit = convertStringDate(fileObj.from);
            let toLimit = convertStringDate(fileObj.to);
            if(d1 >= fromLimit && d1 <= toLimit){
                setFileObj((state) => {
                    return{
                        ...state,
                        from: fromDate,
                    }
                });
            }
            else{
                alert("Invalid Dates Submitted, Try Again with Another Dates!");
                return;
            }   
        }
        if (fromDate === '' && toDate !== ''){
            let d1 = convertStringDate(toDate);
            let fromLimit = convertStringDate(fileObj.from);
            let toLimit = convertStringDate(fileObj.to);
            if(d1 >= fromLimit && d1 <= toLimit){
                setFileObj((state) => {
                    return{
                        ...state,
                        to: toDate,
                    }
                });
            }
            else{
                alert("Invalid Dates Submitted, Try Again with Another Dates!");
                return;
            }   
        }
        const a = sub +1;
        setSub(a);
    }

    const convertStringDate = (mystr) => {
        let year = mystr.slice(0,4);
        let month = mystr.slice(5,7);
        let day = mystr.slice(8,10);
        let hour = mystr.slice(11,13);
        let min = mystr.slice(14,16);
        let sec = mystr.slice(17,19);
        const date = new Date(
            +year,
            +month - 1,
            +day,
            +hour,
            +min,
            +sec
        );
        return date;
    }

    useEffect(()=> {
        if(sub > 0)
        {
            postHandlingData();
        }
    }, [sub]);

    const postHandlingData = async() => {
        try{
            const response = await fetch("http://localhost:5000/reports/getData", {
              method: 'POST',
              headers: {'Content-Type': 'application/json',},
              body: JSON.stringify(fileObj)
            });
            console.log(fileObj);
            const jsonData = await response.json();
            jsonData["dataToFront"]["divideMessagesBy15Min"].map((ele)=>(ele["x"]=new Date(ele["x"])));
            jsonData["dataToFront"]["divideErrorsBy15Min"].map((ele)=>(ele["x"]=new Date(ele["x"])));
            jsonData["dataToFront"]["divideRankBy15Min"].map((ele)=>(ele["x"]=new Date(ele["x"])));
            setDataFromBack(await jsonData["dataToFront"]);
            console.log(dataFromBack);
        }catch(err) {
            console.error(err.message);
        }
    }
    
    return( 
        <>
        <div className="AllContainer">
            <div className='Body-Container'>
            <div className="chart-container">
      <div className="variables">
        {/* Render your variables here */}
        <div className="variable">number of total messages {dataFromBack["numberOfMessages"]} </div>
        <div className="variable">number of total Errors {dataFromBack["numberOfErrors"]}</div>
        <div className="variable">number of total High risk {dataFromBack["numberOfHigh"]}</div>
      </div>
      <div className="chart-row">
        {/* Render your charts here */}
        <div className="chart">{<PieChart arr={dataFromBack["rulesCounters"]}/>}</div>
        <div className="chart">{<PieChart arr={dataFromBack["rankCounters"]}/>}</div>
      </div>
      <div className="chart-row">
        {/* Render your charts here */}
        <div className="chart"><PerXScatter arr={dataFromBack["divideMessagesBy15Min"]} typeName={"messages"}/></div>
        <div className="chart"><PerXScatter arr={dataFromBack["divideErrorsBy15Min"]} typeName={"Errors"}/></div>
        <div className="chart"><PerXScatter arr={dataFromBack["divideRankBy15Min"]} typeName={"High risk"}/></div>
      </div>
      <div className="chart-row">
        <div className="chart">
            <table>
                <tr>
                    <th>message</th>
                    <th>date</th>
                </tr>
                {dataFromBack["lastXMessages"].map((msg)=> 
                <tr>
                    <td>{msg["message"]}</td>
                    <td>{msg["date"]}</td>
                </tr>)}
            </table>
        </div>
      </div>
    </div>
            </div>
            <div className="container">
                <div className="search-box">
                    <div className="Select-option">
                        <form onSubmit={submHandler}>
                            <div className="Search-Bar"> 
                            
                                <label> Choose File To Anlayse:
                                    <select name="file_name" value={fileObj.file_name} onChange={updateFileName}>
                                        {(Array.isArray(orderdfiles)  && orderdfiles.length > 0)&& orderdfiles.map(item=>(
                                            <option key={item} value={item}>{item}</option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                        
                            <div className="Select-Rules">             
                                <label>
                                    Select Rules:
                                    <Select className="custom-select" options={rulesOptions} isMulti={true} value={rulesSelected} onChange={handleChange}
                                            menuPlacement="bottom"
                                            menuPosition="fixed"
                                            />
                                </label>
                            </div> 
                            <div className="DateTime">
                                <label for="from">From:</label>
                                <input type="datetime-local" id="from" name="from" value={fromDate} onChange={(event)=> setFromDate(event.target.value)}></input>
                                <label for="to">To:</label>
                                <input type="datetime-local" id="to" name="to" value={toDate} onChange={(event)=> setToDate(event.target.value)}></input>
                            </div>
                            <input type="submit"></input>      
                        </form>
                        <button>Download Report</button>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default (Dashboard);
