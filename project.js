let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");
let path = require("path");
let xlsx = require("xlsx");


request("https://news24online.com",MainPage)
function MainPage(err,res,html)
{
    let stool = cheerio.load(html);
    let homepage = stool("ul.nav__menu li a");
    for(let i=0;i<homepage.length;i++)
    { 
       if(i!=10 && i!=3 && i!=0)
        {
         let href = stool(homepage[i]).attr("href");
         let categories = stool(homepage[i]).text();
        //  console.log(categories);
         let fUrl = "https://news24online.com"+href;
        //  console.log(fUrl);
        findDataofPage(fUrl,categories);
        }
      
    }
   
}    
function findDataofPage(url,categories)
{

    request(url,finalpage); 
   
     function finalpage(err,response,html)
     {
        let stool = cheerio.load(html);
        let categoriesName = categories;
        // console.log(categoriesName);
        let hLine = stool("div.col-lg-7.col-md-7.col-sm-12.col-xs-12 h3 a");

        for(i=0;i<hLine.length;i++)
        {
            let Headl = stool(hLine[i]).text();
            // console.log(Headl);
            processData(categoriesName,Headl)
        }
     }
}     

function processData(catgry,head)
{
    let dirPath = "News 24";
    let CData=
    {
        Category:catgry,
        Headline:head
    }

    if (fs.existsSync(dirPath))
    {

    }
    else
    {
        fs.mkdirSync(dirPath);
    }
    let Path= path.join(dirPath,catgry+".xlsx");
    let Data=[];

    if(fs.existsSync(Path))
    {
    Data=excelReader(Path,catgry)
    Data.push(CData);
    }

    else
    {
    console.log(Path,"created");
    Data=[CData];
    }
    excelWriter(Path,Data,catgry);
}

function excelReader(Path,catgry) 
{
    if (!fs.existsSync(Path)) 
    {
        return null;
    } 
    else
    {
    let wt = xlsx.readFile(Path);
    let excelData = wt.Sheets[catgry];
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans;
    }
}

function excelWriter(Path, json, catgry) 
{
    let newWB = xlsx.utils.book_new();
    let newWS = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWB, newWS, catgry); 
    xlsx.writeFile(newWB, Path);
}
