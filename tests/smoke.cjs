const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const types = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.woff2':'font/woff2'};
const server = http.createServer((req,res) => {let filename=path.join(root,decodeURIComponent(req.url.split('?')[0] === '/' ? '/index.html' : req.url.split('?')[0]));if(!filename.startsWith(root+path.sep)){res.writeHead(403).end();return;}fs.readFile(filename,(error,data)=>{if(error){res.writeHead(404).end();return;}res.writeHead(200,{'Content-Type':types[path.extname(filename)]||'application/octet-stream'});res.end(data);});});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch(process.env.CHROME_PATH ? {executablePath:process.env.CHROME_PATH} : {});
 try {
 const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
 const url=process.env.TEST_URL||`http://127.0.0.1:${server.address().port}`;await page.goto(url);await page.evaluate(()=>document.fonts.ready);
 assert.equal(await page.locator('.chapter').count(),7);assert.equal(await page.locator('img').count(),0);assert.equal(await page.locator('#sound').getAttribute('aria-pressed'),'true');
 for(const section of await page.locator('.chapter').all()){await section.scrollIntoViewIfNeeded();await page.waitForTimeout(850);}
 await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(250);
 await page.screenshot({path:process.env.SCREENSHOT_PATH||path.join(root,'test-results/desktop.png'),fullPage:true});
 await page.locator('#motion').click();
 await page.locator('#begin').click();await page.waitForFunction(()=>document.querySelector('#sound').getAttribute('aria-pressed')==='true');await page.waitForFunction(()=>audioContext.state==='running');await page.locator('#sound').click();await page.locator('#begin').click();assert.equal(await page.locator('#sound').getAttribute('aria-pressed'),'false');
 await page.locator('.note').first().click();assert.equal(await page.locator('.note').first().getAttribute('aria-pressed'),'true');
 await page.locator('#envelope').click();await page.locator('#letter-paper').waitFor({state:'visible'});assert.match(await page.locator('#letter-paper').innerText(),/May Allah bless you/);await page.locator('#close-letter').click();assert.equal(await page.locator('#letter-paper').isVisible(),false);
 await page.locator('#gift').click();await page.locator('#cake-stage').waitFor({state:'visible'});assert.equal(await page.locator('.cake').evaluate(e=>e.classList.contains('lit')),true);await page.locator('#candle-action').click();assert.match(await page.locator('#wish-message').textContent(),/May all your wishes/);assert.equal(await page.locator('.cake').evaluate(e=>e.classList.contains('lit')),false);await page.locator('#cake-reset').click();assert.equal(await page.locator('#candle-action').textContent(),'Blow out the candles');
 await page.locator('#heart').click();assert.equal(await page.locator('#award').isVisible(),true);await page.locator('#replay').click();assert.equal(await page.locator('#gift-stage').isVisible(),true);assert.equal(await page.locator('#cake-stage').isVisible(),false);assert.equal(await page.locator('#award').isVisible(),false);
 for(const width of [320,360,390,430,768,1440]){await page.setViewportSize({width,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`overflow at ${width}`);}
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});await page.reload();await page.locator('body').click({position:{x:10,y:120}});await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.screenshot({path:path.join(root,'test-results/mobile.png'),fullPage:true});assert.equal(await page.locator('html').evaluate(e=>e.classList.contains('motion-paused')),true);
 await page.locator('#gift').click();await page.locator('#candle-action').click();assert.equal(await page.locator('#balloons i').count(),0);
 for(const width of [320,390,430]) {
 await page.setViewportSize({width,height:844});
 await page.locator('#replay').click();
 await page.locator('#envelope').click();await page.locator('#letter-paper').waitFor({state:'visible'});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`letter overflow at ${width}`);
 await page.locator('#close-letter').click();
 await page.locator('#gift').click();await page.locator('#cake-stage').waitFor({state:'visible'});
 assert.equal(await page.locator('.cake').evaluate(e=>e.classList.contains('lit')),true);
 await page.locator('#candle-action').click();assert.match(await page.locator('#wish-message').textContent(),/May all your wishes/);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`cake overflow at ${width}`);
 }
 assert.deepEqual(errors,[]);console.log('PASS: seven chapters, default sound, no photo placeholders, notes, envelope, cake, replay, six viewport widths and phone letter/cake/replay flows, reduced motion, no console or network errors.');
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
