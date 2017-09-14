# Contract Builder

**Let's create a contract!** Oh, boy. What a boring task. Spending hours copying and pasting the same information over and over again, changing names, IDs, addresses, multiple typos. Gosh.  

> "I realized that document automation was a way to save time and increase consistency while reducing errors in documents. So with document automation, I create documents that look professional each and every time. By automating that process rather than recreating it for every document, I’m able to eliminate the errors."
- [Andrew Legrand to http://abovethelaw.com](http://abovethelaw.com/2015/05/todays-tech-how-a-business-lawyer-uses-document-automation-in-his-practice/)

<img src="/screenshots/contract_builder.gif?raw=true" width="890px">

**TESTED ONLY ON GOOGLE CHROME**

## About
Contract Builder is a free open-source project that allows anyone to easily maintain and build any kind of contract (legal documents, lawsuit, rent, agreements, construction and so on) using Google Spreadsheets. This was develop as a personal project to help´a friend who was struggling spending up to an hour to make a custom contract, now she is able to do it in less than 5 minutes. Hooray! **[TRY IT NOW](https://blopa.github.io/contract/index.html).**

## Libraries
For this project I'm using [Jquery](https://github.com/jquery/jquery), [Sheetrock](https://github.com/chriszarate/sheetrock), [html-docx-js](https://github.com/evidenceprime/html-docx-js) and [Bootstrap](https://github.com/twbs/bootstrap), so a big thanks to all the developers that worked really hard on these libs and make our day easier :D and also a big thanks to [cdnjs.com](https://cdnjs.com/) and [jsdelivr.com](https://www.jsdelivr.com/) for hosting those libs for us.

## Features
- Parse data from Google Spreadsheet
- Use HTML to enhance your contract
- 4 different types of "blocks"
	- Title
	- Subtitle
	- Paragraph
	- List
- Save it as .docx

## Usage
First of all you need to create a Google Spreadsheet following the same rules as [this one](https://docs.google.com/spreadsheets/d/1HFGm_cSH_XeZtxfREusftu-4S1LYZeAVSVjWMmsRHtY/copy) (you can make a copy if you like) and populate with your contract informations.
- **id**: The identification of the row, it can be anything but must be unique
- **description**: Short description of the row
- **content**: The actual content that will appear on the contract. Use HTML tags to format this content
- **type**: Type of the block
	- **title**: A title for the contract
	- **subtitle**: A subtitle for the contract
	- **paragraph**: A paragraph for the contract
	- **list**: A basic list
	- **numeric-list**: A list with a incremented number before it
	- **circle-list**: A list with a circle before it
	- **square-list**: A list with a square before it
- **depends**: Put the identification (id) of the row that this row must belong
- **mandatory**: Make the row mandatory, meaning it will not ask to be added to the contract

So whenever you want a part of the contract to be only available when certain other part is on the contract, you should use the ``depends`` field. One row can depend of another row that also depends on another and so on. Use your creativity.

## Screenshot
**Google Spreadsheet example**
![ScreenShot](https://raw.githubusercontent.com/blopa/Contract-Builder/master/screenshots/screenshot_1.png)

**Built contract**
![ScreenShot](https://raw.githubusercontent.com/blopa/Contract-Builder/master/screenshots/screenshot_2.png)

**Printing contract**
![ScreenShot](https://raw.githubusercontent.com/blopa/Contract-Builder/master/screenshots/screenshot_3.png)

## Release Notes
- **v0.0.1:**
	- First working version

## F.A.Q.
**Q: Can you implement <???> function/bot integration?**

A: I can try. Open a issue and I'll see what I can do.

**Q: Your project is awesome. How can I help?**

A: Thank you! You can help by codding more features, creating pull requests, or donating using Bitcoin: **1BdL9w4SscX21b2qeiP1ApAFNAYhPj5GgG**

## TODO
- Create TODO list


## License
Free. Don't forget to star :D and send pull requests. :D

**Free Software, Hell Yeah!**