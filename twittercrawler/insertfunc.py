add_tweet = ( " insert into tweets "
              " (timestamp, text, tweetID, userID, retweets, coordinates, favorites) "
              " values (%s, %s, %s, %s, %s, %s, %s) " )

add_user = ( " insert into users "
             " (name, userID, location, followercount) "
             " values (%s, %s, %s, %s) " )

add_hashtag = ( " insert into hashtags "
                " (text, tweetID) "
                " values (%s, %s) " )

find_user = ( " select exists ( select * from users where userID = %s ) " )
