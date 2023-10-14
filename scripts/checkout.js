import { calculateCartQuantity, cart, removeItemFromCart,updateQuantity } from "../data/cart.js";
import { products } from '../data/products.js';
import { formatCurrency } from "./utils/money.js";
let displayCartSummary = '';
updateCartQuantity();
cart.forEach(cartItem => {
  let matchingItems;
  const productId = cartItem.productId;
  products.forEach((product) => {
    if (productId === product.id) {
      matchingItems = product;
    }
  });
  displayCartSummary += `<div class="cart-item-container js-cart-item-container-${matchingItems.id}">
  <div class="delivery-date">
    Delivery date: Tuesday, June 21
  </div>

  <div class="cart-item-details-grid">
    <img class="product-image"
      src="${matchingItems.image}">

    <div class="cart-item-details">
      <div class="product-name">
        ${matchingItems.name}
      </div>
      <div class="product-price">
        $${formatCurrency(matchingItems.priceCents)}
      </div>
      <div class="product-quantity">
        <span>
          Quantity: <span class="quantity-label js-quantity-label-${matchingItems.id}">${cartItem.quantity}</span>
        </span>
        <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingItems.id}">
          Update
        </span>
        <input class="quantity-input js-quantity-input-${matchingItems.id}">
      <span class="save-quantity-link link-primary js-save-link" data-product-id="${matchingItems.id}"> 
          Save
      </span>
        <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingItems.id}">
          Delete
        </span>
      </div>
    </div>

    <div class="delivery-options">
      <div class="delivery-options-title">
        Choose a delivery option:
      </div>
      <div class="delivery-option">
        <input type="radio" checked
          class="delivery-option-input"
          name="delivery-option-${matchingItems.id}">
        <div>
          <div class="delivery-option-date">
            Tuesday, June 21
          </div>
          <div class="delivery-option-price">
            FREE Shipping
          </div>
        </div>
      </div>
      <div class="delivery-option">
        <input type="radio"
          class="delivery-option-input"
          name="delivery-option-${matchingItems.id}">
        <div>
          <div class="delivery-option-date">
            Wednesday, June 15
          </div>
          <div class="delivery-option-price">
            $4.99 - Shipping
          </div>
        </div>
      </div>
      <div class="delivery-option">
        <input type="radio"
          class="delivery-option-input"
          name="delivery-option-${matchingItems.id}">
        <div>
          <div class="delivery-option-date">
            Monday, June 13
          </div>
          <div class="delivery-option-price">
            $9.99 - Shipping
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`

  document.querySelector('.js-order-summary').innerHTML = displayCartSummary;

  document.querySelectorAll(`.js-update-link`).forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      container.classList.add('is-editing-quantity');

    
    });
  });
  document.querySelectorAll(`.js-save-link`).forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;

      const container = document.querySelector(`.js-cart-item-container-${productId}`);

       container.classList.remove('is-editing-quantity');

       const quantityInput = document.querySelector(`.js-quantity-input-${productId}`);

       const newQuantity = Number(quantityInput.value);
       if(newQuantity >= 1 && newQuantity <=10){
         updateQuantity(productId,newQuantity);
         document.querySelector(`.js-quantity-label-${productId}`).innerHTML = `${newQuantity}`;
         updateCartQuantity();
       }
    });
  })


  document.querySelectorAll(`.js-delete-link`).forEach((link) => {
    link.addEventListener('click', () => {
      const { productId } = link.dataset;
      removeItemFromCart(productId);
      const itemToRemove = document.querySelector(`.js-cart-item-container-${productId}`);
      itemToRemove.remove();
      updateCartQuantity();
    });
  });

});
function updateCartQuantity() {

  document.querySelector('.js-return-to-home-link').innerHTML = `${calculateCartQuantity()} items`;
}