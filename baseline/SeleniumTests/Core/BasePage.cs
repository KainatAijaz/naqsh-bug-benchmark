using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using SeleniumExtras.WaitHelpers;
using System;

namespace SeleniumTests.Core
{
    public abstract class BasePage
    {
        protected IWebDriver Driver;
        protected WebDriverWait Wait;

        public BasePage(IWebDriver driver)
        {
            Driver = driver;
            Wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));
        }

        protected void Click(By locator)
        {
            Wait.Until(ExpectedConditions.ElementToBeClickable(locator)).Click();
        }

        protected void SendKeys(By locator, string text)
        {
            var element = Wait.Until(ExpectedConditions.ElementIsVisible(locator));
            element.Clear();
            element.SendKeys(text);
        }

        protected bool IsElementDisplayed(By locator)
        {
            try
            {
                return Wait.Until(ExpectedConditions.ElementIsVisible(locator)).Displayed;
            }
            catch (WebDriverTimeoutException)
            {
                return false;
            }
        }
    }
}
