class HenkQuantityStepper extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="wc-stepper-quantity">
        <button type="button" class="wc-stepper-quantity__button wc-stepper-quantity__button-min" aria-label="Decrease quantity">−</button>
        <input type="number" min="1" step="1" value="1" aria-label="Quantity" />
        <button type="button" class="wc-stepper-quantity__button wc-stepper-quantity__button-plus" aria-label="Increase quantity">+</button>
      </div>
    `;
  }
}

customElements.define("henk-quantity-stepper", HenkQuantityStepper);
