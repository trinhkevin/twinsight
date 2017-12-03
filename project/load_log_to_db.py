import MySQLdb
import sys

db = MySQLdb.connect("localhost", "mstaines", "#1Smarty", "twinsight")

#Instantiate cursor
w = db.cursor()
#Run query, return 1 result
with open('log-copy.csv') as f:
    count = 0
    for line in f:
        row = line.rstrip().rsplit(',')
        sys.stdout.write("Row " + str(count) + " of ?\n")
        w.execute("""UPDATE users2 SET latitude = %s, longitude = %s WHERE userid = %s""", (row[1],row[2],row[0],))
        count += 1

#Commit changes to database
db.commit()