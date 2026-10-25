using OpenQA.Selenium;
using SeleniumTests.Core;

namespace SeleniumTests.Pages
{
    // Every new page gets its own Page Object Class mapping it!
    public class ArtistPage : BasePage
    {
        public ArtistPage(IWebDriver driver) : base(driver) { }

        // ==========================================
        // LOCATORS
        // ==========================================
        
        // Let's find all the "Filter by Style" buttons (Bridal, Arabic, etc.)
        // We use CssSelector to find elements by their class name! 
        // In React, they used `<button className="btn-pill">`
        private readonly By StyleFilterButtons = By.CssSelector(".btn-pill");

        // Finding the Sort dropdown to sort by price or rating
        // It's a `<select>` tag inside a div. Let's find it simply by the tag name!
        private readonly By SortDropdown = By.TagName("select");

        // Finding the Artist Cards. They have a class named "card-dark"
        private readonly By ArtistCards = By.CssSelector(".card-dark");


        // ==========================================
        // ACTIONS
        // ==========================================

        public void GoTo(string baseUrl)
        {
            Driver.Navigate().GoToUrl(baseUrl + "artists");
        }

        // A beginner method to find how many artists loaded on the screen!
        // We use FindElements (plural) instead of FindElement (singular) to get a list.
        public int GetNumberOfArtistsDisplayed()
        {
            // Driver.FindElements returns a ReadOnlyCollection<IWebElement>
            // .Count tells us exactly how many elements it found!
            return Driver.FindElements(ArtistCards).Count;
        }

        // A beginner method to just click the dropdown and change it 
        // A Senior QA would use the native `SelectElement` class, but a beginner might just SendKeys to it!
        public void SortBy(string optionText)
        {
            SendKeys(SortDropdown, optionText);
        }
    }
}
