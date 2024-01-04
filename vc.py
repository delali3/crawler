import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.keys import Keys

import time

def get_unique_domain_links(query, max_results=5):
    google_search_url = "https://www.google.com/search"
    headers = {'User-Agent': 'Mozilla/5.0'}
    response = requests.get(google_search_url, params={'q': query}, headers=headers)

    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        links = []
        domains = set()
        for a_tag in soup.find_all('a'):
            href = a_tag.get('href')
            if href and href.startswith('/url?q='):
                url = urlparse(href.split('&')[0].split('=')[1]).geturl()
                domain = urlparse(url).netloc

                # Filter out irrelevant domains (like Google Maps)
                if "maps.google.com" in domain:
                    continue

                # Optional: Check for specific keywords in the URL
                if "downloader" in url or "youtube" in url:
                    if domain not in domains:
                        domains.add(domain)
                        links.append(url)
                        if len(links) == max_results:
                            break
        return links
    else:
        return []

def check_video_on_site(video_url, target_site):

    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("enable-automation")
    chrome_options.add_argument("--disable-infobars")
    chrome_options.add_argument("--disable-dev-shm-usage")

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    wait = WebDriverWait(driver, 10)


    try:
        driver.get(target_site)
        input_field = None

        # Checking for common keywords in input placeholders
        common_keywords = ['paste', 'url', 'link', 'here']
        for keyword in common_keywords:
            try:
                input_field = wait.until(EC.presence_of_element_located((By.XPATH, f"//input[contains(@placeholder, '{keyword}')]")))
                break
            except TimeoutException:
                continue  # Try next keyword

        if not input_field:
            print(f"No input field found with common keywords on {target_site}")
            return "Failed to find input field."

        # Assuming the submit button is near the input field
        submit_button = input_field.find_element(By.XPATH, "./following-sibling::button | ./ancestor::form//button[contains(text(), 'Download') | contains(text(), 'Paste')]")

        input_field.send_keys(video_url)
        submit_button.click()

        # Wait for processing (adjust time as needed)
        time.sleep(10)

        # Checking for success or failure messages
        if "Not found" not in driver.page_source:
            return "Video link processed on the site."
        else:
            return "Video link not found or not processed."
    except Exception as e:
        return f"An error occurred: {str(e)}"
    finally:
        driver.quit()

def main():
    search_query = "YouTube Video Downloader"
    downloader_sites = get_unique_domain_links(search_query)

    print(f"Found downloader sites: {downloader_sites}")  # Debug print

    video_link = "https://www.youtube.com/watch?v=7tkNPdCsI-A"  # Replace with your video link
    for site in downloader_sites:
        print(f"Testing on site: {site}")  # Debug print
        result = check_video_on_site(video_link, site)
        print(f"Checking video on {site}: {result}")

if __name__ == "__main__":
    main()
