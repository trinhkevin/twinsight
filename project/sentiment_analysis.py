from nltk.sentiment.vader import SentimentIntensityAnalyzer as sia
import MySQLdb
import sys

exclude = ['Basilica', 'basilica', 'France', 'Paris', 'Montreal', ' de ', ' dans ', ' le ']
analyzer = sia(lexicon_file = '/var/www/html/cse30246/twinsight/project/vader_lexicon.txt')

db = MySQLdb.connect("localhost", "mstaines", "#1Smarty", "twinsight")

#Instantiate cursor
c = db.cursor()
w = db.cursor()
#Run query, return 1 result
c.execute("""SELECT tweetID, text FROM tweets2""")

count = 0
row = c.fetchone()
while row:
    sys.stdout.write("Row " + str(count) + "of less than 140000\r")
    text = row[1]
    if any(ex in text for ex in exclude):
        pass
    else:
        sent = analyzer.polarity_scores(text)
        w.execute("""UPDATE tweets2 SET sentiment = %s WHERE tweetID = %s""", (sent['compound'], row[0],))
    count += 1
    row = c.fetchone()

#Commit changes to database
db.commit()