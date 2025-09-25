<script>
  // public/scripts/user-env.js
  (() => {
    const html = document.documentElement;

    document.documentElement.classList.remove("no-js");
    document.documentElement.classList.add("js-enabled");

    // Color gamut
    if (window.matchMedia("(color-gamut: p3)").matches) {
      html.classList.add("color-p3");
    } else {
      html.classList.add("color-srgb");
    }

    // Color scheme
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      html.classList.add("theme-dark");
    } else {
      html.classList.add("theme-light");
    }

    // Reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      html.classList.add("reduced-motion");
    }

    // Device pixel ratio
    const dpr = window.devicePixelRatio || 1;
    if (dpr >= 3) {
      html.classList.add("dpr-3plus");
    } else if (dpr >= 2) {
      html.classList.add("dpr-2");
    } else {
      html.classList.add("dpr-1");
    }

    // CSS pow() support detection
    const supportsPow = (() => {
      try {
        const testEl = document.createElement("div");
        testEl.style.width = "calc(pow(1.25, 2) * 1px)";
        // If browser accepts the value, style.width won't be empty string
        return testEl.style.width !== "";
      } catch {
        return false;
      }
    })();

    if (supportsPow) {
      html.classList.add("css-pow-supported");
    } else {
      html.classList.add("css-pow-not-supported");
    }

    const supportsRelativeColors = CSS.supports(
      "color",
      "hsl(from var(--fake) h 0 s 0 l 0)",
    );

    document.documentElement.classList.add(
      supportsRelativeColors ? "rcs-supported" : "rcs-not-supported",
    );
  })();
</script>
