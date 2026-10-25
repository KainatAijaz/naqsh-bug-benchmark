using OpenQA.Selenium;
using SeleniumTests.Core;

namespace SeleniumTests.Pages
{
    public class AuthPage : BasePage
    {
        public AuthPage(IWebDriver driver) : base(driver) { }

        // Locators for Tabs
        private readonly By SignInTab = By.CssSelector("#radix-\:r6\:-trigger-login");
        private readonly By SignUpTab = By.CssSelector("#radix-\:r6\:-trigger-signup");
        

        // Locators for Login Form
        private By LoginEmailInput = By.Id("login-email");
        private By LoginPasswordInput = By.Id("login-password");
        private By LoginSubmitButton = By.CssSelector("button[type='submit']"); 
        // Note: Multiple submits exist, but the active tab's submit will be clickable. 
        // A more advanced XPath would be: By.XPath("//div[@data-state='active']//button[@type='submit']")

        // Locators for Signup Form
        private By SignupNameInput = By.Id("signup-name");
        private By SignupEmailInput = By.Id("signup-email");
        private By SignupPasswordInput = By.Id("signup-password");

        // Action Methods
        public void GoTo(string url)
        {
            Driver.Navigate().GoToUrl(url + "/auth");
        }

        public void SwitchToSignupTab()
        {
            Click(SignupTab);
        }

        public void SwitchToLoginTab()
        {
            Click(LoginTab);
        }

        public void LoginAs(string email, string password)
        {
            SendKeys(LoginEmailInput, email);
            SendKeys(LoginPasswordInput, password);
            Click(LoginSubmitButton);
        }

        public void SignUpAs(string name, string email, string password)
        {
            SendKeys(SignupNameInput, name);
            SendKeys(SignupEmailInput, email);
            SendKeys(SignupPasswordInput, password);
            // using exact match to avoid active tab complexities if running simple queries
            Click(By.XPath("//div[@data-state='active']//button[@type='submit']"));
        }

        public bool IsLoginEmailInputVisible()
        {
            return IsElementDisplayed(LoginEmailInput);
        }

        public bool IsSignupNameInputVisible()
        {
            return IsElementDisplayed(SignupNameInput);
        }
    }
}
