const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');

const scrapeRes = [{
    name: 'String',
    family: 'String',
    ranks: 'Array Strings',
    occupation: 'Array Strings',
    position: 'Array Strings',
    affiliations: 'Array Strings',
    bioUrl: 'String'
}]

// primary page
async function charList(page) {
    const data = [];

    const pageUrls = ['', '/Rankers'];

    for (var x = 0; x < pageUrls.length; x++) {
        await page.goto('https://towerofgod.fandom.com/wiki/List_of_Characters'+ pageUrls[x]);
        const html = await page.content();
        const $ = cheerio.load(html);
        // test
        // fs.writeFileSync('./test.html', html);

        $('#mw-content-text > table > tbody > tr:nth-child(2) > td > div > table > tbody > tr:nth-child(2) > td > center > big').each((i, el) => {
            const nameEl = $(el).find('a > span');
            const bioUrlEl = $(el).find('a')

            const name = $(nameEl).text();
            const bioUrl = 'https://towerofgod.fandom.com/' + $(bioUrlEl).attr('href');

            const dataRow = {
                name,
                bioUrl
            }
        data.push(dataRow);
        })
        await sleep(2000);
    }
    return data
}

// sleep
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// writeFile
async function writeFile(chars) {
    fs.writeFile('../data/data.json', JSON.stringify(chars, null, 4), (err) => {
        console.log('Write file success.')
    })
}

// main
async function main() {
    const browser = await puppeteer.launch({
        headless: true
    });
    const page = await browser.newPage();

    const charsData = await charList(page);
    // ...
    writeFile(charsData);
}
main();