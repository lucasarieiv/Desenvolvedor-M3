const serverurl = process.env.SERVER_API;
console.log("Dev m3", serverurl);

let loadedProducts = []
let renderedElements = []
let allFilters = []
let filteredProducts = []

const cardContainer = document.getElementById('cards-content');
const loadMoreButton = document.getElementById('load_more');
const allColorsButton = document.getElementById('all_colors');
const orderByButton = document.getElementById('order_by')

function priceFormat(price) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);
}

function displayProducts(products) {
  const allCards = document.querySelectorAll('.card');
  allCards.forEach(card => card.remove());

  products.map(product => {
    renderCard(product)
  })
}

function renderCard({id, image, name, parcelamento, price}) {
  const cardElement = document.createElement('div');
  const buttonElement = document.createElement('a')
  const imgElement = document.createElement('img');
  const titleElement = document.createElement('h3');
  const priceElement = document.createElement('strong');
  const installmentElement = document.createElement('span');

  cardElement.classList.add('card');

  imgElement.classList.add('card-image')
  imgElement.setAttribute('src', image);

  titleElement.classList.add('card-title');
  titleElement.textContent = name;

  const priceFormatted = priceFormat(price)
  const installmentPriceFormatted = priceFormat(parcelamento[1]);

  priceElement.classList.add('card-price');
  priceElement.textContent = priceFormatted;

  installmentElement.classList.add('card-installment');
  installmentElement.textContent = `até ${parcelamento[0]}x de ${installmentPriceFormatted}`;

  buttonElement.classList.add('btn', 'btn-buy');
  buttonElement.textContent = 'Comprar';

  cardElement.appendChild(imgElement);
  cardElement.appendChild(titleElement);
  cardElement.appendChild(priceElement);
  cardElement.appendChild(installmentElement);
  cardElement.appendChild(buttonElement);

  cardContainer.appendChild(cardElement);
}

function loadMore() {
  const renderingTimes = loadedProducts.length - renderedElements.length
  const maxRender = loadedProducts.length - renderingTimes;
  
  if (!renderedElements.length >= !loadedProducts.length) {
    for (let count = maxRender; count < loadedProducts.length; count++) {
      renderedElements.push(loadedProducts[count]);
      renderCard(loadedProducts[count])
    }
  }

  loadFiltered(allFilters);
}

function toggleOrderBy() {
  const orderBySelectOptions = document.querySelector('.select-options');
  const arrowElement = orderByButton.querySelector('.arrow');

  orderBySelectOptions.classList.toggle('-active')
  arrowElement.classList.toggle('-active');
}

function orderByOptions() {
  const optionsElements = document.querySelectorAll('li.option');
  optionsElements.forEach(option => {
    option.addEventListener('click', () => {
      filters.orderBy = option.dataset.value

      const orderByText = orderByButton.querySelector('#text_order_by');
      orderByText.textContent = option.textContent;

      toggleOrderBy();
      loadFiltered();
    })
  })
}

allColorsButton.addEventListener('click', () => {
  const allColors = document.querySelectorAll('.container.-hide');
  allColorsButton.classList.add('-hide');
  allColors.forEach(color => color.classList.remove('-hide'));
})
loadMoreButton.addEventListener('click', loadMore);

orderByButton.addEventListener('click', () => {
  toggleOrderBy();
});

function allInput() {
  const inputs = document.querySelectorAll('input[type="checkbox"]');

  inputs.forEach(input => {
    setInputsEventListener(input)
  })
}

function setInputsEventListener(input) {
  input.addEventListener('click', allInputChecked)
}

function allInputChecked() {
  const inputs = document.querySelectorAll('input[type="checkbox"]');
  const filters = [];

  inputs.forEach(input => {
    if (input.checked) filters.push(input.dataset)
  })

  allFilters = filters;
  loadFiltered(filters)
}

function loadFiltered(filters) {
  const colors = [];
  const sizes = [];

  filters.map((filter) => {
    if (filter.color) {
      colors.push(filter.color)
    }

    // if (filter.size) {
    //   if (filter.value) {
    //     // console.log(filter.size, filter.value);
    //     const sizeFilter = {
    //       ...sizes,
    //       [filter.size]: filter.value 
    //     }
    //     sizes.push(sizeFilter)
    //     console.log(sizes);
    //   }
    // }
  })

  const productsFiltered = [];
  
  colors.map(color => {
    const filteredColors = loadedProducts.filter(product => product.color.toUpperCase() == color.toUpperCase());
    productsFiltered.push(...filteredColors);
  })
  
  // if (!productsFiltered.length == 0) {
  // } else {
  //   loadedProducts.forEach(card => renderCard(card));
  // }
  
  if (productsFiltered.length == 0) {
    displayProducts(loadedProducts);
  } else {
    displayProducts(productsFiltered);
  }
  
  // Aqui eu vou percorrer todo o filters e a partir do loadedProducts fazer um filter e renderizar tudo novamente
  // const filteredProducts = loadedProducts.filter(filters...)

  // filteredProducts.map(product, renderCard(product))
  // console.log('Fazendo todo processo de filtragem salvando nos filtros', filters);
}


function loadProducts() {
  fetch('http://localhost:5000/products')
  .then(data => {
    return data.json()
  })
  .then(allProducts => {
    loadedProducts = allProducts;
    const products = []
    for (let count = 0; count < 9; count++) {
      renderedElements.push(allProducts[count]);
      products.push(allProducts[count])
    }
    displayProducts(products);
  })
}

loadProducts();
loadMore();
allInput()
orderByOptions()