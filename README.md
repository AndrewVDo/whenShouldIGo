When Should I Go?
Website that helps users find the best month to travel to
a particular destination.

# React Frontend
React allows for responive web-design and the home page
will show the following options:
1. location (from, to) (TRAVEL HACKING TOOL API)
2. desired weather (hot/cool/cold, sun/rain/snow)
3. time frame (next year/6months/month)
Submit REST request to python server through HTTP

# Python Server
Python responds to REST request by gathering data for user query:
1. Climate Forecast     (tbd API/destination/time-frame)
2. Currency Forecast    (Fixer API/departure/destination/time-frame)
3. Flight Prices        (Skyscanner API/departure/destination/time-frame)
4. Hotel Prices         (Hotels API/destination/time-frame)
Python server will then call a C++ (Boost.Python wrapped) function to 
perform a calculation determining the best time to travel.

# C++ Application
Boost.Python wrapped C++ program, which allows python to call it
Will take data collected by the python server and perform forecasting
based on historical data and actual prices, it returns 
4 x Monthly-segmented scoring vectors (one for each category).

# Response
Python will return the scoring vectors along with a summary of the
data back to the frontend, where it will be presented to the user.
User gets:
    recommendation of when to travel based on:
        optimum currency rate
        optimum flight price
        optimum weather
    destination on map (MapBox API)

# Deployment
Deployment with docker containers, 2 required 
(3 if C++ can't share with python container).
