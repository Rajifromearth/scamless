(() => {
  const observeFeatures = () => {
    const cards = document.querySelectorAll('.feature-card:not(.feature-reveal)')
    if (!cards.length) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    cards.forEach((card) => card.classList.add('feature-reveal'))
    if (reduced || !('IntersectionObserver' in window)) {
      cards.forEach((card) => card.classList.add('is-visible'))
      return
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.18 })
    cards.forEach((card) => observer.observe(card))
  }

  const enhanceScanner = () => {
    const scanner = document.querySelector('.scan-demo')
    if (!scanner || scanner.dataset.polished) return
    scanner.dataset.polished = 'true'
    scanner.setAttribute('aria-label', 'Live scam text scanner')
    const textarea = scanner.querySelector('textarea')
    const button = scanner.querySelector('button')
    if (!textarea || !button) return
    textarea.setAttribute('aria-label', 'Message to scan for scam signals')
    textarea.setAttribute('aria-describedby', 'scan-helper')
    const helper = document.createElement('p')
    helper.className = 'scan-helper'
    helper.id = 'scan-helper'
    helper.textContent = 'We’ll highlight the specific signals that shape the verdict.'
    textarea.after(helper)
    button.type = 'button'
    button.addEventListener('click', () => {
      if (textarea.value.trim() && !button.disabled) {
        button.classList.add('is-loading')
        button.setAttribute('aria-busy', 'true')
      }
    })
    const observer = new MutationObserver(() => {
      const result = scanner.querySelector('.scan-demo-result')
      const error = scanner.querySelector('.scan-demo-error')
      if (result || error) {
        button.classList.remove('is-loading')
        button.setAttribute('aria-busy', 'false')
        helper.hidden = true
        if (result) result.setAttribute('aria-live', 'polite')
      }
    })
    observer.observe(scanner, { childList: true, subtree: true })
  }

  const init = () => { observeFeatures(); enhanceScanner() }
  new MutationObserver(init).observe(document.documentElement, { childList: true, subtree: true })
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init)
  else init()
})()