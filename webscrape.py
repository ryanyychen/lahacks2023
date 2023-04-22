# Web scraping script

# imports
from bs4 import BeautifulSoup
import requests
import json

def getHTMLContent(url):
    """ 
    Get the raw HTML content of the passed in argument 

    Args:
        url (string): url to the webpage to be scraped.

    Returns:
        string: HTML contents of the webpage.
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

    # get first word of list, if it is not a valid course id then
    # return empty list as no prerequisites exist.
    prerequisitesText = str(prerequisitesText)
    first_word = prerequisitesText.split()[0]
    if len(first_word) > 4 or "none." in first_word:
        return prerequisitesArr

    # get string of only prerequisites
    end = prerequisitesText.index(".")
    prerequisitesText = prerequisitesText[:end]
    # cut consent of instructor
    if " or consent of instructor" in prerequisitesText:
        end = prerequisitesText.index(" or consent of instructor")
        prerequisitesText = prerequisitesText[:end]
    # cut anything after semicolon
    if ";" in prerequisitesText:
        end = prerequisitesText.index(";")
        prerequisitesText = prerequisitesText[:end]
    # cut anything permission by instructor
    if " or permission of constructor" in prerequisitesText:
        end = prerequisitesText.index(" or permission of constructor")
        prerequisitesText = prerequisitesText[:end]
    prerequisitesText = prerequisitesText.replace('\u2013', '-')
    prerequisitesText = prerequisitesText.replace("(", "")
    prerequisitesText = prerequisitesText.replace(")", "")


    # separate all prerequisites
    # ex: [CSE 15L, CSE 20 or MATH 109]
    prerequisitesArr = prerequisitesText.split(" and ")
    prerequisitesArr = [req.split(" or ") for req in prerequisitesArr]
        
    return prerequisitesArr

def webScrape(dept):
    url = f'https://catalog.ucsd.edu/courses/{dept}.html'
    htmlContent = getHTMLContent(url)
    courseCatalog = getCourseCatalog(htmlContent)
    json_object = json.dumps(courseCatalog, indent=4)
    with open("courseCatalog.json", "w") as outfile:
        outfile.write(json_object)

webScrape("CSE")