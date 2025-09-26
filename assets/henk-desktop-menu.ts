(() => {
  const initHeaderMenu = (): (() => void) | null => {
    const htmlElement = document.documentElement;
    const header = document.querySelector<HTMLElement>(".henk-header");
    if (!header) return null;

    const selectors = {
      mainLevel: ".main-level",
      openClass: "open",
      openingClass: "opening",
      closingClass: "closing",
      openButton: '[data-js-behavior="openSub"]',
      utils: "[data-js-utils]",
      html: htmlElement,
    };

    let escListener: ((event: KeyboardEvent) => void) | null = null;

    const utils = header.querySelector<HTMLElement>(selectors.utils);

    // Create a single close button next to utils
    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className =
      "henk-button henk-button--ghost henk-button--small close-menu";
    closeButton.setAttribute("aria-label", "Close menu");
    closeButton.innerHTML = `
      <i class="henk-icon">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M23.5 0.5L0.5 23.5M0.5 0.5L23.5 23.5"
            stroke="currentcolor"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </svg>
      </i>
      CLOSE
    `;
    closeButton.style.display = "none"; // hidden by default
    // Insert after utils
    utils?.insertAdjacentElement("afterend", closeButton);

    function toggleHeaderSubmenuState(isOpen: boolean) {
      if (!header) return;
      header.classList.toggle("henk-header--is-open", isOpen);
      closeButton.style.display = isOpen ? "flex" : "none";
    }

    function toggleUtils(hidden: boolean) {
      if (!utils) return;
      utils.style.display = hidden ? "none" : "flex";
    }

    function openSub(element: Element, event?: Event) {
      if (!element) return;
      if (event) event.preventDefault();

      // Close any open submenu immediately
      const alreadyOpen = document.querySelector(`.${selectors.openClass}`);
      if (alreadyOpen && alreadyOpen !== element) {
        // Synchronous reset of classes instead of waiting for timeout
        alreadyOpen.classList.remove(
          selectors.openClass,
          selectors.openingClass,
          selectors.closingClass,
        );
        removeEscListener();
      }

      if (!element.classList.contains(selectors.openClass)) {
        element.classList.add(selectors.openingClass);

        setTimeout(() => {
          element.classList.remove(selectors.openingClass);
          element.classList.add(selectors.openClass);
          htmlElement.style.overflow = "hidden";
          toggleUtils(true);
          toggleHeaderSubmenuState(true);
          addEscListener();
        }, 20);
      } else {
        closeSub(element);
      }
    }

    function closeSub(element: Element, removeBackdrop = true) {
      if (!element || !element.classList.contains(selectors.openClass)) return;

      element.classList.add(selectors.closingClass);

      setTimeout(() => {
        element.classList.remove(selectors.openClass);
        element.classList.remove(selectors.closingClass);

        if (removeBackdrop) {
          htmlElement.style.overflow = "";
          toggleUtils(false);
          toggleHeaderSubmenuState(false);
        }

        removeEscListener();
      }, 500);
    }

    function closeMenu() {
      const openSubMenu = document.querySelector(`.${selectors.openClass}`);
      if (openSubMenu) {
        closeSub(openSubMenu);
      }
    }

    function addEscListener() {
      escListener = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          closeMenu();
        }
      };
      selectors.html.addEventListener("keydown", escListener);
    }

    function removeEscListener() {
      if (escListener) {
        selectors.html.removeEventListener("keydown", escListener);
        escListener = null;
      }
    }

    function init() {
      if (!header) return;

      // Listen to the close button
      closeButton.addEventListener("click", () => closeMenu());

      // Optional: listen to the main-nav details
      // header.querySelectorAll<HTMLDetailsElement>("details[name='main-nav']").forEach((d) => {
      //   d.addEventListener("toggle", () => openSub(d));
      // });
    }

    init();
    // return true;
    // return cleanup function
    return () => {
      // Remove close button
      closeButton.remove();

      // Reset overflow + state classes
      htmlElement.style.overflow = "";
      header.classList.remove("henk-header--is-open");
      toggleUtils(false);

      // Reset submenu states
      header
        .querySelectorAll<HTMLElement>(selectors.mainLevel)
        .forEach((el) => {
          el.classList.remove(
            selectors.openClass,
            selectors.openingClass,
            selectors.closingClass,
          );
        });

      // remove classes from submenu opener links
      header
        .querySelectorAll<HTMLElement>('[data-js-behavior="openSub"]')
        .forEach((el) => {
          el.classList.remove(
            selectors.openClass,
            selectors.openingClass,
            selectors.closingClass,
          );
        });

      // Remove event listeners
      removeEscListener();
      header
        .querySelectorAll<HTMLElement>(selectors.openButton)
        .forEach((button) => {
          button.replaceWith(button.cloneNode(true)); // quick way to remove listeners
        });
    };
  };
  document.addEventListener("DOMContentLoaded", () => {
    const mql = window.matchMedia("(min-width: 768px)");
    let cleanup: (() => void) | null = null;

    const handleChange = (e: MediaQueryList | MediaQueryListEvent) => {
      if (e.matches) {
        if (!cleanup) {
          const maybeCleanup = initHeaderMenu();
          if (typeof maybeCleanup === "function") cleanup = maybeCleanup;
        }
      } else {
        if (cleanup) {
          cleanup();
          cleanup = null;
        }
      }
    };

    handleChange(mql);
    mql.addEventListener("change", handleChange);
  });
})();
