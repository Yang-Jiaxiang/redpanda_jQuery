const HeaderJson = "src/header.json";
setHTTPVerbSelect();
setResourceType();
setPageCountSelect();
initFormDivDisplay();
submitButton();
$("#TokenDIV").show("slow");
$("#IDDIV").show("slow");
$("#PageCountDIV").show("slow");
$("#SortByDIV").show("slow");

var allFHIRjson = {};

function setHTTPVerbSelect() {
    var myMap = new Map(),
        select = document.getElementById("HTTPVerb");
    myMap.set("GET", "GET");
    myMap.set("POST", "POST");
    myMap.set("PUT", "PUT");
    myMap.set("DELETE", "DELETE");

    let str = "";
    myMap.forEach((key, val) => {
        str += `<option value='${key}'>${val}</option>`;
    });
    select.innerHTML = str;
}

function setPageCountSelect() {
    var myMap = new Map(),
        select = document.getElementById("PageCount");
    myMap.set(10, 10);
    myMap.set(20, 20);
    myMap.set(50, 50);
    myMap.set(100, 100);
    myMap.set(150, 150);
    myMap.set(200, 200);

    let str = "";
    myMap.forEach((key, val) => {
        str += `<option value='${key}'>${val}</option>`;
    });
    select.innerHTML = str;
}

async function setResourceType() {
    const responseHeader = await fetch(HeaderJson);
    const { headers } = await responseHeader.json();
    const headersJson = Object.entries(headers);

    var myMap = new Map(),
        select = document.getElementById("ResourceType");

    headersJson.map((item) => {
        myMap.set(item[0], item[0]);
    });

    let str = "";
    myMap.forEach((key, val) => {
        str += `<option value='${key}'>${val}</option>`;
    });
    select.innerHTML = str;
}

function formReset() {
    location.reload();
}

function initFormDivDisplay() {
    $("#TokenDIV").hide();
    $("#IDDIV").hide();
    $("#PageCountDIV").hide();
    $("#SortByDIV").hide();
    $("#FHIRJsonDIV").hide();
}

function getHTTPVerb(selectObject) {
    initFormDivDisplay();
    var value = selectObject.value;
    switch (value) {
        case "POST":
            $("#TokenDIV").show("slow");
            $("#FHIRJsonDIV").show("slow");
            break;

        case "GET":
            $("#TokenDIV").show("slow");
            $("#IDDIV").show("slow");
            $("#PageCountDIV").show("slow");
            $("#SortByDIV").show("slow");
            //getButton();
            break;
    }
}

async function getResourceType(selectObject) {
    const responseHeader = await fetch(HeaderJson);
    const { headers } = await responseHeader.json();
    var value = selectObject.value;

    var myMap = new Map(),
        select = document.getElementById("SortBy");

    if (value !== "") {
        headers[value].map((item) => {
            myMap.set(item, item);
        });
        let str = "<option selected></option>";
        myMap.forEach((key, val) => {
            str += `<option class="SortByOption" value='${key}'>${val}</option>`;
        });
        select.innerHTML = str;
    }
}

function submitButton() {
    $("#form").submit(function (event) {
        event.preventDefault();
        const HTTPVerb = $("#HTTPVerb").val();
        for (var member in allFHIRjson) delete allFHIRjson[member];

        switch (HTTPVerb) {
            case "POST":

            case "GET":
                getFHIR();
                break;
            case "PUT":

            case "DELETE":

            default:
        }
    });
}

async function getFHIR() {
    const data = {
        FHIRServer: $("#FHIRServer").val(),
        ResourceType: $("#ResourceType").val(),
        Token: $("#Token").val(),
        ID: $("#ID").val(),
        PageCount: $("#PageCount").val(),
        SortBy: $("#SortBy").val(),
    };
    if (data.FHIRServer.substr(-1) === "/") {
        data.FHIRServer = data.FHIRServer.slice(0, -1);
    }
    const url = data.FHIRServer + "/" + data.ResourceType + "/" + data.ID;
    const FHIRjson = await fetchServer(url);
    renderContent(FHIRjson, data.ResourceType);
}

async function renderContent(FHIRjson, ResourceType) {
    const responseHeader = await fetch(HeaderJson);
    const { headers } = await responseHeader.json();
    var jQueryHeader = $("#mytable").find("thead") + "<tr>";
    headers[ResourceType].map((item) => {
        jQueryHeader += `<td>${item}</td>`;
    });
    $("#mytable")
        .find("thead")
        .html(jQueryHeader + "<td>options</td></tr>");

    var jQueryHeader = $("#mytable").find("tbody");
    jQueryHeader += "<tr>";
    if (FHIRjson.resourceType === "Bundle") {
        FHIRjson.entry.map((item) => {
            headers[ResourceType].map((headers) => {
                if (typeof item.resource[headers] === "object") {
                    jQueryHeader += `<td id="tbodytd">${objectToString(
                        item.resource[headers]
                    )}</td>`;
                } else {
                    jQueryHeader += `<td>${item.resource[headers]}</td>`;
                }
            });
            jQueryHeader += tebaleOptionsButton(item.resource) + "</tr>";
        });
    } else {
        headers[ResourceType].map((headers) => {
            if (typeof FHIRjson[headers] === "object") {
                jQueryHeader += `<td id="tbodytd">${objectToString(
                    FHIRjson[headers]
                )}</td>`;
            } else {
                jQueryHeader += `<td>${FHIRjson[headers]}</td>`;
            }
        });
        jQueryHeader += tebaleOptionsButton(FHIRjson) + "</tr>";
    }

    $("#mytable").find("tbody").html(jQueryHeader);
}

function tebaleOptionsButton(FHIRjson) {
    allFHIRjson[FHIRjson.id] = FHIRjson;
    const optionsButton = `
    <td>
    <button type="button" id="${FHIRjson.id}" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="modalButtonClick(this.id)">
        Open
    </button>
    </td>
`;
    return optionsButton;
}

function modalButtonClick(id) {
    $(".modalTerxtarrea").val(JSON.stringify(allFHIRjson[id], undefined, 2));
}

function cleanObj(obj) {
    for (var propName in obj) {
        if (
            obj[propName] === null ||
            obj[propName] === undefined ||
            obj[propName] === ""
        ) {
            delete obj[propName];
        }
    }
    return obj;
}

async function fetchServer(url) {
    const data = await fetch(url);
    const json = await data.json();
    return json;
}

//將object轉成string
function objectToString(jsons, stringLimit) {
    var html = "";
    if (jsons.length > 0) {
        for (var json of jsons) {
            var result = [];
            for (var i in json) result.push([i, json[i]]);
            result.map((item) => {
                html += `<b>${item[0]}</b>:`;
                html += `${JSON.stringify(item[1])},　`;
            });
        }
    } else {
        var array = Object.entries(jsons);
        //console.log(array)
        for(var json of array){
            html += `<b>${json[0]}</b>:`;
            html += `${JSON.stringify(json[1])},　`;
        }
        html += JSON.stringify(array);
    }
    return html;
}
