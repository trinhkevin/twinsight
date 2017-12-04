import requests

r = requests.get('http://localhost:8000')
r = requests.post('http://localhost:8000', json = {'query':'select * from sample'})
print r.text
print r.headers
print requests.utils.default_headers()
''', data = {'query':'select * from sample'}'''