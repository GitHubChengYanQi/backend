const ctx = '@@InfiniteScroll'

const throttle = function (fn, delay) {
  let now, lastExec, timer, context, args; //eslint-disable-line

  const execute = function () {
    fn.apply(context, args)
    lastExec = now
  }

  return function () {
    context = this
    args = arguments
    now = Date.now()

    if (timer) {
      clearTimeout(timer)
      timer = null
    }

    if (lastExec) {
      const diff = delay - (now - lastExec)
      if (diff < 0) {
        execute()
      } else {
        timer = setTimeout(() => {
          execute()
        }, diff)
      }
    } else {
      execute()
    }
  }
}

const getScrollTop = function (element) {
  if (element === window) {
    return Math.max(window.pageYOffset || 0, document.documentElement.scrollTop)
  }

  return element.scrollTop
}

const getComputedStyle = document.defaultView.getComputedStyle

const getScrollEventTarget = function (element) {
  let currentNode = element
  while (currentNode && currentNode.tagName !== 'HTML' && currentNode.tagName !== 'BODY' && currentNode.nodeType === 1) {
    const overflowY = getComputedStyle(currentNode).overflowY
    const overflowYStyle = currentNode.style.overflowY
    if (overflowY === 'scroll' || overflowY === 'auto' || overflowYStyle === 'auto') {
      return currentNode
    }
    currentNode = currentNode.parentNode
  }
  return currentNode
}

const getVisibleHeight = function (element) {
  if (element === window) {
    return document.documentElement.clientHeight
  }

  return element.clientHeight
}

const getElementTop = function (element) {
  if (element === window) {
    return getScrollTop(window)
  }
  return element.getBoundingClientRect().top + getScrollTop(window)
}

const isAttached = function (element) {
  let currentNode = element.parentNode
  while (currentNode) {
    if (currentNode.tagName === 'HTML') {
      return true
    }
    if (currentNode.nodeType === 11) {
      return false
    }
    currentNode = currentNode.parentNode
  }
  return false
}

const doBind = function () {
  if (this.binded) return; // eslint-disable-line
  this.binded = true
  const directive = this
  const element = directive.el
  const throttleDelayExpr = element.getAttribute('infinite-scroll-throttle-delay')
  let throttleDelay = 200
  if (throttleDelayExpr) {
    throttleDelay = Number(directive.vm[throttleDelayExpr] || throttleDelayExpr)
    if (isNaN(throttleDelay) || throttleDelay < 0) {
      throttleDelay = 200
    }
  }
  directive.throttleDelay = throttleDelay
  console.log(getScrollEventTarget(element), 'getScrollEventTarget(element)')
  directive.scrollEventTarget = getScrollEventTarget(element)
  directive.scrollListener = throttle(doCheck.bind(directive), directive.throttleDelay)
  directive.scrollEventTarget.addEventListener('scroll', directive.scrollListener)

  this.vm.$on('hook:beforeDestroy', function () {
    directive.scrollEventTarget.removeEventListener('scroll', directive.scrollListener)
  })

  const disabledExpr = element.getAttribute('infinite-scroll-disabled')
  let disabled = false
  if (disabledExpr) {
    this.vm.$watch(disabledExpr, function (value) {
      directive.disabled = value
      if (!value && directive.immediateCheck) {
        doCheck.call(directive)
      }
    })
    disabled = Boolean(directive.vm[disabledExpr])
  }
  directive.disabled = disabled

  const distanceExpr = element.getAttribute('infinite-scroll-distance')
  let distance = 0
  if (distanceExpr) {
    distance = Number(directive.vm[distanceExpr] || distanceExpr)
    if (isNaN(distance)) {
      distance = 0
    }
  }
  directive.distance = distance

  const immediateCheckExpr = element.getAttribute('infinite-scroll-immediate-check')
  let immediateCheck = true
  if (immediateCheckExpr) {
    immediateCheck = Boolean(directive.vm[immediateCheckExpr])
  }
  directive.immediateCheck = immediateCheck

  if (immediateCheck) {
    doCheck.call(directive)
  }

  const eventName = element.getAttribute('infinite-scroll-listen-for-event')
  if (eventName) {
    directive.vm.$on(eventName, function () {
      doCheck.call(directive)
    })
  }
}

const doCheck = function (force) {
  const scrollEventTarget = this.scrollEventTarget
  const element = this.el
  const distance = this.distance

  if (force !== true && this.disabled) return; //eslint-disable-line
  const viewportScrollTop = getScrollTop(scrollEventTarget)
  const viewportBottom = viewportScrollTop + getVisibleHeight(scrollEventTarget)

  let shouldTrigger = false

  if (scrollEventTarget === element) {
    shouldTrigger = scrollEventTarget.scrollHeight - viewportBottom <= distance
  } else {
    const elementBottom = getElementTop(element) - getElementTop(scrollEventTarget) + element.offsetHeight + viewportScrollTop

    shouldTrigger = viewportBottom + distance >= elementBottom
  }

  if (shouldTrigger && this.expression) {
    this.expression()
  }
}

export default {
  // bind
  // bind：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
  // inserted：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。
  inserted (el, binding, vnode) {
    el[ctx] = {
      el,
      vm: vnode.context,
      expression: binding.value
    }
    const args = arguments

    doBind.call(el[ctx])
    el[ctx].vm.$nextTick().then(function () {
      if (isAttached(el)) {
        doBind.call(el[ctx], args)
      }

      el[ctx].bindTryCount = 0

      const tryBind = function () {
        if (el[ctx].bindTryCount > 10) return; //eslint-disable-line
        el[ctx].bindTryCount++
        if (isAttached(el)) {
          doBind.call(el[ctx], args)
        } else {
          setTimeout(tryBind, 50)
        }
      }
      tryBind()
    })
  },

  unbind (el) {
    if (el && el[ctx] && el[ctx].scrollEventTarget) {
      el[ctx].scrollEventTarget.removeEventListener('scroll', el[ctx].scrollListener)
    }
  }
}
