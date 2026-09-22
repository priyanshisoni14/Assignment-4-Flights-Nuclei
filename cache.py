import sys
import time

from selenium import webdriver


def cache_url(driver):
    # Target URL to be cached
    target_url = str(sys.argv[1])

    print("Target URL to be cached: " + target_url)

    # Fetch and load target url
    driver.get(target_url)

    # Wait for all assets to load
    time.sleep(10)

    print("Target URL has been successfully cached")


chrome_options = webdriver.ChromeOptions()
chrome_options.add_argument('--disable-dev-shm-usage')
driver = webdriver.Remote(
    "http://selenium-chrome.selenium-chrome.svc.cluster.local:4444/wd/hub", options=chrome_options)

cache_url(driver)
# Closing the driver
driver.quit()

print("Hit with Safari 11 user agent")

chrome_options = webdriver.ChromeOptions()
chrome_options.add_argument('--disable-dev-shm-usage')
chrome_options.add_argument("user-agent=Mozilla/5.0 (iPhone; CPU iPhone OS 16_3_1 like Mac OS X)"
                            + "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11 Mobile/15E148 Safari/604.1")
safari11_driver = webdriver.Remote(
    "http://selenium-chrome.selenium-chrome.svc.cluster.local:4444/wd/hub", options=chrome_options)

cache_url(safari11_driver)
# Closing the driver
safari11_driver.quit()
