document.addEventListener("DOMContentLoaded", function () {
    let productCardsContainer = document.getElementById("product-cards");

    fetch("products.xml")
        .then(response => response.text())
        .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
        .then(data => {
            let products = data.getElementsByTagName("gundam_item");

            // Get only the first 3 products
            let limitedProducts = Array.from(products).slice(0, 3).map(product => ({
                title: product.getElementsByTagName("title")[0]?.textContent || "Unknown",
                description: product.getElementsByTagName("description")[0]?.textContent || "No description available.",
                price: product.getElementsByTagName("price")[0]?.textContent || "Price not available.",
                release_year: product.getElementsByTagName("release_year")[0]?.textContent || "Unknown",
                image_url: product.getElementsByTagName("image_url")[0]?.textContent || "no-image.jpg"
            }));

            // Render the products as cards
            limitedProducts.forEach(product => {
                let productCard = `
                    <div class="col-md-4 mb-4">
                        <div class="card-sample">
                            <div class="image-container">
                                <img src="${product.image_url}" class="card-img-top" alt="${product.title}">
                            </div>
                            <div class="card-title">
                                <h5>${product.title}</h5>
                            </div>
                        </div>
                    </div>
                `;
                productCardsContainer.innerHTML += productCard;
            });

            // Bind the click event using JavaScript
            document.querySelectorAll(".card-sample").forEach((card, index) => {
                card.addEventListener("click", function () {
                    console.log("Card clicked!"); // Debugging line to ensure the click event is fired
                    viewProductDetails(limitedProducts[index]);
                });
            });
        })
        .catch(error => console.error("Error loading XML:", error));
});

// Function to show product details in the modal
function viewProductDetails(product) {
    // Get the modal content element
    const modalContent = document.getElementById('modal-content');

    // Create the content for the modal dynamically
    modalContent.innerHTML = `
         <div class="text-center">
            <img src="${product.image_url}" class="img-fluid" alt="${product.title}" style="max-height: 300px;">
            <h3>${product.title}</h3>
            <p><strong>Release Year:</strong> ${product.release_year}</p>
            <p><strong>Price:</strong> ${product.price}</p>
            <p><strong>Description:</strong></p>
            <p>${product.description}</p>
            <a href="https://www.google.com/search?hl=en&tbm=shop&q=${encodeURIComponent(product.title)}" target="_blank" class="btn btn-primary mt-3">Buy Now</a>
        </div>
    `;
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    modal.show();
}