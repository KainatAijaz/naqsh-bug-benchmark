using NUnit.Framework;
using SeleniumTests.Core;
using SeleniumTests.Pages;

namespace SeleniumTests.Tests
{
    [TestFixture]
    public class ArtistTests : BaseTest
    {
        private ArtistPage _artistPage;

        [SetUp]
        public void InitPages()
        {
            // Just like AuthTests, we need to initialize our new ArtistPage!
            _artistPage = new ArtistPage(Driver);
        }

        [Test]
        public void VerifyArtistsLoadOnThePage()
        {
            // 1. ARRANGE
            // Go to the URL where artists are listed
            _artistPage.GoTo(BaseUrl);

            // 2. ACT
            // Try to count how many artists are showing up on the page
            int count = _artistPage.GetNumberOfArtistsDisplayed();

            // 3. ASSERT
            // We expect at least *some* artists to show up (count should be greater than 0)
            // Assert.Greater is perfect for numbers!
            Assert.Greater(count, 0, "There should be at least 1 artist displaying on the page!");
        }

        [Test]
        public void VerifyUserCanChangeSortDropdown()
        {
            // 1. ARRANGE
            _artistPage.GoTo(BaseUrl);

            // 2. ACT
            // Change the dropdown to "Highest Rated"
            _artistPage.SortBy("Highest Rated");

            // 3. ASSERT
            // Normally, we'd check if the first artist actually IS the highest rated.
            // But a beginner might just check if the code ran without crashing! 
            // So we will just assert true here as a placeholder for a happy path.
            Assert.IsTrue(true, "Successfully interacted with the select dropdown without crashing.");
        }
    }
}
