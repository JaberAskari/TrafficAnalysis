import datetime
import pandas as pd
import numpy as np
import sys
import math

#argument should be given in following sequence
year = sys.argv[1]
areaID = sys.argv[2]
lamID = sys.argv[3]
startDayNumber = sys.argv[4]
endDayNumber = sys.argv[5]
#vehicle_class =sys.argv[6]

names = ["point_d", "Year", "day_number", "hour", "minute", "second", "100th_of_a_second", "length_m","lane", "direction", "vehicle_class", "speed_km/h", "faulty_0=valid_1=incorrect", "total_time", "interval","jonoalku"]
shortYear = year[-2:]
output = pd.DataFrame()



check =  math.isnan(float(endDayNumber))
if(check == False):

    start = int(startDayNumber)
    end = int(endDayNumber)
    duration = (end+1) - start

    #vehicleTotalNumberInOneDay = pd.DataFrame()
    
    date = []
    day = start
    for x in range(duration):
        
        url = "https://aineistot.vayla.fi/lam/rawdata/{year}/{areaID}/lamraw_{lamID}_{shortYear}_{day}.csv".format(year=year,areaID=areaID,lamID=lamID,shortYear = shortYear, day=day)
        csv = pd.read_csv(url, names=names, sep = ";",error_bad_lines=False)
        
        #getting the day from sequectial day number
        dt = datetime.datetime(int(year),1,1)
        dtdelta = datetime.timedelta(days=(day-1))
        dt = dt + dtdelta
        dt=dt.strftime('%d.%m.%Y')
        date.append(dt)
        
        temp = pd.DataFrame()
        #temp = csv.groupby(["vehicle_class"])["vehicle_class"].count()
        temp = csv.groupby(["vehicle_class","direction"]).agg({"vehicle_class":"count", "speed_km/h":"mean"})\
        .rename(columns={'vehicle_class':'vehicle_number','speed_km/h':'avg_speed_km_h'})
        
        #changing indexes to create uniqe indexs containing date and vehicle class
        indexv = temp.index.values.tolist() 
        newindex = []
        for i in range(len(indexv)):
            a= list(indexv[i])
            ind = dt+"_"+str(a[0])+"_"+str(a[1])
            newindex.append(ind)

        #setting the new index to dataframe
        temp["date_vehicleclass_direction"]= newindex
        temp.set_index("date_vehicleclass_direction", inplace= True)
        #vehicleTotalNumberInOneDay= vehicleTotalNumberInOneDay.append(temp)

        output= temp
        output['avg_speed_km_h'] = output['avg_speed_km_h'].astype(float).round(1)
        outputJson = output.to_json()
        print(outputJson)
        sys.stdout.flush()
        

        day +=1
        
    
    # output= vehicleTotalNumberInOneDay
    # output['avg_speed_km_h'] = output['avg_speed_km_h'].astype(float).round(1)
    # outputJson = output.to_json()
    # print(outputJson)
    # sys.stdout.flush()

#data for only one day
else:
    url = "https://aineistot.vayla.fi/lam/rawdata/{year}/{areaID}/lamraw_{lamID}_{shortYear}_{startDayNumber}.csv"\
    .format(year=year,areaID=areaID,lamID=lamID,shortYear = shortYear, startDayNumber=startDayNumber)
    
    allData = pd.read_csv(url, names=names, sep = ";",error_bad_lines=False)

    # getting date from day number
    dt = datetime.datetime(int(year),1,1)
    dtdelta = datetime.timedelta(days=int(startDayNumber))
    dt = dt + dtdelta
    dt=dt.strftime('%d.%m.%Y')
    
    df = allData.groupby(["hour","vehicle_class","direction"]).agg({"vehicle_class": "count", "speed_km/h":"mean"})\
         .rename(columns={'vehicle_class':'vehicle_number','speed_km/h':'avg_speed_km_h'})
    
    #df = allData.groupby(["hour","vehicle_class"]).agg({"vehicle_class": "count", "speed_km/h":"mean"})\
    #     .rename(columns={'vehicle_class':'vehicle_number','speed_km/h':'avg_speed_km_h'})
    df['avg_speed_km_h'] = df['avg_speed_km_h'].astype(float).round(1)

    #changing indexes to create uniqe indexs containing date and vehicle class
    indexv = df.index.values.tolist() 
    newindex = []
    for i in range(len(indexv)):
        a= list(indexv[i])
        ind = str(a[0])+"_"+str(a[1])+"_"+str(a[2])
        newindex.append(ind)

    df["date_vehicleclass_direction"]= newindex
    df.set_index("date_vehicleclass_direction", inplace= True)

    outjson = df.to_json()
    print(outjson)
    sys.stdout.flush()