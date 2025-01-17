const serverurl = process.env.SERVER_API;
console.log("Dev m3", serverurl);

window.onload = () => {
let loadedProducts = []
let productsToRender = []
let renderedElements = []
let priceFilter = {}
let orderBy = '';
let globalFilteredProducts = []
let basket = 0;

const cardContainer = document.getElementById('cards-content');
const loadMoreButton = document.getElementById('load_more');
const allColorsButton = document.getElementById('all_colors');
const orderByButton = document.getElementById('order_by');

const filterButton = document.getElementById('btn_filter');
const orderButton = document.getElementById('btn_order');

const closeFilterButton = document.querySelector('.close-filters');
const closeOrderButton = document.querySelector('.close-order');

const toggleColors = document.getElementById('toggle-colors');
const toggleSizes = document.getElementById('toggle-sizes');
const togglePrices = document.getElementById('toggle-prices');

const cleanButton = document.getElementById('btn_clean');

function toggleArrow(e) {
  const arrow = e.target.querySelector('.toggle-filters')
  arrow.classList.toggle('-active');
}

toggleColors.addEventListener('click', (e) => {
  const color = document.querySelector('.colors-container');
  toggleArrow(e);
  color.classList.toggle('-active');
})

toggleSizes.addEventListener('click', (e) => {
  const size = document.querySelector('.size-container');
  toggleArrow(e);
  size.classList.toggle('-active')
})

togglePrices.addEventListener('click', (e) => {
  const price = document.querySelector('.price-container');
  toggleArrow(e);
  price.classList.toggle('-active')
})

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

function setBasket() {
  const badge = document.querySelector('.badge');

  if (basket == 1) {
    badge.classList.add('-active');
  }

  badge.textContent = basket
}

function handleBasket() {
  basket+= 1;
  setBasket();
}


function renderCard({image, name, parcelamento, price}) {
  const cardElement = document.createElement('div');
  const buttonBuy = document.createElement('a')
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

  buttonBuy.classList.add('btn', 'btn-buy');
  buttonBuy.textContent = 'Comprar';
  buttonBuy.addEventListener('click', handleBasket)
  

  cardElement.appendChild(imgElement);
  cardElement.appendChild(titleElement);
  cardElement.appendChild(priceElement);
  cardElement.appendChild(installmentElement);
  cardElement.appendChild(buttonBuy);

  cardContainer.appendChild(cardElement);
}

function loadMore(el) {
  el.target.classList.add("-hide");
  const renderingTimes = loadedProducts.length - renderedElements.length
  const maxRender = loadedProducts.length - renderingTimes;
  
  if (!renderedElements.length >= !loadedProducts.length) {
    for (let count = maxRender; count < loadedProducts.length; count++) {
      renderedElements.push(loadedProducts[count]);
      productsToRender.push(loadedProducts[count])
    }
    globalFilteredProducts = [...productsToRender]
  }

  loadFiltered();
}

function toggleOrderBy() {
  const orderBySelectOptions = document.querySelector('.select-options');
  
  const selectOrder = document.querySelector('.select-order');
  const arrowElement = orderByButton.querySelector('.arrow');
  
  document.body.style.overflow = 'visible'
  selectOrder.classList.remove('-active')
  orderBySelectOptions.classList.toggle('-active')
  arrowElement.classList.toggle('-active');
}

function orderByOptions() {
  const optionsElements = document.querySelectorAll('li.option');
  optionsElements.forEach(option => {
    option.addEventListener('click', () => {
      orderBy = option.dataset.value

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

filterButton.addEventListener('click', () => {
  document.body.style.overflow = 'hidden'
  const filtersContainer = document.querySelector('.filters-container');
  filtersContainer.classList.toggle('-active')

  closeFilterButton.addEventListener('click', () => {
    document.body.style.overflow = 'visible'
    filtersContainer.classList.remove('-active')
  })
});

orderButton.addEventListener('click', () => {
  document.body.style.overflow = 'hidden'
  const selectOrder = document.querySelector('.select-order');
  const selectOptions = document.querySelector('.select-options');

  selectOrder.classList.toggle('-active')
  selectOptions.classList.toggle('-active')

  closeOrderButton.addEventListener('click', () => {
    document.body.style.overflow = 'visible'
    selectOrder.classList.remove('-active')
    selectOptions.classList.remove('-active')
  })

});

function setInputsEventListener(input, handleFunction) {
  input.addEventListener('click', handleFunction)
}

function allCheckedInputs() {
  const checkedInputs = []

  getAllInputs().forEach(input => {
    if (input.checked) checkedInputs.push(input.dataset)
  })

  return checkedInputs;
}

function getAllInputs() {
  const inputsCheckbox = document.querySelectorAll('input[type="checkbox"]');
  const inputsRadio = document.querySelectorAll('input[name="price"]');
  const allInputs = [...inputsCheckbox, ...inputsRadio]
  return allInputs;
}

function allInput() {
  const inputs = getAllInputs();
  
  inputs.forEach(input => {
    setInputsEventListener(input, loadFiltered)
  })
}

cleanButton.addEventListener('click', () => {
  
  getAllInputs().forEach(input => {
    input.checked = false;
    loadFiltered()
    priceFilter = {}
  });
})

function loadFiltered() {
  const filters = allCheckedInputs()
  
  const colors = [];
  const sizes = [];
  
  filters.map((filter) => {
    if (filter.color) {
      colors.push(filter.color);
    } 
    
    if (filter.size) {
      sizes.push(filter.size)
    }

    if (filter.maxprice) {
      priceFilter = {
        max: filter.maxprice,
        min: filter.minprice
      }
    }
  })
    
  filteredColors(colors);
  filteredSizes(sizes);
  filteredPrices();
  orderByFilter();

  displayProducts(globalFilteredProducts);
  
  if (!hasFilter(colors) && !hasFilter(sizes) && !priceFilter.min) {
    displayProducts(productsToRender)
  }
}

function filteredColors(colors) {
  let filteredByColors = []
  
  if (hasFilter(colors)) {
    colors.map(color => {
      const filter = productsToRender.filter(product => product.color.toUpperCase() == color.toUpperCase());
      filteredByColors.push(...filter)
    })

    globalFilteredProducts = [...filteredByColors];
  }
  else {
    globalFilteredProducts = productsToRender;
  }
}

function filteredSizes(sizes) {
  const productsMap = new Set();
  const products = []
  
  if (hasFilter(sizes)) {
    sizes.map(size => {
      const filteredSizes = globalFilteredProducts.filter(product => {
        for (const productSize of product.size) {
          if (productSize == size.toUpperCase()) {
            return product
          }
        }
      });

      filteredSizes.map(product => productsMap.add(product))
    })
    productsMap.forEach(value => products.push(value))
    globalFilteredProducts = products;
  }
}

function filteredPrices() {
  let filteredPrice = []

  if (priceFilter.max) {
    if (priceFilter.max == "+") {
      filteredPrice = globalFilteredProducts.filter(product => product.price >= 500);
    } else {
      filteredPrice = globalFilteredProducts.filter(product => product.price >= priceFilter.min && product.price <= priceFilter.max)
    }

    globalFilteredProducts = [...filteredPrice]
  }
}

function orderByFilter() {
  switch (orderBy) {
    case 'lowestPrice':
      const productsFiltetedByLowestPrice = globalFilteredProducts.sort((productA, productB) => productA.price - productB.price)
      globalFilteredProducts = productsFiltetedByLowestPrice;
      break;
    case 'highestPrice':
      const productsFiltetedByHighestPrice = globalFilteredProducts.sort((productA, productB) => productB.price - productA.price)
      globalFilteredProducts = productsFiltetedByHighestPrice;
      break;
    case 'recent':
      const productsFiltetedByDate = globalFilteredProducts.sort((productA, productB) => new Date(productB.date) - new Date(productA.date))
      globalFilteredProducts = productsFiltetedByDate;
      break;
    default:
      break;
  }
}

function hasFilter(filter) {
  if (filter.length == 0) return false
  return true
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
    productsToRender = [...products];
    globalFilteredProducts = productsToRender;
    displayProducts(products);
    loadFiltered();
  })
}

loadProducts();
allInput()
orderByOptions()
};