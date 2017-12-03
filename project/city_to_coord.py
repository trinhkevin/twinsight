import MySQLdb
import sys
import time
from geopy.geocoders import Nominatim

db = MySQLdb.connect("localhost", "mstaines", "#1Smarty", "twinsight")

#Instantiate cursor
c = db.cursor()
w = db.cursor()

geolocator = Nominatim()
#Run query, return 1 result
c.execute("""SELECT userid, location FROM users2""")

done = set()
with open("log-copy.csv") as f:
    for line in f:
        uid = line.rstrip().rsplit(",")[0]
        done.add(uid)
count = 0
row = c.fetchone()
with open("log.csv", "a") as out:
    while row:
        count += 1
        if str(row[0]) in done:
            print row[0]
            row = c.fetchone()
            continue
        print "here"
        sys.stdout.write("Row " + str(count) + "of less than 135000\r")
        loc = row[1]
        if loc:
            try:
                location = geolocator.geocode(loc)
                out.write(row[0] + "," + str(location.latitude) + "," + str(location.longitude) + "\n")
                print "wrote"
            except:
                pass
        count += 1
        row = c.fetchone()
        time.sleep(1.1)
