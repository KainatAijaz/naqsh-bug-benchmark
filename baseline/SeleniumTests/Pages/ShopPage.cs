using OpenQA.Selenium;
using SeleniumTests.Core;

namespace SeleniumTests.Pages
{
    // The ShopPage object handles everything related to purchasing henna products
    public class ShopPage : BasePage
    {
        public ShopPage(IWebDriver driver) : base(driver) { }

        // ==========================================
        // LOCATORS (How to find things)
        // ==========================================

        // The filter buttons are distinctively styled with the 'btn-pill-dark' class.
        private readonly By CategoryFilterButtons = By.CssSelector(".btn-pill-dark");

        // The "Add to Cart" button inside the product cards has identifying classes and text.
        // We use an XPath here to specifically find a button containing the text 'Add to Cart'.
        private readonly By AddToCartButtons = By.XPath("//button[contains(text(), 'Add to Cart')]");

        // The product titles (like "Beginner Henna Kit"). They are <h3> tags with specific styling classes.
        // In Shop.tsx, we can see: `<h3 className="font-serif text-xl ...">`
        private readonly By ProductTitles = By.CssSelector("h3.font-serif");


        // ==========================================
        // ACTIONS (What a user can do)
        // ==========================================

        public void GoTo(string baseUrl)
        {
            Driver.Navigate().GoToUrl(baseUrl + "shop");
        }

        // Action to count how many Add To Cart buttons are on the screen.
        // Since every product has an Add to Cart button, this tells us how many products loaded!
        public int GetDisplayedProductCount()
        {
            // Note: FindElements automatically returns a collection we can run .Count on
            return Driver.FindElements(AddToCartButtons).Count;
        }

        // Action to click the "Bridal Kits" category (or any category passed in)
        // We find ALL the filter buttons, loop through them, and click the one with the right text!
        public void FilterByCategory(string categoryName)
        {
            var filters = Driver.FindElements(CategoryFilterButtons);
            foreach (var filter in filters)
            {
                if (filter.Text.Contains(categoryName))
                {
                    filter.Click();
                    break; 
                }
            }
        }
    }
}
