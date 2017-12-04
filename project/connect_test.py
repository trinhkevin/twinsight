import MySQLdb
from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
import os
import json

db = MySQLdb.connect("localhost", "mstaines", "#1Smarty", "twinsight")
c = db.cursor()

class MyRequestHandler(BaseHTTPRequestHandler):
	def end_headers (self):
		self.send_header('Access-Control-Allow-Origin', '*')
		BaseHTTPRequestHandler.end_headers(self)
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
		#print new_data
		#new_data = new_data.decode('latin1')
		self.wfile.write(json.dumps(new_data, encoding="latin1"))
		return
	def do_OPTIONS(self):
		print 'GOT OPTION'
		self.send_response(200, "ok")
		self.send_header("Access-Control-Allow-Origin", "*");
		self.send_header("Content-Type", "text/plain");
		self.send_header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
		self.send_header("Access-Control-Allow-Methods", "GET, PUT, POST");
		self.end_headers()
		return

def run():
	print 'http server is starting'
	server_address = ('0.0.0.0', 8000)
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
