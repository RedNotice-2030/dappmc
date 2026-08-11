/**
 * -------------------------------------------------------------
 * Zero dependencies. Zero API costs. Zero backend required.
 * Drop this file on your site and add ONE line of HTML:
 *
 * <script src="assets/js/chatbot-widget.js"></script>
 *
 * That's it — a chat bubble appears in the bottom-right corner.
 * -------------------------------------------------------------
 */

(function () {
  "use strict";

  // =========================================================
  // 1. CONFIG — customize freely
  // =========================================================
  const CONFIG = {
    botName: "DAPPMC Chatbot",
    logoSrc: "assets/images/dappmc-logo.png", 
    bubbleIconSrc: "assets/images/chatbot3.png", 
    bgPatternSrc: "assets/images/dappmc-logo-raw.png", 
    bgPatternTileSize: "48px", 
    bgPatternOpacity: 0.05,    // Reduced opacity for better readability
    greeting: "Hi! 👋 I'm the DAPPMC Chatbot. I can help with questions about our services such as OPD, Laboratory, Radiology, Ambulatory, Heart Station, and HMO/insurance partners.",
    quickReplies: [
      { label: "OPD Services", query: "OPD" },
      { label: "Laboratory", query: "Lab results" },
      { label: "Radiology / CT", query: "CT scan" },
      { label: "HMO & Insurance", query: "HMO insurance" },
      { label: "Emergency & Hours", query: "Emergency hours" }
    ],
    fallback:
      "I can only help with questions about Dr. Arturo P. Pingoy Medical Center's services. For anything else, or for billing, insurance, HMO, or account concerns, please use the Email us button above to reach a member of our team directly.",
    handoffText: "Email us",
    handoffMode: "modal",
    handoffModalTarget: "#contact-us-modal", 
    handoffModalWhatever: "user@example.com", 
    handoffHref: "mailto:hello@example.com", 
    accent: "#002c6d",        // primary color
    accentDark: "#001c47",    // added dark accent for hover states
    bg: "#FFFFFF",
    text: "#1A1A1A",
    position: "right"         // "right" or "left"
  };

  // =========================================================
  // 2. KNOWLEDGE BASE
  // =========================================================
  const KNOWLEDGE_BASE = [
    {
      keywords: ["emergency", "er", "urgent", "24/7", "24 hour", "24-hour", "call", "helpline", "address", "location", "directions"],
      answer: "We provide 24/7 emergency care. For emergencies, call 911. You can also reach our helpline at (083) 228-2202. We're located at Gensan Drive, Koronadal, South Cotabato 9506."
    },
    {
      keywords: ["lab result", "test result", "results", "results ready", "when will i get", "how long", "turnaround", "lab"],
      answer: "Most lab results are ready within 12–24 hours after your examination. For your specific results, please call our helpline at (083) 228-2202 or visit the laboratory department directly."
    },
    {
      keywords: ["heart", "cardiovascular", "cardiac", "cardiology"],
      answer: "We have specialized cardiovascular services for heart-related care and monitoring."
    },
    {
      keywords: ["lung", "pulmonary", "respiratory", "breathing"],
      answer: "We offer specialized pulmonary services for lung and respiratory care."
    },
    {
      keywords: ["rehab", "rehabilitation", "physical medicine", "therapy", "pt"],
      answer: "Our physical medicine and rehabilitation services support recovery and mobility after injury or illness."
    },
    {
      keywords: ["room", "accommodation", "stay", "admission", "ward"],
      answer: "We provide comfortable patient accommodations for those admitted to our care."
    },
    {
      keywords: ["ct", "ct scan", "imaging", "scan", "radiology"],
      answer: "We're equipped with a modern 128-slice CT scan for fast, detailed imaging, along with other up-to-date medical equipment."
    },
    {
      keywords: ["hmo", "insurance", "coverage", "provider"],
      answer: "We work with various HMO and insurance providers. For questions about your specific coverage or account, please click 'Email us' in the header so our team can assist you directly."
    },
    {
      keywords: ["billing", "bill", "payment", "charge", "invoice", "account"],
      answer: "For billing or account concerns, please click 'Email us' in the header so a member of our team can help you directly."
    },
    {
      keywords: ["hours", "open", "close", "time"],
      answer: "We're open Monday–Friday, 9am–6pm for general services. Our emergency care is available 24/7."
    },
    {
      keywords: ["contact", "email", "phone", "reach", "support"],
      answer: "You can reach our team using the Email us button in the header above, and we'll get back to you soon."
    },
    {
      keywords: ["hello", "hi", "hey", "opd"],
      answer: "Hello! Our Outpatient Department (OPD) is open Monday–Friday, 9am–6pm. Let us know if you need specific clinic details!"
    },
    {
      keywords: ["thanks", "thank you"],
      answer: "You're welcome! Let me know if you need anything else."
    }
  ];

  // =========================================================
  // 3. MATCHING LOGIC
  // =========================================================
  function findAnswer(message) {
    const lower = message.toLowerCase();
    let best = null;
    let bestScore = 0;

    KNOWLEDGE_BASE.forEach((entry) => {
      let score = 0;
      entry.keywords.forEach((kw) => {
        if (lower.includes(kw.toLowerCase())) {
          score += kw.trim().split(/\s+/).length;
        }
      });
      if (score > bestScore) {
        bestScore = score;
        best = entry;
      }
    });

    return best ? best.answer : CONFIG.fallback;
  }

  // =========================================================
  // 4. STYLES
  // =========================================================
  const side = CONFIG.position === "left" ? "left" : "right";
  const css = `
  .cbw-bubble {
    position: fixed; bottom: 24px; ${side}: 24px; z-index: 999999;
    width: 80px; height: 80px; border-radius: 50%;
    background: transparent; border: none;
    filter: drop-shadow(0 6px 14px rgba(0,0,0,0.25));
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: transform 0.15s ease, opacity 0.15s ease;
    padding: 0;
  }
  .cbw-bubble.cbw-hidden { display: none !important; }
  .cbw-bubble:hover { transform: scale(1.06); }
  .cbw-bubble img { width: 100%; height: 100%; object-fit: contain; }
  
  .cbw-window {
    position: fixed; bottom: 24px; ${side}: 24px; z-index: 999999;
    width: 350px; max-width: calc(100vw - 32px);
    height: 480px; max-height: calc(100vh - 40px);
    background: ${CONFIG.bg}; border-radius: 16px;
    box-shadow: 0 12px 40px rgba(0,0,0,0.25);
    display: none; flex-direction: column; overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }
  .cbw-window.cbw-open { display: flex; }
  
  .cbw-header {
    background: ${CONFIG.accent}; color: #fff; padding: 12px 16px;
    display: flex; align-items: center; justify-content: space-between;
    font-weight: 600; font-size: 15px;
  }
  .cbw-header-left { display: flex; align-items: center; gap: 10px; }
  .cbw-header-logo { height: 26px; width: 26px; object-fit: contain; }
  .cbw-header-actions { display: flex; align-items: center; gap: 12px; }
  .cbw-handoff-btn {
    background: rgba(255,255,255,0.15); border: none; color: #fff;
    padding: 4px 10px; border-radius: 12px; font-size: 12px;
    cursor: pointer; transition: background 0.2s ease;
  }
  .cbw-handoff-btn:hover { background: rgba(255,255,255,0.3); }
  .cbw-close {
    background: none; border: none; color: #fff; font-size: 18px;
    cursor: pointer; opacity: 0.85; line-height: 1; padding: 0;
  }
  .cbw-close:hover { opacity: 1; }
  
  .cbw-messages {
    flex: 1; overflow-y: auto; padding: 14px; background: #F7F7F5;
    position: relative;
  }
  .cbw-messages::before {
    content: ""; position: absolute; inset: 0; z-index: 0;
    background-image: url(${CONFIG.bgPatternSrc});
    background-repeat: repeat;
    background-size: ${CONFIG.bgPatternTileSize} ${CONFIG.bgPatternTileSize};
    opacity: ${CONFIG.bgPatternOpacity};
    pointer-events: none;
  }
  
  .cbw-msg { margin-bottom: 10px; display: flex; position: relative; z-index: 1; }
  .cbw-msg.bot { justify-content: flex-start; }
  .cbw-msg.user { justify-content: flex-end; }
  .cbw-bubble-text {
    max-width: 82%; padding: 10px 14px; border-radius: 14px;
    font-size: 13.5px; line-height: 1.45; color: ${CONFIG.text};
  }
  .cbw-msg.bot .cbw-bubble-text { background: #fff; border: 1px solid #E5E5E0; border-bottom-left-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
  .cbw-msg.user .cbw-bubble-text { background: ${CONFIG.accent}; color: #fff; border-bottom-right-radius: 4px; }
  
  .cbw-chips { 
    display: flex; 
    flex-wrap: wrap; 
    gap: 6px; 
    margin-top: 10px; 
    margin-bottom: 12px; /* Adds the spacing before the user message */
    z-index: 1; 
    position: relative; 
  }
  .cbw-chip {
    background: #fff; 
    border: 1px solid ${CONFIG.accent}; 
    color: ${CONFIG.accent};
    border-radius: 16px; 
    padding: 6px 12px; 
    font-size: 12px; 
    cursor: pointer;
    transition: all 0.2s ease; 
    font-weight: 500;
  }
  .cbw-chip:hover { 
    background: ${CONFIG.accent}; 
    color: #fff; 
  }
  
  .cbw-inputrow {
    display: flex; border-top: 1px solid #eee; padding: 10px; gap: 8px; background: #fff;
  }
  .cbw-inputrow input {
    flex: 1; border: 1px solid #ddd; border-radius: 20px;
    padding: 8px 14px; font-size: 13.5px; outline: none;
  }
  .cbw-inputrow input:focus { border-color: ${CONFIG.accent}; }
  .cbw-inputrow button {
    background: ${CONFIG.accent}; color: #fff; border: none;
    border-radius: 20px; padding: 0 16px; font-size: 13.5px;
    cursor: pointer; font-weight: 600; transition: background 0.2s;
  }
  .cbw-inputrow button:hover { background: ${CONFIG.accentDark}; }
  
  @media (max-width: 420px) {
    .cbw-window { width: calc(100vw - 24px); ${side}: 12px; bottom: 12px; height: 80vh; }
    .cbw-bubble { ${side}: 12px; bottom: 12px; }
  }
  `;

  const styleTag = document.createElement("style");
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  // =========================================================
  // 5. MARKUP
  // =========================================================
  const bubble = document.createElement("button");
  bubble.className = "cbw-bubble";
  bubble.setAttribute("aria-label", "Open chat");
  bubble.innerHTML = `<img src="${CONFIG.bubbleIconSrc}" alt="" />`;

  const win = document.createElement("div");
  win.className = "cbw-window";
  win.innerHTML = `
    <div class="cbw-header">
      <div class="cbw-header-left">
        <img class="cbw-header-logo" src="${CONFIG.logoSrc}" alt="" />
        <span>${CONFIG.botName}</span>
      </div>
      <div class="cbw-header-actions">
        <button class="cbw-handoff-btn" type="button">${CONFIG.handoffText}</button>
        <button class="cbw-close" aria-label="Close chat">✕</button>
      </div>
    </div>
    <div class="cbw-messages"></div>
    <div class="cbw-inputrow">
      <input type="text" placeholder="Type a message..." aria-label="Message" />
      <button class="cbw-send">Send</button>
    </div>
  `;

  document.body.appendChild(win);
  document.body.appendChild(bubble);

  const messagesEl = win.querySelector(".cbw-messages");
  const inputEl = win.querySelector("input");
  const sendBtn = win.querySelector(".cbw-send");
  const closeBtn = win.querySelector(".cbw-close");
  const handoffBtn = win.querySelector(".cbw-handoff-btn");

  handoffBtn.addEventListener("click", () => {
    if (CONFIG.handoffMode === "modal") {
      const trigger = document.createElement("a");
      trigger.href = CONFIG.handoffModalTarget;
      trigger.setAttribute("data-bs-toggle", "modal");
      trigger.setAttribute("data-bs-target", CONFIG.handoffModalTarget);
      if (CONFIG.handoffModalWhatever) {
        trigger.setAttribute("data-bs-whatever", CONFIG.handoffModalWhatever);
      }
      trigger.style.display = "none";
      document.body.appendChild(trigger);
      trigger.click();
      setTimeout(() => trigger.remove(), 500);

      if (typeof window.bootstrap === "undefined") {
        console.warn(
          "[chatbot-widget] Bootstrap's JS doesn't seem to be loaded yet."
        );
      }
    } else {
      window.location.href = CONFIG.handoffHref;
    }
  });

  function addMessage(text, who) {
    const row = document.createElement("div");
    row.className = "cbw-msg " + who;
    const bub = document.createElement("div");
    bub.className = "cbw-bubble-text";
    bub.textContent = text;
    row.appendChild(bub);
    messagesEl.appendChild(row);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  // Function to render quick reply chips dynamically
  function renderQuickReplies(replies) {
    if (!replies || replies.length === 0) return;
    
    const container = document.createElement("div");
    container.className = "cbw-chips";

    replies.forEach((reply) => {
      const chip = document.createElement("button");
      chip.className = "cbw-chip";
      chip.textContent = reply.label;
      
      chip.addEventListener("click", () => {
        // 1. Instantly remove the chips so they don't linger in chat history
        container.remove();
        
        // 2. Add the user's selected reply as a message
        addMessage(reply.label, "user");
        
        // 3. Trigger the bot answer & suggest follow-up chips
        setTimeout(() => {
          const botAnswer = findAnswer(reply.query);
          addMessage(botAnswer, "bot");

          // 4. Offer relevant follow-up options based on what they clicked
          let followUps = [
            { label: "Other Services", query: "services" },
            { label: "Email Support", query: "email" }
          ];
          
          if (reply.query.toLowerCase().includes("emergency")) {
            followUps = [
              { label: "Location / Address", query: "location" },
              { label: "HMO & Insurance", query: "hmo" }
            ];
          } else if (reply.query.toLowerCase().includes("lab")) {
            followUps = [
              { label: "Radiology / CT", query: "ct scan" },
              { label: "OPD Services", query: "opd" }
            ];
          }

          renderQuickReplies(followUps);
        }, 350);
      });
      
      container.appendChild(chip);
    });

    messagesEl.appendChild(container);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function handleSend() {
    const val = inputEl.value.trim();
    if (!val) return;
    addMessage(val, "user");
    inputEl.value = "";
    setTimeout(() => {
      addMessage(findAnswer(val), "bot");
    }, 350);
  }

  sendBtn.addEventListener("click", handleSend);
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSend();
  });

  let greeted = false;
  bubble.addEventListener("click", () => {
    win.classList.add("cbw-open");
    bubble.classList.add("cbw-hidden");
    if (!greeted) {
      addMessage(CONFIG.greeting, "bot");
      renderQuickReplies(CONFIG.quickReplies); // Renders initial chips
      greeted = true;
    }
  });

  closeBtn.addEventListener("click", () => {
    win.classList.remove("cbw-open");
    bubble.classList.remove("cbw-hidden"); // Show floating bubble when chat closes
  });
})();