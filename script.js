// Handle Login
document.getElementById("login-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Valid users (replace with secure backend authentication in production)
    const validUsers = [
        { username: "Moses", password: "12345" },
        { username: "Satyam", password: "123456" },
    ];

    // Check if the user exists
    const user = validUsers.find((user) => user.username === username && user.password === password);

    if (user) {
        // Hide login and show invoice system
        document.getElementById("login-container").style.display = "none";
        document.getElementById("invoice-container").style.display = "block";

        // Fetch grocery items
        fetchGroceryItems();
    } else {
        document.getElementById("login-error").textContent = "Invalid username or password. Please try again.";
    }
});

// Fetch grocery items from the backend and populate the dropdown
function fetchGroceryItems() {
    fetch("http://localhost:3000/api/grocery-items")
        .then((response) => {
            if (!response.ok) throw new Error("Failed to fetch grocery items");
            return response.json();
        })
        .then((data) => {
            const groceryDropdown = document.getElementById("grocery-item");
            groceryDropdown.innerHTML = ""; // Clear previous options

            data.forEach((item) => {
                const option = document.createElement("option");
                option.value = item.id;
                option.textContent = `${item.name} - ₹${item.price}`;
                option.setAttribute("data-price", item.price); // Store price in data attribute
                groceryDropdown.appendChild(option);
            });
        })
        .catch((error) => {
            console.error("Error fetching grocery items:", error);
            alert("Could not load grocery items. Please try again later.");
        });
}

let totalAmount = 0;
let items = [];
let selectedRating = 0;

function addItem() {
    const groceryDropdown = document.getElementById("grocery-item");
    const selectedItem = groceryDropdown.options[groceryDropdown.selectedIndex];
    const itemName = selectedItem.text.split(" - ")[0];
    const price = selectedItem.getAttribute("data-price");
    const quantity = parseInt(document.getElementById("quantity").value, 10);
    const itemList = document.getElementById("item-list");

    if (quantity > 0 && price) {
        const itemTotal = quantity * price;

        // Add the item to the array
        items.push({ name: itemName, quantity: quantity, price: price, total: itemTotal });

        // Insert row into table
        const row = itemList.insertRow();
        const itemCell = row.insertCell(0);
        const quantityCell = row.insertCell(1);
        const priceCell = row.insertCell(2);
        const totalCell = row.insertCell(3);

        itemCell.textContent = itemName;
        quantityCell.textContent = quantity;
        priceCell.textContent = `₹${price}`;
        totalCell.textContent = `₹${itemTotal.toFixed(2)}`;

        // Update the total amount
        totalAmount += itemTotal;
        document.getElementById("total-amount").textContent = `₹${totalAmount.toFixed(2)}`;

        // Clear input fields
        document.getElementById("quantity").value = "";
    } else {
        alert("Please enter a valid quantity.");
    }
}

// Generate Invoice
document.getElementById("invoice-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const customerName = document.getElementById("name").value || "N/A";
    const customerEmail = document.getElementById("email").value || "N/A";

    if (items.length === 0) {
        alert("Please add at least one item to generate an invoice.");
        return;
    }

    // Calculate the 12% tax on the total amount
    const tax = totalAmount * 0.12;
    const totalWithTax = totalAmount + tax;

    // Create invoice details
    let invoiceDetails = `<h2>Invoice for ${customerName}</h2>`;
    invoiceDetails += `<p>Email: ${customerEmail}</p>`;
    invoiceDetails += `
        <table>
            <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
            </tr>`;

    // Loop through items and add each one to the invoice
    items.forEach((item) => {
        invoiceDetails += `
            <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>₹${item.price}</td>
                <td>₹${item.total.toFixed(2)}</td>
            </tr>`;
    });

    invoiceDetails += `</table>`;
    invoiceDetails += `<h3>Total Amount: ₹${totalAmount.toFixed(2)}</h3>`;
    invoiceDetails += `<h3>Tax (12%): ₹${tax.toFixed(2)}</h3>`;
    invoiceDetails += `<h3>Total Amount (after tax): ₹${totalWithTax.toFixed(2)}</h3>`;

    // Display the invoice
    document.getElementById("invoice-output").innerHTML = invoiceDetails;

    // Show the review section
    document.getElementById("review-section").style.display = "block";
});

// Star Rating
const stars = document.querySelectorAll(".star-rating i");
stars.forEach((star, index) => {
    star.addEventListener("click", () => {
        selectedRating = index + 1;
        stars.forEach((s, i) => s.classList.toggle("active", i < selectedRating));
    });
});

document.getElementById("submit-rating").addEventListener("click", () => {
    if (selectedRating > 0) {
        alert(`You rated ${selectedRating} stars! Thank you for your feedback.`);
        // Here you can send the rating to the server
    } else {
        alert("Please select a rating before submitting.");
    }
});
