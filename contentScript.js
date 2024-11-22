let preservedRemainder = ""; // Preserve remainder across loops

// Function to process QA content
function processQAContent(observer) {
  console.log("PQAC Loop Enter");

  const qaElement = document.querySelector("#qa");

  if (!qaElement) {
    console.warn("QA element not found!");
    return;
  }

  // Check if the content contains an <hr> element and skip processing
  if (qaElement.querySelector("hr")) {
    console.log("Answer card detected (contains <hr>). Skipping processing.");
    return;
  }

  const rubyElements = qaElement.querySelectorAll("ruby");
  let kanjiFuriganaPairs = [];
  let processedContent = "";
  let kanjiOnlyForHref = "";

  if (rubyElements.length > 0) {
    rubyElements.forEach((ruby) => {
      const kanji = ruby.querySelector("rb")?.innerText || ""; // Extract kanji (base text)
      const furigana = ruby.querySelector("rt")?.innerText || ""; // Extract furigana (ruby text)
      kanjiFuriganaPairs.push({ kanji, furigana });

      // Reconstruct <ruby> tag with kanji and furigana
      const rubyHTML = `<ruby><rb>${kanji}</rb><rt>${furigana}</rt></ruby>`;
      processedContent += rubyHTML;

      // Append only kanji for the href
      kanjiOnlyForHref += kanji;
    });

    // Add any plain text outside <ruby> tags
    let currentRemainder = Array.from(qaElement.childNodes)
      .filter((node) => node.nodeType === Node.TEXT_NODE)
      .map((node) => node.nodeValue.trim())
      .join("");
    preservedRemainder = preservedRemainder || currentRemainder; // Preserve original remainder
    processedContent += preservedRemainder;
  } else {
    // If no <ruby> tags, process as plain text (just kanji/kana)
    processedContent = qaElement.innerText.trim(); // Use textContent to strip any HTML tags
    kanjiOnlyForHref = processedContent;
  }

  console.log("Kanji-Furigana Pairs:", kanjiFuriganaPairs);
  console.log("Processed Content:", processedContent);
  console.log("Kanji Only for HREF:", kanjiOnlyForHref);

  // Disconnect the observer to prevent infinite loop
  if (observer) observer.disconnect();

  // Generate new HTML with links and copy buttons, including the <ruby> content and remainder
  const newHTML = `
    <span class="svelte-192a69y" style="display: inline-flex; align-items: center; gap: 6px; margin-right: 8px; font-family: arial; font-size: 24px; color: black;">
        <style>.card {font-family: arial;font-size: 24px;text-align: center;color: black;background-color: white;}</style>
        <a href="javascript:void(0);" style="text-decoration: none; color: blue;" id="jpdb-link">${processedContent}</a>
        <button 
            style="display: inline-flex; align-items: center;  text-align: center;  justify-content: center; width: 36px; height: 36px; background-color: #f0f0f0; border: 1px solid #ccc; border-radius: 50%; cursor: pointer; transition: background-color 0.3s;"
            onclick="navigator.clipboard.writeText('${processedContent.replace(/'/g, "\\'")}').then(() => { 
              const btn = this; 
              const originalHTML = btn.innerHTML; 
              btn.innerHTML = '<span style=&quot;font-size: 18px;&quot;>✔️</span>'; 
              setTimeout(() => { btn.innerHTML = originalHTML; }, 1000); 
            });">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-sm">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M7 5C7 3.34315 8.34315 2 10 2H19C20.6569 2 22 3.34315 22 5V14C22 15.6569 20.6569 17 19 17H17V19C17 20.6569 15.6569 22 14 22H5C3.34315 22 2 20.6569 2 19V10C2 8.34315 3.34315 7 5 7H7V5ZM9 7H14C15.6569 7 17 8.34315 17 10V15H19C19.5523 15 20 14.5523 20 14V5C20 4.44772 19.5523 4 19 4H10C9.44772 4 9 4.44772 9 5V7ZM5 9C4.44772 9 4 9.44772 4 10V19C4 19.5523 4 20 5 20H14C14.5523 20 15 19.5523 15 19V10C15 9.44772 14.5523 9 14 9H5Z" fill="currentColor"></path>
            </svg>
          </button>
      </span>`;

  qaElement.innerHTML = newHTML;

  // Add event listener to the link to open/reload jpdb
  const jpdbLink = document.getElementById("jpdb-link");
  if (jpdbLink) {
    jpdbLink.addEventListener("click", () => {
      openJpdb(kanjiOnlyForHref);
    });
  }

  console.log("QA content replaced successfully.");

  // Reconnect the observer after updating the DOM
  if (observer) {
    observer.observe(document.querySelector("#qa_box"), {
      childList: true,
      subtree: true,
      attributes: true,
    });
  }
}

// Function to handle opening jpdb with the current content
function openJpdb(content) {
  const jpdbUrl = `https://jpdb.io/search?q=${encodeURIComponent(content)}`;

  chrome.runtime.sendMessage({ action: "openOrReloadJpdb", url: jpdbUrl }, (response) => {
    if (response && response.success) {
      console.log("jpdb tab updated or created successfully.");
    } else {
      console.error("Failed to update or create jpdb tab. Opening in a new tab...");
      // Open in a new tab as fallback
      window.open(jpdbUrl, "_blank");
    }
  });
}

// Add a global event listener for the space bar key
window.addEventListener("keydown", (event) => {
  // Check if the space bar is pressed
  if (event.code === "Space") {
    event.preventDefault(); // Prevent the default scroll behavior of the space bar

    // Get the current kanji-only content from the link or QA element
    const qaElement = document.querySelector("#qa");
    const kanjiOnlyForHref = qaElement?.querySelector("a#jpdb-link")?.textContent || "";

    // Open jpdb with the current content
    if (kanjiOnlyForHref) {
      console.log(`Opening jpdb with content: ${kanjiOnlyForHref}`);
      openJpdb(kanjiOnlyForHref);
    } else {
      console.warn("No content found for jpdb link.");
    }

    // Find the "Show Answer" button and simulate a click to flip the card
    const showAnswerButton = document.querySelector("button.btn-primary.btn-lg");
    if (showAnswerButton) {
      showAnswerButton.click();
      console.log('"Show Answer" button clicked via space bar.');
    } else {
      console.warn('"Show Answer" button not found.');
    }
  }
});

// Observe card flips in the card display area
function observeCardFlips(cardArea) {
  let debounceTimeout;

  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList" || mutation.type === "attributes") {
        if (debounceTimeout) clearTimeout(debounceTimeout);

        debounceTimeout = setTimeout(() => {
          console.log("Card content updated. Reprocessing QA content...");
          processQAContent(observer);
        }, 100); // Debounce delay
      }
    }
  });

  observer.observe(cardArea, { childList: true, subtree: true, attributes: true });
  console.log("Started observing card area for updates...");
}

// Initialize the observer on page load
window.addEventListener("load", () => {
  console.log("Page loaded, waiting for card area...");
  const interval = setInterval(() => {
    const cardArea = document.querySelector("#qa_box");
    if (cardArea) {
      console.log("Card area found:", cardArea);
      clearInterval(interval);
      observeCardFlips(cardArea);
      processQAContent(null); // Process the initial card content
    } else {
      console.log("Waiting for #qa_box...");
    }
  }, 500); // Check every 500ms
});
