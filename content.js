chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getTranscript") {
      console.log("getTranscript action received.");
  
      // Function to simulate a real user click
      const clickButtonAsUser = (selector) => {
        const button = document.querySelector(selector);
        if (!button) {
          console.warn(`Button with selector "${selector}" not found.`);
          return false;
        }
  
        // Scroll the button into view
        button.scrollIntoView({ behavior: "smooth", block: "center" });
  
        // Simulate a real user click
        const event = new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
          composed: true,
        });
        button.dispatchEvent(event);
  
        console.log(`Button with selector "${selector}" clicked.`);
        return true;
      };
  
      // Function to extract the transcript text
      const extractTranscript = () => {
        const segments = document.querySelectorAll(
          "ytd-transcript-segment-renderer .segment-text"
        );
        if (segments.length > 0) {
          const transcriptTexts = Array.from(segments).map((segment) => segment.innerText);
          console.log("Extracted Transcript:", transcriptTexts);
          return transcriptTexts.join(" ");
        } else {
          console.warn("No transcript segments found.");
          return null;
        }
      };
  
      // Function to wait for a button to appear and click it
      const waitForButtonAndClick = (selector, callback) => {
        const button = document.querySelector(selector);
        if (button) {
          console.log(`Button found: ${selector}`);
          callback();
        } else {
          console.log(`Waiting for button: ${selector}`);
          const observer = new MutationObserver(() => {
            const button = document.querySelector(selector);
            if (button) {
              console.log(`Button appeared: ${selector}`);
              observer.disconnect(); // Stop observing
              callback();
            }
          });
  
          // Start observing the DOM
          observer.observe(document.body, { childList: true, subtree: true });
        }
      };
  
      // Steps to click the buttons and extract the transcript
      const getTranscriptFlow = () => {
        // Step 1: Click the "...more" button
        waitForButtonAndClick("tp-yt-paper-button#expand", () => {
          if (clickButtonAsUser("tp-yt-paper-button#expand")) {
            console.log("Clicked the '...more' button.");
  
            // Step 2: Click the "Show transcript" button after delay
            setTimeout(() => {
              waitForButtonAndClick('button[aria-label="Show transcript"]', () => {
                if (clickButtonAsUser('button[aria-label="Show transcript"]')) {
                  console.log("Clicked the 'Show transcript' button.");
  
                  // Step 3: Extract the transcript after delay
                  setTimeout(() => {
                    const transcript = extractTranscript();
                    if (transcript) {
                      sendResponse({ transcript });
                    } else {
                      sendResponse({ error: "Transcript not found even after all steps." });
                    }
                  }, 2000); // Wait for transcript to load
                } else {
                  sendResponse({ error: "Failed to click 'Show transcript' button." });
                }
              });
            }, 1000); // Wait for UI update after "...more" button
          } else {
            sendResponse({ error: "Failed to click '...more' button." });
          }
        });
      };
  
      // Start the transcript extraction process
      getTranscriptFlow();
  
      // Return true to indicate the response will be sent asynchronously
      return true;
    }
  });
  