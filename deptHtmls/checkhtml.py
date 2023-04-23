# imports
from bs4 import BeautifulSoup
import requests
import csv
import json

depts = []
with open('depts.csv', newline='') as csvfile:
    spamreader = csv.reader(csvfile, delimiter=';', quotechar='|')
    for row in spamreader:
        depts.append(row)

valid = []
for dept in depts:
    url = f'https://catalog.ucsd.edu/courses/{dept[0]}.html'
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    if not soup.find('title', string='Page Not Found'):
        valid.append(dept)

json_dept = json.dumps(valid, indent=4)
with open("departments.json", "w") as outfile:
    outfile.write(json_dept)




