const puppeteer = require('puppeteer');
const Mailjet = require( 'node-mailjet')

    const mailjet = new Mailjet({
        apiKey: "68a5c1884d5a914b38d4a43b3d24a33d",
        apiSecret: "f8906ff1397a29254ca894ef0f80bb0f"
    });
    
    const sendMail = async (con) => {
        
      const data = {
        "Messages":[
          {
            "From": {
              "Email": "m@aoo.cz",
              "Name": "Matej"
            },
            "To": [
              {
                "Email": "m@aoo.cz",
                "Name": "Matej"
              }
            ],
            "Subject": "Vlak Regiojet.",
            "TextPart": "Regiojet",
            "HTMLPart": "<p> Remaining: <b> " + con + "</b> </p>",
            "CustomID": "AppGettingStartedTest"
          }
        ]
      }
      if(Number(con) != 0) {
        data.Messages.push(  {
            "From": {
              "Email": "m@aoo.cz",
              "Name": "Matej"
            },
            "To": [
              {
                "Email": "m@aoo.cz",
                "Name": "Matej"
              }
            ],
            "Subject": "Volná Místa!",
            "TextPart": "Yes Volno v Rj Yes",
            "HTMLPart": "<p> Remaining: <b> " + con + "</b> </p>",
            "CustomID": "AppGettingStartedTest"
          })
      }
    
      const result = await mailjet
        .post('send', { version: 'v3.1' })
        .request(data);
    
      const { Status } = result.body.Messages[0];
    }




const main = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://regiojet.cz/?departureDate=2022-08-10&tariffs=REGULAR&fromLocationId=10202031&fromLocationType=CITY&toLocationId=10202003&toLocationType=CITY');
    await page.waitForNetworkIdle()
    const volnaSedadla = await page.evaluate(() => document.querySelector('[aria-label="Spoj 14:18 - 17:15"]').parentElement.parentElement.parentElement.querySelector('span.sr-only').innerText.split("").pop())
    sendMail(volnaSedadla)
    console.log(volnaSedadla);
    await browser.close();

}
main()
