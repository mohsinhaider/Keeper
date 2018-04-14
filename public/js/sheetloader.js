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
            var tableData = '<table class="table table-bordered table-striped table-headline headline">';
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
speakButton.onclick = function() {
    var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 5;
    recognition.start();

    recognition.onresult = function(event) {
        keeperPrompt.innerText = "You said... " + event.results[0][0].transcript;
    };
}

loadSheets();