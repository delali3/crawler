from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time

def check_video_on_site(video_url, target_site):
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Run Chrome in headless mode
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    wait = WebDriverWait(driver, 10)

    try:
        driver.get(target_site)
        input_field = wait.until(EC.presence_of_element_located((By.ID, 'sf_url')))
        submit_button = wait.until(EC.presence_of_element_located((By.ID, 'sf_submit')))
        input_field.send_keys(video_url)
        submit_button.click()
        time.sleep(10)  # Adjust as necessary

        if "Not found" not in driver.page_source:
            return "Video link processed on the site."
        else:
            return "Video link not found or not processed."
    except Exception as e:
        return f"An error occurred: {str(e)}"
    finally:
        driver.quit()
