function insertParametersObj(obj, currentElement) {
    if (currentElement.id && currentElement.id.length > 0) {
        obj[currentElement.id] = currentElement;
        currentElement.container = obj;
    }

    if (currentElement.hasChildNodes()) {
        insertParametersObj(obj, currentElement.firstChild);
    }

    if (currentElement.nextElementSibling != null) {
        insertParametersObj(obj, currentElement.nextElementSibling);
    }
}

function sendHttpRequest(url, delegateObj,body) {

    let httpRequest = new XMLHttpRequest();

    httpRequest.onreadystatechange = function () {

        if (this.readyState == 4) {

            if (delegateObj.onCompletion)

                delegateObj.onCompletion();

            if (this.status == 200) {

                if (delegateObj.onSuccess)

                    delegateObj.onSuccess(this.responseText);

            }
            else {

                if (delegateObj.onFailure)

                    delegateObj.onFailure();

            }

        }

    };
    if (body) {
        httpRequest.open("POST", url, true);

        httpRequest.setRequestHeader("Content-Type", "application/json");

        httpRequest.send(body);
    }
    else {
        httpRequest.open("GET", url, true);

        httpRequest.send();
    }

}


