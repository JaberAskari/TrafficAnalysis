import sys
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

vehicleClass = int(sys.argv[1])

names = ["LAMpoint_id", "year", "day_number", "hour", "minute", "second", "100th_of_a_second", "length_m","lane", "direction", "vehicle_class", "speed_km/h", "faulty_0=valid_1=incorrect", "total_time", "interval","jonoalku"]


def myfu(vC):
    df = pd.read_csv("https://aineistot.vayla.fi/lam/rawdata/2017/01/lamraw_101_17_39.csv", names=names, sep = ";")
    df1 = df[df["vehicle_class"]==vC]
    df2 = df1.groupby("hour")["vehicle_class"].count()
    df3= pd.DataFrame(df2)
    output = df3.to_json()
    print(output)
    sys.stdout.flush()
    #df3.plot()
    #plt.show()

myfu(vehicleClass)

