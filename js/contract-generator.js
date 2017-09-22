// globals
var docObject = [];
var collDependency = [];
var collection;
var draggableDiv = document.getElementById("pick-option");
var isDown = false;

draggableDiv.addEventListener('mousedown', function(e) {
	isDown = true;
	offset = [
		draggableDiv.offsetLeft - e.clientX,
		draggableDiv.offsetTop - e.clientY
	];
}, true);

document.addEventListener('mouseup', function() {
	isDown = false;
}, true);

document.addEventListener('mousemove', function(event) {
	event.preventDefault();
	if (isDown) {
		mousePosition = {
			x : event.clientX,
			y : event.clientY
		};
		draggableDiv.style.left = (mousePosition.x + offset[0]) + 'px';
		draggableDiv.style.top  = (mousePosition.y + offset[1]) + 'px';
	}
}, true);

function arraysEqual(arr1, arr2) {
	if(arr1.length !== arr2.length)
		return false;
	for(var i = arr1.length; i--;) {
		if(arr1[i] !== arr2[i])
			return false;
	}
	return true;
}

function findFather(objSearch, objAdd, idx)
{
	var found = false;
	objSearch.filter(function(item){ // find item father of the dependency
		if (!found)
		{
			if (item.id === objAdd.depends)
			{
				collDependency.splice(idx, 1); // remove current item
				item.childs.push(objAdd);
				found = true;
			}
			else if (item.childs.length > 0)
			{
				found = findFather(item.childs, objAdd, idx);
			}
		}
	});
	return found;
}

var sheetCallback = function (error, options, response) {
	if (!error) {
		//debugger;
		//console.log(response.rows);
		// making sure it will work even if order changes
		var idIndex = response.rows[0].labels.indexOf('id');
		var descriptionIndex = response.rows[0].labels.indexOf('description');
		var contentIndex = response.rows[0].labels.indexOf('content');
		var typeIndex = response.rows[0].labels.indexOf('type');
		var dependsIndex = response.rows[0].labels.indexOf('depends');
		var mandatoryIndex = response.rows[0].labels.indexOf('mandatory');
		var disabledIndex = response.rows[0].labels.indexOf('disabled');
		//debugger;

		if (arraysEqual(response.rows[0].cellsArray, response.rows[0].labels))
			collection = response.rows.slice(1, response.rows.length); // remove labels
		else
			collection = response.rows; // remove labels
		collection.filter(function(item){ // get all objects that has no dependency
			if (item.cellsArray[dependsIndex] === "")
			{
				var tempObject = Object();
				tempObject.id = item.cellsArray[idIndex];
				tempObject.description = item.cellsArray[descriptionIndex];
				tempObject.content = item.cellsArray[contentIndex];
				tempObject.type = item.cellsArray[typeIndex];
				tempObject.depends = item.cellsArray[dependsIndex];
				tempObject.mandatory = item.cellsArray[mandatoryIndex];
				tempObject.disabled = item.cellsArray[disabledIndex];
				tempObject.used = false;
				tempObject.childs = [];
				if (tempObject.disabled.toLowerCase() === "false") // ignore disabled rows
					return;

				docObject.push(tempObject);
			}
		});
		collDependency = collection.filter(function(item){ // get all objects that has dependency
			return ((item.cellsArray[dependsIndex] !== "") && (item.cellsArray[disabledIndex].toLowerCase() !== "false"));
		});
		var tempColl = [];
		var i = 0;
		var stop = false;
		var message = "";
		//while (collDependency.length > 0) {
		while ((!stop) && (collDependency.length > 0)) {
			tempColl = collDependency;
			$(tempColl).each(function(index){
				if (!stop)
				{
					var tempObject = Object();
					tempObject.id = this.cellsArray[idIndex];
					tempObject.description = this.cellsArray[descriptionIndex];
					tempObject.content = this.cellsArray[contentIndex];
					tempObject.type = this.cellsArray[typeIndex];
					tempObject.depends = this.cellsArray[dependsIndex];
					tempObject.mandatory = this.cellsArray[mandatoryIndex];
					tempObject.disabled = this.cellsArray[disabledIndex];
					tempObject.used = false;
					tempObject.childs = [];

					if (tempObject.id === tempObject.depends)
					{
						stop = true;
						message = "an item cannot depend of itself";
						return;
					}

					stop = !findFather(docObject, tempObject, index - i);
					i++;
				}
			});

			if (stop)
			{
				if (message !== "")
					window.alert(message);
			}
		}

		localStorage.setItem('CG-decisionsTree', JSON.stringify(docObject));
		//localStorage.setItem('CG-decisionPath', JSON.stringify(docObject));
		localStorage.removeItem('CG-brothersIds');
		localStorage.removeItem('CG-vueVars');
		localStorage.removeItem('CG-listStyles');
		localStorage.removeItem('CG-decisionPath');
		//localStorage.removeItem('CG-savedVueVars');

		var startBtn = $('<input/>').attr({class:'btn btn-primary', id:'start-btn', type: 'button', value:'Start', onClick:'startDecisions()'});
		$("#content").append(startBtn);
		$("#main-message").text("Let's get started :D");
	}
	else
	{
		//$("#main-message").text("Connection error. Please try again.");
		window.alert("Connection error. Please try again.");
		window.location.href = window.location.href.split("?")[0];
	}
};

// Processing starts here
var url = new URL(location);
var spreadsheetId = url.searchParams.get("spreadsheetId"); // 1HFGm_cSH_XeZtxfREusftu-4S1LYZeAVSVjWMmsRHtY
var sheetId = url.searchParams.get("sheetId"); // 3214345
if ((spreadsheetId) && (sheetId))
{
	sheetrock({
		url: "https://docs.google.com/spreadsheets/d/" + spreadsheetId + "/edit#gid=" + sheetId,
		callback: sheetCallback
	});
}
else{
	$("#main-message").text("Contract Generator");
	var innerDiv = $('<div/>').attr({id:'parse-sheet'});
	var paragraph = $('<p>').text("Paste your Google Spreadsheet URL").attr({class:'align-center'});
	var input = $('<input/>').attr({type:'text', id:'sheet-input', class:'form-control', placeholder:'Paste your Google Spreadsheet URL here.', value:'https://docs.google.com/spreadsheets/d/1HFGm_cSH_XeZtxfREusftu-4S1LYZeAVSVjWMmsRHtY/'});
	var startBtn = $('<input/>').attr({class:'btn btn-primary', id:'sheet-btn', type: 'button', value:'Go!', onClick:'parseSpreadsheet()'});
	paragraph.append(input);
	innerDiv.append(paragraph).append(startBtn);
	$("#content").append(innerDiv);
}

// FUNCTIONS
function parseSpreadsheet()
{
	//debugger;
	var resourceUrl = $("#sheet-input").val();
	var spreadsheetId = new RegExp("/spreadsheets/d/([a-zA-Z0-9-_]+)").exec(resourceUrl);
	if (spreadsheetId)
		spreadsheetId = spreadsheetId[1];
	var sheetId = new RegExp("[#&]gid=([0-9]+)").exec(resourceUrl);
	if (sheetId)
		sheetId = sheetId[1];
	else
		sheetId = "0";
	var url = window.location.href.split("?")[0]; // remove all parameters
	if ((spreadsheetId) && (sheetId))
	{
		url += '?spreadsheetId=' + spreadsheetId + '&sheetId=' + sheetId;
		window.location.href = url;
	}
	else
		window.alert("This isn't a valid Google Spreadsheet URL.");
}

function startDecisions()
{
	$("#start-btn").toggle();
	$("#main-message").html("").toggle();
	$("#vars-menu").show();
	var decisionsTree = JSON.parse(localStorage.getItem('CG-decisionsTree'));
	var decisionsDiv = $('<div/>').attr({id:'decisions'});
	//var pickOption = $('<div/>').attr({id:'pick-option', class:'no-print'});
	//var pickOption = $('#pick-option');
	var content = $("#content");
	content.append(decisionsDiv);
	content.css('background-color', '#ffffff');
	//var ids = [];
	//debugger;
	generateChoices(decisionsTree); // first call to genHTML
}

function generateChoices(json)
{
	//window.alert("hello world");
	var pickOption = $('#pick-option');
	pickOption.show();
	$('#sheet-effect').show();
	pickOption.html("");
	var found = false;
	var decisionPath = JSON.parse(localStorage.getItem('CG-decisionPath'));
	var tempPaths = [];
	var mandCount = 0;
	var jsonCount = json.length;
	if (decisionPath instanceof Array)
	{

	}
	else
	{
		decisionPath = [];
	}
	$(json).each(function(index){
		debugger;
		if (!found)
		{
			if (this.mandatory.toLowerCase() === "true")
			{
				generateHTMLContent(this);
				mandCount++;
				if (this.childs.length > 0)
				{
					localStorage.setItem('CG-decisionPath', JSON.stringify(decisionPath));
					found = !generateChoices(this.childs);
				}
			}
			else
			{
				var innerDiv = $('<div/>').attr({id:'pick-inner'});
				var paragraph = $('<p>').html('<b>Use "' + this.description + '"?</b>');
				var btnYes = $('<input/>').attr({class:'btn btn-primary btn-pick no-print', id:'btn_' + this.id, type: 'button', value:'Yes', onClick:"parseJson(true, '" + this.id + "', '')"});
				var btnNo = $('<input/>').attr({class:'btn btn-primary btn-pick no-print', id:'btn_' + this.id, type: 'button', value:'No', onClick:"parseJson(false, '" + this.id + "', '')"});
				innerDiv.append(paragraph).append(btnYes).append(btnNo);
				pickOption.append(innerDiv);
				this.used = true;
				found = true;
			}
		}
		else
		{
			tempPaths.push(this);
		}
	});
	if (tempPaths.length > 0)
		decisionPath = tempPaths.concat(decisionPath); // merges arrays
	localStorage.setItem('CG-decisionPath', JSON.stringify(decisionPath));
	if (mandCount >= jsonCount)
		found = generateChoices(decisionPath);

	return found;
}

function parseJson(add, item, json)
{
	//debugger;
	$("#pick-option").html("");
	var found = false;
	var hasChoice = false;
	if (json === "")
		json = JSON.parse(localStorage.getItem('CG-decisionsTree'));
	if (add)
	{
		$(json).each(function(index){
			if (!found)
			{
				//debugger;
				if (this.id === item)
				{
					found = generateHTMLContent(this);
					this.used = true;
					if (this.childs.length > 0)
					{
						//debugger;
						hasChoice = generateChoices(this.childs, false);
					}
					else
						hasChoice = generateChoices(json, true);
				}
				else if (this.childs.length > 0)
				{
					//debugger;
					found = parseJson(add, item, this.childs);
				}
			}
		});
	}
	else
		hasChoice = generateChoices(json, true);

	return found;
}

function generateHTMLContent(item)
{
	var exists = $('#' + item.id);
	var pickOption = $("#pick-option");
	//pickOption.html("");
	if (exists.length > 0)
	{
		pickOption.hide("");
		return false;
	}
	var innerDiv = $('<div/>').attr({id:item.id});
	var decisionsDiv = $("#decisions");
	var content;

	if (item.type === 'list')
	{
		$('#list-style').show();
		var lastElement = decisionsDiv.children().last().prev();
		var lastElemName = lastElement.children().last().prop("nodeName");
		if (lastElemName === "UL")
		{
			//var qty = lastElement.find("ul").length;
			var lastLi = lastElement.children().last().children();
			var qty = parseInt(window.getComputedStyle(lastLi[0],':before').content.replace('"', ''));
			var numberClass = 'number-' + (++qty);
			content = $("<ul>").append($("<li>").html(item.content).attr({class:'list ' + numberClass})); // change to .text to not parse as HTML
			$('#custom-styles').append($('<style>.' + numberClass + ':before {content: "' + qty + '";margin-left: -20px;margin-right: 10px;}</style>'));
		}
		else
		{
			content = $("<ul>").append($("<li>").html(item.content).attr({class:'list number-1'})); // change to .text to not parse as HTML
			$('#custom-styles').append($('<style>.number-1:before {content: "1";margin-left: -20px;margin-right: 10px;}</style>'));
		}
	}
	else if (item.type === 'numeric-list')
	{
		var lastElement = decisionsDiv.children().last().prev();
		var lastElemName = lastElement.children().last().prop("nodeName");
		if (lastElemName === "UL")
		{
			//var qty = lastElement.find("ul").length;
			var lastLi = lastElement.children().last().children();
			var qty = parseInt(window.getComputedStyle(lastLi[0],':before').content.replace('"', ''));
			if (isNaN(qty))
				qty = 0;
			var numberClass = 'number-' + (++qty);
			content = $("<ul>").append($("<li>").html(item.content).attr({class:'list ' + numberClass})); // change to .text to not parse as HTML
			$('#custom-styles').append($('<style>.' + numberClass + ':before {content: "' + qty + '";margin-left: -20px;margin-right: 10px;}</style>'));
		}
		else
		{
			content = $("<ul>").append($("<li>").html(item.content).attr({class:'list number-1'})); // change to .text to not parse as HTML
			$('#custom-styles').append($('<style>.number-1:before {content: "1";margin-left: -20px;margin-right: 10px;}</style>'));
		}
	}
	else if (item.type === 'circle-list')
		content = $("<ul>").append($("<li>").html(item.content).attr({class:'list circle-list'})); // change to .text to not parse as HTML
	else if (item.type === 'square-list')
		content = $("<ul>").append($("<li>").html(item.content).attr({class:'list square-list'})); // change to .text to not parse as HTML
	else if (item.type === 'title')
		content = $("<h1>").html(item.content); // change to .text to not parse as HTML
	else if (item.type === 'subtitle')
		content = $("<h2>").html(item.content); // change to .text to not parse as HTML
	else if (item.type === 'paragraph')
		content = $("<p>").html(item.content); // change to .text to not parse as HTML

	innerDiv.append(content);
	decisionsDiv.append(innerDiv);
	decisionsDiv.append(pickOption);

	// var match = item.content.match(/{{\s*[\w\.]+\s*}}/g);
	// if (match)
	// {
	// 	//debugger;
	// 	var vueTemp = match.map(function(x) { return x.match(/[\w\.]+/)[0]; });
	// 	if (vueTemp.length > 0)
	// 		updateVarsMenu(vueTemp, item.id);
	// }
	return true;
}

function pxToMm(px){
	var mm = $('#my_mm');
	mm.show();
	var math = Math.floor(px/mm.height());
	mm.hide();
	return math; // JQuery returns sizes in PX
};

function updateMargin(data){
	var margin = data.className.split(' ')[0]; // get first class name
	var content = $("#content");

	if (margin === "margin-top")
	{
		debugger;
		var sheet = $("#sheet-effect");
		var margin = pxToMm(parseInt(sheet.css("margin-top"))) - (parseInt(data.value) - pxToMm(parseInt(content.css("padding-top"))));
		sheet.css('margin-top', margin + "mm");
		content.css('padding-top', data.value + "mm");
	}
	if (margin === "margin-right")
		content.css('padding-right', data.value + "mm");
	if (margin === "margin-bottom")
		content.css('padding-bottom', data.value + "mm");
	if (margin === "margin-left")
	{
		var sheet = $("#sheet-effect");
		var margin = pxToMm(parseInt(sheet.css("margin-left"))) - (parseInt(data.value) - pxToMm(parseInt(content.css("padding-left"))));
		sheet.css('margin-left', margin + "mm");
		content.css('padding-left', data.value + "mm");
	}
}

function preparePrint()
{
	window.print();
}

function prepareDownload(contentId)
{
	//debugger;
	var htmlDoc = $('#' + contentId).html();
	htmlDoc = htmlDoc.replace(/(?:\r\n|\r|\n)/g, '<br/>');
	htmlDoc = htmlDoc.replace(/  /g, "&nbsp;&nbsp;"); // replace double whitespaces by double &nbsp;
	var converted = htmlDocx.asBlob(htmlDoc);
	saveAs(converted, 'contract.docx');
	//downloadFile(htmlDoc, "sample.docx", "text/html");
}

//function downloadFile(data, name, type) {
//	if (data !== null && navigator.msSaveBlob)
//		return navigator.msSaveBlob(new Blob([data], { type: type }), name);
//	var a = $("<a style='display: none;'/>");
//	var url = window.URL.createObjectURL(new Blob([data], {type: type}));
//	a.attr("href", url);
//	a.attr("download", name);
//	$("body").append(a);
//	a[0].click();
//	window.URL.revokeObjectURL(url);
//	a.remove();
//}
