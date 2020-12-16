import React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

import HomeForm from './HomeForm'
import Result from './Result'

class Root extends React.Component {    
    render() {
        return(
            <Router>
                <Switch>
                    <Route path='/whenShouldIGo' render={(props) => <Result {...props}/>}/>
                    <Route path='/'>
                        <HomeForm></HomeForm>
                    </Route>
                </Switch>
            </Router>
        )
    }
}

export default Root;