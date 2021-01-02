Heavy Traffic Analysis<br/>
Summer internship 2020<br/>
Jaber Askari<br/>
October 2020<br/>
Jamk University of Applied Science<br/>
ICT, Programming<br/>

# Table of Contents
[Introduction](https://github.com/JaberAskari/TrafficAnalysis#introduction)  
[What has been done](https://github.com/JaberAskari/TrafficAnalysis#what-has-been-done)  
[Road Traffic](https://github.com/JaberAskari/TrafficAnalysis#road-traffic)  
[Heavy train traffic](https://github.com/JaberAskari/TrafficAnalysis#heavy-train-traffic)  
[Challenges](https://github.com/JaberAskari/TrafficAnalysis#challenges)  
[Future development](https://github.com/JaberAskari/TrafficAnalysis#future-development)  
[What I have learnd](https://github.com/JaberAskari/TrafficAnalysis#future-development#what-i-have-learnd)  

# Introduction

This project was a summer internship project for JAMK university of applied science. The subject was to figure out the amount of heavy traffic in Finland using open data offered by Finnish Transport Infrastructure Agency (vayla.fi) and Traffic Management Finland (digitraffic.fi).
The goal of the project was to analyze the amount of road traffic, heavy marine traffic at harbors, heavy train traffic and airplane traffic. This can make it possible to be able to create good perspective of total heavy traffic in whole Finland. But the parts, that could be achieved, and implemented were road traffic and heavy train traffic.

# What has been done

At the beginning of the project I read though all the links, open data and APIs that were offering open and free data about traffic in Finland. The main source was the open data files offered by Finnish Transport Infrastructure Agency and API in digitraffic.fi offered by Traffic Management Finland.<br/>
The technologies that have been used for developing this project are as follow:<br/>

- React js: used for developing frontend and interface
- Node js/Express: used for backend part and server
- Python: Pandas library from python is used to analyze data from each Transport Measurement System (TMS) points. 
<br/>
The project workflow is like when a user selects a TMS point and date a request containing the user input data will be sent to backend server. In backend the data will be checked and validated and then sent to python to run the analysis. In python the input data will construct a URL pointing to the right file (offered by vayla.fi open data) of the selected TMS location. Each TMS location has a csv file for everyday of year. Python uses the Pandas library to analyze the file and returns traffic amount and average speed of the location and send it back to the frontend as a json file. Then the frontend will visualize the received data as graphs for user.
<br/>
This project can be divided into 2 main parts, road traffic and heavy train traffic.

## Road Traffic

This part uses open data from Finnish Transport Agency (vayla.fi). The Finnish Transport Agency collects data about road traffic using an automatic traffic monitoring system (TMS, also referred as LAM). The data is shared both in raw form and as generated reports. Currently, there are about 500 traffic measuring stations in Finland. <br/>
In road traffic analysis that consumed most of the time spent on this project, analyzes amount of traffic and average speed using the data from 500 different TMS points across Finland in a specific time interval and location.<br/>
When a TMS point is selected the related data such as address, ID number, city, province, each direction destination, installation date, coordinates and status of the point will be visible for user to see in a table.<br/><br/>
**Filters:**<br/>
When a user selects a location and time to see the results, it is possible to filter the results based on user preference such as vehicle category and direction. By the help of these filters user can choose from 7 different vehicle categories to see the result of each of them individually. Also, user can choose to see the data only in one direction of street.<br/>
In default user will see the data for all vehicle types in both direction of street.<br/><br/>
**Sub menus**<br/>
The road traffic analysis has 4 sub menus as blow:<br/>

- One Day Analysis: Here user can select a location to see the amount of traffic and average speed of vehicles in each hour of the selected day (24 hours).
- Multiple Day Analysis: Here it is possible to select an interval of days (max 30 days) to see the amount of traffic in each individual day in the selected location.
- Compare 2 Days: In this sub menu user can choose 2 different locations and days to compare the traffic amount with each other in each hour of the selected days.
- Compare Multiple Days: Here user can choose 2 different locations and 2 different time intervals (max 30 days) to compare each day's traffic amount with each other.

## Heavy train traffic

This part of the project offers a map that shows all cargo train locations in real time across Finland. The necessary data for this purpose has been acquired through APIs in digitraffic.fi offered by Finnish Road, Railway and Marine Traffic.<br/>
The location of each train is achieved through onboard GPS device which updates each 15 seconds. Not all trains have onboard or active GPS devices, for this reason there is a No Coordinate tab, that contains information about today's active cargo trains.<br/>
Each cargo train is presented with a circle icon with its ID number in center and a green or red ring around it. Red ring means that the train is late or has been late today at some point. By clicking on a train icon, its information will appear in a side bar. In the side bar the station name that the train has been late, will appear in red text and the reason why the train was late will be there too.<br/>

# Challenges

The biggest challenges for this project were leading it to the right direction and find the right data for it. I took me around a week or two to find, read and understand the provided sources and links required for this project. Also, even when I finished the road traffic part, I was not sure if I had gone to right direction and it was until the last month of the project that my project was confirmed by my supervisor.<br/>
During the development of road traffic analysis, I had problem sending a big Json response to frontend. This problem was happening when user was selecting 30 days to analyze, and the app needed to analyze 30 individual files and send the total result back to user. Since the result was a big Json file, I was getting an error. I could solve the problem by streaming the result to frontend and sending the Json data as small chunks.<br/>
Another challenge happened when developing train traffic part. The application had a performance issue due to having too many subcomponents. Beside many other components the app has more than 100 custom dynamic icons for trains that were updating continuously. I could solve the problem by using some features of React js such as memorizing the components that do not change and changing the class components to Pure Components.<br/>

# Future development

In this internship I could not complete the project goal totally. I could do only road and train traffic part. Marine traffic and airplane traffic are missing from the project and might be continued in future.<br/>
Marine traffic and airplane traffic can be implemented in this application in the future to create a good perspective of heavy traffic all over Finland.<br/>
# What I have learnd
During this internship I realized the importance of planning, application’s structure and timing. I understood that if a project has not been planned properly it will take much longer to complete and a bad over all structure for application can result in having many bugs and performance issues. <br/>
Also, I could deepen my skills in React js, Node js, Express and Python that for sure will be helpful in my future working life.
