/* ============================================================
   CRIMSON INDEX — Mock legacy support chat (video prop)
   Scripted deflection answers, no backend, no real agent.
   ============================================================ */

(function () {
  'use strict';

  const TYPING_BASE_MS = 1300;
  const TYPING_PER_CHAR_MS = 9;
  const TYPING_MAX_MS = 3400;
  const BUBBLE_GAP_MS = 420;
  const MOCK_CHAT_PARAM = 'mock_competitor_chatbot';

  const GREETING = [
    "Hi there! Thank you so much for contacting {brand}. My name is {agent} and I'm a virtual assistant, available 24 hours a day, 7 days a week!",
    "Please let me know how I can assist you today by typing your question below or selecting one of the commonly requested topics."
  ];

  const QUICK_REPLIES = [
    'Where is my order?',
    "I'd like to return an item",
    'Talk to a human'
  ];

  const SCRIPTED_ANSWERS = [
    {
      pattern: /(order|track|deliver|shipping|shipment|dispatch|arriv|late|where)/i,
      bubbles: [
        "Thank you so much for reaching out, and thank you for your patience! I completely understand how important it is to know exactly where your order is at this moment in time.",
        "Delivery estimates can vary depending on a number of factors, including your delivery address, the carrier's current capacity, seasonal volumes and the fulfilment centre that processes your order.",
        "So that I can look into this further, could you please confirm your order number, the email address used at checkout, the billing postcode and the approximate date of purchase?"
      ]
    },
    {
      pattern: /(return|refund|exchange|send back|money back)/i,
      bubbles: [
        "I'm very sorry to hear that your purchase did not fully meet your expectations! Customer satisfaction is extremely important to all of us here.",
        "Returns are generally accepted within 30 days of delivery, provided that the item is unused, in its original packaging, and accompanied by all original accessories, documentation and proof of purchase. Please note that certain product categories may be excluded.",
        "Full details are available in our Help Center article 'How do I return an item?'."
      ]
    },
    {
      pattern: /(warrant|guarantee|broken|faulty|repair|defect)/i,
      bubbles: [
        "That's a great question, and I'm glad you asked! Warranty coverage varies by manufacturer, by product category, and by the country in which the product was originally purchased.",
        "Coverage typically applies to manufacturing defects under normal use, and does not extend to accidental damage, liquid damage, cosmetic wear or unauthorised repairs.",
        "I would recommend reviewing the documentation supplied in the box, or the manufacturer's official website, for the terms applicable to your specific model."
      ]
    },
    {
      pattern: /(which|compare|better|best|recommend|spec|compatib|difference|batter)/i,
      bubbles: [
        "Great question! Every product in our catalogue is carefully selected to meet the highest standards of quality, performance and value for money.",
        "For detailed specifications and side-by-side comparisons, I would recommend visiting the relevant category page, where you can filter by the features that matter most to you.",
        "If you would like, I can email you a link to our Buying Guide."
      ]
    },
    {
      pattern: /(discount|coupon|code|cheap|price|deal|promo|sale|deliver free)/i,
      bubbles: [
        "I would absolutely love to help you save on your purchase today! Unfortunately I am not able to create, validate, apply or extend discount codes within this chat window.",
        "I would encourage you to subscribe to our newsletter, as subscribers are often among the first to be notified about seasonal promotions and exclusive offers."
      ]
    },
    {
      pattern: /(human|agent|person|someone|manager|representative|call|phone)/i,
      bubbles: [
        "I would be delighted to connect you with a member of our Customer Care team!",
        "All of our agents are currently assisting other customers. Your estimated wait time is 47 minutes.",
        "Alternatively, I can create a ticket on your behalf and a member of the team will respond within 24 to 48 business hours, excluding weekends and public holidays. Ticket #8842-179 has been created for your reference."
      ]
    }
  ];

  const FALLBACKS = [
    ["I'm sorry, I didn't quite catch that! Could you try rephrasing your question using different keywords?"],
    [
      "Thank you for that information! I want to make sure I fully understand your request before we continue.",
      "Could you tell me a little more about what you are hoping to achieve today?"
    ],
    [
      "I appreciate your patience! Unfortunately I was not able to find an exact match for your question in our Help Center.",
      "Here are some articles that other customers found helpful: 'Getting Started', 'Shipping & Delivery', 'Contact Us'."
    ]
  ];

  const FEEDBACK_PROMPT = 'Did that answer your question?';
  const FEEDBACK_THANKS = 'Thank you for your feedback! It helps us improve our service.';

  function mockChatRequested() {
    return new URLSearchParams(window.location.search).get(MOCK_CHAT_PARAM) === 'true';
  }

  function propagateMockChatParam() {
    const updateLink = (link) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#')) return;

      let url;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }

      if (url.origin !== window.location.origin) return;
      url.searchParams.set(MOCK_CHAT_PARAM, 'true');
      link.href = url.toString();
    };

    const updateForm = (form) => {
      const method = (form.getAttribute('method') || 'get').toLowerCase();
      if (method !== 'get' || form.querySelector(`[name="${MOCK_CHAT_PARAM}"]`)) return;

      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = MOCK_CHAT_PARAM;
      input.value = 'true';
      form.appendChild(input);
    };

    const updateNode = (node) => {
      if (node.nodeType !== Node.ELEMENT_NODE) return;
      if (node.matches('a[href]')) updateLink(node);
      if (node.matches('form')) updateForm(node);
      node.querySelectorAll('a[href]').forEach(updateLink);
      node.querySelectorAll('form').forEach(updateForm);
    };

    document.querySelectorAll('a[href]').forEach(updateLink);
    document.querySelectorAll('form').forEach(updateForm);

    new MutationObserver((records) => {
      records.forEach(record => record.addedNodes.forEach(updateNode));
    }).observe(document.body, { childList: true, subtree: true });
  }

  class LegacyChat {
    constructor(root) {
      this.root = root;
      this.brand = root.dataset.brand || 'Customer Care';
      this.agent = root.dataset.agent || 'Ava';

      this.window = root.querySelector('[data-legacy-chat-window]');
      this.launcher = root.querySelector('[data-legacy-chat-toggle]');
      this.log = root.querySelector('[data-legacy-chat-log]');
      this.quick = root.querySelector('[data-legacy-chat-quick]');
      this.composer = root.querySelector('[data-legacy-chat-composer]');
      this.input = root.querySelector('[data-legacy-chat-input]');

      this.hasStarted = false;
      this.fallbackIndex = 0;
      this.exchanges = 0;

      this.bindEvents();
    }

    bindEvents() {
      this.launcher.addEventListener('click', () => this.toggle());
      this.root.querySelector('[data-legacy-chat-close]')?.addEventListener('click', () => this.close());

      this.composer.addEventListener('submit', (event) => {
        event.preventDefault();
        const text = this.input.value.trim();
        if (!text) return;
        this.input.value = '';
        this.sendVisitorMessage(text);
      });
    }

    isOpen() {
      return !this.window.hidden;
    }

    toggle() {
      this.isOpen() ? this.close() : this.open();
    }

    open() {
      this.window.hidden = false;
      this.launcher.setAttribute('aria-expanded', 'true');
      this.root.classList.add('is-open');
      if (!this.hasStarted) this.startConversation();
      this.input.focus();
    }

    close() {
      this.window.hidden = true;
      this.launcher.setAttribute('aria-expanded', 'false');
      this.root.classList.remove('is-open');
    }

    startConversation() {
      this.hasStarted = true;
      this.log.hidden = false;
      this.composer.hidden = false;
      this.quick.hidden = false;

      this.renderQuickReplies();
      this.sendBotBubbles(GREETING);
    }

    renderQuickReplies() {
      this.quick.innerHTML = '';
      QUICK_REPLIES.forEach(label => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'legacy-chat__chip';
        chip.textContent = label;
        chip.addEventListener('click', () => this.sendVisitorMessage(label));
        this.quick.appendChild(chip);
      });
    }

    sendVisitorMessage(text) {
      this.appendMessage(text, 'visitor');
      this.exchanges += 1;
      this.sendBotBubbles(this.answerFor(text), { withFeedback: true });
    }

    answerFor(text) {
      const match = SCRIPTED_ANSWERS.find(answer => answer.pattern.test(text));
      if (match) return match.bubbles;

      const fallback = FALLBACKS[this.fallbackIndex % FALLBACKS.length];
      this.fallbackIndex += 1;
      return fallback;
    }

    sendBotBubbles(bubbles, options = {}) {
      let delay = 0;

      bubbles.forEach((bubble, index) => {
        const text = this.interpolate(bubble);
        const typing = Math.min(TYPING_BASE_MS + text.length * TYPING_PER_CHAR_MS, TYPING_MAX_MS);

        setTimeout(() => this.showTyping(), delay);
        delay += typing;
        setTimeout(() => {
          this.hideTyping();
          this.appendMessage(text, 'bot');
          const isLast = index === bubbles.length - 1;
          if (isLast && options.withFeedback) this.appendFeedback();
        }, delay);
        delay += BUBBLE_GAP_MS;
      });
    }

    interpolate(text) {
      return text
        .replace('{brand}', this.brand)
        .replace('{agent}', this.agent);
    }

    appendMessage(text, author) {
      const row = document.createElement('div');
      row.className = `legacy-chat__msg legacy-chat__msg--${author}`;

      if (author === 'bot') {
        const who = document.createElement('span');
        who.className = 'legacy-chat__msg-author';
        who.textContent = this.agent;
        row.appendChild(who);
      }

      const bubble = document.createElement('p');
      bubble.className = 'legacy-chat__bubble';
      bubble.textContent = text;
      row.appendChild(bubble);

      this.log.appendChild(row);
      this.scrollToLatest();
    }

    appendFeedback() {
      const row = document.createElement('div');
      row.className = 'legacy-chat__feedback';

      const label = document.createElement('span');
      label.textContent = FEEDBACK_PROMPT;
      row.appendChild(label);

      ['👍', '👎'].forEach(glyph => {
        const vote = document.createElement('button');
        vote.type = 'button';
        vote.className = 'legacy-chat__vote';
        vote.textContent = glyph;
        vote.addEventListener('click', () => {
          row.textContent = FEEDBACK_THANKS;
          row.classList.add('is-answered');
        });
        row.appendChild(vote);
      });

      this.log.appendChild(row);
      this.scrollToLatest();
    }

    showTyping() {
      if (this.typingRow) return;
      this.typingRow = document.createElement('div');
      this.typingRow.className = 'legacy-chat__typing';
      this.typingRow.innerHTML = `<span class="legacy-chat__typing-label">${this.agent} is typing</span><span class="legacy-chat__dots"><i></i><i></i><i></i></span>`;
      this.log.appendChild(this.typingRow);
      this.scrollToLatest();
    }

    hideTyping() {
      this.typingRow?.remove();
      this.typingRow = null;
    }

    scrollToLatest() {
      this.log.scrollTop = this.log.scrollHeight;
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (!mockChatRequested()) return;

    propagateMockChatParam();

    const root = document.querySelector('[data-legacy-chat]');
    if (!root) return;

    root.hidden = false;
    new LegacyChat(root);
  });
})();
