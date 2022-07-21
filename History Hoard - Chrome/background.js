chrome.runtime.onStartup.addListener(function() {
    let openRequest = indexedDB.open("HoardDB")

    openRequest.onupgradeneeded = function() {
        let db = openRequest.result
        let store = db.createObjectStore("HoardOS", {keyPath: "URL"})
        store.createIndex("LatestVisitIDX", "LatestVisit", {unique: false})
        store.createIndex("TitleIDX", "Title", {unique: false})
    }

    openRequest.onsuccess = function() {
        let db = openRequest.result
        chrome.history.search({text: "", startTime: 0, maxResults: 2500}, function(listOfURLs) {
            for(let i = 0; i < listOfURLs.length; i++) {
                let URLHoard = listOfURLs[i].url
                let title = listOfURLs[i].title
                let lastVisit = listOfURLs[i].lastVisitTime
                let URLVisits = []
                chrome.history.getVisits({url: URLHoard}, function(listOfVisits) {
                    for(let j = 0; j < listOfVisits.length; j++) {
                        URLVisits.push(listOfVisits[j].visitTime)
                    }
                })
                let tx = db.transaction("HoardOS", "readonly")
                let store = tx.objectStore("HoardOS")
                let getReq = store.get(URLHoard)
                
                getReq.onsuccess = function() {
                    let getResult = getReq.result
                    if (getResult) {
                        let oldArray = getResult.Visits
                        let newArray = oldArray.concat(URLVisits)
                        let finalArray = [...new Set(newArray)]
                        finalArray.sort()
                        finalArray.reverse()
                        getResult.Visits = finalArray
                        getResult.Title = title
                        getResult.LatestVisit = lastVisit
                        let tx1 = db.transaction("HoardOS", "readwrite")
                        let store1 = tx1.objectStore("HoardOS")
                        store1.put(getResult)
                    } else {
                        let tx1 = db.transaction("HoardOS", "readwrite")
                        let store1 = tx1.objectStore("HoardOS")
                        store1.add({URL: URLHoard, Title: title, LatestVisit: lastVisit, Visits: URLVisits})
                    }
                }
            }
        })
    }
})
