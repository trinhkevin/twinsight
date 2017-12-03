import requests

r = requests.get('http://localhost:2000')
r = requests.post('http://localhost:2000', json = {'query':'select * from sample'})
print r.text
''', data = {'query':'select * from sample'}'''