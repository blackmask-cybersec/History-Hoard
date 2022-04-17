function displayData() {
    let d = document.getElementById("mains")
    let openRequest = indexedDB.open("HoardDB")
    openRequest.onupgradeneeded = function() {
        let db = openRequest.result
        let store = db.createObjectStore("HoardOS", {keyPath: "URL"})
        store.createIndex("LatestVisitIDX", "LatestVisit", {unique: false})
        store.createIndex("TitleIDX", "Title", {unique: false})
    }
    openRequest.onsuccess = function() {
        let db = openRequest.result
        let tx = db.transaction("HoardOS", "readonly")
        let store = tx.objectStore("HoardOS")
        let index = store.index("LatestVisitIDX")
        let key = IDBKeyRange.lowerBound(0)
        let cursorReq = index.openCursor(key, "prev")
        cursorReq.onsuccess = function() {
            let cursor = cursorReq.result
            if (cursor) {
                let d2 = document.createElement("div")
                let hStr = "<details open class='flexitem'>" + "<span class='field'>URL: </span>"
                 + '<a href="' + cursor.value.URL + '">' + cursor.value.URL + "</a>" + "<br>" 
                + "<span class='field'>Visit Count: </span>" + cursor.value.Visits.length + "<br>";
                for(i=0; i < cursor.value.Visits.length; i++) {
                    let date = new Date(cursor.value.Visits[i])
                    hStr += date.toString() + "<br>"
                }
            if (cursor.value.Title !== "") {
                hStr += "<summary>" + cursor.value.Title + "</summary>" + "</details>";
            } else {
                hStr += "<summary>" + cursor.value.URL + "</summary>" + "</details>"
            }
            d2.innerHTML += hStr
            d.append(d2);
            cursor.continue();
            } else {
                console.log("cursor done")
            }
        }
    }
}

window.onload = function() {
    displayData()
}