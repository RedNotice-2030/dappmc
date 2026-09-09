
(function () {
  "use strict";

  // Display name used throughout the chat widget (kept as a plain local so the
  // greeting below doesn't reference CONFIG before it is initialized).
  const AGENT_NAME = "DAPPMC Chat";

  const CONFIG = {
    AgentName: AGENT_NAME,
    logoSrc: "assets/images/dappmc-logo.png", 
    bubbleIconSrc: "assets/images/img3.png", 
    bgPatternSrc: "assets/images/dappmc-logo-raw.png", 
    bgPatternTileSize: "48px", 
    bgPatternOpacity: 0.05,    // Reduced opacity for better readability
    greeting:
      "Hi! 👋 Welcome to " + AGENT_NAME + ". I can answer questions based on our website — " +
      "services, doctors & specialists, health packages, lab, HMO/insurance, " +
      "visiting hours & location, news, and careers. How can I help you?",
    quickReplies: [
      { label: "OPD Services", query: "OPD services hours" },
      { label: "Laboratory", query: "lab results" },
      { label: "Doctors & Specialists", query: "doctors" },
      { label: "Health Packages", query: "health packages" },
      { label: "Careers / Jobs", query: "jobs" },
      { label: "HMO & Insurance", query: "HMO insurance" },
      { label: "Emergency & Hours", query: "emergency hours" }
    ],
    fallback:
      "I can only help with questions about Dr. Arturo P. Pingoy Medical Center based on our website. " +
      "Try asking about our doctors, services, hours, health packages, HMO partners, news, or careers — " +
      "or use the Email us button above to reach our team directly.",
    handoffText: "Email us",
    handoffMode: "modal",
    handoffModalTarget: "#contact-us-modal", 
    handoffModalWhatever: "user@example.com", 
    handoffHref: "mailto:hello@example.com", 
    accent: "#002c6d",        // primary color
    accentDark: "#001c47",    // added dark accent for hover states
    bg: "#FFFFFF",
    text: "#1A1A1A",
    position: "left"         // "right" or "left"
  };

  const KNOWLEDGE_BASE = [
    {
      keywords: ["emergency", "er", "urgent", "24/7", "24 hour", "ambulance"],
      answer:
        "Our Emergency Room is open 24/7 and is staffed to handle all types of medical " +
        "emergencies. For emergencies, call 911 or (083) 228-2202 immediately."
    },
    {
      keywords: ["helpline", "phone", "contact number", "telephone", "reach us"],
      answer: "Emergency: 911 or (083) 228-2202. Helpline: (083) 228-2202."
    },
    {
      keywords: ["address", "location", "directions", "where", "map"],
      answer:
        "DAPPMC is located at Gensan Drive, Koronadal, 9506 South Cotabato. " +
        "You can view the location on our About page or get directions from the footer of any page."
    },
    {
      keywords: ["hours", "open", "close", "operating", "visiting"],
      answer:
        "Emergency Room: Open 24/7.\n" +
        "Outpatient Clinic: Monday to Saturday, 8:00 AM to 6:00 PM."
    },
    {
      keywords: ["lab result", "test result", "results", "when will i get", "turnaround", "lab"],
      answer:
        "Most lab results are ready within 12–24 hours after your examination. " +
        "For your specific results, call our helpline at (083) 228-2202 or visit the Laboratory department directly."
    },
    {
      keywords: ["heart", "cardiovascular", "cardiac", "cardiology", "ecg", "echocardiogram", "heart station"],
      answer:
        "Our Heart Station provides ECG and echocardiogram services for heart-related care and monitoring."
    },
    {
      keywords: ["lung", "pulmonary", "respiratory", "breathing"],
      answer: "We offer specialized pulmonary services for lung and respiratory care, including testing."
    },
    {
      keywords: ["rehab", "rehabilitation", "physical medicine", "physical therapy", "therapy"],
      answer:
        "Our Physical Medicine and Rehabilitation services support recovery and mobility after injury or illness."
    },
    {
      keywords: ["accommodation", "room", "admission", "ward", "stay", "bed"],
      answer: "We provide comfortable patient accommodations and ward facilities for those admitted to our care."
    },
    {
      keywords: ["ct", "ct scan", "imaging", "scan", "radiology", "x-ray", "ultrasound"],
      answer:
        "We're equipped with a modern 128-slice CT scan for fast, detailed imaging, along with X-ray and ultrasound services."
    },
    {
      keywords: ["hmo", "insurance", "coverage", "provider", "accredited"],
      answer:
        "We are accredited with many HMO and insurance providers including Maxicare, Intellicare, Medicard, " +
        "MediLink, ValuCare, WellCare, Cocolife, BenLife, and many more. Present your HMO card or membership ID " +
        "during admission or consultation, and our billing department coordinates with your provider. " +
        "View the full list on our HMO Partners page."
    },
    {
      keywords: ["billing", "bill", "payment", "charge", "invoice", "pay", "gcash", "paya", "online banking"],
      answer:
        "We accept Cash, Online banking, GCash/PayMaya, and HMO/Insurance. " +
        "For billing or account concerns, use the Email us button so a member of our team can help you directly."
    },
    {
      keywords: ["how do i avail", "avail", "health package", "package", "promo", "promotion"],
      answer:
        "To avail of a health package:\n" +
        "1) Contact DAPPMC Information at (083) 228-2202 or 0949-994-6474.\n" +
        "2) Our staff will assist with scheduling and booking.\n" +
        "3) Preparation guidelines will be provided; please bring a PWD or Senior Citizen ID if applicable."
    },
    {
      keywords: ["appointment", "book", "schedule a", "consultation", "reserve", "walk-in"],
      answer:
        "While walk-ins are accepted for certain services, we highly recommend scheduling an appointment " +
        "to ensure availability and minimize waiting time. Contact our information desk at (083) 228-2202 " +
        "to book a consultation."
    },
    {
      keywords: ["history", "established", "founded", "when was", "1961"],
      answer:
        "DAPPMC was established on May 12, 1961 by spouses Arturo P. Pingoy, MD and Amparo Y. Pingoy, MD. " +
        "It has since grown from a small clinic into a 100-bed tertiary hospital."
    },
    {
      keywords: ["accreditation", "accredited", "iso", "philhealth", "certified", "certification"],
      answer:
        "Yes. DAPPMC is accredited by PhilHealth as a Center of Safety and Center of Quality, " +
        "and has been awarded ISO 9001:2015 certification for quality management systems."
    },
    {
      keywords: ["vision", "mission", "core value", "values"],
      answer:
        "Vision: Delivering Exceptional Care with Compassion.\n" +
        "Mission: Advancing Life and the Environment through Innovation and Responsible Healthcare.\n" +
        "Core values: Integrity, Compassion, Accountability, Reliability, and Excellence."
    },
    {
      keywords: ["specialties", "specialty", "specialization", "departments"],
      answer:
        "DAPPMC offers a wide range of specialties including Cardiology, Pediatrics, Radiology, " +
        "Internal Medicine, Physiology, Anesthesiology, Nephrology, Urology, Orthopedics, Pulmonology, " +
        "ENT, General Surgery, OB-Gynecology, and Neurology."
    },
    {
      keywords: ["contact", "email", "support", "message the", "opd", "outpatient"],
      answer:
        "Hello! Our Outpatient Department (OPD) is open Monday to Saturday, 8:00 AM to 6:00 PM. " +
        "You can also reach our team using the Email us button in the header above."
    },
    {
      keywords: ["hello", "hi", "hey", "good morning", "good afternoon", "good evening"],
      answer: "Hello! 👋 How can I help you today? I can answer questions about our services, doctors, packages, HMO partners, visiting hours, and more."
    },
    {
      keywords: ["thanks", "thank you", "thx"],
      answer: "You're welcome! Let me know if you need anything else."
    }
  ];

  const API_ENDPOINTS = {
    doctors: "doctors.json",           // Doctors::publicList      -> { doctors: [...] }
    packages: "services/packages.json", // Packages::publicList     -> { packages: [...] }
    news: "api/news",                  // News::index (public)     -> { success, news: [...] }
    jobs: "careers/jobs.json"          // Jobs::publicList         -> { jobs: [...] }
  };

  const dynamicData = { doctors: [], packages: [], news: [], jobs: [] };
  let dynamicPromise = null;

  /** Load all dynamic content once (used by matching logic). */
  function loadDynamicData() {
    if (dynamicPromise) return dynamicPromise;
    dynamicPromise = Promise.all(
      Object.entries(API_ENDPOINTS).map(([key, url]) =>
        fetch(url, {
          method: "GET",
          credentials: "same-origin",
          headers: { "X-Requested-With": "XMLHttpRequest" }
        })
          .then((res) => res.json())
          .then((data) => {
            if (key === "doctors" && Array.isArray(data.doctors)) dynamicData.doctors = data.doctors;
            if (key === "packages" && Array.isArray(data.packages)) dynamicData.packages = data.packages;
            if (key === "news" && Array.isArray(data.news)) dynamicData.news = data.news;
            if (key === "jobs" && Array.isArray(data.jobs)) dynamicData.jobs = data.jobs;
          })
          .catch(() => { /* network failure: static knowledge base still works */ })
      )
    );
    return dynamicPromise;
  }

  function scoreMessage(message) {
    const lower = message.toLowerCase();
    let best = null;
    let bestScore = 0;

    KNOWLEDGE_BASE.forEach((entry) => {
      let score = 0;
      entry.keywords.forEach((kw) => {
        const k = kw.toLowerCase();
        // Match 1-2 letter keywords only as whole words (e.g. "er" should not
        // match "where"), but allow substring matching for longer phrases.
        if (k.trim().split(/\s+/).length <= 2) {
          const escaped = k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          if (new RegExp("\\b" + escaped + "\\b").test(lower)) {
            score += k.trim().split(/\s+/).length;
          }
        } else if (lower.includes(k)) {
          score += k.trim().split(/\s+/).length;
        }
      });
      if (score > bestScore) {
        bestScore = score;
        best = entry;
      }
    });

    return { entry: best, score: bestScore, lower };
  }

  function formatDoctor(doc) {
    let out = "• " + doc.name + " (" + (doc.specializationLabel || doc.specialization || "Specialist") + ")";
    if (doc.location) out += "\n  Location: " + doc.location;
    if (Array.isArray(doc.schedule) && doc.schedule.length) {
      out += "\n  Schedule:";
      doc.schedule.forEach((s) => {
        out += "\n  • " + (s.days || "") + (s.time ? " — " + s.time : "");
      });
    }
    return out;
  }

  function buildDynamicAnswer(message, lower, fallback) {
    // --- Doctors & Specialists ---
    if (/(doctor|physician|specialist|consult|dr\.? )/.test(message)) {
      const all = dynamicData.doctors.filter((d) => d.active !== false);
      if (all.length) {
        const matched = all.find((d) =>
          lower.includes((d.specialization || "").toLowerCase()) ||
          lower.includes((d.specializationLabel || "").toLowerCase())
        );
        const docs = matched
          ? all.filter((d) =>
              lower.includes((d.specialization || "").toLowerCase()) ||
              lower.includes((d.specializationLabel || "").toLowerCase())
            )
          : all.slice(0, 6);

        if (docs.length) {
          const header = matched
            ? "Here are our " + (matched.specializationLabel || matched.specialization) + " specialists:"
            : "Here are some of our doctors and specialists:";
          return header + "\n" + docs.map(formatDoctor).join("\n") +
            "\n\nSee the full list on our Doctors page.";
        }
      }
    }

    // --- Health Packages / Promos ---
    if (/(package|promo|promotion|avail)/.test(message)) {
      const pkgs = dynamicData.packages.filter((p) => p.active !== false && !p.isExpired);
      if (pkgs.length) {
        const lines = pkgs.slice(0, 6).map((p) =>
          "• " + p.name + (p.promoBadge ? " [" + p.promoBadge + "]" : "") +
          (p.shortDescription ? "\n  " + p.shortDescription : "")
        );
        return "Here are our current health packages:\n" +
          lines.join("\n") +
          "\n\nSee details and promos on our Services page.";
      }
    }

    // --- News & Updates ---
    if (/(news|update|advis|announcement|event)/.test(message)) {
      const news = dynamicData.news.filter((n) => n.active !== false);
      if (news.length) {
        const lines = news.slice(0, 5).map((n) =>
          "• " + (n.date || "Recently") + " — " + n.title + (n.excerpt ? "\n  " + n.excerpt : "")
        );
        return "Latest updates from DAPPMC:\n" +
          lines.join("\n") +
          "\n\nRead more on our News page.";
      }
    }

    // --- Jobs / Careers ---
    if (/(job|career|hiring|vacancy|position|apply)/.test(message)) {
      const jobs = dynamicData.jobs.filter((j) => j.active !== false);
      if (jobs.length) {
        const lines = jobs.slice(0, 6).map((j) =>
          "• " + j.title + " (" + (j.type || j.employment_type || "") + ")"
        );
        return "We currently have openings for:\n" +
          lines.join("\n") +
          "\n\nApply on our Careers page.";
      }
    }

    return fallback;
  }

  function findAnswer(message) {
    const { entry, score, lower } = scoreMessage(message);
    const fallback = entry && score > 0 ? entry.answer : CONFIG.fallback;

    return loadDynamicData().then(() => buildDynamicAnswer(message, lower, fallback));
  }

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
    flex: 1; overflow-y: auto; padding: 14px;
    /* The background is painted on the scroll container ITSELF, so it stays
       fixed while messages scroll (background-attachment: scroll default).
       NOTE: do NOT move this pattern back to a ::before/absolute child — it
       becomes part of the scrollable content and slides away on long chats. */
    background-color: #F7F7F5;
    background-image:
      linear-gradient(rgba(255, 255, 255, ${1 - CONFIG.bgPatternOpacity}), rgba(255, 255, 255, ${1 - CONFIG.bgPatternOpacity})),
      url(${CONFIG.bgPatternSrc});
    background-repeat: repeat, repeat;
    background-size: auto, ${CONFIG.bgPatternTileSize} ${CONFIG.bgPatternTileSize};
    position: relative;
  }
  
  .cbw-msg { margin-bottom: 10px; display: flex; position: relative; z-index: 1; }
  .cbw-msg.reply { justify-content: flex-start; }
  .cbw-msg.user { justify-content: flex-end; }
  .cbw-bubble-text {
    max-width: 82%; padding: 10px 14px; border-radius: 14px;
    font-size: 13.5px; line-height: 1.45; color: ${CONFIG.text};
  }
  .cbw-msg.reply .cbw-bubble-text { background: #fff; border: 1px solid #E5E5E0; border-bottom-left-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
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
        <span>${CONFIG.AgentName}</span>
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
          "[chat-widget] Bootstrap's JS doesn't seem to be loaded yet."
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

  /**
   * Show a temporary "typing…" bubble that is replaced by the
   * real answer once the Promise resolves (dynamic fetch delay).
   */
  function addAnswer(answerPromise) {
    const row = document.createElement("div");
    row.className = "cbw-msg reply";
    const bub = document.createElement("div");
    bub.className = "cbw-bubble-text";
    bub.textContent = "Typing…";
    row.appendChild(bub);
    messagesEl.appendChild(row);
    messagesEl.scrollTop = messagesEl.scrollHeight;

    Promise.resolve(answerPromise).then((text) => {
      bub.textContent = text;
      messagesEl.scrollTop = messagesEl.scrollHeight;
    });
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
        
        // 3. Trigger the answer & suggest follow-up chips
        setTimeout(() => {
          addAnswer(findAnswer(reply.query));

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
          } else if (reply.query.toLowerCase().includes("doctor")) {
            followUps = [
              { label: "Health Packages", query: "health packages" },
              { label: "Book Appointment", query: "appointment" }
            ];
          } else if (reply.query.toLowerCase().includes("package")) {
            followUps = [
              { label: "Payment Options", query: "payment" },
              { label: "HMO & Insurance", query: "hmo" }
            ];
          } else if (reply.query.toLowerCase().includes("job")) {
            followUps = [
              { label: "About DAPPMC", query: "history" },
              { label: "Email Support", query: "email" }
            ];
          }

          setTimeout(() => renderQuickReplies(followUps), 250);
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
      addAnswer(findAnswer(val));
    }, 250);
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
      addMessage(CONFIG.greeting, "reply");
      renderQuickReplies(CONFIG.quickReplies); // Renders initial chips
      greeted = true;
    }
  });

  closeBtn.addEventListener("click", () => {
    win.classList.remove("cbw-open");
    bubble.classList.remove("cbw-hidden"); // Show floating bubble when chat closes
  });

  window.DappmcChat = { ask: (msg) => findAnswer(msg).then((t) => { console.log("[chat] ", t); return t; }) };
})();