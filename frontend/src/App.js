import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Registration from "./component/auth/Registration";
import {Home} from "./component/basic/basic_main/Home";
import Header from "./component/basic/basic_main/Header";
import GrowGuideCard from "./component/grow_guides/GrowGuideCard";
import VegetablePage from "./component/grow_guides/vegetable/VegetablePage";
import Weather from "./component/weather/Weather";


import './stylesheet/App.css';
import './stylesheet/weather/Weather_forecast.css';
import './stylesheet/grow_guide/Grow_Guides.css';
import './stylesheet/grow_guide/VegetableInfo.css';


function App() {
  return (
      <Router>
          <div>
            <Header />
            <div className="main-container">
                <Route exact path="/" component={Home}/>
                <Route exact path="/grow-guides" component={GrowGuideCard}/>
                <Route path="/grow-guides/:vegetableName" component={VegetablePage}/>
                <Route exact path="/weather-forecast" component={Weather} />
                <Route exact path="/register" component={Registration} />
                <Route exact path="/login" component={Login} />
            </div>
          </div>
      </Router>
  );
}

export default App;
