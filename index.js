const puppeteer = require('puppeteer');
// const Mailjet = require( 'node-mailjet')
const fetch = require('node-fetch')
    // const mailjet = new Mailjet({
    //     apiKey: "68a5c1884d5a914b38d4a43b3d24a33d",
    //     apiSecret: "f8906ff1397a29254ca894ef0f80bb0f"
    // });
    
    // const sendMail = async (con) => {
        
    //   const data = {
    //     "Messages":[
    //       {
    //         "From": {
    //           "Email": "m@aoo.cz",
    //           "Name": "Matej"
    //         },
    //         "To": [
    //           {
    //             "Email": "matej.holubec@gmail.com",
    //             "Name": "Matej"
    //           }, {
                
    //           }
    //         ],
    //         "Subject": (Number(con[0]) === 0) ? "RegioFullJet" : "Volno v Jetu",
    //         "TextPart": "Regiojet",
    //         "HTMLPart": "Regiojet <p> Remaining: <b> " + con[0] + "</b> </p> <p> <i> " + con[1] + "</i> </p>",
    //         "CustomID": "AppGettingStartedTest"
    //       }
    //     ]
    //   }
    //   // if(Number(con) != 0) {
    //   //   data.Messages.push(  {
    //   //       "From": {
    //   //         "Email": "m@aoo.cz",
    //   //         "Name": "Matej"
    //   //       },
    //   //       "To": [
    //   //         {
    //   //           "Email": "m@aoo.cz",
    //   //           "Name": "Matej"
    //   //         }
    //   //       ],
    //   //       "Subject": "Volná Místa!",
    //   //       "TextPart": "Yes Volno v Rj Yes",
    //   //       "HTMLPart": "Yes Volno v Rj Yes <p> Remaining: <b> " + con + "</b> </p>",
    //   //       "CustomID": "AppGettingStartedTest"
    //   //     })
    //   // }
    
    //   const result = await mailjet
    //     .post('send', { version: 'v3.1' })
    //     .request(data);
    
    //   const { Status } = result.body.Messages[0];
    //   // // console.log(Status);
    // }

    const sendWhat = async (con) => {

      let text = "RegioJet: *" + con[0] + "* míst volných.\n _" + con[1] + "_"

      const re = await fetch(`https://api.callmebot.com/whatsapp.php?phone=+420733612260&text=${text}&apikey=687142`)
      console.log(re);
    }



const main = async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://regiojet.cz/?departureDate=2022-08-10&tariffs=REGULAR&fromLocationId=10202031&fromLocationType=CITY&toLocationId=10202003&toLocationType=CITY');
    await page.waitForNetworkIdle()
    const mainel = await page.$('[aria-label="Spoj 14:18 - 17:15"]')
    console.log(mainel);
    const num = await page.evaluate((el) => {
      el.click()
     return el.parentElement.parentElement.parentElement.querySelector('span.sr-only').innerText.split(" ").pop()
    }, mainel)
    
    console.log(num);
    
    await page.waitForNetworkIdle({idleTime: 1000})

    const volnaSedadla = await page.evaluate( () => {
     
      const a = document.querySelector('[aria-label="Volná sedadla"]')
      console.log(a);
      const volno = a.getElementsByTagName("li")
      console.log(volno);
      let txt = ""
      for (let i = 0; i < volno.length; i++) {
        txt += volno[i].innerText + "\n";
        
      }
      return txt
    })
    browser.close()
    sendWhat([num, volnaSedadla]);

}
main()
