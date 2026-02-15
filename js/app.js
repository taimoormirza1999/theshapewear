// WhatsApp number - CHANGE THIS to your actual WhatsApp number
const WHATSAPP_NUMBER = "923001234567";

// State
let currentProduct = null;
let selectedSize = null;
let selectedColor = null;
let quantity = 1;
let mobileMenuOpen = false;

// Mobile menu
function toggleMobileMenu() {
  mobileMenuOpen = !mobileMenuOpen;
  const menu = document.getElementById("mobile-menu");
  const b1 = document.getElementById("burger-1");
  const b2 = document.getElementById("burger-2");
  const b3 = document.getElementById("burger-3");

  if (mobileMenuOpen) {
    menu.classList.remove("hidden");
    b1.classList.add("rotate-45", "translate-y-[8px]");
    b2.classList.add("opacity-0");
    b3.classList.add("-rotate-45", "-translate-y-[8px]");
  } else {
    menu.classList.add("hidden");
    b1.classList.remove("rotate-45", "translate-y-[8px]");
    b2.classList.remove("opacity-0");
    b3.classList.remove("-rotate-45", "-translate-y-[8px]");
  }
}

function closeMobileMenu() {
  if (mobileMenuOpen) toggleMobileMenu();
}

// Size Guide Modal
function openSizeGuide() {
  document.getElementById("size-guide-modal").classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeSizeGuide() {
  document.getElementById("size-guide-modal").classList.add("hidden");
  document.body.style.overflow = "";
}

// Close modal on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeSizeGuide();
});

// Shopify CDN image optimizer - append width param for smaller/faster images
function imgUrl(src, width) {
  if (!src) return "";
  // Shopify CDN supports ?width= for on-the-fly resizing
  const sep = src.includes("?") ? "&" : "?";
  return `${src}${sep}width=${width}`;
}

// Customer reviews data
const reviews = [
  { name: "Ayesha K.", city: "Lahore", rating: 5, img: "https://i.pravatar.cc/150?img=47", text: "Amazing quality! Fits perfectly and really smooths everything out. Wore it under my wedding outfit and felt so confident.", date: "2 days ago" },
  { name: "Ahmed R.", city: "Karachi", rating: 5, img: "https://i.pravatar.cc/150?img=68", text: "Bought this as a gift for my wife and she absolutely loves it. The quality is outstanding. Will order more!", date: "4 days ago" },
  { name: "Sana M.", city: "Karachi", rating: 5, img: "https://i.pravatar.cc/150?img=45", text: "Best shapewear I've ever bought. The material is breathable and doesn't roll down. Will buy more colors!", date: "5 days ago" },
  { name: "Fatima R.", city: "Islamabad", rating: 4, img: "https://i.pravatar.cc/150?img=44", text: "Very comfortable for daily wear. I forget I'm even wearing it. Delivery was super fast too.", date: "1 week ago" },
  { name: "Hassan M.", city: "Rawalpindi", rating: 5, img: "https://i.pravatar.cc/150?img=59", text: "Ordered for my sister's birthday. She said it's the most comfortable shapewear she's ever tried. Great gift idea!", date: "1 week ago" },
  { name: "Hira A.", city: "Rawalpindi", rating: 5, img: "https://i.pravatar.cc/150?img=26", text: "The tummy control is incredible! I went down a full dress size appearance-wise. Highly recommend.", date: "1 week ago" },
  { name: "Zainab N.", city: "Faisalabad", rating: 5, img: "https://i.pravatar.cc/150?img=23", text: "Ordered the bodysuit and it's a game changer. Perfect for formal events. The quality is premium.", date: "2 weeks ago" },
  { name: "Omar S.", city: "Lahore", rating: 5, img: "https://i.pravatar.cc/150?img=52", text: "My wife has been looking for good shapewear for months. This is perfect - she wears it every day now. Thank you!", date: "2 weeks ago" },
  { name: "Maryam S.", city: "Multan", rating: 4, img: "https://i.pravatar.cc/150?img=32", text: "Good compression without being uncomfortable. The seamless design means no visible lines under clothes.", date: "2 weeks ago" },
  { name: "Nadia T.", city: "Peshawar", rating: 5, img: "https://i.pravatar.cc/150?img=9", text: "I was skeptical but this really works! My clothes fit so much better now. Already ordered two more.", date: "3 weeks ago" },
  { name: "Ali K.", city: "Islamabad", rating: 5, img: "https://i.pravatar.cc/150?img=53", text: "Got this for my mom and she's thrilled. Says it's super comfortable and the material feels premium. Five stars!", date: "3 weeks ago" },
  { name: "Amina H.", city: "Lahore", rating: 5, img: "https://i.pravatar.cc/150?img=25", text: "Excellent product! The skin color matches perfectly. It's like a second skin - invisible under everything.", date: "3 weeks ago" },
  { name: "Sarah Q.", city: "Islamabad", rating: 5, img: "https://i.pravatar.cc/150?img=20", text: "Absolutely love it! The material doesn't bunch up or roll. Finally found shapewear that actually stays put.", date: "1 month ago" },
  { name: "Bilal A.", city: "Sialkot", rating: 4, img: "https://i.pravatar.cc/150?img=61", text: "Bought the bodysuit for my wife's anniversary gift. She says it's the best shapewear she's owned. Great quality!", date: "1 month ago" },
  { name: "Bushra L.", city: "Hyderabad", rating: 5, img: "https://i.pravatar.cc/150?img=43", text: "I bought 3 pieces and all are perfect. The black one is my favorite for under abayas. Super smooth finish.", date: "2 months ago" },
];

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  renderHotProduct();
  renderProducts();
  renderReviews();
  handleRoute();
  window.addEventListener("hashchange", handleRoute);

  // Preload first product images in background after page load
  requestIdleCallback(() => {
    products.forEach((p) => {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.as = "image";
      link.href = imgUrl(p.images[0], 600);
      document.head.appendChild(link);
    });
  });
});

// Routing
// Render Hot Product (product ID 4 - Miracle Figure Control Bodysuit)
function renderHotProduct() {
  const hot = products.find((p) => p.id === 4);
  if (!hot) return;
  const el = document.getElementById("hot-product");
  if (!el) return;

  el.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-0">
      <div class="lg:col-span-3 cursor-pointer group" onclick="navigateToProduct(${hot.id})">
        <div class="relative aspect-square sm:aspect-[4/5] lg:aspect-auto lg:h-full bg-brand-50 img-skeleton overflow-hidden">
          <img src="${imgUrl(hot.images[0], 700)}" alt="${hot.name}"
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" decoding="async"
            onload="this.parentElement.classList.remove('img-skeleton')">
        </div>
      </div>
      <div class="lg:col-span-2 flex flex-col justify-center p-8 sm:p-10 lg:p-12">
        <div class="flex items-center gap-3 mb-5">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider" style="background-color: #ebc2b2; color: #7c3a2a;">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clip-rule="evenodd"/></svg>
            Trending
          </span>
          <span class="text-xs text-gray-400">${hot.soldCount}+ sold recently</span>
        </div>
        <h3 class="font-display text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">${hot.name}</h3>
        <p class="text-gray-400 text-xs mt-2 uppercase tracking-wider">${hot.brand}</p>
        <p class="text-gray-500 text-sm leading-relaxed mt-5">${hot.description}</p>
        <div class="flex items-baseline gap-3 mt-6">
          <span class="text-3xl font-bold text-gray-900">AED ${hot.price.toLocaleString()}</span>
        </div>
        <div class="mt-5">
          <p class="text-xs text-gray-400 mb-2 uppercase tracking-wider">Available Sizes</p>
          <div class="flex gap-2">
            ${hot.sizes.map((s) => `<span class="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:border-gray-900 transition">${s}</span>`).join("")}
          </div>
        </div>
        <div class="flex flex-col sm:flex-row gap-3 mt-8">
          <button onclick="navigateToProduct(${hot.id})" class="px-8 py-3.5 text-white text-sm font-semibold rounded-full transition-all hover:shadow-lg hover:opacity-90" style="background-color: #ebc2b2; color: #5a2a1a;">
            View Details
          </button>
          <a href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi! I'm interested in the " + hot.name)}" target="_blank" class="px-8 py-3.5 bg-white text-gray-900 text-sm font-semibold rounded-full border border-gray-200 hover:border-gray-900 transition-all text-center">
            Quick Order
          </a>
        </div>
      </div>
    </div>
  `;
}

function handleRoute() {
  const hash = window.location.hash;
  if (hash.startsWith("#product/")) {
    const slug = hash.split("/").slice(1).join("/");
    const product = products.find((p) => p.slug === slug) || products.find((p) => p.id === parseInt(slug));
    if (product) {
      showProduct(product);
      return;
    }
  }
  showHome();
}

// Show Home
function showHome() {
  window.location.hash = "";
  document.getElementById("home-view").classList.remove("hidden");
  document.getElementById("product-view").classList.add("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Render Product Cards
function renderProducts() {
  const grid = document.getElementById("products-grid");
  grid.innerHTML = products
    .map(
      (product) => `
    <div class="product-card group cursor-pointer" onclick="navigateToProduct(${product.id})">
      <div class="relative aspect-[3/4] bg-brand-50 img-skeleton rounded-2xl overflow-hidden mb-4">
        <img src="${imgUrl(product.images[0], 400)}" alt="${product.name}"
          class="w-full h-full object-cover absolute inset-0 transition-opacity duration-500 group-hover:opacity-0" loading="lazy" decoding="async"
          onload="this.parentElement.classList.remove('img-skeleton')">
        ${product.images[1] ? `<img src="${imgUrl(product.images[1], 400)}" alt="${product.name} - back"
          class="w-full h-full object-cover absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" loading="lazy" decoding="async">` : ""}
        ${
          product.badge
            ? `<span class="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold text-gray-800 rounded-full z-10">${product.badge}</span>`
            : ""
        }
      </div>
      <div class="px-1">
        <h3 class="font-medium text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-brand-700 transition">${product.name}</h3>
        <p class="text-xs text-gray-400 mt-1">${product.brand}</p>
        <div class="flex items-baseline gap-2 mt-2">
          <span class="font-bold text-gray-900">AED ${product.price.toLocaleString()}</span>
          ${
            product.originalPrice
              ? `<span class="text-xs text-gray-400 line-through">AED ${product.originalPrice.toLocaleString()}</span>`
              : ""
          }
        </div>
        <div class="flex gap-1 mt-2">
          ${product.colors
            .map(
              (c) =>
                `<span class="text-[11px] text-gray-400 border border-gray-200 rounded-full px-2 py-0.5">${c}</span>`
            )
            .join("")}
        </div>
      </div>
    </div>
  `
    )
    .join("");
}

// Render Reviews Slider
function renderReviews() {
  const track = document.getElementById("reviews-track");
  if (!track) return;

  const stars = (count) =>
    Array(5)
      .fill("")
      .map((_, i) =>
        i < count
          ? `<svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`
          : `<svg class="w-4 h-4 text-gray-200" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`
      )
      .join("");

  const card = (r) => `
    <div class="flex-shrink-0 w-[300px] sm:w-[340px] bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div class="flex items-center gap-4 mb-4">
        <img src="${r.img}" alt="${r.name}" class="w-12 h-12 rounded-xl object-cover ring-2 ring-brand-100" loading="lazy" decoding="async">
        <div>
          <p class="font-semibold text-gray-900 text-sm">${r.name}</p>
          <p class="text-xs text-gray-400">${r.city}</p>
        </div>
      </div>
      <div class="flex items-center gap-1 mb-3">${stars(r.rating)}</div>
      <p class="text-gray-600 text-sm leading-relaxed">"${r.text}"</p>
      <p class="text-xs text-gray-300 mt-4">${r.date}</p>
    </div>
  `;

  // Duplicate reviews for seamless infinite scroll
  const html = reviews.map(card).join("");
  track.innerHTML = html + html;
}

// Navigate to product
function navigateToProduct(id) {
  const p = products.find((p) => p.id === id);
  window.location.hash = `product/${p ? p.slug : id}`;
}

// Show Product Detail
function showProduct(product) {
  currentProduct = product;
  quantity = 1;
  selectedSize = product.sizes[0];
  selectedColor = product.colors[0];

  document.getElementById("home-view").classList.add("hidden");
  const view = document.getElementById("product-view");
  view.classList.remove("hidden");
  view.classList.add("fade-in");

  // Breadcrumb
  document.getElementById("breadcrumb-name").textContent = product.name;

  // Main image - full size for detail view
  const mainImg = document.getElementById("detail-main-image");
  mainImg.src = imgUrl(product.images[0], 800);
  mainImg.alt = product.name;

  // Prefetch other product images
  product.images.slice(1).forEach((src) => {
    const img = new Image();
    img.src = imgUrl(src, 800);
  });

  // Thumbnails
  const thumbs = document.getElementById("detail-thumbnails");
  thumbs.innerHTML = product.images
    .map(
      (img, i) => `
    <button onclick="setMainImage('${img}')"
      class="w-20 h-24 rounded-lg overflow-hidden border-2 ${i === 0 ? "border-gray-900" : "border-gray-200"} hover:border-gray-900 transition">
      <img src="${imgUrl(img, 150)}" alt="" class="w-full h-full object-cover" loading="lazy" decoding="async">
    </button>
  `
    )
    .join("");

  // Badge
  const badgeEl = document.getElementById("detail-badge");
  if (product.badge) {
    badgeEl.textContent = product.badge;
    badgeEl.classList.remove("hidden");
  } else {
    badgeEl.classList.add("hidden");
  }

  // Name
  document.getElementById("detail-name").textContent = product.name;

  // Sold count
  document.getElementById("detail-sold").querySelector("span").textContent =
    `${product.soldCount} sold in last 18 hours`;

  // Brand
  document.getElementById("detail-brand").textContent =
    `Brand: ${product.brand}`;

  // Price
  document.getElementById("detail-price").textContent =
    `AED ${product.price.toLocaleString()}`;
  const origPriceEl = document.getElementById("detail-original-price");
  const discountEl = document.getElementById("detail-discount");
  if (product.originalPrice) {
    origPriceEl.textContent = `AED ${product.originalPrice.toLocaleString()}`;
    origPriceEl.classList.remove("hidden");
    const discount = Math.round(
      ((product.originalPrice - product.price) / product.originalPrice) * 100
    );
    discountEl.textContent = `${discount}% OFF`;
    discountEl.classList.remove("hidden");
  } else {
    origPriceEl.classList.add("hidden");
    discountEl.classList.add("hidden");
  }

  // Sizes
  const sizesEl = document.getElementById("detail-sizes");
  sizesEl.innerHTML = product.sizes
    .map(
      (size) => `
    <button onclick="selectSize('${size}', this)"
      class="size-btn px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-medium hover:border-gray-900 transition ${size === selectedSize ? "active" : ""}">
      ${size}
    </button>
  `
    )
    .join("");

  // Colors
  const colorsEl = document.getElementById("detail-colors");
  colorsEl.innerHTML = product.colors
    .map(
      (color) => `
    <button onclick="selectColor('${color}', this)"
      class="size-btn px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-medium hover:border-gray-900 transition ${color === selectedColor ? "active" : ""}">
      ${color}
    </button>
  `
    )
    .join("");

  // Quantity
  document.getElementById("detail-qty").textContent = quantity;

  // Description
  document.getElementById("detail-description").textContent =
    product.description;

  // Viewers
  const viewers = Math.floor(Math.random() * 200) + 80;
  document.getElementById(
    "detail-viewers"
  ).textContent = `${viewers} customers are viewing this product`;

  // Update WhatsApp button
  updateWhatsAppLink();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Set main image
function setMainImage(src) {
  document.getElementById("detail-main-image").src = imgUrl(src, 800);
  // Update thumbnail borders
  document.querySelectorAll("#detail-thumbnails button").forEach((btn) => {
    const img = btn.querySelector("img");
    if (img.src.includes(src.split("/").pop())) {
      btn.classList.remove("border-gray-200");
      btn.classList.add("border-gray-900");
    } else {
      btn.classList.remove("border-gray-900");
      btn.classList.add("border-gray-200");
    }
  });
}

// Select size
function selectSize(size, btn) {
  selectedSize = size;
  document
    .querySelectorAll("#detail-sizes .size-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  updateWhatsAppLink();
}

// Select color
function selectColor(color, btn) {
  selectedColor = color;
  document
    .querySelectorAll("#detail-colors .size-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  updateWhatsAppLink();
}

// Change quantity
function changeQty(delta) {
  quantity = Math.max(1, quantity + delta);
  document.getElementById("detail-qty").textContent = quantity;
  updateWhatsAppLink();
}

// Update WhatsApp order link
function updateWhatsAppLink() {
  if (!currentProduct) return;
  const message = encodeURIComponent(
    `Hi! I would like to order:\n\n` +
      `Product: ${currentProduct.name}\n` +
      `Size: ${selectedSize}\n` +
      `Color: ${selectedColor}\n` +
      `Quantity: ${quantity}\n` +
      `Price: AED ${(currentProduct.price * quantity).toLocaleString()}\n\n` +
      `Please confirm my order. Thank you!`
  );
  document.getElementById(
    "order-whatsapp-btn"
  ).href = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}
