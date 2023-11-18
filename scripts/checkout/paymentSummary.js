import { cart } from '../../data/cart.js'
import { getProduct } from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import { getDeliveryOption } from '../../data/deliveryOptions.js';
export function renderPaymentSummary() {
  let priceItems = 0;
  let deliveryPrice = 0;
  cart.forEach(cartItem => {
    const product = getProduct(cartItem.productId);
    priceItems += product.priceCents * cartItem.quantity;
    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionsId);
    deliveryPrice += deliveryOption.priceCents;

  });
  const totalBeforeTax = deliveryPrice + priceItems;
  const tax = 0.1 * totalBeforeTax;
  const totalPrice = tax + totalBeforeTax;

  let htmlRenderingPayment = '';
  htmlRenderingPayment += `<div class="payment-summary-title">
      Order Summary
    </div>

    <div class="payment-summary-row">
      <div>Items (3):</div>
      <div class="payment-summary-money">$${formatCurrency(priceItems)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">$${formatCurrency(deliveryPrice)}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">$${formatCurrency(totalBeforeTax)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">$${formatCurrency(tax)}</div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">$${formatCurrency(totalPrice)}</div>
    </div>

    <button class="place-order-button button-primary">
      Place your order
    </button>`
  document.querySelector('.js-payment-summary').innerHTML = htmlRenderingPayment;
}