# Web scraping script

# imports
import requests
from bs4 import BeautifulSoup

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
    return htmlContent

def populateDict(htmlContent):
    """
    Fill a dictionary with keys = courses, values = array of prerequisites

    Args:
        htmlContent (BeautifulSoup): html text from getHTMLContent() function

    Returns:
        dict: keys = courses, values = array of prerequisites
    """
    courseCatalog = dict()
    return courseCatalog

def getPrereqs(courseTitle):
    """
    Get the prerequisites of the given course

    Args:
        courseTitle (string): course title scraped from getHTMLContent() and 
        populateDict()

    Returns:
        string: array of prerequisites
    """
    prerequisites = []
    return prerequisites