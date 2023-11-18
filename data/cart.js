
export let cart = JSON.parse(localStorage.getItem('cart')) ||
  [{
    productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
    quantity: 2,
    deliveryOptionsId: '1'
  }, {
    productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
    quantity: 1,
    deliveryOptionsId: '2'
  }];
function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}
const timeoutProduct = {};
//add item to the cart
export function addToCart(productId) {
  let isItemAdded;
  const quantitySelector = document.querySelector(`.js-quantity-selector-${productId}`);
  const quantity = Number(quantitySelector.value);
  cart.forEach((cartItem) => {
    if (cartItem.productId === productId) {
      isItemAdded = cartItem;
    }
  })
  if (isItemAdded) {
    isItemAdded.quantity += quantity;
  } else {
    cart.push({ productId, quantity, deliveryOptionsId: '1' });
  }
  displayAddedItem(productId);
  updateCartQuantity();
  saveToStorage();
}

// display on the screen item has been added
function displayAddedItem(productId) {
  const addedToCart = document.querySelector(`.js-added-to-cart-${productId}`);
  const previousTimeOut = timeoutProduct[productId];
  if (previousTimeOut) {
    clearTimeout(previousTimeOut);
  }
  const timeoutID = setTimeout(() => {
    addedToCart.classList.remove('addedToCart');

  }, 2000)
  timeoutProduct[productId] = timeoutID;

  addedToCart.classList.add('addedToCart');
}
export function calculateCartQuantity() {
  let cartQuantity = 0;
  cart.forEach((cartItem) => { cartQuantity += cartItem.quantity });

  return cartQuantity;
}
//calculate cart quantity

export function updateCartQuantity() {

  const saveCartQuantity = document.querySelector('.js-cart-quantity');
  saveCartQuantity.innerHTML = `${calculateCartQuantity()}`;

}
export function updateQuantity(productId, newQuantity) {
  cart.forEach((cartItem) => {
    if (cartItem.productId === productId) {
      cartItem.quantity = newQuantity;
      saveToStorage();
    }
  });
}
//delete item
export function removeItemFromCart(productId) {
  const newCart = [];
  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  });
  cart = newCart;
  saveToStorage();
}

