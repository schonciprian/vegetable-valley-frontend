import React from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";

import Registration from "./component/auth/Registration";
import Login from "./component/auth/Login";
import Profile from "./component/basic/basic_main/profile/Profile";
import {Home} from "./component/basic/basic_main/Home";
import Header from "./component/basic/basic_main/Header";
import GrowGuideCard from "./component/grow_guides/GrowGuideCard";
import VegetablePage from "./component/grow_guides/vegetable_page/VegetablePage";
import Weather from "./component/weather-forecast/weather/Weather";


import './stylesheet/App.css';
import {SelectedTypeListProvider} from "./context/SelectedTypeListContext";
import {LoadingProvider} from "./context/LoadingContext";
import {UserProvider} from "./context/User";
import {WeatherForecastDataProvider} from "./context/WeatherForecastDataContext";
import Charts from "./component/weather-forecast/charts/Charts";


function App() {
    return (
        <Router>
            <UserProvider>
                <div>
                    <Header/>
                    <div className="main-container">
                        <Route exact path="/" component={Home}/>

                        <LoadingProvider>
                            <SelectedTypeListProvider>
                                <Route exact path="/grow-guides" component={GrowGuideCard}/>
                                <Route path="/grow-guides/:vegetableName" component={VegetablePage}/>
                            </SelectedTypeListProvider>

                            <WeatherForecastDataProvider>
                                <Route exact path="/weather" component={Weather}/>
                                <Route exact path="/charts" component={Charts}/>
                            </WeatherForecastDataProvider>
                        </LoadingProvider>

                        <Route exact path="/profile" component={Profile}/>
                        <Route exact path="/register" component={Registration}/>
                        <Route exact path="/login" component={Login}/>
                    </div>
                </div>
            </UserProvider>
        </Router>
    );
}

export default App;
