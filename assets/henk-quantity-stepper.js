class HenkQuantityStepper extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._value = parseInt(this.getAttribute("value")) || 1;
    this._name = this.getAttribute("name") || "quantity";
  }

  connectedCallback() {
    this.render();
    this.updateButtonState();
    this.ensureHiddenInput();
  }

  render() {
    const minusIcon = `<i class="henk-icon icon--large">−</i>`;
    const plusIcon = `<i class="henk-icon icon--large">+</i>`;

    this.shadowRoot.innerHTML = `
      <style>
        .wc-stepper-quantity { display: inline-flex; align-items: center; gap: 0.25rem; }
        .wc-stepper-quantity__button { background: none; border: none; cursor: pointer; padding: 0.25rem; }
        .wc-stepper-quantity__button[disabled] { opacity: 0.4; cursor: not-allowed; }
        .wc-stepper-quantity__input { width: 3rem; text-align: center; font: inherit; border: 1px solid #ccc; border-radius: 4px; }
      </style>
      <div class="wc-stepper-quantity">
        <button type="button" class="wc-stepper-quantity__button wc-stepper-quantity__button-min" aria-label="Decrease quantity">${minusIcon}</button>
        <input type="number" class="wc-stepper-quantity__input" value="${this._value}" readonly min="1" step="1" aria-label="Item quantity">
        <button type="button" class="wc-stepper-quantity__button wc-stepper-quantity__button-plus" aria-label="Increase quantity">${plusIcon}</button>
      </div>
    `;

    this.btnMinus = this.shadowRoot.querySelector(
      ".wc-stepper-quantity__button-min",
    );
    this.btnPlus = this.shadowRoot.querySelector(
      ".wc-stepper-quantity__button-plus",
    );
    this.input = this.shadowRoot.querySelector(".wc-stepper-quantity__input");

    this.btnMinus.addEventListener("click", () => this.change(-1));
    this.btnPlus.addEventListener("click", () => this.change(1));
  }

  ensureHiddenInput() {
    // Light DOM input for form submission
    if (!this._hiddenInput) {
      this._hiddenInput = document.createElement("input");
      this._hiddenInput.type = "hidden";
      this._hiddenInput.name = this._name;
      this._hiddenInput.value = this._value;
      this.appendChild(this._hiddenInput);
    }
  }

  change(delta) {
    this._value = Math.max(1, this._value + delta);
    this.input.value = this._value;
    this._hiddenInput.value = this._value; // update hidden input
    this.updateButtonState();

    this.dispatchEvent(
      new CustomEvent("quantity-change", {
        detail: { value: this._value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  updateButtonState() {
    this.btnMinus.disabled = this._value <= 1;
  }
}

customElements.define("henk-quantity-stepper", HenkQuantityStepper);
