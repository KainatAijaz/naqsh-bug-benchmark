using OpenQA.Selenium;
using SeleniumTests.Core;

namespace SeleniumTests.Pages
{
    // This Page Object models the Artist Registration multi-step form.
    public class ArtistRegistrationPage : BasePage
    {
        public ArtistRegistrationPage(IWebDriver driver) : base(driver) { }

        // ==========================================
        // LOCATORS (How we find the elements)
        // ==========================================

        // When developers don't give us an ID, we can find inputs by their 'placeholder' text!
        private readonly By NameInput = By.CssSelector("input[placeholder='Your name']");
        private readonly By CityInput = By.CssSelector("input[placeholder='Dubai']");
        
        // This finds any button that has exactly the text "Continue"
        private readonly By ContinueButton = By.XPath("//button[text()='Continue']");
        
        // This finds the large headline on the page using a CSS Selector targeting the h1 tag
        private readonly By MainHeadline = By.TagName("h1");

        // Finds the textarea by placeholder
        private readonly By BioTextarea = By.CssSelector("textarea[placeholder*='Share your journey']");


        // ==========================================
        // ACTIONS (What a user does)
        // ==========================================

        public void GoTo(string baseUrl)
        {
            Driver.Navigate().GoToUrl(baseUrl + "register");
        }

        public void FillOutBasicInfo(string name, string city)
        {
            SendKeys(NameInput, name);
            SendKeys(CityInput, city);
        }

        public void ClickContinue()
        {
            Click(ContinueButton);
        }

        // A quick helper method to get the big headline text so our test can assert what step we are on!
        public string GetHeadlineText()
        {
            // First we wait for it to be visible, then we extract the .Text property
            return Driver.FindElement(MainHeadline).Text;
        }
    }
}
