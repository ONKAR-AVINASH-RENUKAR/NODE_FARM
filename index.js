const fs = require('fs');
const http = require('http');
const url = require('url');
const slug = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

///////////////////;////////FILE////////////////////////////
//Blocking, Synchronous way
////////////////////////////////////////////////////////
/* const textIn = fs.readFileSync('1-node-farm/starter/txt/input.txt','utf-8');
console.log(textIn);

const textOut = `this is what we know about readFileSync ${textIn}/n created on ${Date.now()}`;

fs.writeFileSync('1-node-farm/starter/txt/output.txt', textOut);
console.log("file Written!");
 */

//Un-Blocking, Asynchronous
// fs.readFile('1-node-farm/starter/txt/input.txt','utf-8',(err,data1)=>{
//     if(err) return console.log("ERROR!!");
//     fs.readFile('1-node-farm/starter/txt/start.txt',(err,data2)=>{
//         fs.readFile(`1-node-farm/starter/txt/${data2}.txt`,(err,data3)=>{
//             fs.writeFile('1-node-farm/starter/txt/final.txt',`${data1}\n${data3}`,'utf-8',err=>{
//                 console.log("DONE!!!");
//             });
//         });
//     });
// });

/////////////////////////////SERVER///////////////////////

const templateOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
); //locates the current file directory and template_overview in it
const templateProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
); //locates the current file directory and template-product in it
const templateCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
); //locates the current file directory and template-card in it

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8'); //locates the current file directory
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) =>
  slug(el.productName, {
    lower: true,
  })
);
console.log(slugs);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //OVERVIEW PAGE
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const cardHtml = dataObj
      .map((el) => replaceTemplate(templateCard, el))
      .join(''); //here it converts the ARRAY dataObj into map which holds the output of replaceTemplate function which returns the replaced elements of cardHtml.
    const output = templateOverview.replace('{%PRODUCT_CARDS%}', cardHtml);
    res.end(output);

    //PRODUCT PAGE
  } else if (pathname === '/product') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const product = dataObj[query.id];
    const output = replaceTemplate(templateProduct, product);
    res.end(output);

    //API
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json',
    }); //this statement tells browser that the response is in JSON format
    res.end(data);
    //NOT-FOUND
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
    });
    res.end('<h1>Page not Found!</h1> ');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to request on port 8000 !!');
});
