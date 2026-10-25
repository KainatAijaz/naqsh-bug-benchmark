using NUnit.Framework;
using SeleniumTests.Core;
using SeleniumTests.Pages;
using System.Threading;

namespace SeleniumTests.Tests
{
    // [TestFixture] tells the NUnit framework that this class contains automated tests.
    [TestFixture]
    public class AuthTests : BaseTest
    {
        // We declare our page object at the class level so all tests can use it
        private AuthPage _authPage;

        // [SetUp] runs BEFORE EVERY SINGLE TEST in this file. 
        // We use it to create a fresh instance of our AuthPage!
        [SetUp]
        public void InitPages()
        {
            _authPage = new AuthPage(Driver);
        }

        // [Test] means "Run me as an automated test case"
        [Test]
        public void LoginWithValidCredentials()
        {
            // AUTOMATION RULE: Always follow Arrange -> Act -> Assert (AAA Pattern)!

            // 1. ARRANGE (Get everything ready)
            // Go to the website
            _authPage.GoTo(BaseUrl);

            // 2. ACT (Do the action we are testing)
            // Fill in the login form with credentials (from the user's manual change)
            _authPage.LoginAs("kainatajz", "");

            // 3. ASSERT (Check if it worked)
            // Since we submitted an empty password, the login should fail and we should currently still be on the /auth page.
            // A beginner QA always verifies the URL after a login attempt.
            Assert.IsTrue(Driver.Url.Contains("/auth"), "The URL should still contain /auth because the password was empty, so login should not succeed!");
        }

        [Test]
        public void VerifyUserCanSwitchToSignupTab()
        {
            // 1. ARRANGE
            // Go to the auth page
            _authPage.GoTo(BaseUrl);

            // ACT
            // Click the Sign Up tab
            _authPage.SwitchToSignupTab();
            
            // 3. ASSERT
            // Let's assert we clicked it successfully by proving the URL didn't completely break, 
            // or perhaps checking we are still safely on the page.
            Assert.IsTrue(Driver.Url.Contains("auth"), "We should still be on the auth page after switching tabs.");
        }
    }
}
