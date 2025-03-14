const API_URL = "https://desafio.xlow.com.br";

async function fetchData(endpoint = "") {
  try {
    const response = await fetch(`${API_URL}${endpoint}`);

    if (!response.ok) {
      throw new Error(`Fail to fetch on ${API_URL}${endpoint}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function fetchProductDetail(productId) {
  return await fetchData(`/search/${productId}`);
}

async function fetchProducts(getDetail = true) {
  try {
    const products = await fetchData("/search");

    if (getDetail) {
      return Promise.all(
        products.map(async (product) => {
          const [items] = await fetchProductDetail(product.productId);
          return { ...product, ...items };
        })
      );
    }

    return products;
  } catch (e) {
    console.error(e);
    return [];
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const products = await fetchProducts((getDetail = true));
  const gridTemplate = document.getElementById("vitrine");
  const toggle = document.querySelector(".filter__columns-control");
  const quantitySelector = document.querySelector(".filter__quantity-selector");
  const quantityItens = document.querySelector(".filter__quantity-itens");
  quantityItens.innerHTML = `Exibindo 5 de ${products.length}`;

  quantitySelector.addEventListener("change", (event) => {
    const selectedValue = parseInt(event.target.value);
    const displayValue = Math.min(selectedValue, products.length);

    quantityItens.innerHTML = `Exibindo ${displayValue} de ${products.length}`;
    renderProducts(products, displayValue);
  });

  renderProducts(products, 5);
  applyInitialGridClasses(gridTemplate);
  updateIcons(toggle, gridTemplate);
  setOptionsProducts();

  window.addEventListener("resize", () => {
    removeAllGridClasses(gridTemplate);
    applyInitialGridClasses(gridTemplate);
    updateIcons(toggle, gridTemplate);
  });

  toggle.addEventListener("click", () => {
    updatedGrid(gridTemplate);
    updateIcons(toggle, gridTemplate);
  });
});

function applyInitialGridClasses(grid) {
  if (window.innerWidth <= 768) {
    grid.classList.add("mobile-one-column");
  } else {
    grid.classList.add("desktop-five-columns");
  }
}

function removeAllGridClasses(grid) {
  grid.classList.remove(
    "mobile-one-column",
    "mobile-two-columns",
    "desktop-five-columns",
    "desktop-four-columns"
  );
}

function updatedGrid(grid) {
  const isMobile = window.innerWidth <= 768;

  if (isMobile) {
    grid.classList.toggle("mobile-one-column");
    grid.classList.toggle("mobile-two-columns");
  } else {
    grid.classList.toggle("desktop-five-columns");
    grid.classList.toggle("desktop-four-columns");
  }
}

function updateIcons(toggle, grid) {
  const isMobile = window.innerWidth <= 768;
  let columns = 1;

  if (isMobile) {
    columns = grid.classList.contains("mobile-two-columns") ? 1 : 2;
  } else {
    columns = grid.classList.contains("desktop-five-columns") ? 4 : 5;
  }

  Array.from(toggle.children).forEach((icon, index) => {
    if (index < columns) {
      icon.style.display = "block";
    } else {
      icon.style.display = "none";
    }
  });
}

function getPrice(item, type = "Price") {
  const price = item.sellers?.[0]?.commertialOffer?.[type] || "Indisponível";

  return price !== "Indisponível"
    ? `R$ ${parseFloat(price).toFixed(2).replace(".", ",")}`
    : price;
}

function createProductCard(product) {
  if (product.leangth === 0) {
    return `<div class="card">
      <div class="product">
        <h1>Produto não encontrado</h1>
      </div>
    `;
  }

  const card = document.createElement("div");
  card.classList.add("vitrine__card");

  card.setAttribute("data-product-id", product.productId);
  const firstItem = product.items[0];

  const price = getPrice(firstItem, "Price");
  const priceWithoutDiscount = getPrice(firstItem, "PriceWithoutDiscount");

  card.innerHTML = `
    
    <div class="vitrine__card__image">
      ${renderImage(firstItem.images, 300, 300)}
    </div>
    <div class="vitrine__card__options">
      <h3 class="vitrine__cards--title">${product.productName}</h3>

      ${renderOptions(product)}
    </div>
    <div class="vitrine__card__info">
      <div class="vitrine__cards__info-price">
        ${renderPrice(price, priceWithoutDiscount)}
      </div>
      <button class="vitrine__cards__info-button">Comprar</button>
    </div>`;
  return card;
}

function setOptionsProducts() {
  document.querySelectorAll(".vitrine__card__options").forEach((option) => {
    option.addEventListener("click", async (event) => {
      const productId = option
        .closest(".vitrine__card")
        .getAttribute("data-product-id");

      const productDetails = await fetchProductDetail(productId);
      const firstItem = productDetails[0].items[0];
      const newImages = firstItem.images;

      const imageContainer = option
        .closest(".vitrine__card")
        .querySelector(".vitrine__card__image");
      imageContainer.innerHTML = renderImage(newImages, 300, 300);

      const price = getPrice(firstItem, "Price");
      const priceWithoutDiscount = getPrice(firstItem, "PriceWithoutDiscount");

      const priceElemenet = option
        .closest(".vitrine__card")
        .querySelector(".vitrine__cards__info-price");

      priceElemenet.innerHTML = renderPrice(price, priceWithoutDiscount);
    });
  });
}

function renderPrice(price, priceWithoutDiscount) {
  if (priceWithoutDiscount === price) {
    return `
      <p class="vitrine__cards__info-price vitrine__cards__info-price--original">${priceWithoutDiscount}</p>
      <p class="vitrine__cards__info-price vitrine__cards__info-price--discounted">${price}</p>
    `;
  } else {
    return `
      <p class="vitrine__cards__info-price vitrine__cards__info-price--discounted">${price}</p>
    `;
  }
}

function renderProducts(products, quantity) {
  try {
    const vitrine = document.querySelector("#vitrine");
    vitrine.innerHTML = "";

    const productsToRender = quantity ? products.slice(0, quantity) : products;

    productsToRender.map((product) => {
      vitrine.appendChild(createProductCard(product));
    });
  } catch (e) {
    console.error(e);
  }
}

function renderOptions(product) {
  const options = product.items.map((item) => {
    return `${renderImage(Array(item.images[0]), 50, 50)}`;
  });

  return options.join("");
}

function renderImage(images, width, height, limit) {
  const imgsHtml = images
    .map((img) => {
      let imgTagHtml = img.imageTag;
      const imgUrl = new URL(img.imageUrl).origin;

      imgTagHtml = imgTagHtml
        .replace(/#width#/g, width)
        .replace(/#height#/g, height)
        .replace("~", imgUrl)
        .replace('id=""', `id="${img.imageId}"`);

      return imgTagHtml;
    })
    .join("");
  return imgsHtml;
}
