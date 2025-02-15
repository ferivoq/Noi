/**
 * NoiAsk: Batch send messages to AI Chat.
 *
 * This file is a modified version of the GodMode.
 * ref: https://github.com/smol-ai/GodMode/tree/main/src/providers
 */

class NoiAsk {
  static sync(message) {
    const inputElement = document.querySelector('textarea');
    if (inputElement) {
      const nativeTextareaSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
      nativeTextareaSetter.call(inputElement, message);
      const inputEvent = new InputEvent('input', {
        bubbles: true,
        cancelable: true,
      });
      inputElement.dispatchEvent(inputEvent);
    }
  }

  static simulateUserInput(element, text) {
    const inputEvent = new InputEvent('input', {
      bubbles: true,
      cancelable: true,
    });
    element.focus();
    element.value = text;
    element.dispatchEvent(inputEvent);
  }

  static autoClick(btn) {
    btn.focus();
    btn.disabled = false;
    btn.click();
  }
}

class OpenAIAsk extends NoiAsk {
  static name = 'ChatGPT';
  static url = 'https://chat.openai.com';

  static submit() {
    const btn = document.querySelector('button[data-testid="send-button"]');
    if (btn) this.autoClick(btn);
  }
}

class PoeAsk extends NoiAsk {
  static name = 'Poe';
  static url = 'https://poe.com';

  static submit() {
    const btn = document.querySelectorAll('button[class*="ChatMessageSendButton_sendButton"]')[0];
    if (btn) this.autoClick(btn);
  }
}

class ClaudeAsk extends NoiAsk {
  static name = 'Claude';
  static url = 'https://claude.ai';

  static sync(message) {
    const inputElement = document.querySelector('div.ProseMirror');
    if (inputElement) {
      inputElement.focus();
      inputElement.innerHTML = '';
      document.execCommand('insertText', false, message);
    }
  }

  static submit() {
    // subsequent screens use this
    let btn = document.querySelector('button[aria-label*="Send Message"]');
    if (!btn) { // new chats use this
      btn = document.querySelector('button:has(div svg)');
    }
    if (!btn) { // last ditch attempt
      btn = document.querySelector('button:has(svg)');
    }
    if (btn) this.autoClick(btn);
  }
}

class BardAsk extends NoiAsk {
  static name = 'Bard';
  static url = 'https://bard.google.com';

  static sync(message) {
    const inputElement = document.querySelector('.ql-editor.textarea');
    if (inputElement) {
      const inputEvent = new Event('input', { bubbles: true });
      inputElement.value = message;
      inputElement.dispatchEvent(inputEvent);
      // bard is weird
      inputElement.querySelector('p').textContent = message;
    }
  }

  static submit() {
    const btn = document.querySelector('button[aria-label*="Send message"]');
    if (btn) {
      btn.setAttribute('aria-disabled', 'false'); // doesn't work alone
      btn.focus();
      btn.click();
    }
  }
}

class HuggingChatAsk extends NoiAsk {
  static name = 'HuggingChat';
  static url = 'https://huggingface.co/chat';

  static sync(message) {
    var inputElement = document.querySelector('textarea[placeholder*="Ask anything"]');
    if (inputElement) {
      const inputEvent = new Event('input', { bubbles: true });
      inputElement.value = message;
      inputElement.dispatchEvent(inputEvent);
    }
  }

  static submit() {
    var btn = document.querySelector('form.relative > div > button[type="submit"]');
    if (btn) this.autoClick(btn);
  }
}

class PerplexityAsk extends NoiAsk {
  static name = 'Perplexity';
  static url = 'https://www.perplexity.ai';

  static submit() {
    const btns = Array.from(document.querySelectorAll('button.bg-super'));
    if (btns[0]) {
      const btnsWithSvgPath = btns.filter(button => button.querySelector('svg path'));
      const btn = btnsWithSvgPath[btnsWithSvgPath.length - 1];
      btn.click();
    }
  }
}

class CopilotAsk extends NoiAsk {
  static name = 'Copilot';
  static url = 'https://copilot.microsoft.com';

  static sync(message) {
    // SERP Shadow DOM
    const serpDOM = document.querySelector('.cib-serp-main');
    // Action Bar Shadow DOM
    const inputDOM = serpDOM.shadowRoot.querySelector('#cib-action-bar-main');
    // Text Input Shadow DOM
    const textInputDOM = inputDOM.shadowRoot.querySelector('cib-text-input');
    // This inner cib-text-input Shadow DOM is not always present
    const inputElement = textInputDOM ? textInputDOM.shadowRoot.querySelector('#searchbox') : inputDOM.shadowRoot.querySelector('#searchbox');
    if (inputElement) {
      this.simulateUserInput(inputElement, message);
    }
  }

  static submit() {
    try {
      // Access SERP Shadow DOM
      const serpDOM = document.querySelector('.cib-serp-main');
      // Action Bar Shadow DOM
      const actionDOM = serpDOM.shadowRoot.querySelector('#cib-action-bar-main');
      // Submit Button
      const submitButton = actionDOM.shadowRoot.querySelector('div.submit button');

      if (submitButton) {
        submitButton.click();
        submitButton.focus();
        setTimeout(() => {
          submitButton.click();
        }, 100)
      }
    } catch (e) {
      console.error('Copilot submit error', e);
    }
  }
}

class PiAsk extends NoiAsk {
  static name = 'Pi';
  static url = 'https://pi.ai/talk';

  static submit() {
    const inputElement = document.querySelector('textarea[placeholder="Talk with Pi"]');
    if (inputElement) {
      const event = new KeyboardEvent('keydown', {
        key: 'Enter',
        view: window,
        bubbles: true
      });
      inputElement.dispatchEvent(event);
    }
  }
}

class CozeAsk extends NoiAsk {
  static name = 'Coze';
  static url = 'https://www.coze.com/home';

  static submit() {
    const inputElement = document.querySelector('textarea');
    if (inputElement) {
      const nextElement = inputElement.nextElementSibling;
      if (nextElement) {
        const btn = nextElement.querySelector('button');
        if (btn) btn.click();
      }
    }
  }
}

class YouAsk extends NoiAsk {
  static name = 'YouAsk';
  static url = 'https://you.com';

  static submit() {
    const btn = document.querySelector('button[data-eventactionname="click_send"]');
    if (btn) btn.click();
  }
}

window.NoiAsk = {
  OpenAIAsk,
  PoeAsk,
  ClaudeAsk,
  BardAsk,
  HuggingChatAsk,
  PerplexityAsk,
  CopilotAsk,
  PiAsk,
  CozeAsk,
  YouAsk,
};
