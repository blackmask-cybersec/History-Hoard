function importHistory() {
    let upload = document.getElementById("upload")
    let output = document.getElementById("output")
    let importing = document.getElementById("importing")
    let done = document.getElementById("done")
    let importedFile = new FileReader()
    importedFile.readAsText(upload.files[0])
    importedFile.onload = function() {
        let fileJSON = JSON.parse(importedFile.result)
        if (typeof fileJSON[0].LatestVisit == "number") {
            output.innerHTML = ""
            let popDBMessage = document.createElement("div")
            popDBMessage.innerHTML = "Importing file..."
            importing.appendChild(popDBMessage)
            let openRequest = indexedDB.open("HoardDB")
            openRequest.onsuccess = function() {
                for (let i=0; i < fileJSON.length; i++) {
                    let db = openRequest.result
                    let tx = db.transaction("HoardOS", "readonly")
                    let store = tx.objectStore("HoardOS")
                    let getReq = store.get(fileJSON[i].URL)
                    
                    getReq.onsuccess = function() {
                        let getResult = getReq.result
                        if (getResult) {
                            let oldArray = getResult.Visits
                            let newArray = oldArray.concat(fileJSON[i].Visits)
                            let finalArray = [...new Set(newArray)]
                            finalArray.sort()
                            finalArray.reverse()
                            getResult.Visits = finalArray
                            getResult.LatestVisit = finalArray[0]
                            let tx1 = db.transaction("HoardOS", "readwrite")
                            let store1 = tx1.objectStore("HoardOS")
                            var a = store1.put(getResult)
                        } else {
                            let tx1 = db.transaction("HoardOS", "readwrite")
                            let store1 = tx1.objectStore("HoardOS")
                            var a = store1.add({URL: fileJSON[i].URL, Title: fileJSON[i].Title, LatestVisit: fileJSON[i].LatestVisit, Visits: fileJSON[i].Visits})
                        }
                        if (i==fileJSON.length - 1) {
                            a.onsuccess = function() {
                                done.innerHTML += "Done."
                            }
                        }
                    }
                }
            }
        } else {
            output.innerHTML = "Incorrect time format. Upload file with UNIX Time values."
        }
    }
}

window.onload = function() {
    document.getElementById("upload").addEventListener("change", importHistory)
}