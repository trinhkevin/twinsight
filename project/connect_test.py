import MySQLdb
from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
import os
import json

db = MySQLdb.connect("localhost", "mstaines", "#1Smarty", "twinsight")
c = db.cursor()

class MyRequestHandler(BaseHTTPRequestHandler):
	def do_GET(self):
		message = {"Hello" : "World"}
		message = json.dumps(message)
		self.send_response(200)
		self.end_headers()
		self.wfile.write(message)
		return
	def do_POST(self):
		print self.raw_requestline
		length = int(self.headers.getheaders("Content-Length")[0])
		print length
		data = self.rfile.read(length)
		data = json.loads(data)
		print data
		if 'query' in data:
			c.execute(data['query'])
			new_data = c.fetchall()
		self.send_response(200)
		self.end_headers()
		self.wfile.write(json.dumps(new_data))
		return

def run():
	print 'http server is starting'
	server_address = ('localhost', 2000)
	httpd = HTTPServer(server_address, MyRequestHandler)
	print('http server is running...')
	httpd.serve_forever()

if __name__ == '__main__':
	run()
'''#Connect
db = MySQLdb.connect("localhost", "mstaines", "#1Smarty", "twinsight")

#Instantiate cursor
c = db.cursor()

#Run query, return 1 result
c.execute("""SELECT * FROM sample""")
print(c.fetchone())

#Run insert
c.execute("""INSERT INTO sample VALUES ('2', 'Goodbye', 400)""")

#Run query, return all results
c.execute("""SELECT * FROM sample""")
print(c.fetchall())

#Commit changes to database
db.commit()'''
