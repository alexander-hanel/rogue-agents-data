(function () {
  var storageKey = "metrPreferredLang";
  var dismissedKey = "metrLangBannerDismissed";
  var supportedLangs = ["en", "es", "zh-Hans"];
  var bannerTargetLangs = ["es", "zh-Hans"];
  var localizedUrls = window.METR_LOCALIZED_URLS || {};
  var bannerNotes = window.METR_TRANSLATION_BANNER_NOTES || {};
  var bannerCopy = window.METR_LANG_COPY || {};
  var currentLang =
    document.documentElement.getAttribute("lang") ||
    window.METR_CURRENT_LANG ||
    "en";

  function isSupportedLang(lang) {
    return supportedLangs.indexOf(lang) !== -1;
  }

  function getStoredLang() {
    try {
      var lang = window.localStorage.getItem(storageKey);
      return isSupportedLang(lang) ? lang : null;
    } catch (error) {
      return null;
    }
  }

  function setStoredLang(lang) {
    if (!isSupportedLang(lang)) return;

    try {
      window.localStorage.setItem(storageKey, lang);
    } catch (error) {
      // Storage can be disabled. The site should still work normally.
    }
  }

  function getBannerDismissed() {
    try {
      return window.localStorage.getItem(dismissedKey) === "1";
    } catch (error) {
      return false;
    }
  }

  function setBannerDismissed() {
    try {
      window.localStorage.setItem(dismissedKey, "1");
    } catch (error) {
      // Storage can be disabled. The site should still work normally.
    }
  }

  function normalizePath(path) {
    if (!path) return "/";

    var normalized = path.charAt(0) === "/" ? path : "/" + path;
    if (normalized.length > 1 && normalized.charAt(normalized.length - 1) === "/") {
      normalized = normalized.slice(0, -1);
    }
    return normalized;
  }

  function splitSuffix(url) {
    var suffixStart = url.search(/[?#]/);
    if (suffixStart === -1) {
      return { path: url, suffix: "" };
    }

    return {
      path: url.slice(0, suffixStart),
      suffix: url.slice(suffixStart)
    };
  }

  function localizeUrl(url, lang) {
    if (!url || !isSupportedLang(lang) || lang === "en") return url;
    if (url.indexOf("/") !== 0 || url.indexOf("//") === 0) return url;
    if (/^\/(assets|api|netlify)\//.test(url)) return url;

    var parts = splitSuffix(url);
    var translations = localizedUrls[normalizePath(parts.path)];
    if (!translations || !translations[lang]) return url;

    return translations[lang] + parts.suffix;
  }

  // Maps a BCP-47 language tag (case-insensitive) to one of our supported
  // buckets ("en", "es", "zh-Hans") or null.
  // zh-TW / zh-HK / zh-MO / zh-Hant* are Traditional Chinese — different
  // script, different audience — and explicitly do NOT map to zh-Hans.
  function normalizeBcpTag(tag) {
    if (!tag) return null;
    var lower = String(tag).toLowerCase();

    if (lower === "zh-tw" || lower === "zh-hk" || lower === "zh-mo" ||
        lower === "zh-hant" || lower.indexOf("zh-hant-") === 0) {
      return null;
    }

    if (lower === "zh" ||
        lower === "zh-cn" || lower.indexOf("zh-cn-") === 0 ||
        lower === "zh-sg" || lower.indexOf("zh-sg-") === 0 ||
        lower === "zh-hans" || lower.indexOf("zh-hans-") === 0) {
      return "zh-Hans";
    }

    if (lower === "es" || lower.indexOf("es-") === 0) {
      return "es";
    }

    if (lower === "en" || lower.indexOf("en-") === 0) {
      return "en";
    }

    return null;
  }

  // Walk `navigator.languages` in order. Skip unsupported tags. The first
  // mapped tag wins: if it's English, bail (no banner). If it's a target
  // lang, return it. Otherwise null.
  //   ["en-US", "zh-CN"]          -> null  (English preferred over Chinese)
  //   ["zh-CN", "en-US"]          -> "zh-Hans"
  //   ["fr-FR", "zh-CN"]          -> "zh-Hans"  (French unsupported, skip)
  //   ["fr-FR", "en-US", "zh-CN"] -> null  (English beats Chinese)
  //   ["zh-TW"]                   -> null  (Traditional Chinese excluded)
  function resolveTargetLang(navigatorLanguages, targets) {
    if (!navigatorLanguages || !navigatorLanguages.length) return null;
    var targetList = targets || bannerTargetLangs;
    for (var i = 0; i < navigatorLanguages.length; i++) {
      var norm = normalizeBcpTag(navigatorLanguages[i]);
      if (!norm) continue;
      if (norm === "en") return null;
      if (targetList.indexOf(norm) !== -1) return norm;
    }
    return null;
  }

  // Pure decision: "should the suggest banner be shown right now?"
  // All inputs passed in so tests don't need DOM/localStorage.
  // Suppress only when the user has explicitly chosen English. A stored
  // non-English preference means "I want this language" — keep offering the
  // banner on English pages as the one-click path back.
  function shouldShowBanner(state) {
    if (!state) return false;
    if (!state.targetLang) return false;
    if (state.storedLang === "en") return false;
    if (state.dismissed) return false;
    if (state.currentLang && state.currentLang !== "en") return false;
    var urls = state.localizedUrls || {};
    var translations = urls[normalizePath(state.currentPath)];
    if (!translations || !translations[state.targetLang]) return false;
    return true;
  }

  function translationUrlFor(targetLang, currentPath) {
    var translations = localizedUrls[normalizePath(currentPath)];
    if (!translations || !translations[targetLang]) return null;
    return translations[targetLang];
  }

  // An optional qualifier on the offer, e.g. that only part of the page is
  // translated. Not `translation_notice_text`: that is voiced for the
  // translated page itself and belongs there, not on the English original.
  function bannerNoteFor(targetLang, currentPath) {
    var notes = bannerNotes[normalizePath(currentPath)];
    return (notes && notes[targetLang]) || null;
  }

  function renderSuggestBanner(targetLang, translatedUrl, bannerNote) {
    var banner = document.querySelector("[data-lang-suggest]");
    if (!banner) return false;
    var copy = bannerCopy[targetLang];
    if (!copy) return false;

    var textEl = banner.querySelector("[data-lang-suggest-text]");
    var actionEl = banner.querySelector("[data-lang-suggest-action]");
    var dismissEl = banner.querySelector("[data-lang-suggest-dismiss]");
    if (!textEl || !actionEl || !dismissEl) return false;

    var separator = typeof copy.separator === "string" ? copy.separator : " ";
    textEl.textContent = bannerNote ? (copy.offer + separator + bannerNote) : (copy.offer || "");
    actionEl.textContent = copy.action || "";
    actionEl.setAttribute("href", translatedUrl);
    actionEl.setAttribute("hreflang", targetLang);
    actionEl.setAttribute("lang", targetLang);
    textEl.setAttribute("lang", targetLang);
    dismissEl.setAttribute("aria-label", copy.dismiss || "Dismiss");
    banner.setAttribute("data-lang-suggest-active", targetLang);
    banner.removeAttribute("hidden");

    actionEl.addEventListener("click", function () {
      setStoredLang(targetLang);
    });
    dismissEl.addEventListener("click", function (event) {
      event.preventDefault();
      setBannerDismissed();
      banner.setAttribute("hidden", "");
      banner.removeAttribute("data-lang-suggest-active");
    });

    return true;
  }

  function maybeShowSuggestBanner() {
    var navLangs = navigator.languages && navigator.languages.length
      ? navigator.languages
      : (navigator.language ? [navigator.language] : []);
    var storedLang = getStoredLang();
    // A stored non-English preference wins over navigator detection: an
    // explicit user choice is stronger evidence than browser settings.
    var targetLang = (storedLang && storedLang !== "en" && bannerTargetLangs.indexOf(storedLang) !== -1)
      ? storedLang
      : resolveTargetLang(navLangs, bannerTargetLangs);
    var currentPath = window.location.pathname;
    var state = {
      targetLang: targetLang,
      currentPath: currentPath,
      currentLang: currentLang,
      localizedUrls: localizedUrls,
      storedLang: storedLang,
      dismissed: getBannerDismissed()
    };
    if (!shouldShowBanner(state)) return false;
    var url = translationUrlFor(targetLang, currentPath);
    if (!url) return false;
    var bannerNote = bannerNoteFor(targetLang, currentPath);
    return renderSuggestBanner(targetLang, url, bannerNote);
  }

  function updateNavigation(lang) {
    if (!isSupportedLang(lang) || lang === "en") return;

    var selectors = [
      ".menu-main a[href]",
      ".menu-main-mobile a[href]",
      ".footer a[href]",
      ".logos a[href]"
    ];

    document.querySelectorAll(selectors.join(",")).forEach(function (link) {
      if (link.hasAttribute("hreflang") || link.hasAttribute("data-no-localize")) {
        return;
      }

      var href = link.getAttribute("href");
      var localizedHref = localizeUrl(href, lang);
      if (localizedHref !== href) {
        link.setAttribute("href", localizedHref);
      }
    });

    document.querySelectorAll('input[name="lang"]').forEach(function (input) {
      input.value = lang;
    });
  }

  document.addEventListener("click", function (event) {
    var link = event.target.closest("a[hreflang]");
    if (!link) return;

    setStoredLang(link.getAttribute("hreflang"));
  });

  // Don't auto-store the current page's language. Auto-storing locked in a
  // preference on first visit (e.g., landing on /zh-Hans/ from a search
  // result), which then suppressed the suggest banner forever afterward.
  // Preferences are set only by explicit signals: the a[hreflang] click
  // listener above, or accepting the suggest banner.
  updateNavigation(getStoredLang() || (currentLang !== "en" ? currentLang : null));
  maybeShowSuggestBanner();

  // Expose pure logic for tests + Playwright introspection. Side effects
  // above already ran; this object holds inputs and pure functions that are
  // safe to call from a test harness.
  window.METR_LANG = {
    storageKey: storageKey,
    dismissedKey: dismissedKey,
    supportedLangs: supportedLangs,
    bannerTargetLangs: bannerTargetLangs,
    normalizeBcpTag: normalizeBcpTag,
    resolveTargetLang: resolveTargetLang,
    shouldShowBanner: shouldShowBanner,
    normalizePath: normalizePath,
    localizeUrl: localizeUrl,
    translationUrlFor: translationUrlFor,
    bannerNoteFor: bannerNoteFor,
    maybeShowSuggestBanner: maybeShowSuggestBanner
  };
})();
