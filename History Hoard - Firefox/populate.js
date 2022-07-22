function populate() {
    let openRequest = indexedDB.open("HoardDB")
    openRequest.onupgradeneeded = function() {
        let db = openRequest.result
        let store = db.createObjectStore("HoardOS", {keyPath: "URL"})
        store.createIndex("LatestVisitIDX", "LatestVisit", {unique: false})
        store.createIndex("TitleIDX", "Title", {unique: false})
    }

    openRequest.onsuccess = function() {
        let x = document.getElementById("populating")
        let popDBMessage = document.createElement("div")
        popDBMessage.innerHTML = "Populating DB..."
        x.appendChild(popDBMessage)
        let db = openRequest.result
        browser.history.search({text: "", startTime: 0, maxResults: 2147483647}).then(function(listOfURLs) {
            for(let i=0; i < listOfURLs.length; i++) {
                let URLHoard = listOfURLs[i].url
                let title = listOfURLs[i].title
                let lastVisit = listOfURLs[i].lastVisitTime
                let URLVisits = []
                browser.history.getVisits({url: URLHoard}).then(function(listOfVisits) {
                    for(let j=0; j < listOfVisits.length; j++){
                        URLVisits.push(listOfVisits[j].visitTime)
                    }
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
                        let a = store1.put(getResult)
                        if (i == listOfURLs.length - 1) {
                            a.onsuccess = function() {
                                let x = document.getElementById("populating")
                                let doneMessage = document.createElement("div")
                                doneMessage.innerHTML = "Done."
                                x.appendChild(doneMessage)
                            }
                        }
                    } else {
                        let tx1 = db.transaction("HoardOS", "readwrite")
                        let store1 = tx1.objectStore("HoardOS")
                        let b = store1.add({URL: URLHoard, Title: title, LatestVisit: lastVisit, Visits: URLVisits})
                        if (i == listOfURLs.length - 1) {
                            b.onsuccess = function() {
                                let x = document.getElementById("populating")
                                let doneMessage = document.createElement("div")
                                doneMessage.innerHTML = "Done."
                                x.appendChild(doneMessage)
                            }
                        }
                    }
                }
                })
            }
        })
    }
}

window.onload = function() {
    document.getElementById("populate").addEventListener("click", populate)
}
