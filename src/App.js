import React from 'react';
import axios from 'axios';
import './assets/css/App.css';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      bg: ['',''],
      dayAbbreviation: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      day: 0,
      UV: 0,
      uvIndex:['Low', 'Moderate', 'High', 'Very High','Extreme'],
      safeExposureTime: null
    }
    this.UVIndex = this.UVIndex.bind(this);
  }

  UNSAFE_componentWillMount(){
    let today = new Date();
    let time = today.getHours();
    let day = today.getDay();
    let bg = []
    
    if(time >= 10 && time <= 15){
       bg[0] = '#FF512F';
       bg[1] = '#F09819';
    }

    if((time > 15 && time < 19) || (time > 4 && time < 10)){
      bg[0] = '#e96443';
      bg[1] = '#904e95';
    }

    if((time >= 19) || (time >= 0 && time < 4)){
      bg[0] = '#232526';
      bg[1] = '#414345';
    }
    this.setState({
      bg: bg,
      day: day
    })
  }

  async componentDidMount(){
   
    await axios({
      method: 'get',
      url: 'https://api.openuv.io/api/v1/uv?lat=-21.788857&lng=-46.561738',
      headers: {
        'x-access-token': 'd4e3f115fe835eceb4bd093a40f6dd52'
      }
    })
      .then(response => {
        //console.log(response)
        console.log('Call made from OpenUV');
        this.setState({
          UV: response.data.result.uv,
          safeExposureTime: response.data.result.safe_exposure_time.st1
        })
      })
      .catch(e => {
        console.log(e)
        axios({
          method: 'get',
          url: 'http://api.openweathermap.org/data/2.5/uvi?appid=6bcd0eba4e6df52cd7f4063ec2be86ae&lat=-21.788857&lon=-46.561738',
        })
          .then(response => {
            //console.log(response)
            console.log('Call made from OpenWeather');
            this.setState({
              UV: response.data.value,
            })
          })
          .catch(e => {
            console.log(e)
          })
      })
  }

  UVIndex(){
    if(this.state.UV < 3){
      return this.state.uvIndex[0]
    }

    if(this.state.UV < 6){
      return this.state.uvIndex[1]
    }

    if(this.state.UV < 8){
      return this.state.uvIndex[2]
    }

    if(this.state.UV < 11){
      return this.state.uvIndex[3]
    }

    if(this.state.UV >= 11){
      return this.state.uvIndex[4]
    }
  }

  exposureTime(){
    const minutes = this.state.safeExposureTime;

   if(minutes === null)
     return "You can be safely exposed indefinitely.";

     if(minutes < 1)
      return "You can't be safely exposed.";
  
    if(minutes === 1)
      return "You can be safely exposed for "+minutes+" minute.";
    
    if(minutes >= 120){
      return "You can be safely exposed for more than "+Math.floor(minutes/60)+" hours.";
    }

    if(minutes > 1)
      return "You can be safely exposed for "+minutes+" minutes.";
    

  }

  render (){
    return (
      <div className="App" style={{background: 'linear-gradient(to right bottom,'+this.state.bg[0]+','+this.state.bg[1]+')'}}>
        <div className="data-wrapper">
          <div className="data">
            <h3>{this.state.dayAbbreviation[this.state.day - 1]}</h3>
            <h2>{Math.floor(this.state.UV)} UV</h2>
            <span>{this.UVIndex()}</span>
            <span className="exposure">{this.exposureTime()}</span> 
          </div>
        </div>
      </div>
    );
  }
}

export default App;
