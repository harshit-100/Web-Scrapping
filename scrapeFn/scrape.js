const pupeteer = require('puppeteer');
const fs = require('fs');
const data = {
    list : []
};

async function main(skill){
    // launcher chromium
    const browser = await pupeteer.launch({headless: false}) ;
    //opern new tab
    const page = await browser.newPage();
    //https://in.indeed.com/jobs?q={skill}&l=Bengaluru%2C+Karnataka
    await page.goto(`https://in.indeed.com/jobs?q=${skill}&l=Bengaluru%2C+Karnataka`,
       {timeout: 0 ,
       waitUntil: 'networkidle0'
    });

    const jobData = await page.evaluate(async (data) => {
        const items = document.querySelectorAll('td.resultContent')
        items.forEach((item, index) => {
            console.log(`scraping data of product: ${index}`)
            const title= item.querySelector('h2.jobTitle>a') && item.querySelector('h2.jobTitle>a').innerText
            const link =item.querySelector('h2.jobTitle>a') && item.querySelector('h2.jobTitle>a').href
            let salary= item.querySelector('div.metadata.salary-snippet-container > div') && item.querySelector('div.metadata.salary-snippet-container > div').innerText
            const companyName = item.querySelector('span.companyName') && item.querySelector('span.companyName').innerText
            if(salary===null){
                salary="not defined"
            }
            data.list.push({
                title:title,
                salary:salary,
                companyName:companyName,
                link:link
            })
        })
        return data;
        }, data)

        console.log(`successfully collected ${jobData.list.length} products`)
       
        let response = await jobData;
        //convert from an object to string and making json file and writing data to it
        let json = await JSON.stringify(jobData,null,2)
        fs.writeFile('jobs.json', json, 'utf8', () => {
            console.log('succesfully written data')
        });

        browser.close();
        
        return response;
}

module.exports = main ;