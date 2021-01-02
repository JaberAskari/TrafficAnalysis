import React, { Component } from 'react'  
import axios from "axios";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const lamPointList=[]
var pointsData=[];

const provinceCodes = {
    1:[1,5,7],
    2:[2,4],
    3:[8,9],
    4:[6],
    8:[11,10,12],
    9:[13],
    10:[14,15,16],
    12:[17,18],
    14:[19],
}

export class LAMpoints extends Component {  

    constructor(props) {  
        super(props);  
        //creating a ref
        this.lamIDref= React.createRef();

        this.state = {
            
            ID:[],
            address :[],

            msg:'',
            selected : '',

            ready : false,
            endDayDisabled : true,

            years:[],
            months:[],
            days:[],
            info:{},
            selectedYear: 0,
            selectedMonth: 0,
            selectedDay:0,
            selectedEndDay:0
        };  
    }  

    componentDidMount(){
        const url = "https://tie.digitraffic.fi/api/v3/metadata/tms-stations";
        axios.get(url)
        .then(res =>{ 
            //console.log({status});

            if(res.status===200){

                const features = res.data.features;
                //const LamPointsTotalNumber = features.length;
                //console.log(LamPointsTotalNumber);
                features.forEach(element => {
                    let lamPoint={
                         id : element.properties.tmsNumber,
                         name : element.properties.name,
                         status :element.properties.collectionStatus,
                         coordinatesETRS89 :element.properties.coordinatesETRS89,
                         address :element.properties.names,
                         municipality :element.properties.municipality +' '+element.properties.municipalityCode,
                         province : element.properties.province,
                         provinceCode : element.properties.provinceCode,
                         direction1 : element.properties.direction1Municipality,
                         direction2 : element.properties.direction2Municipality,
                         startTime : element.properties.startTime,
                    };
                    lamPointList.push(lamPoint);    
                });            
            }else{

            }

        }).catch(err => {
            console.log(err);
            alert(err)
        })
    }

    areaIDHandler=(e)=>{
       pointsData=[];
       let address=[];
       let ID=[];
       let areaID = parseInt( e.target.value);

       lamPointList.forEach(element => {

           let provinceCode = parseInt( element.provinceCode);
           
            if(provinceCodes[areaID].length > 1){
                
                for(let x =0; x<provinceCodes[areaID].length;x++){

                    if(provinceCode === provinceCodes[areaID][x]){
                        pointsData.push(element);
                        address.push(element.address.en);
                        ID.push(element.id);
                    }
                } 
            }else{
                if(provinceCode === provinceCodes[areaID][0]){
                    pointsData.push(element);
                    address.push(element.address.en);
                    ID.push(element.id);
                }
            }   
       });
        
        this.setState({address,ID},()=>{
            this.checkInputDate();
        });

          //triggering the lamIDHandler to set the new lam point and update info in state
          if(this.state.info['id'] !== undefined){
            this.setState({selected : '', info:{}},()=>{
            });
        } 
        
        //setting the props and sending information to parent component
        this.props.SelectedAreaID(e.target.value);
    }

    lamIDHandler=(e)=>{
        let pointID ;
        if(e.target !== undefined) {
            pointID =parseInt(e.target.value);
            
        }

        let info = {};
        //getting the selected lam point information
        pointsData.forEach(element => {
            if(element.id===pointID){
                info = element;
            }
        });
        //getting the time lam point start working
        let startTime = info.startTime;
        let startYear =parseInt((startTime.split('-'))[0]);

        //todays date and year
        let now = Date().toString();
        let thisYear = parseInt((now.split(' '))[3])
        
        let yearsActive=[]
        for(let x=thisYear;x>=startYear;x--){
            yearsActive.push(x);
        }
        this.setState({info, years : yearsActive, selected : pointID},()=>{
            this.checkInputDate()
        });          
        this.props.info(info);
        //console.log({info})
    }

    yearHandler=(e)=>{
        var selectedYear = parseInt(e.target.value);
        this.setState({ selectedYear},this.checkInputDate());
        //console.log(months)
        this.props.selectedYear(selectedYear);
    }

    monthHandler=(e)=>{
        var selectedMonth = e.target.value;
     
         var daysOfMonths = [31,28,31,30,31,30,31,31,30,31,30];
         var nameOfMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        // //check for leap year
        var leap = this.leapyear(this.state.selectedYear);
        if(leap) daysOfMonths[1]=29;

        // //getting how many number of day the selected month has
        let temp=0;

        nameOfMonths.map((v,i)=>{
            if(parseInt(selectedMonth)===i) {
                temp = daysOfMonths[i];
            }
            return ''
        });

        var days =[];
        for(let x = 1; x<=temp;x++){
                    days.push(x);
        }

        this.setState({selectedMonth,days},this.checkInputDate());
        this.props.selectedMonth(selectedMonth);

    }
    dayHandler=(e)=>{
        var selectedDay = e.target.value;
        this.setState({selectedDay},()=>{
            //console.log(this.state);
            this.checkInputDate();
        });
        this.props.selectedDay(selectedDay);
    }


    endDayHandler=(e)=>{
        var selectedEndDay = e.target.value;
        this.setState({selectedEndDay},()=>{
            //console.log(this.state);
            this.checkInputDate();
        });
        this.props.selectedEndDay(selectedEndDay);
    }

    checkInputDate = ()=>{
        let year = this.state.selectedYear;
        let month = this.state.selectedMonth;
        let day = this.state.selectedDay;
        let startTimeStr = this.state.info.startTime;

        if(year!==0 && month!==0 && day!==0 && startTimeStr !==undefined){
            this.setState({msg : `` })
            let startDate = new Date(startTimeStr);
            let startTime = startDate.getTime();

            let selectedDate = new Date(year,month,day);
            let selectedTime = selectedDate.getTime();

            let todayDate =  new Date()
            let todayTime = todayDate.getTime();

            if(selectedTime < startTime){
                this.setState({msg : `Invalid date, Date can not be before ${startDate}`, ready : false }
                ,()=>{
                    let isReady = this.state.ready;
                    this.props.ready(isReady)
                })
            }

            if(selectedTime > todayTime){
                var yesterday = new Date(Date.now() - 864e5);
                this.setState({msg : `Invalid date, date can not be in future of today! ${yesterday}`, ready : false }
                ,()=>{
                    let isReady = this.state.ready;
                    this.props.ready(isReady)
                })
            }

            if(selectedTime > startTime  && selectedTime < todayTime) {

                this.setState({msg : ``,ready:true},()=>{
                    let isReady = this.state.ready;
                    this.props.ready(isReady)
                })
            }
         
        }else {
            this.setState({ready : false },()=>{
                let isReady = this.state.ready;
                this.props.ready(isReady)
            });
        }
    }

    leapyear=(year)=> {
        return year % 100 === 0 ? year % 400 === 0 : year % 4 === 0;
      }
  
    render() {  
        var ids = this.state.ID;
        var address = this.state.address;
        var nameOfMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return (
          <div>
            <div style={{ fontSize: 16, color: "#eb4034" }}>
              {this.state.msg}
            </div>
            <Form>
              <Form.Label
                className="my-1 mr-2"
                htmlFor="inlineFormCustomSelectPref"
              >
                <h5>TMS Station:</h5>
              </Form.Label>
              <br></br> <br></br>
              <div style={{ marginBottom: 20 }}>
                <Form.Label
                  className="my-1 mr-2"
                  htmlFor="inlineFormCustomSelectPref"
                >
                  Choose an Area
                </Form.Label>
                <Form.Control
                  as="select"
                  className="my-1 mr-sm-2"
                  id="areaID"
                  custom
                  onChange={this.areaIDHandler}
                >
                  <option value="">Choose...</option>
                  <option value="01">Uusimaa, Häme</option>
                  <option value="02">Varsinais-Suomi, Satakunta</option>
                  <option value="03">Kaakkois-Suomi</option>
                  <option value="04">Pirkanmaa</option>
                  <option value="08">
                    Pohjois-Savo, Etelä-Savo, Pohjois-Karjala
                  </option>
                  <option value="09">Keski-Suomi</option>
                  <option value="10">Etelä-Pohjanmaa, Pohjanmaa</option>
                  <option value="12">Pohjois-Pohjanmaa, Kainuu</option>
                  <option value="14">Lappi</option>
                </Form.Control>
              </div>

              <div style={{ marginBottom: 20 }}>
              <Form.Label
                className="my-1 mr-2"
                htmlFor="inlineFormCustomSelectPref"
              >
                LAM point ID
              </Form.Label>
              <Form.Control
                as="select"
                className="my-1 mr-sm-2"
                id="lamID"
                custom
                onChange={this.lamIDHandler}
                ref={this.lamIDref}
                value={this.state.selected}
              >
                <option value="">Choose...</option>
                {
                  // //React.Children.map(address, (v,i)=>
                  //     <option value={ids[i]}>{v}</option>
                  // )
                  React.Children.map(ids, (v, i) => (
                    <option value={v}>{v + " " + address[i]}</option>
                  ))
                }
              </Form.Control>
              </div>
              <div style={{ marginBottom: 20 }}>
              <Form.Label
                className="my-1 mr-2"
                htmlFor="inlineFormCustomSelectPref"
              >
                Year
              </Form.Label>
              <Form.Control
                as="select"
                className="my-1 mr-sm-2"
                id="year"
                custom
                onChange={this.yearHandler}
              >
                <option value="">Choose...</option>
                {React.Children.map(this.state.years, (year) => (
                  <option value={year}>{year}</option>
                ))}
              </Form.Control>
              </div>
              <div style={{ marginBottom: 20 }}>
              <Form.Label
                className="my-1 mr-2"
                htmlFor="inlineFormCustomSelectPref"
              >
                Month
              </Form.Label>
              <Form.Control
                as="select"
                className="my-1 mr-sm-2"
                id="month"
                custom
                onChange={this.monthHandler}
              >
                <option value="">Choose...</option>
                {React.Children.map(nameOfMonths, (month, i) => (
                  <option value={i}>{month}</option>
                ))}
                
              </Form.Control>
              </div>
              <div style={{ marginBottom: 20 }}>

              <Row>
                <Col>
                  <Form.Label
                    className="my-1 mr-2"
                    htmlFor="inlineFormCustomSelectPref"
                  >
                    Start day
                  </Form.Label>
                  <Form.Control
                    as="select"
                    className="my-1 mr-sm-2"
                    id="day"
                    custom
                    onChange={this.dayHandler}
                  >
                    <option value="">Choose...</option>
                    {React.Children.map(this.state.days, (day) => (
                      <option value={day}>{day}</option>
                    ))}
                  </Form.Control>
                </Col>

                <Col>
                  <Form.Label
                    className="my-1 mr-2"
                    htmlFor="inlineFormCustomSelectPref"
                  >
                    End day
                  </Form.Label>
                  <Form.Control
                    as="select"
                    className="my-1 mr-sm-2"
                    id="endDay"
                    custom
                    onChange={this.endDayHandler}
                    disabled={this.props.endDayDisabled}
                  >
                    <option value="">Choose...</option>
                    {React.Children.map(this.state.days, (day) => (
                      <option value={day}>{day}</option>
                    ))}
                  </Form.Control>
                </Col>
              </Row>
              </div>
              
             
            </Form>
          </div>
        );  
    }  
}  
 

export default LAMpoints;  