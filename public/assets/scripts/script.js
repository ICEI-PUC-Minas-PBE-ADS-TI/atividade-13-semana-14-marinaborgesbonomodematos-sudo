const API_URL = "http://localhost:3000/produtos";


let estoqueProdutos = [];


async function fetchItems() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Erro ao buscar produtos");
        return await response.json();
    } catch (error) {
        console.error("Erro Home:", error);
        return [];
    }
}

const productList = document.getElementById("product-list");
const productDetails = document.getElementById("product-details"); 


const searchInput = document.querySelector("#search");
const categorySelect = document.querySelector("#category");
const btnRender = document.querySelector("#btnRender");


function formatPrice(preco){
    return preco.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function createProductCard(produto){
    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("data-id", produto.id);
    card.style.border = "2px solid transparent";

    const estoque = produto.emEstoque ? "Em estoque" : "Fora de estoque";

    card.innerHTML = `
        <img src="${produto.imagem}" alt="${produto.nome}">
        <h2>${produto.nome}</h2>
        <p class="price">${formatPrice(produto.preco)}</p>
        <span class="category">${produto.categoria}</span>
        <p>${estoque}</p>
        <div class="card-buttons">
          <button class="details-btn">Ver detalhes</button>
          <button class="highlight-btn">Destacar</button>
        </div>
    `;


    const detailsButton = card.querySelector(".details-btn");
    detailsButton.addEventListener("click", () => {
        window.location.href = `details.html?id=${produto.id}`;
    });

    const highlightButton = card.querySelector(".highlight-btn");
    highlightButton.addEventListener("click", () => {
        card.classList.toggle("highlight");
    });

    return card;
}

function renderProducts(produtos){
    if (!productList) return;
    productList.innerHTML = "";
    produtos.forEach(produto => {
        const card = createProductCard(produto);
        productList.appendChild(card);
    });
}


function renderCategories(){
    if (!categorySelect) return;
    const categorias = estoqueProdutos.map(produto => produto.categoria);
    const categoriasUnicas = [...new Set(categorias)];

    categorySelect.innerHTML = '<option value="Todas">Todas</option>';

    categoriasUnicas.forEach(categoria => {
        const option = document.createElement("option");
        option.value = categoria;
        option.textContent = categoria;
        categorySelect.appendChild(option);
    });
}


function filterProducts(){
    const searchText = searchInput.value.toLowerCase();
    const selectedCategory = categorySelect.value;
    
    const produtosFiltrados = estoqueProdutos.filter(produto => {
        const matchName = produto.nome.toLowerCase().includes(searchText);
        const matchCategory = selectedCategory === "Todas" || produto.categoria === selectedCategory;

        return matchName && matchCategory;
    });

    renderProducts(produtosFiltrados);
}


if (searchInput) searchInput.addEventListener("input", filterProducts);
if (categorySelect) categorySelect.addEventListener("change", filterProducts);

if(btnRender) {
    btnRender.addEventListener("click", () => {
        renderProducts(estoqueProdutos);
    });
}


async function inicializar() {
    estoqueProdutos = await fetchItems(); 
    
    if (estoqueProdutos.length > 0) {
        renderCategories();      
        renderProducts(estoqueProdutos);
    } else {
        console.warn("Nenhum produto foi carregado da API.");
    }
}


inicializar();