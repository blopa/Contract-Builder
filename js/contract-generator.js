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
		debugger;

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
		localStorage.setItem('CG-currentNode', JSON.stringify(docObject));
		localStorage.removeItem('CG-decisionPath');
		localStorage.removeItem('CG-tempPath');
		localStorage.removeItem('CG-vueVars');
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
	$("#parse-sheet").show();
	// var innerDiv = $('<div/>').attr({id:'parse-sheet'});
	// var paragraph = $('<p>').text("Paste your Google Spreadsheet URL").attr({class:'align-center'});
	// var input = $('<input/>').attr({type:'text', id:'sheet-input', class:'form-control', placeholder:'Paste your Google Spreadsheet URL here.', value:'https://docs.google.com/spreadsheets/d/1HFGm_cSH_XeZtxfREusftu-4S1LYZeAVSVjWMmsRHtY/'});
	// var startBtn = $('<input/>').attr({class:'btn btn-primary', id:'sheet-btn', type: 'button', value:'Go!', onClick:'parseSpreadsheet()'});
	// paragraph.append(input);
	// innerDiv.append(paragraph).append(startBtn);
	// $("#content").append(innerDiv);
}

// FUNCTIONS
function parseUpload(item)
{
	//debugger;
	var file = item.files[0];
	if (!file) {
		return;
	}
	var reader = new FileReader();
	reader.onload = function(event) {
		//debugger;
		var data = event.target.result;
		var workbook = XLSX.read(data, {type: 'binary'});
		workbook.SheetNames.forEach(function(sheetName) {
			debugger;
			// var XL_row_object = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {raw: true});
			// var json_object = JSON.stringify(XL_row_object);
			var jsonObject = workbook.Sheets[sheetName];
			var len = Object.keys(jsonObject).length;
			var cloneObj = JSON.parse(JSON.stringify(jsonObject));
			for (var i = 0; i < len; i++)
			{
				var objKey = Object.keys(jsonObject)[i];
				if (objKey !== "!ref")
				{
					var tmp = jsonObject[objKey].h;
					if (!tmp)
						tmp = jsonObject[objKey].w;
					cloneObj[objKey].w = tmp;
				}
			}
			var finalObj = XLSX.utils.sheet_to_row_object_array(cloneObj);
			debugger;
		})
	};
	//reader.readAsText(file);
	reader.readAsBinaryString(file);
}

function parseMethod(method)
{
	//debugger;
	var url = $("#spread-url");
	var upload = $("#spread-upload");
	var urlBtn = $("#btn-url");
	var uploadBtn = $("#btn-upload");
	if (method === 0)
	{
		url.show();
		upload.hide();
		// uploadBtn.css("background", "#2c3e50");
		// urlBtn.css("background", "#25313e");
		urlBtn.addClass("item-selected");
		uploadBtn.removeClass("item-selected");
	}
	else //if (method === 1)
	{
		url.hide();
		upload.show();
		// urlBtn.css("background", "#2c3e50");
		// uploadBtn.css("background", "#25313e");
		uploadBtn.addClass("item-selected");
		urlBtn.removeClass("item-selected");
	}
}

function parseSpreadsheet()
{
	//debugger;
	$("#parse-sheet").hide();
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

function updateMargin(data){
	var margin = data.className.split(' ')[0]; // get first class name
	var content = $("#content");

	if (margin === "margin-top")
		content.css('padding-top', data.value + "mm");
	if (margin === "margin-right")
		content.css('padding-right', data.value + "mm");
	if (margin === "margin-bottom")
		content.css('padding-bottom', data.value + "mm");
	if (margin === "margin-left")
		content.css('padding-left', data.value + "mm");
}

function changeListType(value)
{
	//debugger;
	var style = $('#custom-styles');
	var listStyle = localStorage.getItem('CG-listStyles');
	if (value === "1") // numbers
	{
		style.html(listStyle);
		$(".list").css("list-style-type","none");
	}
	else if (value === "2") // circle
	{
		if (listStyle === null)
			localStorage.setItem('CG-listStyles', style.html());
		style.html("");
		$(".list").css("list-style-type","disc");
	}
	else if (value === "3") // square
	{
		if (listStyle === null)
			localStorage.setItem('CG-listStyles', style.html());
		style.html("");
		$(".list").css("list-style-type","square");
	}
}

function startDecisions()
{
	//debugger;
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
	JSONPath(decisionsTree, 0); // first call to genHTML and choices
}

// search for a choice on the decisionsTree
function JSONPath(json, currentNode)
{
	console.log("Current node: " + currentNode);
	var pickOption = $('#pick-option');
	pickOption.show();
	//$('#sheet-effect').show();
	pickOption.html("");
	var found = false;
	var tempPaths = [];
	var decisionPath = JSON.parse(localStorage.getItem('CG-decisionPath'));
	if (!(decisionPath instanceof Array))
		decisionPath = [];

	$(json).each(function(index){
		debugger;
		if (!found)
		{
			if (this.mandatory.toLowerCase() === "true")
			{
				// generate HTML
				generateHTMLContent(this);
				if (this.childs.length > 0)
					found = JSONPath(this.childs, currentNode + 1);
			}
			else
			{
				// generate choices
				localStorage.setItem('CG-currentNode', JSON.stringify(this));
				generateChoice(this);
				found = true;
			}
		}
		else
		{
			tempPaths.push(this);
		}
	});
	if (tempPaths.length > 0)
	{
		//decisionPath = tempPaths.concat(decisionPath); // merges arrays
		var tempPath = JSON.parse(localStorage.getItem('CG-tempPath'));
		if (!(tempPath instanceof Array))
			tempPath = [];
		tempPath.push(tempPaths);
		localStorage.setItem('CG-tempPath', JSON.stringify(tempPath));
	}
	if ((!found) && (decisionPath.length > 0))
	{
		debugger;
		found = JSONPath(decisionPath, currentNode + 1);
	}
	if (currentNode === 0)
	{
		debugger;
		var tempPath = JSON.parse(localStorage.getItem('CG-tempPath'));
		if (!(tempPath instanceof Array))
			tempPath = [];
		var len = tempPath.length;
		for (var i = (len - 1); i >= 0; i--)
		{
			decisionPath = tempPath[i].concat(decisionPath); // merges arrays
		}
		localStorage.setItem('CG-decisionPath', JSON.stringify(decisionPath));
		localStorage.setItem('CG-tempPath', JSON.stringify([])); // clear CG-tempPath
		if (decisionPath.length <= 0)
			pickOption.hide();
	}
	return found;
}

function choiceMade(choosed)
{
	debugger;
	var pickedPath = [];
	var hasChilds = false;
	if (choosed)
	{
		pickedPath = JSON.parse(localStorage.getItem('CG-currentNode'));
		generateHTMLContent(pickedPath);
		if (pickedPath.childs.length > 0)
		{
			pickedPath = pickedPath.childs;
			hasChilds = true;
		}
	}

	if (!hasChilds)
	{
		debugger;
		var decisionPath = JSON.parse(localStorage.getItem('CG-decisionPath'));
		if (decisionPath.length > 0)
		{
			pickedPath = decisionPath.slice(0); // dirty trick to make a copy of the object
			//localStorage.setItem('CG-decisionPath', JSON.stringify(decisionPath.splice(1, decisionPath.length))); // remove picked node
			localStorage.setItem('CG-decisionPath', JSON.stringify([])); // clear decisionPath
		}
	}

	JSONPath(pickedPath, 0);
}

function generateChoice(item)
{
	var pickOption = $('#pick-option');
	var innerDiv = $('<div/>').attr({id:'pick-inner'});
	var paragraph = $('<p>').html('<b>Use "' + item.description + '"?</b>');
	var btnYes = $('<input/>').attr({class:'btn btn-primary btn-pick no-print', id:'btn_' + item.id, type: 'button', value:'Yes', onClick:"choiceMade(true)"});
	var btnNo = $('<input/>').attr({class:'btn btn-primary btn-pick no-print', id:'btn_' + item.id, type: 'button', value:'No', onClick:"choiceMade(false)"});
	innerDiv.append(paragraph).append(btnYes).append(btnNo);
	pickOption.append(innerDiv);
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

	var match = item.content.match(/{{\s*[\w\.]+\s*}}/g);
	if (match)
	{
		//debugger;
		var vueTemp = match.map(function(x) { return x.match(/[\w\.]+/)[0]; });
		if (vueTemp.length > 0)
			updateVarsMenu(vueTemp, item.id);
	}
	return true;
}

function updateVarsValue(data)
{
	//debugger;
	var savedVueVars = JSON.parse(localStorage.getItem('CG-savedVueVars'));
	if (!(savedVueVars instanceof Object))
		savedVueVars = {};
	var content = document.getElementById("content");
	var classes = content.getElementsByClassName(data.placeholder);
	var len = Object.keys(classes).length;
	var val = data.value;
	savedVueVars[data.placeholder] = val; // update value on save vars
	if (val === "")
		val = data.placeholder;
	for (var i = 0; i < len; i++)
		classes[i].innerText = val;
	localStorage.setItem('CG-savedVueVars', JSON.stringify(savedVueVars));
}

function updateVarsMenu(arr, id)
{
	//debugger;
	var vueVars = JSON.parse(localStorage.getItem('CG-vueVars'));
	var savedVueVars = JSON.parse(localStorage.getItem('CG-savedVueVars'));
	if (!(vueVars instanceof Array))
		vueVars = [];
	if (!(savedVueVars instanceof Object))
		savedVueVars = {};
	//debugger;
	var newVars = $(arr).not(vueVars).get();
	if (newVars.length > 0) // means there's new vars
	{
		$(newVars).each(function(idx){
			var varName = "{{" + this + "}}";
			var varDiv = $('<div/>').attr({id:'var_' + this, class:'vars'});
			var paragraph = $('<p>').text(varName);
			var input = $('<input/>').attr({type:'text', class:'vue-var form-control', placeholder:varName, oninput:"updateVarsValue(this)"});
			paragraph.append(input);
			varDiv.append(paragraph);
			$("#vars-menu").append(varDiv);
		});
	}
	//debugger;
	$(arr).each(function(index){
		//debugger;
		var varName = "{{" + this + "}}";
		var text = varName;
		if (savedVueVars[varName]) // !== "undefined"
		{
			text = savedVueVars[varName];
			$('#var_' + this)
		}
		else
			savedVueVars[varName] = "";

		if (text !== varName)
			$('#var_' + this).find('input').first().val(text);

		// update var from HTML
		var pattern = new RegExp(varName, 'g');
		var content = $("#" + id);
		var newHTML = content.html().replace(pattern, '<abbr class="' + varName + '">' + text + '</abbr>');
		content.html(newHTML);
	});
	$.extend(vueVars, arr);
	//debugger;
	localStorage.setItem('CG-vueVars', JSON.stringify(vueVars));
	localStorage.setItem('CG-savedVueVars', JSON.stringify(savedVueVars));
}

function preparePrint()
{
	var content = $("#content");
	content.css("margin-top", "-108px");
	window.print();
	content.css("margin-top", "0px");
}

function prepareDownload(contentId)
{
	//debugger;
	var content = $("#content");
	content.css("margin-top", "-108px");
	var htmlDoc = $('#' + contentId).html();
	htmlDoc = htmlDoc.replace(/(?:\r\n|\r|\n)/g, '<br/>');
	htmlDoc = htmlDoc.replace(/  /g, "&nbsp;&nbsp;"); // replace double whitespaces by double &nbsp;
	var converted = htmlDocx.asBlob(htmlDoc);
	saveAs(converted, 'contract.docx');
	content.css("margin-top", "0px");
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
