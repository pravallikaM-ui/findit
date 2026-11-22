
// Get saved items from browser storage
let items = JSON.parse(localStorage.getItem("finditItems")) || [];

// Display all items
function displayItems() {
    const grid = document.getElementById("itemsGrid");

    const search = document.getElementById("searchInput")
        .value.toLowerCase();

    const category = document.getElementById("categoryFilter").value;
    const status = document.getElementById("statusFilter").value;

    grid.innerHTML = "";

    const filteredItems = items.filter(item => {
        return (
            item.name.toLowerCase().includes(search) &&
            (category === "All" || item.category === category) &&
            (status === "All" || item.type === status)
        );
    });

    if (filteredItems.length === 0) {
        grid.innerHTML = "<p>No items found. Try another search.</p>";
    }

    filteredItems.forEach(item => {
        const card = document.createElement("div");
        card.className = "item-card";

        // Create elements safely without inserting user input as HTML
        const image = document.createElement("img");
        image.src = item.image || "https://placehold.co/500x300?text=No+Image";
        image.alt = item.name;

        const info = document.createElement("div");
        info.className = "item-info";

        const badge = document.createElement("span");
        badge.className = "status " + item.type;
        badge.textContent = item.type;

        const heading = document.createElement("h3");
        heading.textContent = item.name;

        const description = document.createElement("p");
        description.textContent = "Description: " + item.description;

        const location = document.createElement("p");
        location.textContent = "Location: " + item.location;

        const categoryText = document.createElement("p");
        categoryText.textContent = "Category: " + item.category;

        const date = document.createElement("p");
        date.textContent = "Date: " + item.date;

        const contact = document.createElement("a");
        contact.className = "contact-btn";
        contact.textContent = "Contact Reporter";
        contact.href = "mailto:" + encodeURIComponent(item.email) +
            "?subject=" + encodeURIComponent("FindIt: " + item.name);

        info.append(badge, heading, description,
                    location, categoryText, date, contact);

        card.append(image, info);
        grid.appendChild(card);
    });

    updateStats();
}

// Update dashboard statistics
function updateStats() {
    document.getElementById("totalItems").textContent = items.length;

    document.getElementById("lostItems").textContent =
        items.filter(item => item.type === "Lost").length;

    document.getElementById("foundItems").textContent =
        items.filter(item => item.type === "Found").length;
}

// Handle form submission
document.getElementById("itemForm").addEventListener("submit",
    function(event) {

    event.preventDefault();

    const imageFile = document.getElementById("itemImage").files[0];

    // Limit image size for LocalStorage
    if (imageFile && imageFile.size > 1024 * 1024) {
        alert("Please select an image smaller than 1 MB.");
        return;
    }

    const saveItem = (imageData) => {
        const newItem = {
            id: Date.now(),
            type: document.getElementById("reportType").value,
            name: document.getElementById("itemName").value.trim(),
            category: document.getElementById("itemCategory").value,
            description: document.getElementById("itemDescription").value.trim(),
            location: document.getElementById("itemLocation").value.trim(),
            date: document.getElementById("itemDate").value,
            email: document.getElementById("itemEmail").value.trim(),
            image: imageData
        };

        items.unshift(newItem);

        try {
            localStorage.setItem("finditItems", JSON.stringify(items));
        } catch (error) {
            items.shift();
            alert("Browser storage is full. Try a smaller image.");
            return;
        }

        document.getElementById("message").textContent =
            "Your report was submitted successfully!";

        document.getElementById("itemForm").reset();

        displayItems();

        document.getElementById("items").scrollIntoView({
            behavior: "smooth"
        });
    };

    if (imageFile) {
        const reader = new FileReader();

        reader.onload = function() {
            saveItem(reader.result);
        };

        reader.onerror = function() {
            alert("Could not read the selected image.");
        };

        reader.readAsDataURL(imageFile);
    } else {
        saveItem("");
    }
});

// Search and filter events
document.getElementById("searchInput")
    .addEventListener("input", displayItems);

document.getElementById("categoryFilter")
    .addEventListener("change", displayItems);

document.getElementById("statusFilter")
    .addEventListener("change", displayItems);

// Load saved reports when the page opens
displayItems();
