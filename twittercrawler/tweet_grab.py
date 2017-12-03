from info import *
from dbconfig import config
from track_terms import terms
from insertfunc import *
import tweepy
import mysql.connector

class StreamListener(tweepy.StreamListener):

    def on_status(self, status):
        #print(status.id_str, "\n")
	print int(status.id_str), status.id_str, status.user.id_str
	tweetdata = (status.created_at, status.text, int(status.id_str), int(status.user.id_str), int(status.retweet_count), status.coordinates, int(status.favorite_count))
	print tweetdata
        userdata = (status.user.name, status.user.id_str, status.user.location, status.user.followers_count)

	userID = (status.user.id_str,)

	cursor.execute(find_user, userID)
	for i in cursor:
		if i[0] == 0:
			cursor.execute(add_user, userdata)
			print "New User Created."
		else: print "Old User Found."
	cursor.execute(add_tweet, tweetdata)
	print "Tweet inserted."

        cnx.commit()
	
    def on_error(self, status_code):
        if status_code == 420:
            return False


cnx = mysql.connector.connect(**config)
cursor = cnx.cursor()

auth = tweepy.OAuthHandler(api_key, api_secret)
auth.set_access_token(access_token, access_token_secret)
api = tweepy.API(auth)

streamlistener = StreamListener()
stream = tweepy.Stream(auth=api.auth, listener=streamlistener)
stream.filter(track=terms)

cursor.close()
cnx.close()
