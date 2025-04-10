document.addEventListener("DOMContentLoaded", function () {
    let productCardsContainer = document.getElementById("product-list");
    let searchInput = document.getElementById("search");
    let priceFilter = document.getElementById("priceFilter");
    let yearFilter = document.getElementById("yearFilter");
    let toggleYearsButton = document.getElementById("toggleYears");

    fetch("products.xml")
        .then(response => response.text())
        .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
        .then(data => {
            let products = data.getElementsByTagName("gundam_item");

            // Get all products
            let allProducts = Array.from(products).map(product => ({
                title: product.getElementsByTagName("title")[0]?.textContent || "Unknown",
                description: product.getElementsByTagName("description")[0]?.textContent || "No description available.",
                price: parseFloat(product.getElementsByTagName("price")[0]?.textContent.replace(/[^\d.-]/g, '') || "0"),  // Remove non-numeric characters
                release_year: product.getElementsByTagName("release_year")[0]?.textContent || "Unknown",
                image_url: product.getElementsByTagName("image_url")[0]?.textContent || "no-image.jpg"
            }));

            function renderProducts(filteredProducts) {
                productCardsContainer.innerHTML = '';
                filteredProducts.forEach(product => {
                    let productCard = `
                        <div class="col-md-4 mb-4">
                            <div class="product-card">
                                <div class="image-container">
                                    <img src="${product.image_url}" class="card-img-top" alt="${product.title}">
                                </div>
                                <div class="card-title">
                                    <h5>${product.title}</h5>
                                    <p><strong>Price:</strong> $${product.price.toFixed(2)}</p>
                                    <p><strong>Release Year:</strong> ${product.release_year}</p>
                                </div>
                            </div>
                        </div>
                    `;
                    productCardsContainer.innerHTML += productCard;
                });

                // Bind the click event using JavaScript
                document.querySelectorAll(".product-card").forEach((card, index) => {
                    card.addEventListener("click", function () {
                        console.log("Card clicked!"); // Debugging line to ensure the click event is fired
                        viewProductDetails(filteredProducts[index]);
                    });
                });
            }

            // Initial render
            renderProducts(allProducts);

            // Search filter
            searchInput.addEventListener("input", function () {
                let query = searchInput.value.toLowerCase();
                let filteredProducts = allProducts.filter(product => product.title.toLowerCase().includes(query));
                renderProducts(filteredProducts);
            });

            // Price sort filter
            priceFilter.addEventListener("change", function () {
                let order = priceFilter.value;
                let sortedProducts = [...allProducts].sort((a, b) => {
                    if (order === "asc") {
                        return a.price - b.price;
                    } else {
                        return b.price - a.price;
                    }
                });
                renderProducts(sortedProducts);
            });

            // Year filter
            yearFilter.addEventListener("change", function () {
                let selectedYears = Array.from(yearFilter.querySelectorAll("input:checked")).map(checkbox => checkbox.value);
                let filteredProducts = allProducts.filter(product => selectedYears.includes(product.release_year));
                renderProducts(filteredProducts);
            });

            // Toggle checkboxes for all years
            toggleYearsButton.addEventListener("click", function () {
                let checkboxes = yearFilter.querySelectorAll("input[type='checkbox']");
                let areAllChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);

                // Toggle all checkboxes based on the current state
                checkboxes.forEach(checkbox => checkbox.checked = !areAllChecked);

                // Update button text based on the new state
                updateButtonText();
                
                // Filter products based on the selected years
                let selectedYears = Array.from(yearFilter.querySelectorAll("input:checked")).map(checkbox => checkbox.value);
                let filteredProducts = allProducts.filter(product => selectedYears.includes(product.release_year));
                renderProducts(filteredProducts);
            });

            // Set checkboxes to be checked by default and update button text
            let checkboxes = yearFilter.querySelectorAll("input[type='checkbox']");
            checkboxes.forEach(checkbox => checkbox.checked = true); // Check all by default
            updateButtonText(); // Set the button text initially

            // Update button text based on the checkbox state
            function updateButtonText() {
                let checkboxes = yearFilter.querySelectorAll("input[type='checkbox']");
                let anyChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);
                toggleYearsButton.textContent = anyChecked ? "Unchecked All" : "Check All";
            }
        })
        .catch(error => console.error("Error loading XML:", error));
});

// Function to show product details in the modal
function viewProductDetails(product) {
    // Get the modal content element
    const modalContent = document.getElementById('modal-content');

    // Create the content for the modal dynamically
    modalContent.innerHTML = `
        <div class="modal-product">
            <div>
                <h3>${product.title}</h3>
                <p><strong>Release Year:</strong> ${product.release_year}</p>
                <p><strong>Price:</strong> $${product.price.toFixed(2)}</p>
                <p><strong>Description:</strong></p>
                <p>${product.description}</p>
                <a href="https://www.google.com/search?hl=en&tbm=shop&q=${encodeURIComponent(product.title)}" target="_blank" class="mt-3">Buy Now</a>
            </div>
            <img src="${product.image_url}" class="img-fluid" alt="${product.title}" style="max-height: 300px;">
        </div>
    `;
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    modal.show();
}
