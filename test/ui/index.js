var locators = require("./locators");
var loginData = require("./lodinData");
const { Builder, By, until } = require("selenium-webdriver");
const {
    getAllTabs,
    getTabWithIndex,
    getAllBoutiqueImages,
    getBoutiqueWithIndex,
    getAllProductImages,
    getProductWithIndex,
    getRandomNumber
} = require('./helpers')

const uiTestAutomation = async () => {
    const driver = await initializeDriver();
    global.driver = driver;
    
    try {
        if(Object.values(loginData).some(val => !val)) {
            throw "All login data must be provided in test-data/loginData.js file";
        }

        await driver.get(loginData.pageUrl);
        await driver.manage().window().maximize();
        //TODO
        await driver.manage().setTimeouts({ implicit: 0, pageLoad: 20000, script: 25000 })

        /* 1 - LOGIN */
        login();

        // close pop up
        await driver.wait(until.elementLocated(By.css(locators.popupClose))).click();

        /* 2 - CHECK BOUTIQUE IMAGES */
        const tabsLength = (await getAllTabs()).length;
        for (let index=1; index<=tabsLength; index++) {
            console.log("Checking tab nuber ", index);
            await getTabWithIndex(index).click();
            const boutiqueImageElements = await getAllBoutiqueImages();
            for(const img of boutiqueImageElements) {
                checkIfImageLoaded(img);
            }
            await driver.sleep(500);
        }

        /* 3 - CHECK PRODUCT IMAGES */
        // select a random tab
        const tabIndex = getRandomNumber(1, tabsLength);
        console.log("Openin tab with index ", tabIndex)
        await getTabWithIndex(tabIndex).click();

        // select a random boutique
        const boutiqueCounts = (await getAllBoutiqueImages()).length;
        const boutiqueIndex = getRandomNumber(1, boutiqueCounts);
        console.log("Openin boutique with index ", boutiqueIndex);
        await getBoutiqueWithIndex(boutiqueIndex).click();

        const productImageElements = await getAllProductImages();
        for(const img of productImageElements) {
            checkIfImageLoaded(img);
        }

        /* 4 - SELECT A PRODUCT */

        // select a random product,
        const productIndex = getRandomNumber(1, productImageElements.length);
        console.log("Selecting product with index ", productIndex);

        await getProductWithIndex(productIndex).click();

        /* 5 - ADD PRODUCT TO BASKET */
        await driver.wait(until.elementLocated(By.css(locators.addToBasketButton))).click();

    } finally {
        await driver.quit();
    }
};
const initializeDriver = async () => {
    const parameters = process.argv.slice(3);
    if(parameters.includes("firefox"))
        browser = "firefox";
    else if(parameters.includes("ie"))
        browser = "internet explorer";
    else
        browser = "chrome";

    return await new Builder().forBrowser(browser).build();
}

const login = async () => {
    const popupCloseElement = await driver.wait(until.elementLocated(By.css(locators.fancyboxPopupClose)));
    await popupCloseElement.click();

    actions = driver.actions();
    const loginContainer = await driver.wait(until.elementLocated(By.css(locators.loginContainer)));
    await actions.move({duration: 2000, origin: loginContainer}).perform();

    await driver.wait(until.elementLocated(By.css(locators.loginButton))).click();

    const userNameElement = await driver.wait(until.elementLocated(By.css(locators.loginEmail)));
    await userNameElement.sendKeys(loginData.email);
    const passwordElement = await driver.wait(until.elementLocated(By.css(locators.loginPassword)));
    await passwordElement.sendKeys(loginData.password);
    await driver.wait(until.elementLocated(By.css(locators.loginSubmitButton))).click();
}


const checkIfImageLoaded = async (img) => {
    img.getAttribute("naturalWidth").then(size => {
        if(size === "0"){
            console.log("IMAGE NOT LOADED");
        }
    })
}

uiTestAutomation();