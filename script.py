import glob
import requests
from requests_toolbelt.multipart.encoder import MultipartEncoder
files = glob.glob('D:/proj/proj/csv_file/*.csv')
for file in files:
	print(file)
	f=open(file,'r').read()
	requests.post('http://localhost:3003/upload',data={'files':f},headers={'Content-type':m.content_type})