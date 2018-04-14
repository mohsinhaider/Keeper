let xmlHttp = new XMLHttpRequest();

function loadSheets() {
    xmlHttp.onreadystatechange = () => { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            let sheetResponseObject = JSON.parse(xmlHttp.response);
            console.log(sheetResponseObject);
            loadCSV(sheetResponseObject);
        }
    }
    xmlHttp.open('GET', '/sheet/view/' + getParameterByName('sheetID'), true);
    xmlHttp.send(null);
}

// Thank you, James Forbes
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function loadCSV(sheetResponseObject) {
    $.ajax({
        url: "http://localhost:8080/sheet-files/" + sheetResponseObject.file_name + ".csv",
        dataType: "text",
        success: function(data) {
            var rowData = data.split(/\r?\n|\r/);
            var tableData = '<table id="sheet-table" class="table table-bordered table-striped table-headline headline">';
            for (var count = 0; count < rowData.length; count++) {
                var cell_data = rowData[count].split(",");
                tableData += '<tr>';
                for (var cell_count = 0; cell_count < cell_data.length; cell_count++) {
                    if (count === 0) {
                        tableData += '<th>' + cell_data[cell_count] + '</th>';
                    }
                    else {
                        tableData += '<td>' + cell_data[cell_count] + '</td>';
                    }
                }
                tableData += '</tr>';
            }
            tableData += '</table>';
            $('#sheet_table').html(tableData);
        }

    });
}


let speakButton = document.getElementById('speak-button');
let keeperPrompt = document.getElementById('keeper-prompt');
let sheetTable = document.getElementById('sheet_table');
let sheetTableHeaders = sheetTable.getElementsByTagName("th");
let sheetTableRows = sheetTable.getElementsByTagName("tr");

speakButton.onclick = function() {
    var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 5;
    recognition.start();

    recognition.onresult = function(event) {
        var speechResult = event.results[0][0].transcript;
        keeperPrompt.innerText = "You said... " + speechResult;
        var speechResultAdjusted = speechResult.toLowerCase();

        if (speechResultAdjusted.includes("reset")) {
            location.reload();
        } 
        else if (speechResultAdjusted.includes("match")) {
            let sentenceArray = speechResultAdjusted.split(" ");
            var afterFilter, afterMatch = false;
            var columnName;
            var criteriaString = "";

            for (let i = 0; i < sentenceArray.length; i++) {
                if (afterFilter) {
                    columnName = sentenceArray[i];
                    afterFilter = false;
                }
                else if (afterMatch) {
                    if (sentenceArray[i] === 'by') {
                        continue;
                    }
                    criteriaString += sentenceArray[i];
                    if (i != sentenceArray.length - 1) {
                        criteriaString += " ";
                    }
                }
                else if (sentenceArray[i] === "keeper") {
                    // pass
                }
                else if (sentenceArray[i] === "filter") {
                    afterFilter = true;
                    continue;
                }
                else if (sentenceArray[i] === "match") {
                    afterMatch = true;
                    continue;
                }
            }

            console.log('Column: ' + columnName);
            console.log('Criteria: ' + criteriaString);

            if (columnName.length > 0 && criteriaString.length > 0) {
                keeperMatch(columnName, criteriaString);
            }
        }
        else if (speechResultAdjusted.includes("containing")) {
            let sentenceArray = speechResultAdjusted.split(" ");
            var afterFilter, afterContaining = false;
            var columnName;
            var criteriaString = "";

            for (let i = 0; i < sentenceArray.length; i++) {
                if (afterFilter) {
                    columnName = sentenceArray[i];
                    afterFilter = false;
                }
                else if (afterContaining) {
                    criteriaString += sentenceArray[i];
                    if (i != sentenceArray.length - 1) {
                        criteriaString += " ";
                    }
                }
                else if (sentenceArray[i] === "keeper") {
                    // pass
                }
                else if (sentenceArray[i] === "filter") {
                    afterFilter = true;
                    continue;
                }
                else if (sentenceArray[i] === "containing") {
                    afterContaining = true;
                    continue;
                }
            }

            console.log('Column: ' + columnName);
            console.log('Criteria: ' + criteriaString);

            if (columnName.length > 0 && criteriaString.length > 0) {
                keeperContaining(columnName, criteriaString);
            }
        }
        else if (speechResultAdjusted.includes("less than")) {
            let sentenceArray = speechResultAdjusted.split(" ");
            var afterFilter, afterLessThan = false;
            var columnName;
            var criteriaString = "";

            for (let i = 0; i < sentenceArray.length; i++) {
                if (afterFilter) {
                    columnName = sentenceArray[i];
                    afterFilter = false;
                }
                else if (afterLessThan) {
                    criteriaString += sentenceArray[i];
                    if (i != sentenceArray.length - 1) {
                        criteriaString += " ";
                    }
                }
                else if (sentenceArray[i] === "keeper") {
                    // pass
                }
                else if (sentenceArray[i] === "filter") {
                    afterFilter = true;
                    continue;
                }
                else if (sentenceArray[i] === "than" || sentenceArray[i] === "then") {
                    afterLessThan = true;
                    continue;
                }
            }

            console.log('Column: ' + columnName);
            console.log('Criteria: ' + criteriaString);

            if (columnName.length > 0 && criteriaString.length > 0) {
                keeperLessThan(columnName, criteriaString);
            }
        }
        else if (speechResultAdjusted.includes("greater than")) {
            let sentenceArray = speechResultAdjusted.split(" ");
            var afterFilter, afterGreaterThan = false;
            var columnName;
            var criteriaString = "";

            for (let i = 0; i < sentenceArray.length; i++) {
                if (afterFilter) {
                    columnName = sentenceArray[i];
                    afterFilter = false;
                }
                else if (afterGreaterThan) {
                    criteriaString += sentenceArray[i];
                    if (i != sentenceArray.length - 1) {
                        criteriaString += " ";
                    }
                }
                else if (sentenceArray[i] === "keeper") {
                    // pass
                }
                else if (sentenceArray[i] === "filter") {
                    afterFilter = true;
                    continue;
                }
                else if (sentenceArray[i] === "than" || sentenceArray[i] === "then") {
                    afterGreaterThan = true;
                    continue;
                }
            }

            console.log('Column: ' + columnName);
            console.log('Criteria: ' + criteriaString);

            if (columnName.length > 0 && criteriaString.length > 0) {
                keeperGreaterThan(columnName, criteriaString);
            }
        }
    };
}

function keeperMatch(columnName, criteriaString) {
    let columnMapping = [];
    let tdIndex;
    for (let i = 0; i < sheetTableHeaders.length; i++) {
        let currentColumnName = sheetTableHeaders[i].innerText.toLowerCase();
        if (currentColumnName === columnName) {
            tdIndex = i;
        }
        columnMapping.push(currentColumnName);
    }

    console.log(columnMapping);
    console.log(tdIndex);

    for (var i = 0; i < sheetTableRows.length; i++) {
        var td = sheetTableRows[i].getElementsByTagName("td")[tdIndex]; // Fix this (iterate by trs)
        if (td) {
            if (td.innerText.toLowerCase().trim() === criteriaString) {
                console.log('made it');
                sheetTableRows[i].style.display = "";
            } 
            else {
                sheetTableRows[i].innerHTML = "";
            }
        }       
    }
}

function keeperContaining(columnName, criteriaString) {
    let columnMapping = [];
    let tdIndex;
    for (let i = 0; i < sheetTableHeaders.length; i++) {
        let currentColumnName = sheetTableHeaders[i].innerText.toLowerCase();
        if (currentColumnName === columnName) {
            tdIndex = i;
        }
        columnMapping.push(currentColumnName);
    }

    console.log(columnMapping);
    console.log(tdIndex);

    for (var i = 0; i < sheetTableRows.length; i++) {
        var td = sheetTableRows[i].getElementsByTagName("td")[tdIndex]; // Fix this (iterate by trs)
        if (td) {  
            console.log(td.innerText.toLowerCase().trim().split(" "));
            if (td.innerText.toLowerCase().trim().split(" ").includes(criteriaString)) {
                console.log('made it');
                sheetTableRows[i].style.display = "";
            }
            else {
                sheetTableRows[i].innerHTML = "";
            }
        }       
    }
}

function keeperLessThan(columnName, criteriaString) {
    let criteriaFloat = parseFloat(criteriaString);

    let columnMapping = [];
    let tdIndex;
    for (let i = 0; i < sheetTableHeaders.length; i++) {
        let currentColumnName = sheetTableHeaders[i].innerText.toLowerCase();
        if (currentColumnName === columnName) {
            tdIndex = i;
        }
        columnMapping.push(currentColumnName);
    }

    console.log(columnMapping);
    console.log(tdIndex);

    for (var i = 0; i < sheetTableRows.length; i++) {
        var td = sheetTableRows[i].getElementsByTagName("td")[tdIndex]; // Fix this (iterate by trs)
        if (td) {
            if (parseFloat(td.innerText.toLowerCase().trim()) < criteriaFloat) {
                console.log('made it');
                sheetTableRows[i].style.display = "";
            } 
            else {
                sheetTableRows[i].innerHTML = "";
            }
        }       
    }
}

function keeperGreaterThan(columnName, criteriaString) {
    let criteriaFloat = parseFloat(criteriaString);

    let columnMapping = [];
    let tdIndex;
    for (let i = 0; i < sheetTableHeaders.length; i++) {
        let currentColumnName = sheetTableHeaders[i].innerText.toLowerCase();
        if (currentColumnName === columnName) {
            tdIndex = i;
        }
        columnMapping.push(currentColumnName);
    }

    console.log(columnMapping);
    console.log(tdIndex);

    for (var i = 0; i < sheetTableRows.length; i++) {
        var td = sheetTableRows[i].getElementsByTagName("td")[tdIndex]; // Fix this (iterate by trs)
        if (td) {
            if (parseFloat(td.innerText.toLowerCase().trim()) > criteriaFloat) {
                console.log('made it');
                sheetTableRows[i].style.display = "";
            } 
            else {
                sheetTableRows[i].innerHTML = "";
            }
        }       
    }

}

loadSheets();