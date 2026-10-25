using NUnit.Framework;
using SeleniumTests.Core;
using SeleniumTests.Pages;

namespace SeleniumTests.Tests
{
    [TestFixture]
    public class ArtistRegistrationTests : BaseTest
    {
        private ArtistRegistrationPage _registerPage;

        [SetUp]
        public void InitPages()
        {
            _registerPage = new ArtistRegistrationPage(Driver);
        }

        [Test]
        public void VerifyUserCanNavigateToStepTwo()
        {
            // 1. ARRANGE
            _registerPage.GoTo(BaseUrl);

            // 2. ACT
            // Fill out the required basic info
            _registerPage.FillOutBasicInfo("Sarah Henna", "Dubai");
            
            // Move to Step 2
            _registerPage.ClickContinue();

            // 3. ASSERT
            // We verify that the page successfully advanced to Step 2 ("Your Art")
            // We check the big headline text!
            string headline = _registerPage.GetHeadlineText();
            Assert.IsTrue(headline.Contains("Show them what your hands can do"), "The headline should change to step 2 after clicking Continue.");
        }

        [Test]
        public void VerifyInitialHeadlineDisplay()
        {
            // 1. ARRANGE
            _registerPage.GoTo(BaseUrl);

            // 2. ACT
            // We just grab the headline without doing anything else
            string headline = _registerPage.GetHeadlineText();

            // 3. ASSERT
            Assert.IsTrue(headline.Contains("Let the world discover your art"), "Step 1 headline should be displayed when first opening the page.");
        }
    }
}
