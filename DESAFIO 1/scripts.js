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

async function fetchProducts(getDetail = false) {
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
  renderProducts(products, 5);
});

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

  card.innerHTML = `
    
    <div class="vitrine__card__image">
      ${renderImage(product.items[0].images, 200, 200)}
    </div>
    <h3>${product.productName}</h3>
  `;

  return card;
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
