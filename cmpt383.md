When Should I Go?
Website that helps users find the best month to travel to
a particular destination.

# React Frontend
React allows for responive web-design and the home page
will show the following options:
1. location (from, to) (TRAVEL HACKING TOOL API)
2. desired weather (hot/cool/cold, sun/rain)
Submit REST request to python server through HTTP

# Python Server
Python responds to REST request by gathering data for user query:
1. Climate Forecast     (tbd API/destination/time-frame)
2. Currency Forecast    (Fixer API/departure/destination/time-frame)
3. Flight Prices        (Skyscanner API/departure/destination/time-frame)
Python server will then call a C functions to 
perform a calculation determining the best time to travel.
Frequently called APIs are cached to a MongoDB database.

# C Application
Pyton to C shared object file, which allows python to call it
Will take data collected by the python server and perform forecasting
based on historical data and actual prices, it returns 

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
Please run "docker-compose up"
And visit "localhost:3000" in a webbrowser
