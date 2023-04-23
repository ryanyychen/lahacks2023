# Web scraping script

# imports
from bs4 import BeautifulSoup
import requests
import json
import jsonify
import re
from flask import Flask, render_template
import subprocess

app = Flask(__name__)

def getHTMLContent(url):
    """ 
    Get the raw HTML content of the passed in argument 

    Args:
        url (string): url to the webpage to be scraped.

    Returns:
        BeautifulSoup: HTML contents of the webpage.
    """
    site = requests.get(url)
    htmlContent = BeautifulSoup(site.content, 'html.parser')

    # find the desired header tag
    header = htmlContent.find('h2', string='Graduate')

    # find all tags after the header tag
    tags_to_remove = header.find_all_next()

    # loop through the tags and remove them
    for tag in tags_to_remove:
        tag.decompose()

    return htmlContent

def getCourseCatalog(htmlContent):
    """
    Fill a dictionary with keys = courses, values = array of prerequisites

    Args:
        htmlContent (BeautifulSoup): html text from getHTMLContent() function

    Returns:
        dict: keys = courses, values = array of prerequisites
    """
    courseCatalog = dict()
    # get a list of course titles
    courseTitles = htmlContent.find_all('p', {'class': 'course-name'})
    # call getPrereqs() to populate each course with its prerequisites
    for course in courseTitles:
        # get course description of given course
        courseDesc = course.find_next_sibling()
        # find "Prerequisites:", that begins list of prerequisites
        preq_tag = courseDesc.find_next(['em', 'span', 'strong'])
        if preq_tag.text[0] == 'p':
            preq_tag = preq_tag.find_next(['em', 'span', 'strong'])
        prerequisitesText = None
        if type(preq_tag) == type(None):
            prerequisites = []
        else:
            # store list of prerequisites
            prerequisitesText = preq_tag.next_sibling.strip()
            prerequisites = getPrereqs(prerequisitesText)
        # removes units because unicode incompability
        justId = course.text.index(".")
        # inserts course and its prerequisites into courseCatalog
        courseCatalog[course.text[:justId]] = prerequisites
    return courseCatalog

def getPrereqs(prerequisitesText):
    """
    Get the prerequisites of the given course by parsing prerequisitesText

    Args:
        prerequisitesText (string): prerequisites list scraped from 
        getHTMLContent() and getCourseCatalog()

    Returns:
        string: array of prerequisites
    """
    prerequisitesArr = []

    # Define the pattern to match, "DEPT 123(H/R/AH)"
    aCourse = r"[A-Z]{3,4}\s+\d{1,3}[A-Z]{0,2}"

    # get string of only prerequisites
    match = re.search(aCourse, prerequisitesText)
    if match:
        start = match.start()
    else:
        start = 0
    end = prerequisitesText.index(".")
    prerequisitesText = prerequisitesText[start:end]
    #print(prerequisitesText)
    prerequisitesText = prerequisitesText.replace('\u2013', '-')
    prerequisitesText = prerequisitesText.replace("(", "")
    prerequisitesText = prerequisitesText.replace(")", "")

    # Define the regular expression pattern to match the substrings you want to keep
    prerequisitesText = re.sub(r',+\s+or+\s', r' or ', prerequisitesText)
    prerequisitesText = re.sub(r',+\s+and+\s', r' and ', prerequisitesText)
    prerequisitesText = re.sub(r',+\s', r' and ', prerequisitesText)

    pattern = re.compile(rf'( or {aCourse}| and {aCourse}|{aCourse})')

    # Use re.findall to extract all matches of the pattern from the input string
    matches = pattern.findall(prerequisitesText)

    # Join the matches together with a delimiter to create a new string containing only the desired substrings
    prerequisitesText = ', '.join(matches).replace(', ', '')

    if prerequisitesText == "":
        return prerequisitesArr

    #print(prerequisitesText)

    # separate all prerequisites
    # ex: [CSE 15L, CSE 20 or MATH 109]
    prerequisitesArr = prerequisitesText.split(" and ")
    prerequisitesArr = [req.split(" or ") for req in prerequisitesArr]

    return prerequisitesArr

@app.route("/")
def index():
    return render_template('index.html')

@app.route('/reqDept', methods=['POST'])
def webScrape():
    """
    Output two .json's of the upper and lower division requirements to be read
    by the web app.

    Args:
        dept (string): 3-4 letter department code
    """
    dept = request.json['inputField']
    # obtain link through given dept
    url = f'https://catalog.ucsd.edu/courses/{dept}.html'
    # get BeautifulSoup of course catalog
    lower = getHTMLContent(url)

    # find upper division cut off point
    division = lower.find('h2', string='Upper Division')

    # extract all siblings after the target heading
    target_content = list(division.next_siblings)

    # create a new BeautifulSoup object with the target content
    upper = BeautifulSoup('', 'html.parser')
    upper.append(division)
    for sibling in target_content:
        if sibling.name:
            upper.append(sibling)

    # construct dictionary of upper divs
    upperDivs = getCourseCatalog(upper)

    # find all tags after the header tag
    tags_to_remove = division.find_all_next()

    # loop through the tags and remove them
    for tag in tags_to_remove:
        tag.decompose()

    # construct dictionary of lower divs
    lowerDivs = getCourseCatalog(lower)
    # convert dictionary to json
    json_lower = json.dumps(lowerDivs, indent=4)
    json_upper = json.dumps(upperDivs, indent=4)
    with open("lowerDivs.json", "w") as outfile:
        outfile.write(json_lower)
    with open("upperDivs.json", "w") as outfile:
        outfile.write(json_upper)
    return jsonify({"status": "success"})