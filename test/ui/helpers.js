const { By, until } = require("selenium-webdriver");
var locators = require("./locators");

const getAllTabs = () => driver.findElements(By.css(locators.tabs));
const getTabWithIndex = (index) => driver.wait(until.elementLocated(By.css(`${locators.tabs}:nth-of-type(${index})`)));
const getAllBoutiqueImages = () => driver.findElements(By.css(locators.boutiqueImages));
const getBoutiqueWithIndex = (index) => driver.wait(until.elementLocated(By.css(`${locators.boutiques}:nth-of-type(${index})`)));
const getAllProductImages = () => driver.wait(until.elementsLocated(By.css(locators.productImages)));
const getProductWithIndex = (index) => driver.wait(until.elementLocated(By.css(`${locators.products}:nth-of-type(${index})`)));

const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

module.exports = {
    getAllTabs,
    getTabWithIndex,
    getAllBoutiqueImages,
    getBoutiqueWithIndex,
    getAllProductImages,
    getProductWithIndex,
    getRandomNumber
}