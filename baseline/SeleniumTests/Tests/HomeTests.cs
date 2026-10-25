using NUnit.Framework;
using SeleniumTests.Core;
using SeleniumTests.Pages;

namespace SeleniumTests.Tests
{
    [TestFixture]
    public class HomeTests : BaseTest
    {
        private HomePage _homePage;

        [SetUp]
        public void InitPages()
        {
            _homePage = new HomePage(Driver);
        }

        [Test]
        public void VerifyHomePageLoadsCorrectly()
        {
            // Act
            _homePage.GoTo(BaseUrl);

            // Assert
            Assert.IsTrue(_homePage.IsFindYourArtistVisible(), "Find Your Artist button should be visible on the homepage.");
        }

        [Test]
        public void VerifyFindYourArtistButtonNavigatesToArtists()
        {
            // Arrange
            _homePage.GoTo(BaseUrl);

            // Act
            _homePage.ClickFindYourArtist();

            // Assert: verifying URL changed. Very standard junior QA check.
            Assert.IsTrue(Driver.Url.Contains("/artists"), "Clicking 'Find Your Artist' should navigate to /artists page.");
        }
    }
}
