//firebase stuff
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

//first pass the databae url here
const appSettings = {
//    databaseURL: "https://realtime-database-df319-default-rtdb.europe-west1.firebasedatabase.app/"
    databaseURL : "https://realtime-database-4430f-default-rtdb.asia-southeast1.firebasedatabase.app/"
}
//initialise the app using database url
const app = initializeApp(appSettings)
//using database url - create database
const database = getDatabase(app)
//using database - get the shopping list db reference
const shoppingListInDB = ref(database, "shoppingList")

//getting the input field 
const inputFieldEl = document.getElementById("input-field")
//add button
const addButtonEl = document.getElementById("add-button")
//shopping list - unordered list 
const shoppingListEl = document.getElementById("shopping-list")


//so what happens when we click on add button?
addButtonEl.addEventListener("click", function() {
    //read the input value
    let inputValue = inputFieldEl.value
    
    if(inputValue){
    //push that value into the db 
    push(shoppingListInDB, inputValue)
    }
    
    //clear
    clearInputFieldEl()
})

//when we push a value to the db or if any change happens at the db
//onValue will trigger and it gets the snapshot of the db
onValue(shoppingListInDB, function(snapshot) {
    //so if a snapshot exits - ie, if atleast one item is there in the db
    if (snapshot.exists()) {
        //convert the snapshot object to array - key - value pair
        let itemsArray = Object.entries(snapshot.val())
    
        //clear the list 
        clearShoppingListEl()
        
        //loop through the items in db and add them to shopping list item
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            
            //pass both - key and value 
            appendItemToShoppingListEl(currentItem)
        }    
    } else {
        shoppingListEl.innerHTML = "No items here... yet"
    }
})

//clears the list
function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

//clears input field
function clearInputFieldEl() {
    inputFieldEl.value = ""
}

//this is for adding the input to shopping list 
function appendItemToShoppingListEl(item) {
    //get the key
    let itemID = item[0]
    //get the value
    let itemValue = item[1]
    //create a bullet
    let newEl = document.createElement("li")
    //fill that with the value of key-value pair 
    newEl.textContent = itemValue
    
    //this is for deletion - when we click an item 
    newEl.addEventListener("click", function() {
        //find the item in db using key of key-value pair
        //not the syntax - it is like dbName/key
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        
        //remove it from db - this will trigger onValue? 
        remove(exactLocationOfItemInDB)
    })
    
    //add new element to shopping cart 
    shoppingListEl.append(newEl)
}