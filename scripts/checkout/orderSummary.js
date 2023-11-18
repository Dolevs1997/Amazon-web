import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { deliveryOptions, getDeliveryOption } from '../../data/deliveryOptions.js';
import { calculateCartQuantity, cart, removeItemFromCart, updateQuantity, updateDeliveryOption } from "../../data/cart.js";
import { products, getProduct } from '../../data/products.js';
import { formatCurrency } from "../utils/money.js";
import { renderPaymentSummary } from './paymentSummary.js';

export function renderOrderSummary() {

  let displayCartSummary = '';
  updateCartQuantity();

  // Looping through the cart and checking if a product is in the cart
  cart.forEach(cartItem => {
    const productId = cartItem.productId;
    const matchingProduct = getProduct(productId);
    const optionId = cartItem.deliveryOptionsId.replace(/["']/g, ''); // Remove any extra quotes
    const delivery = getDeliveryOption(optionId);
    const formatString = dateFormat(delivery);

    function dateFormat(deliveryOption) {
      const today = dayjs();
      const deliveryDate = today.add(deliveryOption.deliveryDays, 'day');
      return deliveryDate.format('dddd, MMMM DD');
    }


    //generating html base on cart properties
    displayCartSummary += `<div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
    <div class="delivery-date">
      Delivery date: ${formatString}
    </div>
  
    <div class="cart-item-details-grid">
      <img class="product-image"
        src="${matchingProduct.image}">
  
      <div class="cart-item-details">
        <div class="product-name">
          ${matchingProduct.name}
        </div>
        <div class="product-price">
          $${formatCurrency(matchingProduct.priceCents)}
        </div>
        <div class="product-quantity">
          <span>
            Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
          </span>
          <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
            Update
          </span>
          <input class="quantity-input js-quantity-input-${matchingProduct.id}">
        <span class="save-quantity-link link-primary js-save-link" data-product-id="${matchingProduct.id}"> 
            Save
        </span>
          <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
            Delete
          </span>
        </div>
      </div>
  
      <div class="delivery-options-container">
        <div class="delivery-options-title">
          Choose a delivery option:
          </div>
            ${generateDeliveryOptionHTML(matchingProduct, cartItem)}
        </div>
        </div>
      </div>
    </div>`
    //generating html for delivery options based on the current day (using dayjs library) 
    function generateDeliveryOptionHTML(matchingProduct, cartItem) {

      let html = '';
      deliveryOptions.forEach((deliveryOption) => {
        const isChecked = deliveryOption.id === cartItem.deliveryOptionsId;

        const deliveryPrice = deliveryOption.priceCents === 0 ? 'FREE' : `$${formatCurrency(deliveryOption.priceCents)} -`;
        html += `      
        <div class="delivery-option js-delivery-options" 
        data-product-id="${matchingProduct.id}" data-delivery-options-id="${deliveryOption.id}">
            <input type="radio" ${isChecked ? 'checked' : cartItem.deliveryOptionsId}
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
            <div>
            <div class="delivery-option-date">
              ${dateFormat(deliveryOption)}
              </div>
              <div class="delivery-option-price">
              ${deliveryPrice} Shipping
              </div>
            </div>
          </div>
      `
      })
      return html;
    }

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
        if (newQuantity >= 1 && newQuantity <= 10) {
          updateQuantity(productId, newQuantity);
          document.querySelector(`.js-quantity-label-${productId}`).innerHTML = `${newQuantity}`;
          updateCartQuantity();
        }
        renderPaymentSummary();
      });
    })


    document.querySelectorAll(`.js-delete-link`).forEach((link) => {
      link.addEventListener('click', () => {
        const { productId } = link.dataset;
        removeItemFromCart(productId);
        const itemToRemove = document.querySelector(`.js-cart-item-container-${productId}`);
        itemToRemove.remove();
        updateCartQuantity();
        renderPaymentSummary();
      });
    });

  });
  document.querySelectorAll(`.js-delivery-options`).forEach((element) => {
    element.addEventListener('click', () => {
      const productId = element.dataset.productId;
      const deliveryOptionsId = element.dataset.deliveryOptionsId;

      updateDeliveryOption(productId, deliveryOptionsId);
      renderOrderSummary();
      renderPaymentSummary();
    })
  })
  function updateCartQuantity() {

    document.querySelector('.js-return-to-home-link').innerHTML = `${calculateCartQuantity()} items`;
  }
  if (cart.length == 0) {
    const orderList = document.querySelector('.js-order-list');
    console.log(orderList);
    const text = document.createElement("p");
    text.classList.add('text-empty-cart');
    text.innerHTML = 'Your cart is empty.';
    const linker = document.createElement("a");
    linker.setAttribute('href', 'amazon.html');
    const productsButton = document.createElement("button");
    productsButton.classList.add('productButton');
    linker.appendChild(productsButton);
    productsButton.innerHTML = `View Products`;
    orderList.appendChild(text);
    orderList.appendChild(linker);

  }

}
