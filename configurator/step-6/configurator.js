/************ Modal Control **************/
let modal = document.getElementById("config_modal");
let open_modal_btn = document.getElementById("openmodal");
let close_btn = document.getElementsByClassName("close")[0];

let addtocart = document.getElementById("add_to_cart");

open_modal_btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
close_btn.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks on Add to Cart, close the modal
addtocart.onclick = function() {
    modal.style.display = "none";
}


/************ Runs On Page Load *************/
let drink_cost = 4.5;

// Number Formatter for Price
let formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
});
const topping_pointers = document.getElementsByName('topping');
for (let i = 0; i < topping_pointers.length; i++) {
    //add event listener to each topping checkbox
    topping_pointers[i].addEventListener("click", updateTopping, false);

    //add quantity control HTML to for each topping
    let topping_div = topping_pointers[i].parentElement.parentElement;

    const inc_btn = document.createElement("button");
    inc_btn.setAttribute("id", topping_pointers[i].id + "_inc_btn");
    inc_btn.setAttribute("class", "topping_inc_btn");
    inc_btn.append("+");

    const topping_quantity = document.createElement("div");
    topping_quantity.setAttribute("id", topping_pointers[i].id + "_quantity");
    topping_quantity.setAttribute("class", "topping_quantity");
    topping_quantity.append("1");

    const dec_btn = document.createElement("button");
    dec_btn.setAttribute("id", topping_pointers[i].id + "_dec_btn");
    inc_btn.setAttribute("class", "topping_dec_btn");
    dec_btn.append("-");

    const topping_control = document.createElement("div");
    topping_control.setAttribute("id", topping_pointers[i].id + "_control");
    topping_control.setAttribute("class", "quantity_control");
    topping_control.append(dec_btn);
    topping_control.append(topping_quantity);
    topping_control.append(inc_btn);


    topping_div.append(topping_control);
    topping_control.style.display = "none";

    //add event listeners for each toppingcontrol
    document.getElementById(topping_pointers[i].id + "_inc_btn").addEventListener("click", function() { increaseVal(topping_pointers[i].id + "_quantity"); }, false);
    document.getElementById(topping_pointers[i].id + "_dec_btn").addEventListener("click", function() { decreaseVal(topping_pointers[i].id + "_quantity"); }, false);

    //run once to display regular drink cost immediately
    calculateCost();
}
const sizes = document.getElementsByName("size");
for (let i = 0; i < sizes.length; i++) {
    sizes[i].addEventListener("click", calculateCost, false);
}


/************ Topping Control **************/
function updateTopping() {
    let topping_pointers = document.getElementsByName("topping");

    for (let i = 0; i < topping_pointers.length; i++) {
        //topping's control id
        let control_id = topping_pointers[i].id + "_control";
        let control_div = document.getElementById(control_id);

        if (checkMax() > 3) {
            break;
        } else if (topping_pointers[i].checked) {
            control_div.style.display = "flex";
        } else {
            //reset quantity counter to 1 upon unchecking
            let topping_quantity_id = topping_pointers[i].id + "_quantity";
            document.getElementById(topping_quantity_id).innerHTML = 1;
            control_div.style.display = "none";
        }
        //update cost when new topping is checked
        calculateCost();
    }
}



/************ Quantity Control **************/
//event listeners for quantity +/-
document.getElementById("quantity_increment_btn").addEventListener("click", function() { increaseVal("quantity_display"); }, false);
document.getElementById("quantity_decrement_btn").addEventListener("click", function() { decreaseVal("quantity_display"); }, false);



/************ Calculate and Update Cost in "Add to Cart" Section **************/
function calculateCost() {
    let total_cost = 0;
    let topping_cost = 0;
    let total_toppings = 0;
    let size_cost = 0;

    //iterate through all toppings to add up total cost of all toppings
    let topping_pointers = document.getElementsByName("topping");
    for (let i = 0; i < topping_pointers.length; i++) {
        //grab quantity only if topping has been checked
        if (topping_pointers[i].checked) {
            let topping_quantity_id = topping_pointers[i].id + "_quantity";
            let topping_quantity_val = parseFloat(document.getElementById(topping_quantity_id).innerHTML);

            //check total amount of toppings to make sure it isn't more than three
            total_toppings = total_toppings + topping_quantity_val;
            //calculate cost of single topping and add to total
            topping_cost = topping_cost + (topping_quantity_val * 0.70);
        }
    }
    //iterate check size to see if additional cost should be added
    let which_size = checkSize();
    if (which_size == "large") {
        size_cost = 2.5;
    }

    //get total number of drink from quantity control 
    let quantity_val = parseFloat(document.getElementById("quantity_display").innerHTML);

    total_cost = quantity_val * (drink_cost + topping_cost + size_cost);
    total_cost = formatter.format(total_cost);
    print_cost = "Add to Cart (" + total_cost + ")";
    document.getElementById("add_to_cart").innerHTML = print_cost;
}

/************ Check if maximum topping has been reached **************/
function checkMax() {
    let total_toppings = 0;
    //iterate through all toppings to add up total cost of all toppings
    let topping_pointers = document.getElementsByName("topping");
    for (let i = 0; i < topping_pointers.length; i++) {
        //grab quantity only if topping has been checked
        if (topping_pointers[i].checked) {
            let topping_quantity_id = topping_pointers[i].id + "_quantity";
            let topping_quantity_val = parseFloat(document.getElementById(topping_quantity_id).innerHTML);

            //check total amount of toppings to make sure it isn't more than three
            total_toppings = total_toppings + topping_quantity_val;
        }
    }
    return total_toppings;
}

function checkSize() {
    //iterate through size choices add up total cost of all toppings
    let size_pointers = document.getElementsByName("size");

    let which_size = null;
    for (let i = 0; i < size_pointers.length; i++) {
        //grab quantity only if topping has been checked
        if (size_pointers[i].checked) {
            which_size = size_pointers[i].value;
            break;
        }
    }
    return which_size;
}


/************ Helper Functions **************/
// Increase/Decrease Functions
//functions for incrementing/decrementing input values
function increaseVal(val_id) {
    if (val_id == "quantity_display") {
        let value = parseInt(document.getElementById(val_id).innerHTML);
        value++;
        document.getElementById(val_id).innerHTML = value;
        //update cost anytime something is increased
        calculateCost();
    }
    if (checkMax() >= 3) {
        //cannot select more than three toppings
    } else {
        let value = parseInt(document.getElementById(val_id).innerHTML);
        value++;
        document.getElementById(val_id).innerHTML = value;
        //update cost anytime something is increased
        calculateCost();
    }
}

function decreaseVal(val_id) {
    let value = parseInt(document.getElementById(val_id).innerHTML);
    if (value > 1) {
        value--;
    }
    document.getElementById(val_id).innerHTML = value;
    //update cost anytime something is decreased
    calculateCost();
}