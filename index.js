const HeaderJson = "./src/header.json";
setHTTPVerbSelect();
setResourceType();
setPageCountSelect();
initFormDivDisplay();

function setHTTPVerbSelect() {
    var myMap = new Map(),
        select = document.getElementById("HTTPVerb");
    myMap.set("GET", "GET");
    myMap.set("POST", "POST");
    myMap.set("PUT", "PUT");
    myMap.set("DELETE", "DELETE");

    let str = "<option selected></option>";
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

    let str = "<option selected></option>";
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
            getButton();
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

function getButton() {
    $("#form").submit(function (event) {
        event.preventDefault();
        const data = {
            FHIRServer: $("#FHIRServer").val(),
            ResourceType: $("#ResourceType").val(),
            Token: $("#Token").val(),
            ID: $("#ID").val(),
            PageCount: $("#PageCount").val(),
            SortBy: $("#SortBy").val(),
        };

        const url = data.FHIRServer + "/" + data.ResourceType + "/" + data.ID;
        console.log(url)
        console.log(cleanObj(data));
    });
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
