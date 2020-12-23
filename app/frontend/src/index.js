import React from 'react';
import ReactDOM from 'react-dom';
import Root from './components/Root';
import './stylesheets/Home.css'
import BackgroundSlider from 'react-background-slider'
import reportWebVitals from './reportWebVitals';

import image1 from './images/1.jpg'
import image2 from './images/2.jpg'
import image3 from './images/3.jpg'
import image4 from './images/4.jpg'
import image5 from './images/5.jpg'
import image6 from './images/6.jpg'
import image7 from './images/7.jpg'
import image8 from './images/8.jpg'
import image9 from './images/9.jpg'
import image10 from './images/10.jpg'
import image11 from './images/11.jpg'
import image12 from './images/12.jpg'

ReactDOM.render(
  <React.StrictMode>
    <BackgroundSlider 
      className="bg-slider"
      images={[
        image1,
        image2,
        image3,
        image4,
        image5,
        image6,
        image7,
        image8,
        image9,
        image10,
        image11,
        image12,
      ]}
      duration={10}
      transition={2}
    />
    <Root />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
