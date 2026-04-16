let productsData = [];
let cartCount = 0;

/* Update Cart Count */
function updateCart() {
  document.getElementById("cart-count").textContent = cartCount;
}

/* Fetch Products */
async function getProducts() {
  document.getElementById("loader").style.display = "block";

  try {
    let res = await fetch("https://fakestoreapi.com/products");
    if (!res.ok) throw new Error();

    let data = await res.json();
    productsData = data;

    showProducts(data);
    loadCategories(data);

  } catch {
    document.getElementById("error").textContent = "Failed to load products";
  }

  document.getElementById("loader").style.display = "none";
}

/* Show Products */
function showProducts(data) {
  let container = document.getElementById("products");
  container.innerHTML = "";

  data.forEach(p => {
    container.innerHTML += `
      <div class="col-md-3 mb-3">
        <div class="card p-2">
          <img src="${p.image}" class="card-img-top">
          <h6>${p.title.slice(0,30)}</h6>
          <p>₹ ${p.price}</p>
          <button class="btn btn-sm btn-primary" onclick="addToCart()">
            Add to Cart
          </button>
        </div>
      </div>
    `;
  });
}

/* Categories */
function loadCategories(data) {
  let cats = [...new Set(data.map(p => p.category))];
  let select = document.getElementById("category");

  cats.forEach(c => {
    let opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    select.appendChild(opt);
  });
}

/* Search */
document.getElementById("search").addEventListener("input", e => {
  let value = e.target.value.toLowerCase();

  let filtered = productsData.filter(p =>
    p.title.toLowerCase().includes(value)
  );

  showProducts(filtered);
});

/* Category Filter */
document.getElementById("category").addEventListener("change", e => {
  let value = e.target.value;

  if (value === "all") {
    showProducts(productsData);
  } else {
    let filtered = productsData.filter(p => p.category === value);
    showProducts(filtered);
  }
});

/* Sorting */
document.getElementById("sort").addEventListener("change", e => {
  let value = e.target.value;
  let sorted = [...productsData];

  if (value === "low") sorted.sort((a,b)=>a.price-b.price);
  if (value === "high") sorted.sort((a,b)=>b.price-a.price);

  showProducts(sorted);
});

/* Add to Cart (Simple Count Only) */
function addToCart() {
  cartCount++;
  updateCart();
}

/* Start */
getProducts();