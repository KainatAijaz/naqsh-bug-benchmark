using OpenQA.Selenium;
using SeleniumTests.Core;

namespace SeleniumTests.Pages
{
    public class HomePage : BasePage
    {
        public HomePage(IWebDriver driver) : base(driver) { }

        // Locators
        private By FindYourArtistBtn = By.CssSelector(".btn-hero[href='/artists']");
        private By OccasionPills = By.CssSelector(".occasion-pill");
        private By ShopSectionBtn = By.CssSelector("a[href='/shop'].btn-gold, a[href='/shop'].text-primary");

        // Action Methods
        public void GoTo(string url)
        {
            Driver.Navigate().GoToUrl(url);
        }

        public void ClickFindYourArtist()
        {
            Click(FindYourArtistBtn);
        }

        public bool IsFindYourArtistVisible()
        {
            return IsElementDisplayed(FindYourArtistBtn);
        }
    }
}
