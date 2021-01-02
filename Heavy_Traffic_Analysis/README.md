# Project Subject

8. Tavara- ja raskaan liikenteen avoimet datalähteen

- Meriliikenteen (satamiin saapuvat laivat jne.) avoimen rajapintojen selvittäminen

- Raskaanliikenteen määrien selvittäminen satamien läheisyydessä olevien LAM-pisteiden avulla (LAM-pisteistä saa ajoneuvoluokat selville)

- Raskaanliikenteen liikennemäärät Suomessa (LAM-pisteet)

- Junaliikenteen rajapintojen selvittäminen (erityisesti tavaraliikenne)

- Lentoliikenne (onko avointa rajapintaa Suomessa (finavia)? Saako https://www.flightradar24.com jotakin irti, saapuvat rahtikoneet Helsinki-Vantaa?

# Road Traffic

## LAM reports

LAM reports can be found from the link:
https://aineistot.vayla.fi/lam/reports/
<br>
In LAM report general information and graphs and statistics of traffic in Finland can be found.

## LAM raw data

From the LAM raw data service you can get measurement data starting from year 1995. New data comes once a day at 03:00-04:00 AM.
There is around 500 LAM/TMS point across Finland that each of them gathers information about traffic of vehicles in that area. This data is being stored as csv file for each day
and are free to use.
When using the raw data of LAM points it should be considered that data of some days might be faulty or unavailable.

### Retrieving data

Getting raw data from a LAM/tms point needs the file's exact path and name in following format:
https://aineistot.vayla.fi/lam/rawdata/[year]/[ELY]/lamraw_[lam_id]_[yearshort]_[day_number].csv

where:

- year = year starting from 1995, or starting installation date
- ELY = ELY-L area number in 2 digits.
  note that Area numbers are different from the: http://www.tilastokeskus.fi/meta/luokitukset/ely/001-2019/index.html

  - 01 Uusimaa (contains also: Häme)<br/>
  - 02 Varsinais-Suomi (contains also: Satakunta)<br/>
  - 03 Kaakkois-Suomi<br/>
  - 04 Pirkanmaa<br/>
  - 08 Pohjois-Savo (contains also: Etelä-Savo and Pohjois-Karjala)<br/>
  - 09 Keski-Suomi<br/>
  - 10 Etelä-Pohjanmaa (contains also: Pohjanmaa)<br/>
  - 12 Pohjois-Pohjanmaa (contains also: Kainuu)<br/>
  - 14 Lappi<br/>

- lam_id = LAM point ID
- yearshort = 2 last digits of year
- day_number = day number from beginning of the year

for example the path for LAM point 101 in Uusimaa on 1.2.2017 will be :
https://aineistot.vayla.fi/lam/rawdata/2017/01/lamraw_101_17_32.csv

### Output file description

The output file will be in CSV format, where its headings are as follow:

- Point id
- year
- day number in year
- hour
- minute
- second
- 100th of a second
- length (m)
- lane
- direction
- vehicle class
- speed (km/h)
- faulty (0= valid, 1=incorrect)
- total time
- interval
- jonoalku

#### Vehicle classes

1 HA-PA (henkilö- tai pakettiauto)<br/>
2 KAIP (kuorma-auto ilman perävaunua)<br/>
3 Linja-autot<br/>
4 KAPP (kuorma-auto ja puoliperävaunu)<br/>
5 KATP (kuorma-auto ja täysperävaunu)<br/>
6 HA + PK (henkilöauto ja peräkärry)<br/>
7 HA + AV (henkilöauto ja asuntovaunu)<br/>

## Digitraffic.fi API

Digitraffic.fi provides free information about open data from Finnish road, railway and marine traffic through API.
Link to Digitraffic website:
https://www.digitraffic.fi/en/road-traffic/
<br/>

### Data from LAM stations

https://tie.digitraffic.fi/api/v1/data/tms-data

https://tie.digitraffic.fi/api/v1/data/tms-data/{id}

Response message contains TMS (Traffic Measurement System)–stations measurement data.

Every TMS station provides information about traffic amounts and measured average speeds.

Data is updated almost in real time but information is cached. Actual update interval is one minute. Real time data can be read from WebSocket.

## TMS stations(LAM points) information

Information about all LAM/TMS stations such location, address, status, start date, coordinates, city, province and etc can be found through below links.
The response will be a json including all the information about all TMS stations in Finland.

https://tie.digitraffic.fi/api/v3/metadata/tms-stations

note : The province code in TMS stations API (above link) are different from the province code that is the raw data url.
please make sure to use the right province code to get right data.
Province codes in raw data url and its equivalent in TMS stations API are as follow:

| Province name                               | Province code in raw data URL | Province code in [TMS stations API](https://tie.digitraffic.fi/api/v3/metadata/tms-stations) |
| ------------------------------------------- | ----------------------------- | -------------------------------------------------------------------------------------------- |
| Uusimaa, Häme                               | 01                            | 01, 05, 07                                                                                   |
| Varsinais-Suomi , Satakunta                 | 02                            | 02, 04                                                                                       |
| Kaakkois-Suomi                              | 03                            | 08 , 09                                                                                      |
| Pirkanmaa                                   | 04                            | 06                                                                                           |
| Pohjois-Savo, Etelä-Savo, Pohjois-Karjala   | 08                            | 11, 10,12                                                                                    |
| Keski-Suomi                                 | 09                            | 13                                                                                           |
| Etelä-Pohjanmaa, Pohjanmaa, Keski-Pohjanmaa | 10                            | 14, 15, 16                                                                                   |
| Pohjois-Pohjanmaa, Kainuu                   | 12                            | 17, 18                                                                                       |
| Lappi                                       | 14                            | 19                                                                                           |

The following link offers information about sensors of LAM/TMS stations.
https://tie.digitraffic.fi/api/v3/metadata/tms-sensors

## Sources

https://vayla.fi/avoindata/tiestotiedot/lam-tiedot <br/>
https://www.digitraffic.fi/tieliikenne/ <br/>
https://www.tilastokeskus.fi/meta/luokitukset/maakunta/001-2019/index.html<br/>
<br/> <br/> <br/> <br/> <br/> <br/>

# Train Heavy Traffic

By using the free data from digitraffic.fi it is possible to track and get all the necessary information about train commuting in Finland.

## Railway network data in Finland

Through this link you can get data for railway network in finland. The data will be as a downloadable file contatining all the coordinates for railway network across Finland. <br/>
By using this data it is possible to create a layer for map that visualize the railway network in across Finland. <br/>
http://verkkoselostus-vayla.opendata.arcgis.com/datasets/liikennointi-1

## Digitraffic Train APIs

Digitraffic offers free information through API about train traffics in in Finland. <br/>
The bas URL for APIs is : https://rata.digitraffic.fi/api/v1/ <br/>
v1 is the version number. <br/>
The APIs are divided into eight different parts:

- Trans information (/trains)
- Monitoring of active trains(/live-trains)
- Trains GPS location (/train-locations)
- Trains composition (/compositions)
- Route set of trains (/routesets)
- Railway work and maintenance of tracks (/trackwork-notifications), Restrictions (/trafficrestriction-notifications)
- Meta data (/metadata) <br/> <br/>

### Train's infomation

One train informatin URL: /trains/<departure_date>/<train_number> <br/>
Examples:

- /trains/latest/1
- /trains/2017-01-01/1

One day's train informations URL: /trains/<departure_date> <br/>
Example:

- /trains/2017-11-09

All trains informations URL: /trains?version <br/>
Example:

- /trains?version=1234567891234

### Search by route

URL: /live-trains/station/<departure_station_code>/<arrival_station_code>?departure_date=<departure_date>&startDate=<startDate>&endDate=<endDate>&limit=<limit>
<br/>
Example:

- /live-trains/station/HKI/TPE

### Train's GPS location

location of all trains : URL: /train-locations/latest?bbox=<points> <br/>
example:

- /train-locations/latest?bbox=20,60,35,70

 <br/> 
one train location: URL: /train-locations/<departure_date>/<train_number>?bbox=<points> <br/>

Examples:

- /train-locations/latest/1
- /train-locations/2018-03-01/1

### Route sets

When a train wants to move to a location it should reserve beforehand a safe route.

- Monitoring all reserved routes URL : /routesets?version=<version>

  - Example: /routesets?version=12349873459128375

- One Train's reserved route URL : /routesets/<departure_date>/<train_number>
  - Example: /routesets/2019-05-20/1

### Stations

All train stations information can be found through URL:

- metadata/stations

### Train Categories and Train types

URL: metadata/train-categories <br/>
It returns a list, consist of service's existing train categories. <br/>
Train categories are as below:

- Long-distance
- Commuter
- Cargo
- Locomotive
- Test drive
- On-track machines
- Shunting
  <br/>

URL: metadata/train-types <br/>
It returns a list consist of service's existing train types (for example: IC,P). <br/>
Train types and corresponding train category are listed in following table:

| Train type                                                | Train category    |
| --------------------------------------------------------- | ----------------- |
| PAR, VEV, VLI, W, MUV, SAA, PI                            | Shunting          |
| HL, HV, HLV                                               | Commuter          |
| H, PVS, P, HDM, PVV, S, V, IC2, IC, HSM, AE, PYO, MV, MUS | Long-distance     |
| T, RJ                                                     | Cargo             |
| VET                                                       | Locomotive        |
| LIV                                                       | Test drive        |
| TYO                                                       | On-track machines |

### WebSocket (MQTT)

#### Train station's traffic

Provides live information about trains using web socket. <br/>
Topic: trains-by-station/<station>

Example:

- http://jsfiddle.net/bkeav28u/

#### GPS-Location

Provides live GPS location of trains through web socket. <br/>  
Topic: train-locations/<departure_date>/<train_number>

HTTPS URL: rata.digitraffic.fi:443
HTTP URL: rata.digitraffic.fi:80

Example:

- http://jsfiddle.net/r4f7b2qe/

## Sources

https://www.digitraffic.fi/rautatieliikenne/#junien-tiedot-trains <br/>
https://rata.digitraffic.fi/swagger/index.html<br/>
https://vayla.fi/avoindata/rajapinnat <br/>
http://verkkoselostus-vayla.opendata.arcgis.com/datasets/liikennointi-1?selectedAttribute=liikennointi

## License

https://creativecommons.org/licenses/by/4.0/
and more
