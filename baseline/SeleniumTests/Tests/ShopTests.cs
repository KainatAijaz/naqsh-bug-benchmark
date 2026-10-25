using NUnit.Framework;
using SeleniumTests.Core;
using SeleniumTests.Pages;

namespace SeleniumTests.Tests
{
    [TestFixture]
    public class ShopTests : BaseTest
    {
        private ShopPage _shopPage;

        [SetUp]
        public void InitPages()
        {
            // Prepares the ShopPage before each test runs
            _shopPage = new ShopPage(Driver);
        }

        [Test]
        public void VerifyProductsDisplayOnShopLoad()
        {
            // ARRANGE: Go to the shop
            _shopPage.GoTo(BaseUrl);

            // ACT: Ask the page how many products are currently rendering
            int amountOfProducts = _shopPage.GetDisplayedProductCount();

            // ASSERT: Verify at least one product has loaded
            // We use Assert.Greater instead of Assert.AreEqual because the store might add more inventory later!
            Assert.Greater(amountOfProducts, 0, "Products should automatically load when navigating to the Shop.");
        }

        [Test]
        public void VerifyCategoryFilteringWorksWithoutCrashing()
        {
            // ARRANGE: Go to the shop
            _shopPage.GoTo(BaseUrl);

            // ACT: Click the "Bridal" filter to try and filter products
            // Notice there is NO Thread.Sleep! 
            // Because our custom methods in BasePage use WebDriverWait, the framework naturally waits.
            _shopPage.FilterByCategory("Bridal");

            // ASSERT: Ensure we're still on the shop page safely
            Assert.IsTrue(Driver.Url.Contains("/shop"), "URL should still contain /shop after filtering.");
        }
    }
}
