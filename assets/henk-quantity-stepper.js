class HenkQuantityStepper extends HTMLElement {
  static formAssociated = true; // enables form association

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this._internals = this.attachInternals(); // FACE API
    this._value = parseInt(this.getAttribute("value")) || 1;
    this._name = this.getAttribute("name") || "quantity";
    this._min = parseInt(this.getAttribute("min")) || 1;
    this._max = this.hasAttribute("max")
      ? parseInt(this.getAttribute("max"))
      : Infinity;

    this.render();
    this.updateButtonState();
    this._internals.setFormValue(String(this._value)); // initial form value
  }

  connectedCallback() {
    this.btnMinus.addEventListener("click", () => this.change(-1));
    this.btnPlus.addEventListener("click", () => this.change(1));
  }

  render() {
    const minusIcon = `<i class="henk-icon icon--large">-</i>`;
    const plusIcon = `<i class="henk-icon icon--large">+</i>`;

    this.shadowRoot.innerHTML = `
      <style>
        .wc-stepper-quantity {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }
        .wc-stepper-quantity__button {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: inherit;
          padding: 0.25rem;
        }
        .wc-stepper-quantity__button[disabled] {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .wc-stepper-quantity__input {

-webkit-appearance: textfield !important;
    appearance: textfield !important;
    background-color: var(--color-alias-base-transparent);
    border: 0;
    cursor: default;
    font-family: var(--font-body, sans-serif);
    font-feature-settings: "pnum" on, "lnum" on;
    padding: 0;
    pointer-events: none;
    text-align: center;
    -webkit-user-select: none;
    user-select: none;
    width: 3ch;
        }
      </style>

      <div class="wc-stepper-quantity">
        <button type="button" aria-label="Decrease quantity" class="wc-stepper-quantity__button wc-stepper-quantity__button-min">
          ${minusIcon}
        </button>

        <input type="number"
               class="wc-stepper-quantity__input"
               min="${this._min}"
               max="${this._max === Infinity ? "" : this._max}"
               step="1"
               value="${this._value}"
               readonly
        />

        <button type="button" aria-label="Increase quantity" class="wc-stepper-quantity__button wc-stepper-quantity__button-plus">
          ${plusIcon}
        </button>
      </div>
    `;

    this.btnMinus = this.shadowRoot.querySelector(
      ".wc-stepper-quantity__button-min",
    );
    this.btnPlus = this.shadowRoot.querySelector(
      ".wc-stepper-quantity__button-plus",
    );
    this.input = this.shadowRoot.querySelector(".wc-stepper-quantity__input");
  }

  change(delta) {
    let newValue = this._value + delta;
    newValue = Math.max(this._min, Math.min(newValue, this._max));
    this._value = newValue;
    this.input.value = newValue;
    this.updateButtonState();

    // Update form value
    this._internals.setFormValue(String(this._value));

    // Dispatch a custom event
    this.dispatchEvent(
      new CustomEvent("quantity-change", {
        detail: { value: newValue },
        bubbles: true,
        composed: true,
      }),
    );
  }

  updateButtonState() {
    this.btnMinus.disabled = this._value <= this._min;
    this.btnPlus.disabled = this._value >= this._max;
  }

  // Expose value as property
  get value() {
    return this._value;
  }

  set value(val) {
    const num = parseInt(val);
    if (!isNaN(num)) {
      this._value = Math.max(this._min, Math.min(num, this._max));
      this.input.value = this._value;
      this.updateButtonState();
      this._internals.setFormValue(String(this._value));
    }
  }

  // Optional: support required validation
  checkValidity() {
    return this._value >= this._min && this._value <= this._max;
  }

  reportValidity() {
    if (!this.checkValidity()) {
      this.input.setCustomValidity("Invalid quantity");
      return this.input.reportValidity();
    }
    this.input.setCustomValidity("");
    return true;
  }
}

customElements.define("henk-quantity-stepper", HenkQuantityStepper);
