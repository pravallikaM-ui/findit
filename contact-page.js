
const params = new URLSearchParams(window.location.search);
const itemId = params.get("id");

const items = JSON.parse(
    localStorage.getItem("finditItems") || "[]"
);

const item = items.find(
    report => String(report.id) === String(itemId)
);

if (!item) {
    document.querySelector(".contact-card").innerHTML =
        "<h2>Reporter not found</h2>" +
        '<a href="browse.html">Back to Browse</a>';
} else {

    document.getElementById("itemName").textContent =
        item.name;

    document.getElementById("itemLocation").textContent =
        item.location;

    document.getElementById("reporterEmail").textContent =
        item.email || "Not available";

    if (item.phone && item.phoneConsent === true) {

        document.getElementById("reporterPhone").textContent =
            item.phone;

        const number = item.phone.replace(/[^0-9+]/g, "");
        const whatsappNumber = item.phone.replace(/\D/g, "");

        document.getElementById("callButton").href =
            "tel:" + number;

        document.getElementById("whatsappButton").href =
            "https://wa.me/" + whatsappNumber +
            "?text=" + encodeURIComponent(
                "Hello, I saw your FindIt report for " + item.name
            );

    } else {

        document.getElementById("reporterPhone").textContent =
            "Not shared by reporter";

        document.getElementById("callButton").style.display = "none";
        document.getElementById("whatsappButton").style.display = "none";
    }

    document.getElementById("emailButton").href =
        "mailto:" + encodeURIComponent(item.email || "");
}

