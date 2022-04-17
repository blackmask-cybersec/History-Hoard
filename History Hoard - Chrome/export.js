function exportHistory() {
    let openRequest = indexedDB.open("HoardDB")
    openRequest.onsuccess = function() {
        let db = openRequest.result
        let tx = db.transaction("HoardOS", "readonly")
        let store = tx.objectStore("HoardOS")
        let index = store.index("LatestVisitIDX")
        let key = IDBKeyRange.lowerBound(0)
        let cursorReq = index.openCursor(key, "prev")
        let historyArray = []
        cursorReq.onsuccess = function() {
            let cursor = cursorReq.result
            if (cursor) {
                historyArray.push(cursor.value)
                cursor.continue()
            } else {
                let historyString = JSON.stringify(historyArray)
                let blob = new Blob([historyString], {type: "text/plain"})
                let exportURL = URL.createObjectURL(blob)
                chrome.downloads.download({url: exportURL, saveAs: true, filename: "History-Hoard.txt"})
            }
        }
    }
}

function exportHistoryTimeStamp() {
    let openRequest = indexedDB.open("HoardDB")
    openRequest.onsuccess = function() {
        let db = openRequest.result
        let tx = db.transaction("HoardOS", "readonly")
        let store = tx.objectStore("HoardOS")
        let index = store.index("LatestVisitIDX")
        let key = IDBKeyRange.lowerBound(0)
        let cursorReq = index.openCursor(key, "prev")
        let historyArray = []
        cursorReq.onsuccess = function() {
            let cursor = cursorReq.result
            if (cursor) {
                let hVis = []
                for(i=0; i < cursor.value.Visits.length; i++) {
                    let timeStamp = new Date(cursor.value.Visits[i])
                    hVis.push(timeStamp.toString())
                }
                let lastTimeStamp = new Date(cursor.value.LatestVisit)
                cursor.value.LatestVisit = lastTimeStamp.toString()
                cursor.value.Visits = hVis
                historyArray.push(cursor.value)
                cursor.continue()
            } else {
                let historyString = JSON.stringify(historyArray)
                let blob = new Blob([historyString], {type: "text/plain"})
                let exportURL = URL.createObjectURL(blob)
                chrome.downloads.download({url: exportURL, saveAs: true, filename: "History-Hoard.txt"})
            }
        }
    }
}

function exportHistoryJSON() {
    let openRequest = indexedDB.open("HoardDB")
    openRequest.onsuccess = function() {
        let db = openRequest.result
        let tx = db.transaction("HoardOS", "readonly")
        let store = tx.objectStore("HoardOS")
        let index = store.index("LatestVisitIDX")
        let key = IDBKeyRange.lowerBound(0)
        let cursorReq = index.openCursor(key, "prev")
        let historyArray = []
        cursorReq.onsuccess = function() {
            let cursor = cursorReq.result
            if (cursor) {
                historyArray.push(cursor.value)
                cursor.continue()
            } else {
                let historyString = JSON.stringify(historyArray)
                let blob = new Blob([historyString], {type: "application/json"})
                let exportURL = URL.createObjectURL(blob)
                chrome.downloads.download({url: exportURL, saveAs: true, filename: "History-Hoard.json"})
            }
        }
    }
}

function exportHistoryTimeStampJSON() {
    let openRequest = indexedDB.open("HoardDB")
    openRequest.onsuccess = function() {
        let db = openRequest.result
        let tx = db.transaction("HoardOS", "readonly")
        let store = tx.objectStore("HoardOS")
        let index = store.index("LatestVisitIDX")
        let key = IDBKeyRange.lowerBound(0)
        let cursorReq = index.openCursor(key, "prev")
        let historyArray = []
        cursorReq.onsuccess = function() {
            let cursor = cursorReq.result
            if (cursor) {
                let hVis = []
                for(i=0; i < cursor.value.Visits.length; i++) {
                    let timeStamp = new Date(cursor.value.Visits[i])
                    hVis.push(timeStamp.toString())
                }
                let lastTimeStamp = new Date(cursor.value.LatestVisit)
                cursor.value.LatestVisit = lastTimeStamp.toString()
                cursor.value.Visits = hVis
                historyArray.push(cursor.value)
                cursor.continue()
            } else {
                let historyString = JSON.stringify(historyArray)
                let blob = new Blob([historyString], {type: "application/json"})
                let exportURL = URL.createObjectURL(blob)
                chrome.downloads.download({url: exportURL, saveAs: true, filename: "History-Hoard.json"})
            }
        }
    }
}

window.onload = function() {
    document.getElementById("export").addEventListener("click", exportHistory)
    document.getElementById("exportJSON").addEventListener("click", exportHistoryJSON)
    document.getElementById("exportTimeStamp").addEventListener("click", exportHistoryTimeStamp)
    document.getElementById("exportTimeStampJSON").addEventListener("click", exportHistoryTimeStampJSON)
}