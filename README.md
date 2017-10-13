# Contract Builder

**Let's create a contract!** Oh, boy. What a boring task. Spending hours copying and pasting the same information over and over again, changing names, IDs, addresses, multiple typos. Gosh.  

> "I realized that document automation was a way to save time and increase consistency while reducing errors in documents. So with document automation, I create documents that look professional each and every time. By automating that process rather than recreating it for every document, I’m able to eliminate the errors."
- [Andrew Legrand to http://abovethelaw.com](http://abovethelaw.com/2015/05/todays-tech-how-a-business-lawyer-uses-document-automation-in-his-practice/)

<img src="/screenshots/contract_builder.gif?raw=true" width="890px">

**TESTED ONLY ON GOOGLE CHROME**

## About
Contract Builder is a free open-source project that allows anyone to easily maintain and build any kind of contract (legal documents, lawsuit, rent, agreements, construction and so on) using Google Spreadsheets. This was develop as a personal project to help a friend who was struggling spending up to an hour to make a custom contract, now she is able to do it in less than 5 minutes. Hooray! **[TRY IT NOW](https://blopa.github.io/contract/index.html).**

## Features
- Parse data from Google Spreadsheet
- Use HTML to enhance your contract
- 4 different types of "blocks"
	- Title
	- Subtitle
	- Paragraph
	- List
- Download the contract as .docx

## Usage
First of all you need to create a Google Spreadsheet following the same rules as [this one](https://docs.google.com/spreadsheets/d/1HFGm_cSH_XeZtxfREusftu-4S1LYZeAVSVjWMmsRHtY/copy) (you can make a copy if you like) and populate with your contract informations.
- **id**: The identification of the row, it can be anything but must be unique
- **description**: Short description of the row
- **content**: The actual content that will appear on the contract. Use HTML tags to format this content
- **type**: Type of the block
	- **title**: A title for the contract
	- **title-center**: A centralized title for the contract
	- **subtitle**: A subtitle for the contract
	- **subtitle-center**: A centralized subtitle for the contract
	- **paragraph**: A paragraph for the contract
	- **paragraph-center**: A centralized paragraph for the contract
	- **list**: A basic list
	- **numeric-list**: A list with a incremented number before it
	- **circle-list**: A list with a circle before it
	- **square-list**: A list with a square before it
- **depends**: Put the identification (id) of the row that this row must belong
- **mandatory**: Make the row mandatory, meaning it will not ask to be added to the contract
- **disabled**: Disable row

So whenever you want a part of the contract to be only available when certain other part is on the contract, you should use the ``depends`` field. One row can depend of another row that also depends on another and so on. Use your creativity.

## Libraries
- For the jQuery version ( < 0.0.4 ) of this project I'm using [jQuery](https://github.com/jquery/jquery), [Sheetrock](https://github.com/chriszarate/sheetrock), [html-docx-js](https://github.com/evidenceprime/html-docx-js) and [Bootstrap](https://github.com/twbs/bootstrap).
- For the vue.js version ( > 0.0.4 )of this project I'm using [vue.js](https://github.com/vuejs/vue), [html-docx-js](https://github.com/evidenceprime/html-docx-js) and [Bootstrap](https://github.com/twbs/bootstrap).
- Honorable mentions: [babel](https://github.com/babel/babel), [webpack](https://github.com/webpack/webpack), [Vuex](https://github.com/vuejs/vuex), [IntelliJ IDEA](https://github.com/JetBrains/intellij-community) and [Squarespace](https://logo.squarespace.com).

So a big thanks to all the developers that worked really hard on these libs and make our day easier :D and also a big thanks to [cdnjs.com](https://cdnjs.com/) and [jsdelivr.com](https://www.jsdelivr.com/) for hosting those libs for us.

## Deployment
Run `npm run build` then copy the `dist/` folder into your website root directory. Done.

## Example
You can create complex tree decisions using the field ``depends``. The following ``JSON`` is a result of [this Google Spreadsheet](https://docs.google.com/spreadsheets/d/1HFGm_cSH_XeZtxfREusftu-4S1LYZeAVSVjWMmsRHtY/edit). For a better view of the ``JSON`` [click here](https://codebeautify.org/jsonviewer/cba7783b).
```json
[
 {
  "id": "sample_1",
  "description": "Sample Agreement Title",
  "content": "SAMPLE AGREEMENT",
  "type": "title",
  "depends": "",
  "mandatory": "TRUE",
  "disabled": "",
  "used": false,
  "childs": []
 },
 {
  "id": "sample_2",
  "description": "Description",
  "content": "This Agreement is entered into as of the {{date_day}} day of {{date_month}}, {{date_year}}, between {{the_committee}} and {{the_contractor}}",
  "type": "paragraph",
  "depends": "",
  "mandatory": "FALSE",
  "disabled": "",
  "used": false,
  "childs": []
 },
 {
  "id": "sample_3",
  "description": "Independent Contractor",
  "content": "<b>Independent Contractor</b>. Subject to the terms and conditions of this Agreement, the Committee hereby engages the Contractor as an independent contractor to perform the services set forth herein, and the Contractor hereby accepts such engagement.",
  "type": "numeric-list",
  "depends": "",
  "mandatory": "FALSE",
  "disabled": "TRUE",
  "used": false,
  "childs": []
 },
 {
  "id": "sample_4",
  "description": "Duties, Term, and Compensation",
  "content": "<b>Duties, Term, and Compensation.</b> The Contractor’s duties, term of engagement, compensation and provisions for payment thereof shall be as set forth in the budget which is attached as {{attachment_1}}, which may be amended in writing from time to time, or supplemented with subsequent estimates for services to be rendered by the Contractor and agreed to by the Committee, and which collectively are hereby incorporated by reference.",
  "type": "numeric-list",
  "depends": "",
  "mandatory": "FALSE",
  "disabled": "",
  "used": false,
  "childs": [
   {
    "id": "sample_5",
    "description": "Expenses",
    "content": "<b>Expenses</b>. During the term of this Agreement, the Contractor shall bill and the Committee shall reimburse her for all reasonable and approved out-of-pocket expenses as set forth in {{attachment_1}} which are incurred in connection with the performance of the duties hereunder.",
    "type": "circle-list",
    "depends": "sample_4",
    "mandatory": "FALSE",
    "disabled": "",
    "used": false,
    "childs": []
   },
   {
    "id": "sample_6",
    "description": "Written Reports",
    "content": "<b>Written Reports</b>. The Committee may request that project plans, progress reports and a final results report be provided by Consultant.. A final results report shall be due at the conclusion of the project and shall be submitted to the Committee in a confidential written report at such time. The results report shall be in such form and setting forth such information and data as is reasonably requested by the Committee.",
    "type": "numeric-list",
    "depends": "sample_4",
    "mandatory": "FALSE",
    "disabled": "",
    "used": false,
    "childs": []
   },
   {
    "id": "sample_8",
    "description": "Conflicts of Interest",
    "content": "<b>Conflicts of Interest</b>; The Contractor represents that she is free to enter into this Agreement and that this engagement does not violate the terms of any agreement between the Contractor and {{third_party}}. During the term of this agreement, the Contractor shall devote as much of her productive time, energy and abilities to the performance of her duties hereunder as is necessary to perform the required duties in a timely and productive manner. The Contractor is expressly free to perform services for other parties while performing services for the Committee.",
    "type": "numeric-list",
    "depends": "sample_4",
    "mandatory": "FALSE",
    "disabled": "",
    "used": false,
    "childs": [
     {
      "id": "sample_9",
      "description": "Termination",
      "content": "<b>Termination</b>. The Committee may terminate this Agreement at any time by {{working_days_qty}} working days’ written notice to the Contractor. In addition, if the Contractor is convicted of any crime or offense, fails or refuses to comply with the written policies or reasonable directive of the Committee, is guilty of serious misconduct in connection with performance hereunder, or materially breaches provisions of this Agreement, the Committee at any time may terminate the engagement of the Contractor immediately and without prior written notice to the Contractor",
      "type": "numeric-list",
      "depends": "sample_8",
      "mandatory": "FALSE",
      "disabled": "",
      "used": false,
      "childs": [
       {
        "id": "sample_11",
        "description": "Insurance",
        "content": "<b>Insurance</b>. The Contractor will carry liability insurance (including malpractice insurance, if warranted) relative to any service that she performs for the Committee.",
        "type": "circle-list",
        "depends": "sample_9",
        "mandatory": "FALSE",
        "disabled": "",
        "used": false,
        "childs": [
         {
          "id": "sample_12",
          "description": "Assignment Type A",
          "content": "<b>Assignment</b>. The Contractor shall not assign any of her rights under this Agreement, or delegate the performance of any of her duties hereunder, without the prior written consent of the Committee.",
          "type": "circle-list",
          "depends": "sample_11",
          "mandatory": "TRUE",
          "disabled": "",
          "used": false,
          "childs": []
         },
         {
          "id": "sample_13",
          "description": "Assignment Type B",
          "content": "<b>Assignment</b>. The Contractor shall not assign any of her rights under this Agreement, or delegate the performance of any of her duties hereunder, without the prior written consent of the Committee.",
          "type": "circle-list",
          "depends": "sample_11",
          "mandatory": "TRUE",
          "disabled": "",
          "used": false,
          "childs": [
           {
            "id": "sample_17",
            "description": "Entire Understanding",
            "content": "<b>Entire Understanding</b>. This document and any exhibit attached constitut the entire understanding and agreement of the parties, and any and all prior agreements, understandings, and representations are hereby terminated and canceled in their entirety and are of no further force and effect.",
            "type": "square-list",
            "depends": "sample_13",
            "mandatory": "FALSE",
            "disabled": "",
            "used": false,
            "childs": [
             {
              "id": "sample_18",
              "description": "Unenforceability of Provisions",
              "content": "<b>Unenforceability of Provisions</b>. If any provision of this Agreement, or any portion thereof, is held to be invalid and unenforceable, then the remainder of this Agreement shall nevertheless remain in full force and effect.",
              "type": "square-list",
              "depends": "sample_17",
              "mandatory": "FALSE",
              "disabled": "",
              "used": false,
              "childs": []
             }
            ]
           }
          ]
         },
         {
          "id": "sample_14",
          "description": "Assignment Type C",
          "content": "<b>Assignment</b>. The Contractor shall not assign any of her rights under this Agreement, or delegate the performance of any of her duties hereunder, without the prior written consent of the Committee.",
          "type": "circle-list",
          "depends": "sample_11",
          "mandatory": "TRUE",
          "disabled": "",
          "used": false,
          "childs": []
         },
         {
          "id": "sample_15",
          "description": "Assignment Type D",
          "content": "<b>Assignment</b>. The Contractor shall not assign any of her rights under this Agreement, or delegate the performance of any of her duties hereunder, without the prior written consent of the Committee.",
          "type": "circle-list",
          "depends": "sample_11",
          "mandatory": "TRUE",
          "disabled": "",
          "used": false,
          "childs": []
         }
        ]
       }
      ]
     }
    ]
   }
  ]
 },
 {
  "id": "sample_7",
  "description": "Confidentiality",
  "content": "<b>Confidentiality</b>. Upon the expiration or earlier termination of this Agreement, or whenever requested by the Committee, the Contractor shall immediately deliver to the Committee all such files, records, documents, specifications, information, and other items in her possession or under her control. The Contractor further agrees that she will not disclose her retention as an independent contractor or the terms of this Agreement to any person without the prior written consent of the Committee and shall at all times preserve the confidential nature of her relationship to the Committee and of the services hereunder.",
  "type": "numeric-list",
  "depends": "",
  "mandatory": "TRUE",
  "disabled": "",
  "used": false,
  "childs": []
 },
 {
  "id": "sample_10",
  "description": "Independent Contractor",
  "content": "<b>Independent Contractor</b>. This Agreement shall not render the Contractor an employee, partner, agent of, or joint venturer with the Committee for any purpose. The Contractor is and will remain an independent contractor in her relationship to the Committee. The Committee shall not be responsible for withholding taxes with respect to the Contractor’s compensation hereunder. The Contractor shall have no claim against the Committee hereunder or otherwise for vacation pay, sick leave, retirement benefits, social security, worker’s compensation, health or disability benefits, unemployment insurance benefits, or employee benefits of any kind.",
  "type": "paragraph",
  "depends": "",
  "mandatory": "TRUE",
  "disabled": "",
  "used": false,
  "childs": []
 },
 {
  "id": "sample_16",
  "description": "Modification or Amendment",
  "content": "<b>Modification or Amendment</b>. No amendment, change or modification of this Agreement shall be valid unless in writing signed by the parties hereto.",
  "type": "square-list",
  "depends": "",
  "mandatory": "FALSE",
  "disabled": "",
  "used": false,
  "childs": []
 },
 {
  "id": "sample_19",
  "description": "Witness",
  "content": "IN WITNESS WHEREOF the undersigned have executed this Agreement as of the day and year first written above. The parties hereto agree that facsimile signatures shall be as effective as if originals.",
  "type": "paragraph",
  "depends": "",
  "mandatory": "TRUE",
  "used": false,
  "childs": []
 },
 {
  "id": "sample_20",
  "description": "Signatures",
  "content": "______________________________                                     ______________________________\n{{the_committee}}                                                        {{the_contractor}}\n\n______________________________                                     ______________________________\n{{witness_1}}                                                                {{witness_2}}",
  "type": "paragraph",
  "depends": "",
  "mandatory": "TRUE",
  "disabled": "",
  "used": false,
  "childs": []
 }
]
```

## Screenshot
**[Google Spreadsheet example](https://docs.google.com/spreadsheets/d/1HFGm_cSH_XeZtxfREusftu-4S1LYZeAVSVjWMmsRHtY/copy)**
![ScreenShot](https://raw.githubusercontent.com/blopa/Contract-Builder/master/screenshots/screenshot_1.png)

**Built contract**
![ScreenShot](https://raw.githubusercontent.com/blopa/Contract-Builder/master/screenshots/screenshot_2.png)

**Printing contract**
![ScreenShot](https://raw.githubusercontent.com/blopa/Contract-Builder/master/screenshots/screenshot_3.png)

## Release Notes
- **v0.0.5:**
	- [Feature] Remade everything using Vue.js
	- [Feature] Rich Text working with Google Spreadsheet
- **v0.0.4:**
	- [Feature] Add option to upload .xls Spreadsheet file
	- [Feature] Layout improvements
- **v0.0.3:**
	- [Bugfix] Fix decision tree algorithm
	- [Feature] New layout
- **v0.0.2:**
	- [Feature] Add option to disable row in the Spreadsheet
	- [Bugfix] Fix mandatory children glitch
	- [Bugfix] Fix sheetId always equals to 0
- **v0.0.1:**
	- First working version

## F.A.Q.
**Q: Can you implement <???> function/bot integration?**

A: I can try. Open a issue and I'll see what I can do.

**Q: Your project is awesome. How can I help?**

A: Thank you! You can help by codding more features, creating pull requests, or donating using Bitcoin: **1BdL9w4SscX21b2qeiP1ApAFNAYhPj5GgG**

## TODO
- Add list of recent used documents
- Add option to save a built contract
- Add option to save contract variables

## License
MIT License

Copyright (c) 2017 blopa

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

**Free Software, Hell Yeah!**