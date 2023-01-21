// ==UserScript==
// @name         @1gy/rdas
// @namespace    http://1gy.github.io
// @version      0.1.0
// @author       1gy
// @description  refined d-animestore
// @match        https://animestore.docomo.ne.jp/animestore/tp_pc
// @match        https://animestore.docomo.ne.jp/animestore/mpa_cmp_pc*
// @match        https://animestore.docomo.ne.jp/animestore/CP/*
// ==/UserScript==

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
(function() {
  var _a, _b, _c, _d, _e, _f;
  "use strict";
  const createText = (text) => document.createTextNode(text);
  const createElement$2 = (tagName, operation) => {
    const element = document.createElement(tagName);
    operation == null ? void 0 : operation(element);
    return element;
  };
  const applyAddFooterMenu = () => {
    const footerMenu = document.querySelector(".footerMenu");
    if (!footerMenu) {
      return;
    }
    footerMenu.appendChild(
      createElement$2("li", (li) => {
        li.appendChild(
          createElement$2("a", (anchor) => {
            anchor.href = "CF/feature_index";
            anchor.appendChild(createText("*特集一覧*"));
            anchor.appendChild(
              createElement$2("i", (italic) => {
                italic.className = "icon iconArrowOrangeRight";
              })
            );
          })
        );
      })
    );
  };
  const applyHideFooterBottom = () => {
    const footerBottomMenu = document.querySelector(".footerBottomMenu");
    if (!footerBottomMenu) {
      return;
    }
    footerBottomMenu.style.display = "none";
  };
  const applyHideGoods = () => {
    const goodsWrapper = document.querySelector(".goodsTopWrapper");
    if (!goodsWrapper) {
      return;
    }
    goodsWrapper.style.display = "none";
  };
  const applyHideSong = () => {
    const songWrapper = document.querySelector(".songWrapper");
    if (!songWrapper) {
      return;
    }
    songWrapper.style.display = "none";
  };
  const defaultSettings = () => ({
    features: {
      addFooterMenu: true,
      hideFooterBottom: true,
      hideGoods: true,
      hideSong: true,
      showCompleted: true
    }
  });
  const loadSettings = () => {
    try {
      const text = localStorage.getItem("@1gy/rdas/settings");
      if (text) {
        return JSON.parse(text);
      }
    } catch (err) {
      return defaultSettings();
    }
    return defaultSettings();
  };
  const saveSettings = (settings2) => {
    localStorage.setItem("@1gy/rdas/settings", JSON.stringify(settings2));
  };
  const loadCompleted = () => {
    try {
      const text = localStorage.getItem("@1gy/rdas/completed");
      if (text) {
        return new Set(JSON.parse(text));
      }
    } catch (err) {
      return /* @__PURE__ */ new Set();
    }
    return /* @__PURE__ */ new Set();
  };
  const saveCompleted = (completed) => {
    localStorage.setItem("@1gy/rdas/completed", JSON.stringify([...completed]));
  };
  const applyGetCompleted = () => {
    const completed = loadCompleted();
    document.querySelectorAll("i.iconTextComplete").forEach((complete) => {
      var _a2, _b2;
      const workId = (_b2 = (_a2 = complete.closest("div.itemModule")) == null ? void 0 : _a2.querySelector("[class=workId")) == null ? void 0 : _b2.value;
      if (workId) {
        completed.add(workId);
      }
    });
    saveCompleted(completed);
  };
  const applyShowCompletedToCP = () => {
    const showComplete = (content) => {
      content.style.position = "relative";
      content.append(
        createElement$2("div", (div) => {
          div.style.display = "flex";
          div.style.position = "absolute";
          div.style.left = "0";
          div.style.top = "0";
          div.style.width = "100%";
          div.style.height = "100%";
          div.style.boxSizing = "border-box";
          div.style.background = "rgba(0,0,0,.3)";
          div.style.border = "2px solid gray";
          div.style.pointerEvents = "none";
          div.style.justifyContent = "center";
          div.style.alignItems = "center";
          div.appendChild(
            createElement$2("i", (italic) => {
              italic.className = "icon iconTextComplete";
            })
          );
        })
      );
    };
    const checkAndShowCompleted = (completed2, content) => {
      var _a2, _b2;
      const workId = (_b2 = (_a2 = content.querySelector("a")) == null ? void 0 : _a2.href.match(".*?workId=(\\d+)")) == null ? void 0 : _b2[1];
      if (workId && completed2.has(workId)) {
        showComplete(content);
      }
    };
    const completed = loadCompleted();
    document.querySelectorAll(".contents1In0.itemModule.small").forEach((content) => checkAndShowCompleted(completed, content));
    document.querySelectorAll(".lineup_list").forEach((content) => checkAndShowCompleted(completed, content));
    document.querySelectorAll(".itemWrapper.smallBox.clearfix").forEach((content) => checkAndShowCompleted(completed, content));
  };
  const sharedConfig = {};
  function setHydrateContext(context) {
    sharedConfig.context = context;
  }
  const equalFn = (a, b) => a === b;
  const $PROXY = Symbol("solid-proxy");
  const $TRACK = Symbol("solid-track");
  const $DEVCOMP = Symbol("solid-dev-component");
  const signalOptions = {
    equals: equalFn
  };
  let runEffects = runQueue;
  const STALE = 1;
  const PENDING = 2;
  const UNOWNED = {
    owned: null,
    cleanups: null,
    context: null,
    owner: null
  };
  var Owner = null;
  let Transition$1 = null;
  let Listener = null;
  let Updates = null;
  let Effects = null;
  let ExecCount = 0;
  function createRoot(fn, detachedOwner) {
    const listener = Listener, owner = Owner, unowned = fn.length === 0, root = unowned ? UNOWNED : {
      owned: null,
      cleanups: null,
      context: null,
      owner: detachedOwner || owner
    }, updateFn = unowned ? fn : () => fn(() => untrack(() => cleanNode(root)));
    Owner = root;
    Listener = null;
    try {
      return runUpdates(updateFn, true);
    } finally {
      Listener = listener;
      Owner = owner;
    }
  }
  function createSignal(value, options) {
    options = options ? Object.assign({}, signalOptions, options) : signalOptions;
    const s = {
      value,
      observers: null,
      observerSlots: null,
      comparator: options.equals || void 0
    };
    const setter = (value2) => {
      if (typeof value2 === "function") {
        value2 = value2(s.value);
      }
      return writeSignal(s, value2);
    };
    return [readSignal.bind(s), setter];
  }
  function createComputed(fn, value, options) {
    const c = createComputation(fn, value, true, STALE);
    updateComputation(c);
  }
  function createRenderEffect(fn, value, options) {
    const c = createComputation(fn, value, false, STALE);
    updateComputation(c);
  }
  function createEffect(fn, value, options) {
    runEffects = runUserEffects;
    const c = createComputation(fn, value, false, STALE), s = SuspenseContext && lookup(Owner, SuspenseContext.id);
    if (s)
      c.suspense = s;
    c.user = true;
    Effects ? Effects.push(c) : updateComputation(c);
  }
  function createMemo(fn, value, options) {
    options = options ? Object.assign({}, signalOptions, options) : signalOptions;
    const c = createComputation(fn, value, true, 0);
    c.observers = null;
    c.observerSlots = null;
    c.comparator = options.equals || void 0;
    updateComputation(c);
    return readSignal.bind(c);
  }
  function batch(fn) {
    return runUpdates(fn, false);
  }
  function untrack(fn) {
    const listener = Listener;
    Listener = null;
    try {
      return fn();
    } finally {
      Listener = listener;
    }
  }
  function on(deps, fn, options) {
    const isArray = Array.isArray(deps);
    let prevInput;
    let defer = options && options.defer;
    return (prevValue) => {
      let input;
      if (isArray) {
        input = Array(deps.length);
        for (let i = 0; i < deps.length; i++)
          input[i] = deps[i]();
      } else
        input = deps();
      if (defer) {
        defer = false;
        return void 0;
      }
      const result = untrack(() => fn(input, prevInput, prevValue));
      prevInput = input;
      return result;
    };
  }
  function onMount(fn) {
    createEffect(() => untrack(fn));
  }
  function onCleanup(fn) {
    if (Owner === null)
      ;
    else if (Owner.cleanups === null)
      Owner.cleanups = [fn];
    else
      Owner.cleanups.push(fn);
    return fn;
  }
  function getListener() {
    return Listener;
  }
  function createContext(defaultValue, options) {
    const id = Symbol("context");
    return {
      id,
      Provider: createProvider(id),
      defaultValue
    };
  }
  function useContext(context) {
    let ctx;
    return (ctx = lookup(Owner, context.id)) !== void 0 ? ctx : context.defaultValue;
  }
  function children(fn) {
    const children2 = createMemo(fn);
    const memo = createMemo(() => resolveChildren(children2()));
    memo.toArray = () => {
      const c = memo();
      return Array.isArray(c) ? c : c != null ? [c] : [];
    };
    return memo;
  }
  let SuspenseContext;
  function readSignal() {
    const runningTransition = Transition$1;
    if (this.sources && (this.state || runningTransition)) {
      if (this.state === STALE || runningTransition)
        updateComputation(this);
      else {
        const updates = Updates;
        Updates = null;
        runUpdates(() => lookUpstream(this), false);
        Updates = updates;
      }
    }
    if (Listener) {
      const sSlot = this.observers ? this.observers.length : 0;
      if (!Listener.sources) {
        Listener.sources = [this];
        Listener.sourceSlots = [sSlot];
      } else {
        Listener.sources.push(this);
        Listener.sourceSlots.push(sSlot);
      }
      if (!this.observers) {
        this.observers = [Listener];
        this.observerSlots = [Listener.sources.length - 1];
      } else {
        this.observers.push(Listener);
        this.observerSlots.push(Listener.sources.length - 1);
      }
    }
    return this.value;
  }
  function writeSignal(node, value, isComp) {
    let current = node.value;
    if (!node.comparator || !node.comparator(current, value)) {
      node.value = value;
      if (node.observers && node.observers.length) {
        runUpdates(() => {
          for (let i = 0; i < node.observers.length; i += 1) {
            const o = node.observers[i];
            const TransitionRunning = Transition$1 && Transition$1.running;
            if (TransitionRunning && Transition$1.disposed.has(o))
              ;
            if (TransitionRunning && !o.tState || !TransitionRunning && !o.state) {
              if (o.pure)
                Updates.push(o);
              else
                Effects.push(o);
              if (o.observers)
                markDownstream(o);
            }
            if (TransitionRunning)
              ;
            else
              o.state = STALE;
          }
          if (Updates.length > 1e6) {
            Updates = [];
            if (false)
              ;
            throw new Error();
          }
        }, false);
      }
    }
    return value;
  }
  function updateComputation(node) {
    if (!node.fn)
      return;
    cleanNode(node);
    const owner = Owner, listener = Listener, time = ExecCount;
    Listener = Owner = node;
    runComputation(node, node.value, time);
    Listener = listener;
    Owner = owner;
  }
  function runComputation(node, value, time) {
    let nextValue;
    try {
      nextValue = node.fn(value);
    } catch (err) {
      if (node.pure) {
        {
          node.state = STALE;
          node.owned && node.owned.forEach(cleanNode);
          node.owned = null;
        }
      }
      handleError(err);
    }
    if (!node.updatedAt || node.updatedAt <= time) {
      if (node.updatedAt != null && "observers" in node) {
        writeSignal(node, nextValue);
      } else
        node.value = nextValue;
      node.updatedAt = time;
    }
  }
  function createComputation(fn, init, pure, state = STALE, options) {
    const c = {
      fn,
      state,
      updatedAt: null,
      owned: null,
      sources: null,
      sourceSlots: null,
      cleanups: null,
      value: init,
      owner: Owner,
      context: null,
      pure
    };
    if (Owner === null)
      ;
    else if (Owner !== UNOWNED) {
      {
        if (!Owner.owned)
          Owner.owned = [c];
        else
          Owner.owned.push(c);
      }
    }
    return c;
  }
  function runTop(node) {
    const runningTransition = Transition$1;
    if (node.state === 0 || runningTransition)
      return;
    if (node.state === PENDING || runningTransition)
      return lookUpstream(node);
    if (node.suspense && untrack(node.suspense.inFallback))
      return node.suspense.effects.push(node);
    const ancestors = [node];
    while ((node = node.owner) && (!node.updatedAt || node.updatedAt < ExecCount)) {
      if (node.state || runningTransition)
        ancestors.push(node);
    }
    for (let i = ancestors.length - 1; i >= 0; i--) {
      node = ancestors[i];
      if (node.state === STALE || runningTransition) {
        updateComputation(node);
      } else if (node.state === PENDING || runningTransition) {
        const updates = Updates;
        Updates = null;
        runUpdates(() => lookUpstream(node, ancestors[0]), false);
        Updates = updates;
      }
    }
  }
  function runUpdates(fn, init) {
    if (Updates)
      return fn();
    let wait = false;
    if (!init)
      Updates = [];
    if (Effects)
      wait = true;
    else
      Effects = [];
    ExecCount++;
    try {
      const res = fn();
      completeUpdates(wait);
      return res;
    } catch (err) {
      if (!Updates)
        Effects = null;
      handleError(err);
    }
  }
  function completeUpdates(wait) {
    if (Updates) {
      runQueue(Updates);
      Updates = null;
    }
    if (wait)
      return;
    const e = Effects;
    Effects = null;
    if (e.length)
      runUpdates(() => runEffects(e), false);
  }
  function runQueue(queue) {
    for (let i = 0; i < queue.length; i++)
      runTop(queue[i]);
  }
  function runUserEffects(queue) {
    let i, userLength = 0;
    for (i = 0; i < queue.length; i++) {
      const e = queue[i];
      if (!e.user)
        runTop(e);
      else
        queue[userLength++] = e;
    }
    if (sharedConfig.context)
      setHydrateContext();
    for (i = 0; i < userLength; i++)
      runTop(queue[i]);
  }
  function lookUpstream(node, ignore) {
    const runningTransition = Transition$1;
    node.state = 0;
    for (let i = 0; i < node.sources.length; i += 1) {
      const source = node.sources[i];
      if (source.sources) {
        if (source.state === STALE || runningTransition) {
          if (source !== ignore)
            runTop(source);
        } else if (source.state === PENDING || runningTransition)
          lookUpstream(source, ignore);
      }
    }
  }
  function markDownstream(node) {
    const runningTransition = Transition$1;
    for (let i = 0; i < node.observers.length; i += 1) {
      const o = node.observers[i];
      if (!o.state || runningTransition) {
        o.state = PENDING;
        if (o.pure)
          Updates.push(o);
        else
          Effects.push(o);
        o.observers && markDownstream(o);
      }
    }
  }
  function cleanNode(node) {
    let i;
    if (node.sources) {
      while (node.sources.length) {
        const source = node.sources.pop(), index = node.sourceSlots.pop(), obs = source.observers;
        if (obs && obs.length) {
          const n = obs.pop(), s = source.observerSlots.pop();
          if (index < obs.length) {
            n.sourceSlots[s] = index;
            obs[index] = n;
            source.observerSlots[index] = s;
          }
        }
      }
    }
    if (node.owned) {
      for (i = 0; i < node.owned.length; i++)
        cleanNode(node.owned[i]);
      node.owned = null;
    }
    if (node.cleanups) {
      for (i = 0; i < node.cleanups.length; i++)
        node.cleanups[i]();
      node.cleanups = null;
    }
    node.state = 0;
    node.context = null;
  }
  function castError(err) {
    if (err instanceof Error || typeof err === "string")
      return err;
    return new Error("Unknown error");
  }
  function handleError(err) {
    err = castError(err);
    throw err;
  }
  function lookup(owner, key) {
    return owner ? owner.context && owner.context[key] !== void 0 ? owner.context[key] : lookup(owner.owner, key) : void 0;
  }
  function resolveChildren(children2) {
    if (typeof children2 === "function" && !children2.length)
      return resolveChildren(children2());
    if (Array.isArray(children2)) {
      const results = [];
      for (let i = 0; i < children2.length; i++) {
        const result = resolveChildren(children2[i]);
        Array.isArray(result) ? results.push.apply(results, result) : results.push(result);
      }
      return results;
    }
    return children2;
  }
  function createProvider(id, options) {
    return function provider(props) {
      let res;
      createRenderEffect(() => res = untrack(() => {
        Owner.context = {
          [id]: props.value
        };
        return children(() => props.children);
      }), void 0);
      return res;
    };
  }
  const FALLBACK = Symbol("fallback");
  function dispose(d) {
    for (let i = 0; i < d.length; i++)
      d[i]();
  }
  function mapArray(list, mapFn, options = {}) {
    let items = [], mapped = [], disposers = [], len = 0, indexes = mapFn.length > 1 ? [] : null;
    onCleanup(() => dispose(disposers));
    return () => {
      let newItems = list() || [], i, j;
      newItems[$TRACK];
      return untrack(() => {
        let newLen = newItems.length, newIndices, newIndicesNext, temp, tempdisposers, tempIndexes, start, end, newEnd, item;
        if (newLen === 0) {
          if (len !== 0) {
            dispose(disposers);
            disposers = [];
            items = [];
            mapped = [];
            len = 0;
            indexes && (indexes = []);
          }
          if (options.fallback) {
            items = [FALLBACK];
            mapped[0] = createRoot((disposer) => {
              disposers[0] = disposer;
              return options.fallback();
            });
            len = 1;
          }
        } else if (len === 0) {
          mapped = new Array(newLen);
          for (j = 0; j < newLen; j++) {
            items[j] = newItems[j];
            mapped[j] = createRoot(mapper);
          }
          len = newLen;
        } else {
          temp = new Array(newLen);
          tempdisposers = new Array(newLen);
          indexes && (tempIndexes = new Array(newLen));
          for (start = 0, end = Math.min(len, newLen); start < end && items[start] === newItems[start]; start++)
            ;
          for (end = len - 1, newEnd = newLen - 1; end >= start && newEnd >= start && items[end] === newItems[newEnd]; end--, newEnd--) {
            temp[newEnd] = mapped[end];
            tempdisposers[newEnd] = disposers[end];
            indexes && (tempIndexes[newEnd] = indexes[end]);
          }
          newIndices = /* @__PURE__ */ new Map();
          newIndicesNext = new Array(newEnd + 1);
          for (j = newEnd; j >= start; j--) {
            item = newItems[j];
            i = newIndices.get(item);
            newIndicesNext[j] = i === void 0 ? -1 : i;
            newIndices.set(item, j);
          }
          for (i = start; i <= end; i++) {
            item = items[i];
            j = newIndices.get(item);
            if (j !== void 0 && j !== -1) {
              temp[j] = mapped[i];
              tempdisposers[j] = disposers[i];
              indexes && (tempIndexes[j] = indexes[i]);
              j = newIndicesNext[j];
              newIndices.set(item, j);
            } else
              disposers[i]();
          }
          for (j = start; j < newLen; j++) {
            if (j in temp) {
              mapped[j] = temp[j];
              disposers[j] = tempdisposers[j];
              if (indexes) {
                indexes[j] = tempIndexes[j];
                indexes[j](j);
              }
            } else
              mapped[j] = createRoot(mapper);
          }
          mapped = mapped.slice(0, len = newLen);
          items = newItems.slice(0);
        }
        return mapped;
      });
      function mapper(disposer) {
        disposers[j] = disposer;
        if (indexes) {
          const [s, set] = createSignal(j);
          indexes[j] = set;
          return mapFn(newItems[j], s);
        }
        return mapFn(newItems[j]);
      }
    };
  }
  function createComponent(Comp, props) {
    return untrack(() => Comp(props || {}));
  }
  function trueFn() {
    return true;
  }
  const propTraps = {
    get(_, property, receiver) {
      if (property === $PROXY)
        return receiver;
      return _.get(property);
    },
    has(_, property) {
      if (property === $PROXY)
        return true;
      return _.has(property);
    },
    set: trueFn,
    deleteProperty: trueFn,
    getOwnPropertyDescriptor(_, property) {
      return {
        configurable: true,
        enumerable: true,
        get() {
          return _.get(property);
        },
        set: trueFn,
        deleteProperty: trueFn
      };
    },
    ownKeys(_) {
      return _.keys();
    }
  };
  function resolveSource(s) {
    return !(s = typeof s === "function" ? s() : s) ? {} : s;
  }
  function mergeProps(...sources) {
    let proxy = false;
    for (let i = 0; i < sources.length; i++) {
      const s = sources[i];
      proxy = proxy || !!s && $PROXY in s;
      sources[i] = typeof s === "function" ? (proxy = true, createMemo(s)) : s;
    }
    if (proxy) {
      return new Proxy({
        get(property) {
          for (let i = sources.length - 1; i >= 0; i--) {
            const v = resolveSource(sources[i])[property];
            if (v !== void 0)
              return v;
          }
        },
        has(property) {
          for (let i = sources.length - 1; i >= 0; i--) {
            if (property in resolveSource(sources[i]))
              return true;
          }
          return false;
        },
        keys() {
          const keys = [];
          for (let i = 0; i < sources.length; i++)
            keys.push(...Object.keys(resolveSource(sources[i])));
          return [...new Set(keys)];
        }
      }, propTraps);
    }
    const target = {};
    for (let i = sources.length - 1; i >= 0; i--) {
      if (sources[i]) {
        const descriptors = Object.getOwnPropertyDescriptors(sources[i]);
        for (const key in descriptors) {
          if (key in target)
            continue;
          Object.defineProperty(target, key, {
            enumerable: true,
            get() {
              for (let i2 = sources.length - 1; i2 >= 0; i2--) {
                const v = (sources[i2] || {})[key];
                if (v !== void 0)
                  return v;
              }
            }
          });
        }
      }
    }
    return target;
  }
  function splitProps(props, ...keys) {
    const blocked = new Set(keys.flat());
    if ($PROXY in props) {
      const res = keys.map((k) => {
        return new Proxy({
          get(property) {
            return k.includes(property) ? props[property] : void 0;
          },
          has(property) {
            return k.includes(property) && property in props;
          },
          keys() {
            return k.filter((property) => property in props);
          }
        }, propTraps);
      });
      res.push(new Proxy({
        get(property) {
          return blocked.has(property) ? void 0 : props[property];
        },
        has(property) {
          return blocked.has(property) ? false : property in props;
        },
        keys() {
          return Object.keys(props).filter((k) => !blocked.has(k));
        }
      }, propTraps));
      return res;
    }
    const descriptors = Object.getOwnPropertyDescriptors(props);
    keys.push(Object.keys(descriptors).filter((k) => !blocked.has(k)));
    return keys.map((k) => {
      const clone = {};
      for (let i = 0; i < k.length; i++) {
        const key = k[i];
        if (!(key in props))
          continue;
        Object.defineProperty(clone, key, descriptors[key] ? descriptors[key] : {
          get() {
            return props[key];
          },
          set() {
            return true;
          },
          enumerable: true
        });
      }
      return clone;
    });
  }
  let counter = 0;
  function createUniqueId$1() {
    const ctx = sharedConfig.context;
    return ctx ? `${ctx.id}${ctx.count++}` : `cl-${counter++}`;
  }
  function Show(props) {
    let strictEqual = false;
    const keyed = props.keyed;
    const condition = createMemo(() => props.when, void 0, {
      equals: (a, b) => strictEqual ? a === b : !a === !b
    });
    return createMemo(() => {
      const c = condition();
      if (c) {
        const child = props.children;
        const fn = typeof child === "function" && child.length > 0;
        strictEqual = keyed || fn;
        return fn ? untrack(() => child(c)) : child;
      }
      return props.fallback;
    }, void 0, void 0);
  }
  const booleans = ["allowfullscreen", "async", "autofocus", "autoplay", "checked", "controls", "default", "disabled", "formnovalidate", "hidden", "indeterminate", "ismap", "loop", "multiple", "muted", "nomodule", "novalidate", "open", "playsinline", "readonly", "required", "reversed", "seamless", "selected"];
  const Properties = /* @__PURE__ */ new Set(["className", "value", "readOnly", "formNoValidate", "isMap", "noModule", "playsInline", ...booleans]);
  const ChildProperties = /* @__PURE__ */ new Set(["innerHTML", "textContent", "innerText", "children"]);
  const Aliases = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(null), {
    className: "class",
    htmlFor: "for"
  });
  const PropAliases = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(null), {
    class: "className",
    formnovalidate: "formNoValidate",
    ismap: "isMap",
    nomodule: "noModule",
    playsinline: "playsInline",
    readonly: "readOnly"
  });
  const DelegatedEvents = /* @__PURE__ */ new Set(["beforeinput", "click", "dblclick", "contextmenu", "focusin", "focusout", "input", "keydown", "keyup", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "pointerdown", "pointermove", "pointerout", "pointerover", "pointerup", "touchend", "touchmove", "touchstart"]);
  const SVGElements = /* @__PURE__ */ new Set([
    "altGlyph",
    "altGlyphDef",
    "altGlyphItem",
    "animate",
    "animateColor",
    "animateMotion",
    "animateTransform",
    "circle",
    "clipPath",
    "color-profile",
    "cursor",
    "defs",
    "desc",
    "ellipse",
    "feBlend",
    "feColorMatrix",
    "feComponentTransfer",
    "feComposite",
    "feConvolveMatrix",
    "feDiffuseLighting",
    "feDisplacementMap",
    "feDistantLight",
    "feFlood",
    "feFuncA",
    "feFuncB",
    "feFuncG",
    "feFuncR",
    "feGaussianBlur",
    "feImage",
    "feMerge",
    "feMergeNode",
    "feMorphology",
    "feOffset",
    "fePointLight",
    "feSpecularLighting",
    "feSpotLight",
    "feTile",
    "feTurbulence",
    "filter",
    "font",
    "font-face",
    "font-face-format",
    "font-face-name",
    "font-face-src",
    "font-face-uri",
    "foreignObject",
    "g",
    "glyph",
    "glyphRef",
    "hkern",
    "image",
    "line",
    "linearGradient",
    "marker",
    "mask",
    "metadata",
    "missing-glyph",
    "mpath",
    "path",
    "pattern",
    "polygon",
    "polyline",
    "radialGradient",
    "rect",
    "set",
    "stop",
    "svg",
    "switch",
    "symbol",
    "text",
    "textPath",
    "tref",
    "tspan",
    "use",
    "view",
    "vkern"
  ]);
  const SVGNamespace = {
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace"
  };
  function reconcileArrays(parentNode, a, b) {
    let bLength = b.length, aEnd = a.length, bEnd = bLength, aStart = 0, bStart = 0, after = a[aEnd - 1].nextSibling, map = null;
    while (aStart < aEnd || bStart < bEnd) {
      if (a[aStart] === b[bStart]) {
        aStart++;
        bStart++;
        continue;
      }
      while (a[aEnd - 1] === b[bEnd - 1]) {
        aEnd--;
        bEnd--;
      }
      if (aEnd === aStart) {
        const node = bEnd < bLength ? bStart ? b[bStart - 1].nextSibling : b[bEnd - bStart] : after;
        while (bStart < bEnd)
          parentNode.insertBefore(b[bStart++], node);
      } else if (bEnd === bStart) {
        while (aStart < aEnd) {
          if (!map || !map.has(a[aStart]))
            a[aStart].remove();
          aStart++;
        }
      } else if (a[aStart] === b[bEnd - 1] && b[bStart] === a[aEnd - 1]) {
        const node = a[--aEnd].nextSibling;
        parentNode.insertBefore(b[bStart++], a[aStart++].nextSibling);
        parentNode.insertBefore(b[--bEnd], node);
        a[aEnd] = b[bEnd];
      } else {
        if (!map) {
          map = /* @__PURE__ */ new Map();
          let i = bStart;
          while (i < bEnd)
            map.set(b[i], i++);
        }
        const index = map.get(a[aStart]);
        if (index != null) {
          if (bStart < index && index < bEnd) {
            let i = aStart, sequence = 1, t;
            while (++i < aEnd && i < bEnd) {
              if ((t = map.get(a[i])) == null || t !== index + sequence)
                break;
              sequence++;
            }
            if (sequence > index - bStart) {
              const node = a[aStart];
              while (bStart < index)
                parentNode.insertBefore(b[bStart++], node);
            } else
              parentNode.replaceChild(b[bStart++], a[aStart++]);
          } else
            aStart++;
        } else
          a[aStart++].remove();
      }
    }
  }
  const $$EVENTS = "_$DX_DELEGATE";
  function render$1(code, element, init, options = {}) {
    let disposer;
    createRoot((dispose2) => {
      disposer = dispose2;
      element === document ? code() : insert(element, code(), element.firstChild ? null : void 0, init);
    }, options.owner);
    return () => {
      disposer();
      element.textContent = "";
    };
  }
  function template(html, check, isSVG) {
    const t = document.createElement("template");
    t.innerHTML = html;
    let node = t.content.firstChild;
    if (isSVG)
      node = node.firstChild;
    return node;
  }
  function delegateEvents(eventNames, document2 = window.document) {
    const e = document2[$$EVENTS] || (document2[$$EVENTS] = /* @__PURE__ */ new Set());
    for (let i = 0, l = eventNames.length; i < l; i++) {
      const name = eventNames[i];
      if (!e.has(name)) {
        e.add(name);
        document2.addEventListener(name, eventHandler);
      }
    }
  }
  function setAttribute(node, name, value) {
    if (value == null)
      node.removeAttribute(name);
    else
      node.setAttribute(name, value);
  }
  function setAttributeNS(node, namespace, name, value) {
    if (value == null)
      node.removeAttributeNS(namespace, name);
    else
      node.setAttributeNS(namespace, name, value);
  }
  function className(node, value) {
    if (value == null)
      node.removeAttribute("class");
    else
      node.className = value;
  }
  function addEventListener(node, name, handler, delegate) {
    if (delegate) {
      if (Array.isArray(handler)) {
        node[`$$${name}`] = handler[0];
        node[`$$${name}Data`] = handler[1];
      } else
        node[`$$${name}`] = handler;
    } else if (Array.isArray(handler)) {
      const handlerFn = handler[0];
      node.addEventListener(name, handler[0] = (e) => handlerFn.call(node, handler[1], e));
    } else
      node.addEventListener(name, handler);
  }
  function classList(node, value, prev = {}) {
    const classKeys = Object.keys(value || {}), prevKeys = Object.keys(prev);
    let i, len;
    for (i = 0, len = prevKeys.length; i < len; i++) {
      const key = prevKeys[i];
      if (!key || key === "undefined" || value[key])
        continue;
      toggleClassKey(node, key, false);
      delete prev[key];
    }
    for (i = 0, len = classKeys.length; i < len; i++) {
      const key = classKeys[i], classValue = !!value[key];
      if (!key || key === "undefined" || prev[key] === classValue || !classValue)
        continue;
      toggleClassKey(node, key, true);
      prev[key] = classValue;
    }
    return prev;
  }
  function style(node, value, prev) {
    if (!value)
      return prev ? setAttribute(node, "style") : value;
    const nodeStyle = node.style;
    if (typeof value === "string")
      return nodeStyle.cssText = value;
    typeof prev === "string" && (nodeStyle.cssText = prev = void 0);
    prev || (prev = {});
    value || (value = {});
    let v, s;
    for (s in prev) {
      value[s] == null && nodeStyle.removeProperty(s);
      delete prev[s];
    }
    for (s in value) {
      v = value[s];
      if (v !== prev[s]) {
        nodeStyle.setProperty(s, v);
        prev[s] = v;
      }
    }
    return prev;
  }
  function spread(node, props = {}, isSVG, skipChildren) {
    const prevProps = {};
    if (!skipChildren) {
      createRenderEffect(() => prevProps.children = insertExpression(node, props.children, prevProps.children));
    }
    createRenderEffect(() => props.ref && props.ref(node));
    createRenderEffect(() => assign(node, props, isSVG, true, prevProps, true));
    return prevProps;
  }
  function insert(parent, accessor, marker, initial) {
    if (marker !== void 0 && !initial)
      initial = [];
    if (typeof accessor !== "function")
      return insertExpression(parent, accessor, initial, marker);
    createRenderEffect((current) => insertExpression(parent, accessor(), current, marker), initial);
  }
  function assign(node, props, isSVG, skipChildren, prevProps = {}, skipRef = false) {
    props || (props = {});
    for (const prop2 in prevProps) {
      if (!(prop2 in props)) {
        if (prop2 === "children")
          continue;
        prevProps[prop2] = assignProp(node, prop2, null, prevProps[prop2], isSVG, skipRef);
      }
    }
    for (const prop2 in props) {
      if (prop2 === "children") {
        if (!skipChildren)
          insertExpression(node, props.children);
        continue;
      }
      const value = props[prop2];
      prevProps[prop2] = assignProp(node, prop2, value, prevProps[prop2], isSVG, skipRef);
    }
  }
  function getNextElement(template2) {
    let node, key;
    if (!sharedConfig.context || !(node = sharedConfig.registry.get(key = getHydrationKey()))) {
      return template2.cloneNode(true);
    }
    if (sharedConfig.completed)
      sharedConfig.completed.add(node);
    sharedConfig.registry.delete(key);
    return node;
  }
  function toPropertyName(name) {
    return name.toLowerCase().replace(/-([a-z])/g, (_, w) => w.toUpperCase());
  }
  function toggleClassKey(node, key, value) {
    const classNames = key.trim().split(/\s+/);
    for (let i = 0, nameLen = classNames.length; i < nameLen; i++)
      node.classList.toggle(classNames[i], value);
  }
  function assignProp(node, prop2, value, prev, isSVG, skipRef) {
    let isCE, isProp, isChildProp;
    if (prop2 === "style")
      return style(node, value, prev);
    if (prop2 === "classList")
      return classList(node, value, prev);
    if (value === prev)
      return prev;
    if (prop2 === "ref") {
      if (!skipRef)
        value(node);
    } else if (prop2.slice(0, 3) === "on:") {
      const e = prop2.slice(3);
      prev && node.removeEventListener(e, prev);
      value && node.addEventListener(e, value);
    } else if (prop2.slice(0, 10) === "oncapture:") {
      const e = prop2.slice(10);
      prev && node.removeEventListener(e, prev, true);
      value && node.addEventListener(e, value, true);
    } else if (prop2.slice(0, 2) === "on") {
      const name = prop2.slice(2).toLowerCase();
      const delegate = DelegatedEvents.has(name);
      if (!delegate && prev) {
        const h = Array.isArray(prev) ? prev[0] : prev;
        node.removeEventListener(name, h);
      }
      if (delegate || value) {
        addEventListener(node, name, value, delegate);
        delegate && delegateEvents([name]);
      }
    } else if ((isChildProp = ChildProperties.has(prop2)) || !isSVG && (PropAliases[prop2] || (isProp = Properties.has(prop2))) || (isCE = node.nodeName.includes("-"))) {
      if (prop2 === "class" || prop2 === "className")
        className(node, value);
      else if (isCE && !isProp && !isChildProp)
        node[toPropertyName(prop2)] = value;
      else
        node[PropAliases[prop2] || prop2] = value;
    } else {
      const ns = isSVG && prop2.indexOf(":") > -1 && SVGNamespace[prop2.split(":")[0]];
      if (ns)
        setAttributeNS(node, ns, prop2, value);
      else
        setAttribute(node, Aliases[prop2] || prop2, value);
    }
    return value;
  }
  function eventHandler(e) {
    const key = `$$${e.type}`;
    let node = e.composedPath && e.composedPath()[0] || e.target;
    if (e.target !== node) {
      Object.defineProperty(e, "target", {
        configurable: true,
        value: node
      });
    }
    Object.defineProperty(e, "currentTarget", {
      configurable: true,
      get() {
        return node || document;
      }
    });
    if (sharedConfig.registry && !sharedConfig.done) {
      sharedConfig.done = true;
      document.querySelectorAll("[id^=pl-]").forEach((elem) => {
        while (elem && elem.nodeType !== 8 && elem.nodeValue !== "pl-" + e) {
          let x = elem.nextSibling;
          elem.remove();
          elem = x;
        }
        elem && elem.remove();
      });
    }
    while (node) {
      const handler = node[key];
      if (handler && !node.disabled) {
        const data = node[`${key}Data`];
        data !== void 0 ? handler.call(node, data, e) : handler.call(node, e);
        if (e.cancelBubble)
          return;
      }
      node = node._$host || node.parentNode || node.host;
    }
  }
  function insertExpression(parent, value, current, marker, unwrapArray) {
    if (sharedConfig.context && !current)
      current = [...parent.childNodes];
    while (typeof current === "function")
      current = current();
    if (value === current)
      return current;
    const t = typeof value, multi = marker !== void 0;
    parent = multi && current[0] && current[0].parentNode || parent;
    if (t === "string" || t === "number") {
      if (sharedConfig.context)
        return current;
      if (t === "number")
        value = value.toString();
      if (multi) {
        let node = current[0];
        if (node && node.nodeType === 3) {
          node.data = value;
        } else
          node = document.createTextNode(value);
        current = cleanChildren(parent, current, marker, node);
      } else {
        if (current !== "" && typeof current === "string") {
          current = parent.firstChild.data = value;
        } else
          current = parent.textContent = value;
      }
    } else if (value == null || t === "boolean") {
      if (sharedConfig.context)
        return current;
      current = cleanChildren(parent, current, marker);
    } else if (t === "function") {
      createRenderEffect(() => {
        let v = value();
        while (typeof v === "function")
          v = v();
        current = insertExpression(parent, v, current, marker);
      });
      return () => current;
    } else if (Array.isArray(value)) {
      const array = [];
      const currentArray = current && Array.isArray(current);
      if (normalizeIncomingArray(array, value, current, unwrapArray)) {
        createRenderEffect(() => current = insertExpression(parent, array, current, marker, true));
        return () => current;
      }
      if (sharedConfig.context) {
        if (!array.length)
          return current;
        for (let i = 0; i < array.length; i++) {
          if (array[i].parentNode)
            return current = array;
        }
      }
      if (array.length === 0) {
        current = cleanChildren(parent, current, marker);
        if (multi)
          return current;
      } else if (currentArray) {
        if (current.length === 0) {
          appendNodes(parent, array, marker);
        } else
          reconcileArrays(parent, current, array);
      } else {
        current && cleanChildren(parent);
        appendNodes(parent, array);
      }
      current = array;
    } else if (value instanceof Node) {
      if (sharedConfig.context && value.parentNode)
        return current = multi ? [value] : value;
      if (Array.isArray(current)) {
        if (multi)
          return current = cleanChildren(parent, current, marker, value);
        cleanChildren(parent, current, null, value);
      } else if (current == null || current === "" || !parent.firstChild) {
        parent.appendChild(value);
      } else
        parent.replaceChild(value, parent.firstChild);
      current = value;
    } else
      ;
    return current;
  }
  function normalizeIncomingArray(normalized, array, current, unwrap2) {
    let dynamic = false;
    for (let i = 0, len = array.length; i < len; i++) {
      let item = array[i], prev = current && current[i];
      if (item instanceof Node) {
        normalized.push(item);
      } else if (item == null || item === true || item === false)
        ;
      else if (Array.isArray(item)) {
        dynamic = normalizeIncomingArray(normalized, item, prev) || dynamic;
      } else if (typeof item === "function") {
        if (unwrap2) {
          while (typeof item === "function")
            item = item();
          dynamic = normalizeIncomingArray(normalized, Array.isArray(item) ? item : [item], Array.isArray(prev) ? prev : [prev]) || dynamic;
        } else {
          normalized.push(item);
          dynamic = true;
        }
      } else {
        const value = String(item);
        if (prev && prev.nodeType === 3 && prev.data === value) {
          normalized.push(prev);
        } else
          normalized.push(document.createTextNode(value));
      }
    }
    return dynamic;
  }
  function appendNodes(parent, array, marker = null) {
    for (let i = 0, len = array.length; i < len; i++)
      parent.insertBefore(array[i], marker);
  }
  function cleanChildren(parent, current, marker, replacement) {
    if (marker === void 0)
      return parent.textContent = "";
    const node = replacement || document.createTextNode("");
    if (current.length) {
      let inserted = false;
      for (let i = current.length - 1; i >= 0; i--) {
        const el = current[i];
        if (node !== el) {
          const isParent = el.parentNode === parent;
          if (!inserted && !i)
            isParent ? parent.replaceChild(node, el) : parent.insertBefore(node, marker);
          else
            isParent && el.remove();
        } else
          inserted = true;
      }
    } else
      parent.insertBefore(node, marker);
    return [node];
  }
  function getHydrationKey() {
    const hydrate = sharedConfig.context;
    return `${hydrate.id}${hydrate.count++}`;
  }
  const isServer = false;
  const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
  function createElement$1(tagName, isSVG = false) {
    return isSVG ? document.createElementNS(SVG_NAMESPACE, tagName) : document.createElement(tagName);
  }
  function Portal$1(props) {
    const {
      useShadow
    } = props, marker = document.createTextNode(""), mount = props.mount || document.body;
    function renderPortal() {
      if (sharedConfig.context) {
        const [s, set] = createSignal(false);
        queueMicrotask(() => set(true));
        return () => s() && props.children;
      } else
        return () => props.children;
    }
    if (mount instanceof HTMLHeadElement) {
      const [clean, setClean] = createSignal(false);
      const cleanup = () => setClean(true);
      createRoot((dispose2) => insert(mount, () => !clean() ? renderPortal()() : dispose2(), null));
      onCleanup(() => {
        if (sharedConfig.context)
          queueMicrotask(cleanup);
        else
          cleanup();
      });
    } else {
      const container = createElement$1(props.isSVG ? "g" : "div", props.isSVG), renderRoot = useShadow && container.attachShadow ? container.attachShadow({
        mode: "open"
      }) : container;
      Object.defineProperty(container, "_$host", {
        get() {
          return marker.parentNode;
        },
        configurable: true
      });
      insert(renderRoot, renderPortal());
      mount.appendChild(container);
      props.ref && props.ref(container);
      onCleanup(() => mount.removeChild(container));
    }
    return marker;
  }
  function Dynamic$1(props) {
    const [p, others] = splitProps(props, ["component"]);
    const cached = createMemo(() => p.component);
    return createMemo(() => {
      const component = cached();
      switch (typeof component) {
        case "function":
          return untrack(() => component(others));
        case "string":
          const isSvg = SVGElements.has(component);
          const el = sharedConfig.context ? getNextElement() : createElement$1(component, isSvg);
          spread(el, others, isSvg);
          return el;
      }
    });
  }
  function clamp(value, min = 0, max = 1) {
    return Math.min(Math.max(min, value), max);
  }
  function hexToRgb(color) {
    color = color.substr(1);
    const re = new RegExp(`.{1,${color.length >= 6 ? 2 : 1}}`, "g");
    let colors = color.match(re);
    if (colors && colors[0].length === 1) {
      colors = colors.map((n) => n + n);
    }
    return colors ? `rgb${colors.length === 4 ? "a" : ""}(${colors.map((n, index) => {
      return index < 3 ? parseInt(n, 16) : Math.round(parseInt(n, 16) / 255 * 1e3) / 1e3;
    }).join(", ")})` : "";
  }
  function decomposeColor(color) {
    if (typeof color !== "string") {
      return color;
    }
    if (color.charAt(0) === "#") {
      return decomposeColor(hexToRgb(color));
    }
    const marker = color.indexOf("(");
    const type = color.substring(0, marker);
    if (["rgb", "rgba", "hsl", "hsla", "color"].indexOf(type) === -1) {
      throw new Error("MUI: Unsupported `%s` color.\nThe following formats are supported: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla(), color(). " + color);
    }
    const valuesInput = color.substring(marker + 1, color.length - 1);
    let values;
    let colorSpace;
    if (type === "color") {
      values = valuesInput.split(" ");
      colorSpace = values.shift();
      if (values.length === 4 && values[3].charAt(0) === "/") {
        values[3] = values[3].substr(1);
      }
      if (["srgb", "display-p3", "a98-rgb", "prophoto-rgb", "rec-2020"].indexOf(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        colorSpace
      ) === -1) {
        throw new Error("MUI: unsupported `%s` color space.\nThe following color spaces are supported: srgb, display-p3, a98-rgb, prophoto-rgb, rec-2020. " + colorSpace);
      }
    } else {
      values = valuesInput.split(",");
    }
    return { type, values: values.map((value) => parseFloat(value)), colorSpace };
  }
  function recomposeColor(color) {
    const { type, colorSpace } = color;
    const { values } = color;
    let newValues;
    if (type.indexOf("rgb") !== -1) {
      newValues = values.map((n, i) => i < 3 ? parseInt(n.toString(), 10) : n).join(",");
    } else if (type.indexOf("hsl") !== -1) {
      newValues = values.map((n, i) => i === 1 || i === 2 ? `${n}%` : n).join(",");
    }
    if (type.indexOf("color") !== -1) {
      newValues = `${colorSpace} ${values.join(" ")}`;
    } else {
      newValues = `${values.join(", ")}`;
    }
    return `${type}(${newValues})`;
  }
  function hslToRgb(color) {
    const c = decomposeColor(color);
    const { values } = c;
    const h = values[0];
    const s = values[1] / 100;
    const l = values[2] / 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n, k = (n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    let type = "rgb";
    const rgb = [
      Math.round(f(0) * 255),
      Math.round(f(8) * 255),
      Math.round(f(4) * 255)
    ];
    if (c.type === "hsla") {
      type += "a";
      rgb.push(values[3]);
    }
    return recomposeColor({ type, values: rgb });
  }
  function getLuminance(color) {
    const { type, values } = decomposeColor(color);
    let rgb = type === "hsl" ? decomposeColor(hslToRgb(color)).values : values;
    rgb = rgb.map((val) => {
      if (type !== "color") {
        val /= 255;
      }
      return val <= 0.03928 ? val / 12.92 : ((val + 0.055) / 1.055) ** 2.4;
    });
    return Number((0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]).toFixed(3));
  }
  function getContrastRatio(foreground, background) {
    const lumA = getLuminance(foreground);
    const lumB = getLuminance(background);
    return (Math.max(lumA, lumB) + 0.05) / (Math.min(lumA, lumB) + 0.05);
  }
  function alpha(color, value) {
    let { type, values } = decomposeColor(color);
    value = clamp(value);
    if (type === "rgb" || type === "hsl") {
      type += "a";
    }
    if (type === "color") {
      values[3] = `/${value}`;
    } else {
      values[3] = value;
    }
    return recomposeColor({ type, values });
  }
  function darken(inputColor, coefficient) {
    const color = decomposeColor(inputColor);
    coefficient = clamp(coefficient);
    if (color.type.indexOf("hsl") !== -1) {
      color.values[2] *= 1 - coefficient;
    } else if (color.type.indexOf("rgb") !== -1 || color.type.indexOf("color") !== -1) {
      for (let i = 0; i < 3; i += 1) {
        color.values[i] *= 1 - coefficient;
      }
    }
    return recomposeColor(color);
  }
  function lighten(inputColor, coefficient) {
    const color = decomposeColor(inputColor);
    coefficient = clamp(coefficient);
    if (color.type.indexOf("hsl") !== -1) {
      color.values[2] += (100 - color.values[2]) * coefficient;
    } else if (color.type.indexOf("rgb") !== -1) {
      for (let i = 0; i < 3; i += 1) {
        color.values[i] += (255 - color.values[i]) * coefficient;
      }
    } else if (color.type.indexOf("color") !== -1) {
      for (let i = 0; i < 3; i += 1) {
        color.values[i] += (1 - color.values[i]) * coefficient;
      }
    }
    return recomposeColor(color);
  }
  const StyledEngineContext = createContext({});
  function isPlainObject(item) {
    return item !== null && typeof item === "object" && item.constructor === Object;
  }
  function sortKeys(object, keys) {
    for (const key of keys) {
      const value = object[key];
      delete object[key];
      object[key] = value;
    }
  }
  function deepmerge(target, source, options = { clone: true }) {
    const output = options.clone ? { ...target } : target;
    if (isPlainObject(target) && isPlainObject(source)) {
      Object.keys(source).forEach((key) => {
        if (key === "__proto__") {
          return;
        }
        if (isPlainObject(source[key]) && key in target && isPlainObject(target[key])) {
          output[key] = deepmerge(target[key], source[key], options);
        } else {
          output[key] = source[key];
        }
      });
      if (options.sortKeys)
        sortKeys(output, Object.keys(source));
    }
    return output;
  }
  function cloneObject(target) {
    if (Array.isArray(target)) {
      const output = [];
      for (const value of target) {
        output.push(cloneObject(value));
      }
      return output;
    } else if (isPlainObject(target)) {
      const output = {};
      for (const key in target) {
        if (key === "__proto__") {
          continue;
        }
        output[key] = cloneObject(target[key]);
      }
      return output;
    } else {
      return target;
    }
  }
  function merge(target, ...sources) {
    for (const source of sources)
      deepmerge(target, cloneObject(source), {
        clone: false
      });
    return target;
  }
  const componentsDefault = createComponentsOptions({});
  function createComponentsOptions(options) {
    return options;
  }
  function createComponents(data) {
    const result = {
      ...merge({}, componentsDefault, data ?? {})
    };
    return result;
  }
  function createMixins(breakpoints, spacing = void 0, mixins = {}) {
    return {
      toolbar: {
        minHeight: 56,
        [`${breakpoints.up("xs")} and (orientation: landscape)`]: {
          minHeight: 48
        },
        [breakpoints.up("sm")]: {
          minHeight: 64
        }
      },
      ...mixins
    };
  }
  const common = {
    black: "#000",
    white: "#fff"
  };
  const red = {
    50: "#ffebee",
    100: "#ffcdd2",
    200: "#ef9a9a",
    300: "#e57373",
    400: "#ef5350",
    500: "#f44336",
    600: "#e53935",
    700: "#d32f2f",
    800: "#c62828",
    900: "#b71c1c",
    A100: "#ff8a80",
    A200: "#ff5252",
    A400: "#ff1744",
    A700: "#d50000"
  };
  const purple = {
    50: "#f3e5f5",
    100: "#e1bee7",
    200: "#ce93d8",
    300: "#ba68c8",
    400: "#ab47bc",
    500: "#9c27b0",
    600: "#8e24aa",
    700: "#7b1fa2",
    800: "#6a1b9a",
    900: "#4a148c",
    A100: "#ea80fc",
    A200: "#e040fb",
    A400: "#d500f9",
    A700: "#aa00ff"
  };
  const blue = {
    50: "#e3f2fd",
    100: "#bbdefb",
    200: "#90caf9",
    300: "#64b5f6",
    400: "#42a5f5",
    500: "#2196f3",
    600: "#1e88e5",
    700: "#1976d2",
    800: "#1565c0",
    900: "#0d47a1",
    A100: "#82b1ff",
    A200: "#448aff",
    A400: "#2979ff",
    A700: "#2962ff"
  };
  const lightBlue = {
    50: "#e1f5fe",
    100: "#b3e5fc",
    200: "#81d4fa",
    300: "#4fc3f7",
    400: "#29b6f6",
    500: "#03a9f4",
    600: "#039be5",
    700: "#0288d1",
    800: "#0277bd",
    900: "#01579b",
    A100: "#80d8ff",
    A200: "#40c4ff",
    A400: "#00b0ff",
    A700: "#0091ea"
  };
  const green = {
    50: "#e8f5e9",
    100: "#c8e6c9",
    200: "#a5d6a7",
    300: "#81c784",
    400: "#66bb6a",
    500: "#4caf50",
    600: "#43a047",
    700: "#388e3c",
    800: "#2e7d32",
    900: "#1b5e20",
    A100: "#b9f6ca",
    A200: "#69f0ae",
    A400: "#00e676",
    A700: "#00c853"
  };
  const orange = {
    50: "#fff3e0",
    100: "#ffe0b2",
    200: "#ffcc80",
    300: "#ffb74d",
    400: "#ffa726",
    500: "#ff9800",
    600: "#fb8c00",
    700: "#f57c00",
    800: "#ef6c00",
    900: "#e65100",
    A100: "#ffd180",
    A200: "#ffab40",
    A400: "#ff9100",
    A700: "#ff6d00"
  };
  const grey = {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#eeeeee",
    300: "#e0e0e0",
    400: "#bdbdbd",
    500: "#9e9e9e",
    600: "#757575",
    700: "#616161",
    800: "#424242",
    900: "#212121",
    A100: "#f5f5f5",
    A200: "#eeeeee",
    A400: "#bdbdbd",
    A700: "#616161"
  };
  const useLightOptions = () => ({
    text: {
      primary: "rgba(0, 0, 0, 0.87)",
      secondary: "rgba(0, 0, 0, 0.6)",
      disabled: "rgba(0, 0, 0, 0.38)"
    },
    divider: "rgba(0, 0, 0, 0.12)",
    background: {
      paper: common.white,
      default: common.white
    },
    action: {
      active: "rgba(0, 0, 0, 0.54)",
      hover: "rgba(0, 0, 0, 0.04)",
      hoverOpacity: 0.04,
      selected: "rgba(0, 0, 0, 0.08)",
      selectedOpacity: 0.08,
      disabled: "rgba(0, 0, 0, 0.26)",
      disabledBackground: "rgba(0, 0, 0, 0.12)",
      disabledOpacity: 0.38,
      focus: "rgba(0, 0, 0, 0.12)",
      focusOpacity: 0.12,
      activatedOpacity: 0.12
    }
  });
  const lightColors = {
    primary: {
      main: blue[700],
      light: blue[400],
      dark: blue[800]
    },
    secondary: {
      main: purple[500],
      light: purple[300],
      dark: purple[700]
    },
    error: {
      main: red[700],
      light: red[400],
      dark: red[800]
    },
    info: {
      main: lightBlue[700],
      light: lightBlue[800],
      dark: lightBlue[900]
    },
    success: {
      main: green[800],
      light: green[500],
      dark: green[900]
    },
    warning: {
      main: "#ED6C02",
      light: orange[500],
      dark: orange[900]
    }
  };
  const useDarkOptions = () => ({
    text: {
      primary: common.white,
      secondary: "rgba(255, 255, 255, 0.7)",
      disabled: "rgba(255, 255, 255, 0.5)"
    },
    divider: "rgba(255, 255, 255, 0.12)",
    background: {
      paper: "#121212",
      default: "#121212"
    },
    action: {
      active: common.white,
      hover: "rgba(255, 255, 255, 0.08)",
      hoverOpacity: 0.08,
      selected: "rgba(255, 255, 255, 0.16)",
      selectedOpacity: 0.16,
      disabled: "rgba(255, 255, 255, 0.3)",
      disabledBackground: "rgba(255, 255, 255, 0.12)",
      disabledOpacity: 0.38,
      focus: "rgba(255, 255, 255, 0.12)",
      focusOpacity: 0.12,
      activatedOpacity: 0.24
    }
  });
  const darkColors = {
    primary: {
      main: blue[200],
      light: blue[50],
      dark: blue[400]
    },
    secondary: {
      main: purple[200],
      light: purple[50],
      dark: purple[400]
    },
    error: {
      main: red[500],
      light: red[300],
      dark: red[700]
    },
    info: {
      main: lightBlue[400],
      light: lightBlue[300],
      dark: lightBlue[700]
    },
    success: {
      main: green[400],
      light: green[300],
      dark: green[700]
    },
    warning: {
      main: orange[400],
      light: orange[300],
      dark: orange[700]
    }
  };
  const modes = {
    light: useLightOptions,
    dark: useDarkOptions
  };
  function getContrastText(background, contrastThreshold) {
    return getContrastRatio(background, common.white) >= contrastThreshold ? common.white : "rgba(0, 0, 0, 0.87)";
  }
  function addLightOrDark(intent, direction, shade, tonalOffset) {
    const tonalOffsetLight = typeof tonalOffset === "number" ? tonalOffset : tonalOffset.light;
    const tonalOffsetDark = typeof tonalOffset === "number" ? tonalOffset * 1.5 : tonalOffset.dark;
    if (!intent[direction]) {
      if (intent.hasOwnProperty(shade)) {
        intent[direction] = intent[shade];
      } else if (direction === "light") {
        intent.light = lighten(intent.main, tonalOffsetLight);
      } else if (direction === "dark") {
        intent.dark = darken(intent.main, tonalOffsetDark);
      }
    }
  }
  function augmentColor(data) {
    const color = {
      ...data.color
    };
    const mainShade = data.mainShade ?? 500;
    if (!data.color.main && data.color[mainShade])
      color.main = data.color[mainShade];
    addLightOrDark(color, "light", data.lightShade ?? 300, data.tonalOffset);
    addLightOrDark(color, "dark", data.darkShade ?? 700, data.tonalOffset);
    if (!color.contrastText)
      color.contrastText = getContrastText(color.main, data.contrastThreshold);
    return color;
  }
  const usePalleteDefaults = () => createPaletteOptions({
    mode: "light",
    tonalOffset: 0.2,
    contrastThreshold: 3,
    grey,
    common
  });
  function createPaletteOptions(data) {
    return data;
  }
  function createPalette(options) {
    const colorNames = ["error", "info", "primary", "secondary", "success", "warning"];
    const palleteDefaults = usePalleteDefaults();
    const result = {
      ...merge({}, palleteDefaults, modes[(options == null ? void 0 : options.mode) ?? palleteDefaults.mode](), options),
      isColorName(name) {
        return colorNames.includes(name);
      },
      getColorObject(color) {
        return result[color];
      },
      getColor(color) {
        return result.mode === "light" ? result[color].light : result[color].dark;
      },
      augmentColor(data) {
        return augmentColor({
          ...data,
          tonalOffset: result.tonalOffset,
          contrastThreshold: result.contrastThreshold
        });
      },
      getContrastText(background) {
        return getContrastText(background, result.contrastThreshold);
      }
    };
    const getDefaultColor = (color) => result.mode === "light" ? lightColors[color] : darkColors[color];
    result.primary = result.augmentColor({
      color: result.primary || getDefaultColor("primary")
    });
    result.secondary = result.augmentColor({
      color: result.secondary || getDefaultColor("secondary"),
      mainShade: "A400",
      lightShade: "A200",
      darkShade: "A700"
    });
    result.error = result.augmentColor({
      color: result.error || getDefaultColor("error")
    });
    result.warning = result.augmentColor({
      color: result.warning || getDefaultColor("warning")
    });
    result.info = result.augmentColor({
      color: result.info || getDefaultColor("info")
    });
    result.success = result.augmentColor({
      color: result.success || getDefaultColor("success")
    });
    return result;
  }
  const cache = {};
  const shadowKeyUmbraOpacity = 0.2;
  const shadowKeyPenumbraOpacity = 0.14;
  const shadowAmbientShadowOpacity = 0.12;
  function createCssShadow(...px) {
    return [`${px[0]}px ${px[1]}px ${px[2]}px ${px[3]}px rgba(0,0,0,${shadowKeyUmbraOpacity})`, `${px[4]}px ${px[5]}px ${px[6]}px ${px[7]}px rgba(0,0,0,${shadowKeyPenumbraOpacity})`, `${px[8]}px ${px[9]}px ${px[10]}px ${px[11]}px rgba(0,0,0,${shadowAmbientShadowOpacity})`].join(",");
  }
  const shadows = [() => "none", () => createCssShadow(0, 2, 1, -1, 0, 1, 1, 0, 0, 1, 3, 0), () => createCssShadow(0, 3, 1, -2, 0, 2, 2, 0, 0, 1, 5, 0), () => createCssShadow(0, 3, 3, -2, 0, 3, 4, 0, 0, 1, 8, 0), () => createCssShadow(0, 2, 4, -1, 0, 4, 5, 0, 0, 1, 10, 0), () => createCssShadow(0, 3, 5, -1, 0, 5, 8, 0, 0, 1, 14, 0), () => createCssShadow(0, 3, 5, -1, 0, 6, 10, 0, 0, 1, 18, 0), () => createCssShadow(0, 4, 5, -2, 0, 7, 10, 1, 0, 2, 16, 1), () => createCssShadow(0, 5, 5, -3, 0, 8, 10, 1, 0, 3, 14, 2), () => createCssShadow(0, 5, 6, -3, 0, 9, 12, 1, 0, 3, 16, 2), () => createCssShadow(0, 6, 6, -3, 0, 10, 14, 1, 0, 4, 18, 3), () => createCssShadow(0, 6, 7, -4, 0, 11, 15, 1, 0, 4, 20, 3), () => createCssShadow(0, 7, 8, -4, 0, 12, 17, 2, 0, 5, 22, 4), () => createCssShadow(0, 7, 8, -4, 0, 13, 19, 2, 0, 5, 24, 4), () => createCssShadow(0, 7, 9, -4, 0, 14, 21, 2, 0, 5, 26, 4), () => createCssShadow(0, 8, 9, -5, 0, 15, 22, 2, 0, 6, 28, 5), () => createCssShadow(0, 8, 10, -5, 0, 16, 24, 2, 0, 6, 30, 5), () => createCssShadow(0, 8, 11, -5, 0, 17, 26, 2, 0, 6, 32, 5), () => createCssShadow(0, 9, 11, -5, 0, 18, 28, 2, 0, 7, 34, 6), () => createCssShadow(0, 9, 12, -6, 0, 19, 29, 2, 0, 7, 36, 6), () => createCssShadow(0, 10, 13, -6, 0, 20, 31, 3, 0, 8, 38, 7), () => createCssShadow(0, 10, 13, -6, 0, 21, 33, 3, 0, 8, 40, 7), () => createCssShadow(0, 10, 14, -6, 0, 22, 35, 3, 0, 8, 42, 7), () => createCssShadow(0, 11, 14, -7, 0, 23, 36, 3, 0, 9, 44, 8), () => createCssShadow(0, 11, 15, -7, 0, 24, 38, 3, 0, 9, 46, 8)];
  function createShadows() {
    return new Proxy([], {
      get: (target, p) => {
        if (typeof p !== "string" || isNaN(Number(p)))
          return target[p];
        if (p in cache)
          return cache[p];
        return cache[p] = shadows[p]();
      }
    });
  }
  const easing = {
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    easeOut: "cubic-bezier(0.0, 0, 0.2, 1)",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    sharp: "cubic-bezier(0.4, 0, 0.6, 1)"
  };
  const duration = {
    shortest: 150,
    shorter: 200,
    short: 250,
    standard: 300,
    complex: 375,
    enteringScreen: 225,
    leavingScreen: 195
  };
  function formatMs(milliseconds) {
    return `${Math.round(milliseconds)}ms`;
  }
  function getAutoHeightDuration(height) {
    if (!height) {
      return 0;
    }
    const constant = height / 36;
    return Math.round((4 + 15 * constant ** 0.25 + constant / 5) * 10);
  }
  function createTransitions(inputTransitions) {
    const mergedEasing = {
      ...easing,
      ...inputTransitions.easing
    };
    const mergedDuration = {
      ...duration,
      ...inputTransitions.duration
    };
    const create2 = (props = ["all"], options = {}) => {
      const {
        duration: durationOption = mergedDuration.standard,
        easing: easingOption = mergedEasing.easeInOut,
        delay = 0,
        ...other
      } = options;
      return (Array.isArray(props) ? props : [props]).map((animatedProp) => `${animatedProp} ${typeof durationOption === "string" ? durationOption : formatMs(durationOption)} ${easingOption} ${typeof delay === "string" ? delay : formatMs(delay)}`).join(",");
    };
    return {
      getAutoHeightDuration,
      create: create2,
      ...inputTransitions,
      easing: mergedEasing,
      duration: mergedDuration
    };
  }
  const fontWeight = {
    light: 300,
    regular: 400,
    medium: 500,
    bold: 700
  };
  const typographyDefaults = createTypographyOptions({
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    htmlFontSize: 16,
    h1: {},
    h2: {},
    h3: {},
    h4: {},
    h5: {},
    h6: {},
    subtitle1: {},
    subtitle2: {},
    body1: {},
    body2: {},
    button: {},
    caption: {},
    overline: {},
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700
  });
  function createTypographyOptions(options) {
    return options;
  }
  function round(value) {
    return Math.round(value * 1e5) / 1e5;
  }
  function makeVariant(base, fontWeight2, size, lineHeight, letterSpacing, casing) {
    return {
      fontFamily: base.fontFamily,
      fontWeight: fontWeight2,
      fontSize: base.pxToRem(size),
      lineHeight: `${lineHeight}`,
      letterSpacing: `${round(letterSpacing / size)}em`,
      ...casing ? {
        textTransform: "uppercase"
      } : {}
    };
  }
  function createTypography(options = {}) {
    const base = {
      fontFamily: options.fontFamily ?? typographyDefaults.fontFamily,
      fontSize: options.fontSize ?? typographyDefaults.fontSize,
      htmlFontSize: (options == null ? void 0 : options.htmlFontSize) ?? typographyDefaults.htmlFontSize,
      pxToRem: (size) => {
        const coef = base.fontSize / 14;
        return `${size / base.htmlFontSize * coef}rem`;
      }
    };
    return merge(base, {
      h1: makeVariant(base, fontWeight.light, 96, 1.167, -1.5),
      h2: makeVariant(base, fontWeight.light, 60, 1.2, -0.5),
      h3: makeVariant(base, fontWeight.regular, 48, 1.167, 0),
      h4: makeVariant(base, fontWeight.regular, 34, 1.235, 0.25),
      h5: makeVariant(base, fontWeight.regular, 24, 1.334, 0),
      h6: makeVariant(base, fontWeight.medium, 20, 1.6, 0.15),
      subtitle1: makeVariant(base, fontWeight.regular, 16, 1.75, 0.15),
      subtitle2: makeVariant(base, fontWeight.medium, 14, 1.57, 0.1),
      body1: makeVariant(base, fontWeight.regular, 16, 1.5, 0.15),
      body2: makeVariant(base, fontWeight.regular, 14, 1.43, 0.15),
      button: makeVariant(base, fontWeight.medium, 14, 1.75, 0.4, true),
      caption: makeVariant(base, fontWeight.regular, 12, 1.66, 0.4),
      overline: makeVariant(base, fontWeight.regular, 12, 2.66, 1, true)
    }, typographyDefaults, options);
  }
  const zIndexDefaults = createZIndexOptions({
    mobileStepper: 1e3,
    speedDial: 1050,
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500
  });
  function createZIndexOptions(data) {
    return data;
  }
  function createZIndex(data) {
    const result = {
      ...merge({}, zIndexDefaults, data)
    };
    return result;
  }
  function renderMediaQuery(comparator, width, units = "px") {
    let selector;
    if (comparator === "up") {
      selector = `(min-width:${width}${units})`;
    } else if (comparator === "down") {
      selector = `(max-width:${width}${units})`;
    } else if (comparator === "between") {
      const [maxW, minW] = width;
      selector = `(max-width:${maxW}${units}) and (min-width:${minW}${units})`;
    } else {
      throw new Error(`Invalid comparator: ${comparator}`);
    }
    return `@media ${selector}`;
  }
  const breakpointsDefault = createBreakpointsOptions({
    columns: 12,
    keys: ["xs", "sm", "md", "lg", "xl"],
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536
    },
    unit: "px"
  });
  function createBreakpointsOptions(options) {
    return options;
  }
  function createBreakpoints(options) {
    const result = {
      ...breakpointsDefault,
      ...options ?? {},
      up: (value, css) => {
        const key = renderMediaQuery("up", result.resolve(value));
        return css ? { [key]: css } : key;
      },
      down: (value, css) => {
        const key = renderMediaQuery("down", result.resolve(value));
        return css ? { [key]: css } : key;
      },
      between: (value, css) => {
        const key = renderMediaQuery("between", [
          result.resolve(value[0]),
          result.resolve(value[1])
        ]);
        return css ? { [key]: css } : key;
      },
      resolve: (value) => typeof value === "number" ? value : result.values[value]
    };
    return result;
  }
  function createSpacing(options) {
    if (typeof options === "function")
      return options;
    const resolved = (...values) => {
      return values.map((v) => typeof v === "number" ? `${v * (options ?? 8)}px` : v).join(" ");
    };
    return resolved;
  }
  const shapeDefaults = createShapeOptions({
    borderRadius: 4
  });
  function createShapeOptions(data) {
    return data;
  }
  function createShape(options) {
    const result = {
      ...merge({}, shapeDefaults, options)
    };
    return result;
  }
  function createTheme$1(input = {}) {
    const theme = {
      direction: "ltr",
      ...input
    };
    function def(key, defaults) {
      const inputValue = input[key];
      Object.defineProperty(theme, key, {
        configurable: true,
        enumerable: true,
        ...typeof inputValue === "function" ? {
          get: inputValue
        } : {
          value: defaults({
            [key]: inputValue
          })
        }
      });
    }
    def("breakpoints", (input2) => createBreakpoints(input2.breakpoints));
    def("components", (input2) => createComponents(input2.components));
    def("palette", (input2) => createPalette(input2.palette));
    def("shape", (input2) => createShape(input2.shape));
    def("spacing", (input2) => createSpacing(input2.spacing));
    def("typography", (input2) => createTypography(input2.typography));
    def("shadows", () => createShadows());
    def("transitions", () => createTransitions({}));
    def("zIndex", (input2) => createZIndex(input2.zIndex));
    def("mixins", () => createMixins(theme.breakpoints));
    return theme;
  }
  function makeGetDefaultTheme(createTheme2) {
    let defaultTheme;
    return function getDefaultTheme2() {
      if (!defaultTheme) {
        defaultTheme = createTheme2();
      }
      return defaultTheme;
    };
  }
  const getDefaultTheme$1 = makeGetDefaultTheme(createTheme$1);
  let ThemeContext;
  {
    ThemeContext = createContext({});
  }
  const ThemeContext$1 = ThemeContext;
  function createTheme(data) {
    const result = {
      direction: "ltr",
      shadows: void 0,
      transitions: void 0,
      components: void 0,
      palette: void 0,
      typography: void 0,
      zIndex: void 0,
      mixins: void 0,
      ...data,
      breakpoints: createBreakpoints(data == null ? void 0 : data.breakpoints),
      shape: createShape(data == null ? void 0 : data.shape),
      spacing: createSpacing(data == null ? void 0 : data.spacing)
    };
    return result;
  }
  const getDefaultTheme = makeGetDefaultTheme(createTheme);
  function isEmptyObject(object) {
    for (const _key in object)
      return false;
    return true;
  }
  function useTheme$2(defaultTheme = getDefaultTheme, Context = ThemeContext$1) {
    const theme = useContext(Context);
    if (isEmptyObject(theme) && defaultTheme) {
      if (typeof defaultTheme === "function")
        return defaultTheme();
      return defaultTheme;
    }
    if (!theme)
      throw new Error("Theme is not defined");
    return theme;
  }
  function useTheme$1(defaultTheme = getDefaultTheme$1) {
    return useTheme$2(defaultTheme, ThemeContext$1);
  }
  function useTheme(defaultTheme) {
    return useTheme$2(defaultTheme, ThemeContext$1);
  }
  function useThemeProps(options) {
    const theme = useTheme();
    const set = (v) => v;
    const propDefaults = typeof options.propDefaults === "function" ? options.propDefaults({
      set,
      inProps: options.props
    }) : options.propDefaults;
    return mergeProps(...[
      ...propDefaults ? [propDefaults] : [],
      () => {
        var _a2, _b2;
        return ((_b2 = (_a2 = theme.components) == null ? void 0 : _a2[options.name]) == null ? void 0 : _b2.defaultProps) || {};
      },
      options.props
    ]);
  }
  function createElement(tagName, isSVG = false) {
    return isSVG ? document.createElementNS("http://www.w3.org/2000/svg", tagName) : document.createElement(tagName);
  }
  function Dynamic(props) {
    const [p, others] = splitProps(props, ["$component"]);
    const cached = createMemo(() => p.$component);
    return createMemo(() => {
      const component = cached();
      switch (typeof component) {
        case "function":
          Object.assign(component, {
            [$DEVCOMP]: true
          });
          return untrack(() => component(others));
        case "string":
          const isSvg = SVGElements.has(component);
          const el = sharedConfig.context ? getNextElement() : createElement(component, isSvg);
          spread(el, others, isSvg);
          return el;
      }
    });
  }
  function mergeStyleProps(values) {
    const result = values.reduce((result2, value) => {
      if ("name" in value)
        result2[`--${value.name}`] = "0";
      deepmerge(result2, value, {
        clone: false,
        sortKeys: true
      });
      return result2;
    }, {});
    delete result.name;
    return result;
  }
  function isVar(value) {
    return value.startsWith("--");
  }
  function isPrivateVar(value) {
    return value.startsWith("__");
  }
  function isSelector(value) {
    return /[^a-z-]/i.test(value) && !isVar(value);
  }
  function isGlobalSelector(value) {
    return value.startsWith("@global");
  }
  function isMediaQuery(value) {
    return value.startsWith("@media");
  }
  function isKeyframes(value) {
    return value.startsWith("@keyframes");
  }
  function snakeCase(value) {
    return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  }
  function renderSelector(propKey, propValue, selectors = [], options = {}) {
    const subselectors = propKey.split(",").map((v) => {
      v = v.trim();
      return v.includes("&") ? v : `& ${v}`;
    });
    return render(propValue, (selectors.length ? selectors : [""]).flatMap((selector) => subselectors.map((v) => v.replace(/&/g, selector).trim())), {
      ...options
    });
  }
  function render(css, selectors = [], options = {}) {
    const props = [];
    const rules = [];
    for (let propKey in css) {
      const propValue = css[propKey];
      if (isPrivateVar(propKey)) {
        continue;
      } else if (isGlobalSelector(propKey)) {
        for (const selector in propValue) {
          rules.push(...renderSelector(selector, propValue[selector], [], options));
        }
      } else if (isMediaQuery(propKey)) {
        rules.push(...render(propValue, selectors, {
          ...options,
          sublevel: true
        }).map((v) => `${propKey} {
${v}
}`));
      } else if (isVar(propKey)) {
        if (propValue !== void 0 && propValue !== null)
          props.push(`${propKey}: ${propValue};`);
      } else if (isKeyframes(propKey)) {
        const keyframes = [];
        for (const k in propValue) {
          keyframes.push(...render(propValue[k], [/^\d+$/.test(k) ? `${k}%` : k], {
            ...options,
            sublevel: true
          }));
        }
        rules.push(`${propKey} {
${keyframes.join("\n")}
}`);
      } else if (isSelector(propKey)) {
        rules.push(...renderSelector(propKey, propValue, selectors, options));
      } else if (options.extraProperties && propKey in options.extraProperties) {
        const extraProps = options.extraProperties[propKey](propValue);
        for (const extraPropKey in extraProps) {
          const inValue = extraProps[extraPropKey];
          const value = options.onPropertyValue ? options.onPropertyValue(extraPropKey, inValue) : inValue;
          if (value !== void 0 && value !== null)
            props.push(`${snakeCase(extraPropKey)}: ${value};`);
        }
      } else {
        propKey = snakeCase(propKey);
        const value = options.onPropertyValue ? options.onPropertyValue(propKey, propValue) : propValue;
        if (value !== void 0 && value !== null)
          props.push(`${propKey}: ${value};`);
      }
    }
    const renderProps = (level) => {
      const pad = "	".repeat(level);
      return `${pad}${props.join(`
${pad}`)}`;
    };
    if (selectors.length) {
      const pad = options.sublevel ? `	` : ``;
      const selectorStr = pad + selectors.join(`,
${pad}`);
      return [
        ...props.length ? [
          `${selectorStr} {
${renderProps(options.sublevel ? 2 : 1)}
${pad}}`
        ] : [],
        ...rules
      ];
    } else {
      return [...props.length ? [renderProps(0)] : [], ...rules];
    }
  }
  function toArray(value) {
    return value ? Array.isArray(value) ? value : [value] : [];
  }
  function resolveFunction(value) {
    if (typeof value === "function")
      value = value();
    return value;
  }
  class StyleCache {
    constructor() {
      __publicField(this, "ids", /* @__PURE__ */ new Map());
      __publicField(this, "rules", /* @__PURE__ */ new Map());
    }
    create(name, rules, componentId) {
      let styleObject = this.rules.get(rules);
      if (styleObject)
        return styleObject;
      let componentIndex = this.ids.get(componentId);
      if (typeof componentIndex === "number") {
        this.ids.set(componentId, ++componentIndex);
        componentId += `_${componentIndex}`;
      }
      styleObject = create(name, rules, componentId);
      this.save(styleObject, rules);
      return styleObject;
    }
    save(style2, rules) {
      this.ids.set(style2.id, 0);
      this.rules.set(rules, style2);
    }
    delete(style2) {
      this.ids.delete(style2.id);
      this.rules.delete(style2.rules);
    }
  }
  function create(name, rules, id) {
    return {
      id,
      name,
      className: `${name}-${id}`,
      rules: rules.replaceAll(`$id`, `${id}`)
    };
  }
  function createStyleObject(options) {
    var _a2;
    const className2 = `${options.name}-$id`;
    const propsValues = toArray(resolveFunction(options.props));
    const rules = propsValues.map((v) => typeof v === "string" ? `.${className2} {
${v}
}` : render(v, [`.${className2}`], {
      extraProperties: options.extraProperties
    }).join("\n")).join("\n");
    return ((_a2 = options.cache) == null ? void 0 : _a2.create(options.name, rules, options.componentId)) || create(options.name, rules, options.componentId);
  }
  function setStyleElementText(element, text) {
    if ("styleSheet" in element) {
      element["styleSheet"].cssText = text;
    } else {
      element.innerText = "";
      element.appendChild(document.createTextNode(text));
    }
  }
  function setAttributes(element, attributes) {
    for (const name in attributes) {
      const value = attributes[name];
      if (value !== void 0) {
        if (value === null) {
          element.removeAttribute(name);
        } else {
          element.setAttribute(name, value);
        }
      }
    }
  }
  function createStyleElement(css, attributes) {
    const element = document.createElement("style");
    element.type = "text/css";
    if (attributes)
      setAttributes(element, attributes);
    setStyleElementText(element, css);
    return element;
  }
  function registerStyleElementUsage(style2) {
    let uses = Number(style2.getAttribute("data-uses"));
    uses++;
    style2.setAttribute("data-uses", uses.toString());
  }
  const placeholderId = "suid-injectFirst";
  function appendStyleElement(css, attributes, injectFirst) {
    if (Array.isArray(css))
      css = css.join("\n");
    const id = attributes == null ? void 0 : attributes["id"];
    const head = document.head || document.getElementsByTagName("head")[0];
    const prevElement = id && document.getElementById(id);
    if (prevElement && prevElement instanceof HTMLStyleElement) {
      setStyleElementText(prevElement, css);
      registerStyleElementUsage(prevElement);
      return prevElement;
    } else {
      if (prevElement)
        prevElement.remove();
      const element = createStyleElement(css, attributes);
      registerStyleElementUsage(element);
      if (injectFirst) {
        let placeholderElement = head.querySelector(`#${placeholderId}`);
        if (!placeholderElement) {
          placeholderElement = document.createElement("style");
          placeholderElement.setAttribute("id", placeholderId);
          head.prepend(placeholderElement);
        }
        head.insertBefore(element, placeholderElement);
      } else {
        head.appendChild(element);
      }
      return element;
    }
  }
  function findStyleElement(id) {
    return document.getElementById(id);
  }
  function unregisterStyleElementUsage(style2) {
    let uses = Number(style2.getAttribute("data-uses"));
    uses--;
    if (uses <= 0) {
      style2.remove();
    } else {
      style2.setAttribute("data-uses", uses.toString());
    }
  }
  function capitalize(string) {
    if (typeof string !== "string") {
      throw new Error("MUI: `capitalize(string)` expects a string argument.");
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  function createUniqueId(idOverride) {
    return createMemo(() => (idOverride == null ? void 0 : idOverride()) ?? `mui-${createUniqueId$1()}`);
  }
  function getScrollbarSize(doc) {
    const documentWidth = doc.documentElement.clientWidth;
    return Math.abs(window.innerWidth - documentWidth);
  }
  function ownerDocument(node) {
    return node && node.ownerDocument || document;
  }
  function ownerWindow(node) {
    const doc = ownerDocument(node);
    return doc.defaultView || window;
  }
  function randomString() {
    return Math.random().toString(36).substring(2, 15).slice(0, 8);
  }
  let hadKeyboardEvent = true;
  let hadFocusVisibleRecently = false;
  let hadFocusVisibleRecentlyTimeout;
  const inputTypesWhitelist = {
    text: true,
    search: true,
    url: true,
    tel: true,
    email: true,
    password: true,
    number: true,
    date: true,
    month: true,
    week: true,
    time: true,
    datetime: true,
    "datetime-local": true
  };
  function focusTriggersKeyboardModality(node) {
    const { type, tagName } = node;
    if (tagName === "INPUT" && inputTypesWhitelist[type] && !node.readOnly) {
      return true;
    }
    if (tagName === "TEXTAREA" && !node.readOnly) {
      return true;
    }
    if (node.isContentEditable) {
      return true;
    }
    return false;
  }
  function handleKeyDown(event) {
    if (event.metaKey || event.altKey || event.ctrlKey) {
      return;
    }
    hadKeyboardEvent = true;
  }
  function handlePointerDown() {
    hadKeyboardEvent = false;
  }
  function handleVisibilityChange() {
    if (this.visibilityState === "hidden") {
      if (hadFocusVisibleRecently) {
        hadKeyboardEvent = true;
      }
    }
  }
  function prepare(doc) {
    doc.addEventListener("keydown", handleKeyDown, true);
    doc.addEventListener("mousedown", handlePointerDown, true);
    doc.addEventListener("pointerdown", handlePointerDown, true);
    doc.addEventListener("touchstart", handlePointerDown, true);
    doc.addEventListener("visibilitychange", handleVisibilityChange, true);
  }
  function isFocusVisible(event) {
    const { target } = event;
    try {
      return target.matches(":focus-visible");
    } catch (error) {
    }
    return hadKeyboardEvent || focusTriggersKeyboardModality(target);
  }
  function useIsFocusVisible() {
    const ref = (node) => {
      if (node != null) {
        prepare(node.ownerDocument);
      }
    };
    const [isFocusVisibleRef, setFocusVisibleRef] = createSignal(false);
    function handleBlurVisible() {
      if (isFocusVisibleRef()) {
        hadFocusVisibleRecently = true;
        window.clearTimeout(hadFocusVisibleRecentlyTimeout);
        hadFocusVisibleRecentlyTimeout = window.setTimeout(() => {
          hadFocusVisibleRecently = false;
        }, 100);
        setFocusVisibleRef(false);
        return true;
      }
      return false;
    }
    function handleFocusVisible(event) {
      if (isFocusVisible(event)) {
        setFocusVisibleRef(true);
        return true;
      }
      return false;
    }
    return {
      isFocusVisibleRef: {
        get current() {
          return isFocusVisibleRef();
        }
      },
      onFocus: handleFocusVisible,
      onBlur: handleBlurVisible,
      ref
    };
  }
  const $RAW = Symbol("store-raw"), $NODE = Symbol("store-node"), $NAME = Symbol("store-name");
  function isWrappable(obj) {
    let proto;
    return obj != null && typeof obj === "object" && (obj[$PROXY] || !(proto = Object.getPrototypeOf(obj)) || proto === Object.prototype || Array.isArray(obj));
  }
  function unwrap(item, set = /* @__PURE__ */ new Set()) {
    let result, unwrapped, v, prop2;
    if (result = item != null && item[$RAW])
      return result;
    if (!isWrappable(item) || set.has(item))
      return item;
    if (Array.isArray(item)) {
      if (Object.isFrozen(item))
        item = item.slice(0);
      else
        set.add(item);
      for (let i = 0, l = item.length; i < l; i++) {
        v = item[i];
        if ((unwrapped = unwrap(v, set)) !== v)
          item[i] = unwrapped;
      }
    } else {
      if (Object.isFrozen(item))
        item = Object.assign({}, item);
      else
        set.add(item);
      const keys = Object.keys(item), desc = Object.getOwnPropertyDescriptors(item);
      for (let i = 0, l = keys.length; i < l; i++) {
        prop2 = keys[i];
        if (desc[prop2].get)
          continue;
        v = item[prop2];
        if ((unwrapped = unwrap(v, set)) !== v)
          item[prop2] = unwrapped;
      }
    }
    return item;
  }
  function getDataNodes(target) {
    let nodes = target[$NODE];
    if (!nodes)
      Object.defineProperty(target, $NODE, {
        value: nodes = {}
      });
    return nodes;
  }
  function getDataNode(nodes, property, value) {
    return nodes[property] || (nodes[property] = createDataNode(value));
  }
  function trackSelf(target) {
    if (getListener()) {
      const nodes = getDataNodes(target);
      (nodes._ || (nodes._ = createDataNode()))();
    }
  }
  function ownKeys(target) {
    trackSelf(target);
    return Reflect.ownKeys(target);
  }
  function createDataNode(value) {
    const [s, set] = createSignal(value, {
      equals: false,
      internal: true
    });
    s.$ = set;
    return s;
  }
  function setProperty(state, property, value, deleting = false) {
    if (!deleting && state[property] === value)
      return;
    const prev = state[property], len = state.length;
    if (value === void 0)
      delete state[property];
    else
      state[property] = value;
    let nodes = getDataNodes(state), node;
    if (node = getDataNode(nodes, property, prev))
      node.$(() => value);
    if (Array.isArray(state) && state.length !== len)
      (node = getDataNode(nodes, "length", len)) && node.$(state.length);
    (node = nodes._) && node.$();
  }
  function proxyDescriptor(target, property) {
    const desc = Reflect.getOwnPropertyDescriptor(target, property);
    if (!desc || desc.get || desc.set || !desc.configurable || property === $PROXY || property === $NODE || property === $NAME)
      return desc;
    delete desc.value;
    delete desc.writable;
    desc.get = () => target[$PROXY][property];
    desc.set = (v) => target[$PROXY][property] = v;
    return desc;
  }
  const proxyTraps = {
    get(target, property, receiver) {
      if (property === $RAW)
        return target;
      if (property === $PROXY)
        return receiver;
      if (property === $TRACK) {
        trackSelf(target);
        return receiver;
      }
      const nodes = getDataNodes(target);
      const tracked = nodes.hasOwnProperty(property);
      let value = tracked ? nodes[property]() : target[property];
      if (property === $NODE || property === "__proto__")
        return value;
      if (!tracked) {
        const desc = Object.getOwnPropertyDescriptor(target, property);
        const isFunction = typeof value === "function";
        if (getListener() && (!isFunction || target.hasOwnProperty(property)) && !(desc && desc.get))
          value = getDataNode(nodes, property, value)();
        else if (value != null && isFunction && value === Array.prototype[property]) {
          return (...args) => batch(() => Array.prototype[property].apply(receiver, args));
        }
      }
      return isWrappable(value) ? wrap(value) : value;
    },
    has(target, property) {
      if (property === $RAW || property === $PROXY || property === $TRACK || property === $NODE || property === "__proto__")
        return true;
      this.get(target, property, target);
      return property in target;
    },
    set(target, property, value) {
      batch(() => setProperty(target, property, unwrap(value)));
      return true;
    },
    deleteProperty(target, property) {
      batch(() => setProperty(target, property, void 0, true));
      return true;
    },
    ownKeys,
    getOwnPropertyDescriptor: proxyDescriptor
  };
  function wrap(value, name) {
    let p = value[$PROXY];
    if (!p) {
      Object.defineProperty(value, $PROXY, {
        value: p = new Proxy(value, proxyTraps)
      });
      const keys = Object.keys(value), desc = Object.getOwnPropertyDescriptors(value);
      for (let i = 0, l = keys.length; i < l; i++) {
        const prop2 = keys[i];
        if (desc[prop2].get) {
          const get = desc[prop2].get.bind(p);
          Object.defineProperty(value, prop2, {
            get
          });
        }
        if (desc[prop2].set) {
          const og = desc[prop2].set, set = (v) => batch(() => og.call(p, v));
          Object.defineProperty(value, prop2, {
            set
          });
        }
      }
    }
    return p;
  }
  function createMutable(state, options) {
    const unwrappedStore = unwrap(state || {});
    const wrappedStore = wrap(unwrappedStore);
    return wrappedStore;
  }
  const styleCache = isServer ? void 0 : new StyleCache();
  function normalizeStyleProps(props) {
    if (!props)
      return [];
    return (Array.isArray(props) ? props : [props]).flat(Infinity).filter((v) => !!v);
  }
  function createStyleId() {
    if (!sharedConfig.context)
      return randomString();
    const id = createUniqueId$1().replaceAll("-", "");
    const chunkSize = 9;
    const chunks = Math.ceil(id.length / chunkSize);
    const ids = [];
    for (let chunk = 1; chunk <= chunks; ++chunk) {
      const index = (chunk - 1) * chunkSize;
      const number = Number(id.slice(index, index + chunkSize));
      ids.push(number.toString(32));
    }
    return ids.join("-");
  }
  function createStyle(value) {
    const context = useContext(StyledEngineContext);
    const [name, setName] = createSignal("");
    const componentId = createStyleId();
    let styleElement;
    createRenderEffect((prevResult) => {
      var _a2;
      const propsValue = value();
      let styleObject;
      if (propsValue) {
        styleObject = createStyleObject({
          name: "css",
          props: mergeStyleProps(normalizeStyleProps(propsValue)),
          cache: styleCache,
          componentId
        });
        {
          styleElement = findStyleElement(styleObject.id);
          if (styleElement) {
            registerStyleElementUsage(styleElement);
          } else {
            styleElement = appendStyleElement(styleObject.rules, {
              id: styleObject.id,
              nonce: (_a2 = context.cache) == null ? void 0 : _a2.nonce
            }, context.injectFirst);
          }
          if (prevResult == null ? void 0 : prevResult.styleElement) {
            unregisterStyleElementUsage(prevResult.styleElement);
          }
        }
      }
      if (typeof (styleObject == null ? void 0 : styleObject.className) === "string") {
        setName(styleObject.className);
      } else {
        setName("");
      }
      return {
        className: styleObject == null ? void 0 : styleObject.className,
        styleElement
      };
    }, void 0);
    onCleanup(() => {
      if (styleElement)
        unregisterStyleElementUsage(styleElement);
    });
    return name;
  }
  function resolve(css, onProp, cssTarget = {}) {
    for (const name in css) {
      const value = css[name];
      if (isGlobalSelector(name)) {
        cssTarget[name] = resolve(value, onProp);
      } else if (isMediaQuery(name)) {
        cssTarget[name] = resolve(value, onProp);
      } else if (isKeyframes(name)) {
        cssTarget[name] = {};
        for (const v in value) {
          cssTarget[name][v] = resolve(value[v], onProp);
        }
      } else if (isSelector(name)) {
        cssTarget[name] = resolve(value, onProp);
      } else {
        const result = onProp(name, value);
        if (result) {
          Object.assign(cssTarget, result);
        } else {
          cssTarget[name] = value;
        }
      }
    }
    return cssTarget;
  }
  const unitLess = /* @__PURE__ */ new Set([
    "animationIterationCount",
    "borderImageOutset",
    "borderImageSlice",
    "borderImageWidth",
    "boxFlex",
    "boxFlexGroup",
    "boxOrdinalGroup",
    "columnCount",
    "columns",
    "flex",
    "flexGrow",
    "flexPositive",
    "flexShrink",
    "flexNegative",
    "flexOrder",
    "gridRow",
    "gridRowEnd",
    "gridRowSpan",
    "gridRowStart",
    "gridColumn",
    "gridColumnEnd",
    "gridColumnSpan",
    "gridColumnStart",
    "msGridRow",
    "msGridRowSpan",
    "msGridColumn",
    "msGridColumnSpan",
    "fontWeight",
    "lineHeight",
    "opacity",
    "order",
    "orphans",
    "tabSize",
    "widows",
    "zIndex",
    "zoom",
    "WebkitLineClamp",
    "fillOpacity",
    "floodOpacity",
    "stopOpacity",
    "strokeDasharray",
    "strokeDashoffset",
    "strokeMiterlimit",
    "strokeOpacity",
    "strokeWidth"
  ]);
  function resolveStyledPropsValue(name, value) {
    if (typeof value === "number") {
      return { [name]: unitLess.has(name) ? value.toString() : `${value}px` };
    }
  }
  function resolveStyledProps(v) {
    return resolve(v, resolveStyledPropsValue);
  }
  function getThemeValue(theme, key, value) {
    if (typeof value !== "string")
      return value;
    const names = value.split(".");
    let ref = theme[key];
    for (let i = 0; i < names.length; i++) {
      ref = ref == null ? void 0 : ref[names[i]];
      if (!ref)
        break;
    }
    return ref ?? value;
  }
  function getPath(obj, path) {
    if (!path || typeof path !== "string") {
      return null;
    }
    return path.split(".").reduce((acc, item) => acc && acc[item] ? acc[item] : null, obj);
  }
  function createUnaryUnit(theme, themeKey, defaultValue, propName) {
    const themeSpacing = getPath(theme, themeKey) || defaultValue;
    if (typeof themeSpacing === "number") {
      return (abs) => {
        if (typeof abs === "string") {
          return abs;
        }
        return themeSpacing * abs;
      };
    }
    if (Array.isArray(themeSpacing)) {
      return (abs) => {
        if (typeof abs === "string") {
          return abs;
        }
        return themeSpacing[abs];
      };
    }
    if (typeof themeSpacing === "function") {
      return themeSpacing;
    }
    return () => void 0;
  }
  const dirMap = {
    x: ["Left", "Right"],
    y: ["Top", "Bottom"]
  };
  function asPx(value) {
    return typeof value === "number" ? `${value}px` : value;
  }
  function customProp(name, onValue) {
    return (value, theme) => onValue(name, value, theme);
  }
  function prop(name, onValue) {
    return onValue ? (value, theme) => ({
      [name]: onValue(name, value, theme)
    }) : (value) => ({ [name]: value });
  }
  function pxProp(name) {
    return prop(name, (name2, value) => asPx(value));
  }
  function mProp(name, suffix, onValue) {
    const names = suffix.map((v) => `${name}${v}`);
    return onValue ? (value, theme) => names.reduce((result, name2) => {
      result[name2] = onValue(name2, value, theme);
      return result;
    }, {}) : (value) => names.reduce((result, name2) => {
      result[name2] = value;
      return result;
    }, {});
  }
  function createSystemProps() {
    return {
      ...createSystemDisplayProps(),
      ...createSystemFlexboxProps(),
      ...createSystemGridProps(),
      ...createSystemPositionProps(),
      ...createSystemPaletteProps(),
      ...createSystemSizingProps(),
      ...createSystemBorderProps(),
      ...createSystemSpacingProps(),
      ...createSystemTypographyProps()
    };
  }
  function createSystemDisplayProps() {
    return {
      displayPrint: customProp("displayPrint", (name, display) => ({
        "@media print": {
          display
        }
      })),
      displayRaw: prop("display"),
      overflow: prop("overflow"),
      textOverflow: prop("textOverflow"),
      visibility: prop("visibility"),
      whiteSpace: prop("whiteSpace")
    };
  }
  function createSystemFlexboxProps() {
    return {
      flexBasis: prop("flexBasis"),
      flexDirection: prop("flexDirection"),
      flexWrap: prop("flexWrap"),
      justifyContent: prop("justifyContent"),
      alignItems: prop("alignItems"),
      alignContent: prop("alignContent"),
      order: prop("order"),
      flex: prop("flex"),
      flexGrow: prop("flexGrow"),
      flexShrink: prop("flexShrink"),
      alignSelf: prop("alignSelf"),
      justifyItems: prop("justifyItems"),
      justifySelf: prop("justifySelf")
    };
  }
  function createSystemGridProps() {
    const spacing = (name, value, theme) => createUnaryUnit(theme, "spacing", 8)(value);
    return {
      gap: prop("gap", spacing),
      columnGap: prop("columnGap", spacing),
      rowGap: prop("rowGap", spacing),
      gridColumn: prop("gridColumn"),
      gridRow: prop("gridRow"),
      gridAutoFlow: prop("gridAutoFlow"),
      gridAutoColumns: prop("gridAutoColumns"),
      gridAutoRows: prop("gridAutoRows"),
      gridTemplateColumns: prop("gridTemplateColumns"),
      gridTemplateRows: prop("gridTemplateRows"),
      gridTemplateAreas: prop("gridTemplateAreas"),
      gridArea: prop("gridArea")
    };
  }
  function createSystemPositionProps() {
    return {
      position: prop("position"),
      zIndex: prop("zIndex", (name, value, theme) => {
        var _a2;
        return ((_a2 = theme.zIndex) == null ? void 0 : _a2[name]) ?? value;
      }),
      top: pxProp("top"),
      right: pxProp("right"),
      bottom: pxProp("bottom"),
      left: pxProp("left")
    };
  }
  function createSystemPaletteProps() {
    const paletteValue = (name, value, theme) => getThemeValue(theme, "palette", value);
    return {
      color: prop("color", paletteValue),
      bgcolor: prop("backgroundColor", paletteValue),
      backgroundColor: prop("backgroundColor", paletteValue)
    };
  }
  function createSystemSizingProps() {
    const onValue = (name, value, theme) => {
      if (name === "maxWidth") {
        value = theme.breakpoints.values[name] ?? value;
      }
      if (typeof value === "number") {
        value = value > 0 && value <= 1 ? `${value * 100}%` : `${value}px`;
      }
      return value;
    };
    return {
      width: prop("width", onValue),
      maxWidth: prop("maxWidth", onValue),
      minWidth: prop("minWidth", onValue),
      height: prop("height", onValue),
      maxHeight: prop("maxHeight", onValue),
      minHeight: prop("minHeight", onValue),
      boxSizing: prop("boxSizing", onValue)
    };
  }
  function createSystemBorderProps() {
    const borderValue = (name, value) => typeof value === "number" ? `${value}px solid` : value;
    const paletteValue = (name, value, theme) => getThemeValue(theme, "palette", value);
    return {
      border: prop("border", borderValue),
      borderTop: prop("borderTop", borderValue),
      borderRight: prop("borderRight", borderValue),
      borderBottom: prop("borderBottom", borderValue),
      borderLeft: prop("borderLeft", borderValue),
      borderColor: prop("borderColor", paletteValue),
      borderTopColor: prop("borderTopColor", paletteValue),
      borderRightColor: prop("borderRightColor", paletteValue),
      borderBottomColor: prop("borderBottomColor", paletteValue),
      borderLeftColor: prop("borderLeftColor", paletteValue),
      borderRadius: prop("borderRadius", (name, value, theme) => typeof value === "number" ? `${theme.shape.borderRadius * value}px` : value)
    };
  }
  function createSystemTypographyProps() {
    const typographyValue = (name, value, theme) => getThemeValue(theme, "typography", value);
    return {
      typography: customProp("typography", (name, value, theme) => getThemeValue(theme, "typography", value)),
      fontFamily: prop("fontFamily", typographyValue),
      fontSize: prop("fontSize", (name, value, theme) => asPx(typographyValue(name, value, theme))),
      fontStyle: prop("fontStyle", typographyValue),
      fontWeight: prop("fontWeight", typographyValue),
      letterSpacing: pxProp("letterSpacing"),
      lineHeight: prop("lineHeight"),
      textAlign: prop("textAlign"),
      textTransform: prop("textTransform")
    };
  }
  function createSystemSpacingProps() {
    const spacing = (name, value, theme) => theme.spacing(value);
    const m = "margin";
    const p = "padding";
    return {
      m: prop(m, spacing),
      mt: prop("marginTop", spacing),
      mr: prop("marginRight", spacing),
      mb: prop("marginBottom", spacing),
      ml: prop("marginLeft", spacing),
      mx: mProp(m, dirMap["x"], spacing),
      my: mProp(m, dirMap["y"], spacing),
      margin: prop(m, spacing),
      marginTop: prop("marginTop", spacing),
      marginRight: prop("marginRight", spacing),
      marginBottom: prop("marginBottom", spacing),
      marginLeft: prop("marginLeft", spacing),
      marginX: mProp(m, dirMap["x"], spacing),
      marginY: mProp(m, dirMap["y"], spacing),
      marginInline: mProp(m, ["Inline", "InlineStart"], spacing),
      marginInlineStart: prop("marginInlineStart", spacing),
      marginInlineEnd: prop("marginInlineEnd", spacing),
      marginBlock: mProp(m, ["BlockStart", "BlockEnd"], spacing),
      marginBlockStart: prop("marginBlockStart", spacing),
      marginBlockEnd: prop("marginBlockEnd", spacing),
      p: prop(p, spacing),
      pt: prop("paddingTop", spacing),
      pr: prop("paddingRight", spacing),
      pb: prop("paddingBottom", spacing),
      pl: prop("paddingLeft", spacing),
      px: mProp(p, dirMap["x"], spacing),
      py: mProp(p, dirMap["y"], spacing),
      padding: prop(p, spacing),
      paddingTop: prop("paddingTop", spacing),
      paddingRight: prop("paddingRight", spacing),
      paddingBottom: prop("paddingBottom", spacing),
      paddingLeft: prop("paddingLeft", spacing),
      paddingX: mProp(p, dirMap["x"], spacing),
      paddingY: mProp(p, dirMap["y"], spacing),
      paddingInline: mProp(p, ["Inline", "InlineStart"], spacing),
      paddingInlineStart: prop("paddingInlineStart", spacing),
      paddingInlineEnd: prop("paddingInlineEnd", spacing),
      paddingBlock: mProp(p, ["BlockStart", "BlockEnd"], spacing),
      paddingBlockStart: prop("paddingBlockStart", spacing),
      paddingBlockEnd: prop("paddingBlockEnd", spacing)
    };
  }
  const systemProps = createSystemProps();
  const systemPropNames = Object.keys(systemProps);
  function resolveSystemPropsValue(name, value, theme) {
    return systemProps[name](value, theme);
  }
  function reslveSxPropsValue(name, value, theme) {
    return name in systemProps ? resolveSystemPropsValue(name, value, theme) : resolveStyledPropsValue(name, value);
  }
  function resolveSxProps(v, theme) {
    return resolve(v, (name, value) => reslveSxPropsValue(name, value, theme));
  }
  function r(e) {
    var t, f, n = "";
    if ("string" == typeof e || "number" == typeof e)
      n += e;
    else if ("object" == typeof e)
      if (Array.isArray(e))
        for (t = 0; t < e.length; t++)
          e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
      else
        for (t in e)
          e[t] && (n && (n += " "), n += t);
    return n;
  }
  function clsx() {
    for (var e, t, f = 0, n = ""; f < arguments.length; )
      (e = arguments[f++]) && (t = r(e)) && (n && (n += " "), n += t);
    return n;
  }
  const skipProps = ["ownerState", "theme", "sx", "as"];
  function resolveStyles(useTheme2, className2, styles, inProps) {
    return createMemo(() => {
      const theme = useTheme2();
      return styles.reduce((result, style2) => {
        let styledProps;
        if (typeof style2 === "function") {
          styledProps = style2({
            ownerState: inProps.ownerState,
            theme,
            sx: inProps.sx,
            as: inProps.as,
            props: inProps
          });
        } else if (style2) {
          styledProps = style2;
        }
        if (styledProps)
          result.push({
            ["name"]: className2,
            ...resolveStyledProps(styledProps)
          });
        return result;
      }, []);
    });
  }
  function isStyledComponent(input) {
    return typeof input === "function" && "__styled" in input && !!input.__styled;
  }
  function createStyled(config) {
    return function styled2(Component, options = {}) {
      let className2;
      if (options.name) {
        const slot = options.slot || "Root";
        className2 = `${options.name}-${slot.slice(0, 1).toLowerCase() + slot.slice(1)}`;
      } else {
        className2 = `styled-${randomString()}`;
      }
      return function(...styles) {
        function StyledComponent(inProps) {
          const $useTheme = () => inProps.theme ?? ((config == null ? void 0 : config.onUseTheme) ? config.onUseTheme() : useTheme$2());
          const [, otherProps] = splitProps(inProps, options.skipProps ?? skipProps);
          const inStyles = resolveStyles(
            $useTheme,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            options.name ? className2 : "css",
            styles,
            inProps
          );
          const inSx = createMemo(() => !options.skipSx && inProps.sx ? Array.isArray(inProps.sx) ? inProps.sx : [inProps.sx] : []);
          const sx = () => {
            const theme = $useTheme();
            return [...inStyles().map((v) => ({
              ...v,
              __resolved: true
            })), ...inSx().map((sx2) => sx2.__resolved ? sx2 : resolveSxProps(sx2, theme))];
          };
          const styledComponent = createMemo(() => isStyledComponent(Component));
          const $component = () => inProps.as && !styledComponent() ? inProps.as : Component;
          const styled$Component = createMemo(() => isStyledComponent($component()));
          const as = () => inProps.as && styledComponent() ? inProps.as : void 0;
          const styledProps = () => styled$Component() && {
            ownerState: inProps.ownerState,
            sx: sx()
          };
          const styleClassName = createStyle(() => styled$Component() ? void 0 : sx());
          const component = () => styled$Component() ? otherProps.component : null;
          return createComponent(Dynamic, mergeProps(otherProps, {
            get $component() {
              return $component();
            },
            get component() {
              return component();
            },
            get as() {
              return as();
            }
          }, styledProps, {
            get ["class"]() {
              return clsx([.../* @__PURE__ */ new Set([inProps.class, className2, styleClassName()])]);
            }
          }));
        }
        StyledComponent["__styled"] = true;
        if (className2)
          StyledComponent.toString = () => `.${className2}`;
        return StyledComponent;
      };
    };
  }
  const skipRootProps = [...skipProps, "classes"];
  const styled$1 = createStyled({
    onUseTheme: () => useTheme$1()
  });
  function composeClasses(slots, getUtilityClass, classes) {
    const output = {};
    Object.keys(slots).forEach(
      // `Objet.keys(slots)` can't be wider than `T` because we infer `T` from `slots`.
      // @ts-expect-error https://github.com/microsoft/TypeScript/pull/12253#issuecomment-263132208
      (slot) => {
        output[slot] = slots[slot].reduce((acc, key) => {
          if (key) {
            if (classes && classes[key]) {
              acc.push(classes[key]);
            }
            acc.push(getUtilityClass(key));
          }
          return acc;
        }, []).join(" ");
      }
    );
    return output;
  }
  function componentTrap(fn) {
    function Component(props) {
      return fn(props);
    }
    Object.defineProperty(Component, "name", {
      value: fn.name
    });
    Component.toString = fn.toString;
    return Component;
  }
  function createComponentFactory() {
    return function(options) {
      function useClasses(ownerState) {
        const haveSlotClasses = !!options.slotClasses;
        const compose = () => {
          if (!options.slotClasses)
            throw new Error(`'slotClasses' option is not defined`);
          if (!options.utilityClass)
            throw new Error(`'utilityClass' option is not defined`);
          return composeClasses(options.slotClasses(ownerState), options.utilityClass, ownerState["classes"] ?? "");
        };
        const classes = createMutable({});
        if (haveSlotClasses)
          createComputed(() => {
            const result = compose();
            batch(() => {
              for (const slot in result)
                classes[slot] = result[slot];
            });
          });
        return classes;
      }
      function splitInProps(allProps) {
        const [props, otherProps] = splitProps(allProps, options.selfPropNames);
        return { allProps, props, otherProps };
      }
      function useThemeProps$1(input) {
        return useThemeProps({
          propDefaults: options.propDefaults,
          ...input,
          name: options.name
        });
      }
      function useProps(props) {
        const themeProps = useThemeProps$1({ props });
        return splitInProps(themeProps);
      }
      function defineComponent2(cb) {
        cb = componentTrap(cb);
        cb.toString = () => `.${options.name}-root`;
        cb.__styled = true;
        return cb;
      }
      function component(cb) {
        const Component = defineComponent2(function Component2(inProps) {
          const { allProps, otherProps, props } = useProps(inProps);
          const classes = options.autoCallUseClasses ?? true ? useClasses(allProps) : {};
          return cb({
            allProps,
            otherProps,
            props,
            classes
          });
        });
        Object.defineProperty(Component, "name", { value: cb.name });
        return Component;
      }
      return {
        name: options.name,
        selfPropNames: options.selfPropNames,
        component,
        defineComponent: defineComponent2,
        useClasses,
        useThemeProps: useThemeProps$1,
        useProps,
        splitInProps
      };
    };
  }
  function defineComponent(cb) {
    return cb;
  }
  function extendSxProp(props) {
    const [systemProps2, otherProps] = splitProps(props, systemPropNames);
    const sx = () => {
      const sx2 = props.sx;
      if (sx2) {
        if (Array.isArray(sx2)) {
          return [systemProps2, ...sx2];
        } else {
          return mergeProps(systemProps2, sx2);
        }
      } else {
        return systemProps2;
      }
    };
    return mergeProps(otherProps, {
      get sx() {
        return sx();
      }
    });
  }
  const styled = createStyled();
  const BoxRoot = styled("div", {
    name: "MuiBox",
    slot: "Root",
    skipProps: [...skipProps, "component"]
  })();
  const Box$1 = defineComponent(function Box2(inProps) {
    inProps = extendSxProp(inProps);
    return createComponent(BoxRoot, mergeProps(inProps, {
      get as() {
        return inProps.as ?? inProps.component;
      }
    }));
  });
  Box$1.toString = BoxRoot.toString;
  const $$p = createComponentFactory()({
    name: "MuiBox",
    selfPropNames: [],
    utilityClass: (slot) => `MuiBox-${slot}`,
    slotClasses: () => ({
      root: ["root"]
    })
  });
  const Box = $$p.component(function Box2({
    otherProps,
    classes
  }) {
    const theme = useTheme$1();
    return createComponent(Box$1, mergeProps({
      theme
    }, otherProps, {
      get ["class"]() {
        return clsx(classes.root, otherProps.class);
      }
    }));
  });
  const _tmpl$$5 = /* @__PURE__ */ template(`<span></span>`);
  const $$o = createComponentFactory()({
    name: "MuiRipple",
    selfPropNames: ["class", "classes", "pulsate", "rippleX", "rippleY", "rippleSize", "in", "onExited", "timeout"],
    propDefaults: ({
      set
    }) => set({
      pulsate: false,
      classes: {}
    })
  });
  const Ripple = $$o.component(function Ripple2({
    props,
    otherProps
  }) {
    const [leaving, setLeaving] = createSignal(false);
    const rippleClassName = createMemo(() => clsx(props.class, props.classes.ripple, props.classes.rippleVisible, props.classes.ripplePulsate && {
      [props.classes.ripplePulsate]: props.pulsate
    }));
    const rippleStyles = createMemo(() => ({
      width: `${props.rippleSize}px`,
      height: `${props.rippleSize}px`,
      top: `${-(props.rippleSize / 2) + props.rippleY}px`,
      left: `${-(props.rippleSize / 2) + props.rippleX}px`
    }));
    const childClassName = createMemo(() => clsx(props.classes.child, props.classes.childLeaving && {
      [props.classes.childLeaving]: leaving()
    }, props.classes.childPulsate && {
      [props.classes.childPulsate]: props.pulsate
    }));
    createEffect(() => {
      if (!props.in && !leaving()) {
        setLeaving(true);
      }
    });
    let timeoutId;
    createEffect(() => {
      if (!props.in && props.onExited) {
        clearTimeout(timeoutId);
        timeoutId = window.setTimeout(props.onExited, props.timeout);
      }
    });
    onCleanup(() => clearTimeout(timeoutId));
    return createComponent(Box, {
      as: "span",
      get ["class"]() {
        return rippleClassName();
      },
      get style() {
        return rippleStyles();
      },
      get sx() {
        return otherProps.sx;
      },
      get children() {
        const _el$ = _tmpl$$5.cloneNode(true);
        createRenderEffect(() => className(_el$, childClassName()));
        return _el$;
      }
    });
  });
  const defaultGenerator = (componentName) => componentName;
  const createClassNameGenerator = () => {
    let generate = defaultGenerator;
    return {
      configure(generator) {
        generate = generator;
      },
      generate(componentName) {
        return generate(componentName);
      },
      reset() {
        generate = defaultGenerator;
      }
    };
  };
  const ClassNameGenerator = createClassNameGenerator();
  const globalStateClassesMapping = {
    active: "Mui-active",
    checked: "Mui-checked",
    completed: "Mui-completed",
    disabled: "Mui-disabled",
    error: "Mui-error",
    expanded: "Mui-expanded",
    focused: "Mui-focused",
    focusVisible: "Mui-focusVisible",
    required: "Mui-required",
    selected: "Mui-selected"
  };
  function generateUtilityClass(componentName, slot) {
    const globalStateClass = globalStateClassesMapping[slot];
    return globalStateClass || `${ClassNameGenerator.generate(componentName)}-${slot}`;
  }
  function generateUtilityClasses(componentName, slots) {
    const result = {};
    slots.forEach((slot) => {
      result[slot] = generateUtilityClass(componentName, slot);
    });
    return result;
  }
  const touchRippleClasses = generateUtilityClasses("MuiTouchRipple", [
    "root",
    "ripple",
    "rippleVisible",
    "ripplePulsate",
    "child",
    "childLeaving",
    "childPulsate"
  ]);
  function createRef(input) {
    const cb = (e) => {
      cb.ref = cb.current = e;
      if (typeof input === "function") {
        const inputResult = input();
        if (typeof inputResult === "function") {
          inputResult(e);
        }
      } else if (typeof (input == null ? void 0 : input.ref) === "function") {
        input.ref(e);
      }
    };
    return cb;
  }
  function createElementRef(props) {
    return createRef(props);
  }
  const $$n = createComponentFactory()({
    name: "MuiTouchRipple",
    selfPropNames: ["center", "classes", "ref"],
    propDefaults: ({
      set
    }) => set({
      center: false,
      classes: {}
    })
  });
  const DURATION = 550;
  const DELAY_RIPPLE = 80;
  const TouchRippleRoot = styled$1("span", {
    name: "MuiTouchRipple",
    slot: "Root"
  })({
    overflow: "hidden",
    pointerEvents: "none",
    position: "absolute",
    zIndex: 0,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: "inherit"
  });
  const TouchRippleRipple = styled$1(Ripple, {
    name: "MuiTouchRipple",
    slot: "Ripple"
  })(({
    theme
  }) => ({
    position: "absolute",
    "@keyframes animation-enter-$id": {
      0: {
        transform: "scale(0)",
        opacity: 0.1
      },
      100: {
        transform: "scale(1)",
        opacity: 0.3
      }
    },
    "@keyframes animation-exit-$id": {
      0: {
        opacity: 1
      },
      100: {
        opacity: 0
      }
    },
    "@keyframes animation-pulsate-$id": {
      0: {
        transform: "scale(1)"
      },
      50: {
        transform: "scale(0.92)"
      },
      100: {
        transform: "scale(1)"
      }
    },
    [`&.${touchRippleClasses.rippleVisible}`]: {
      opacity: "0.3",
      transform: "scale(1)",
      animationName: `animation-enter-$id`,
      animationDuration: `${DURATION}ms`,
      animationTimingFunction: theme.transitions.easing.easeInOut
    },
    [`&.${touchRippleClasses.ripplePulsate}`]: {
      animationDuration: `${theme.transitions.duration.shorter}ms`
    },
    [`& .${touchRippleClasses.child}`]: {
      opacity: 1,
      display: "block",
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      backgroundColor: "currentColor"
    },
    [`& .${touchRippleClasses.childLeaving}`]: {
      opacity: 0,
      animationName: `animation-exit-$id`,
      animationDuration: `${DURATION}ms`,
      animationTimingFunction: `${theme.transitions.easing.easeInOut}`
    },
    [`& .${touchRippleClasses.childPulsate}`]: {
      position: "absolute",
      left: "0px",
      top: 0,
      animationName: `animation-pulsate-$id`,
      animationDuration: "2500ms",
      animationTimingFunction: `${theme.transitions.easing.easeInOut}`,
      animationIterationCount: "infinite",
      animationDelay: "200ms"
    }
  }));
  const TouchRipple = $$n.component(function TouchRipple2({
    props,
    otherProps
  }) {
    let counter2 = 0;
    const [ripples, setRipples] = createSignal([]);
    const inProps = createMutable({});
    let rippleCallback;
    let ignoringMouseDown = false;
    let startTimer;
    let startTimerCommit;
    const container = createElementRef(otherProps);
    onCleanup(() => {
      if (startTimer)
        clearTimeout(startTimer);
    });
    createEffect(() => {
      ripples();
      if (rippleCallback) {
        rippleCallback();
        rippleCallback = void 0;
      }
    });
    const startCommit = (params) => {
      const id = counter2++;
      inProps[id] = true;
      setRipples((oldRipples) => [...oldRipples, {
        id,
        params
      }]);
      rippleCallback = params.cb;
    };
    const start = (event, options = {
      pulsate: false,
      center: props.center
    }, cb) => {
      options = mergeProps(options, {
        center: options.center || options.pulsate
      });
      if (event.type === "mousedown" && ignoringMouseDown) {
        ignoringMouseDown = false;
        return;
      }
      if (event.type === "touchstart") {
        ignoringMouseDown = true;
      }
      const rect = container.ref ? container.ref.getBoundingClientRect() : {
        width: 0,
        height: 0,
        left: 0,
        top: 0
      };
      let rippleX;
      let rippleY;
      let rippleSize;
      if (options.center || event.clientX === 0 && event.clientY === 0 || !event.clientX && !event.touches) {
        rippleX = Math.round(rect.width / 2);
        rippleY = Math.round(rect.height / 2);
      } else {
        const {
          clientX,
          clientY
        } = event.touches ? event.touches[0] : event;
        rippleX = Math.round(clientX - rect.left);
        rippleY = Math.round(clientY - rect.top);
      }
      if (options.center) {
        rippleSize = Math.sqrt((2 * rect.width ** 2 + rect.height ** 2) / 3);
        if (rippleSize % 2 === 0) {
          rippleSize += 1;
        }
      } else {
        const sizeX = Math.max(Math.abs((container.ref ? container.ref.clientWidth : 0) - rippleX), rippleX) * 2 + 2;
        const sizeY = Math.max(Math.abs((container.ref ? container.ref.clientHeight : 0) - rippleY), rippleY) * 2 + 2;
        rippleSize = Math.sqrt(sizeX ** 2 + sizeY ** 2);
      }
      if (event.touches) {
        if (!startTimerCommit) {
          startTimerCommit = () => {
            startCommit({
              pulsate: options.pulsate,
              rippleX,
              rippleY,
              rippleSize,
              cb
            });
          };
          startTimer = setTimeout(() => {
            if (startTimerCommit) {
              startTimerCommit();
              startTimerCommit = void 0;
            }
          }, DELAY_RIPPLE);
        }
      } else {
        startCommit({
          pulsate: options.pulsate,
          rippleX,
          rippleY,
          rippleSize,
          cb
        });
      }
    };
    const pulsate = () => start({}, {
      pulsate: true
    });
    const stop = (event, cb) => {
      clearTimeout(startTimer);
      if (event.type === "touchend" && startTimerCommit) {
        startTimerCommit();
        startTimerCommit = void 0;
        startTimer = setTimeout(() => {
          stop(event, cb);
        });
        return;
      }
      for (const id in inProps)
        inProps[id] = false;
      startTimerCommit = void 0;
      rippleCallback = cb;
    };
    const actions = {
      pulsate,
      start,
      stop
    };
    if (typeof props.ref === "function") {
      props.ref(actions);
    }
    return createComponent(TouchRippleRoot, mergeProps({
      get ["class"]() {
        return clsx(props.classes.root, touchRippleClasses.root, otherProps.class);
      },
      ref: container
    }, otherProps, {
      get children() {
        return mapArray(ripples, (data) => createComponent(TouchRippleRipple, {
          get ["in"]() {
            return inProps[data.id];
          },
          onExited: () => {
            setRipples((oldRipples) => oldRipples.filter((v) => v.id !== data.id));
            delete inProps[data.id];
          },
          get classes() {
            return {
              ripple: clsx(props.classes.ripple, touchRippleClasses.ripple),
              rippleVisible: clsx(props.classes.rippleVisible, touchRippleClasses.rippleVisible),
              ripplePulsate: clsx(props.classes.ripplePulsate, touchRippleClasses.ripplePulsate),
              child: clsx(props.classes.child, touchRippleClasses.child),
              childLeaving: clsx(props.classes.childLeaving, touchRippleClasses.childLeaving),
              childPulsate: clsx(props.classes.childPulsate, touchRippleClasses.childPulsate)
            };
          },
          timeout: DURATION,
          get pulsate() {
            return data.params.pulsate;
          },
          get rippleX() {
            return data.params.rippleX;
          },
          get rippleY() {
            return data.params.rippleY;
          },
          get rippleSize() {
            return data.params.rippleSize;
          }
        }));
      }
    }));
  });
  function getButtonBaseUtilityClass(slot) {
    return generateUtilityClass("MuiButtonBase", slot);
  }
  const buttonBaseClasses = generateUtilityClasses("MuiButtonBase", ["root", "disabled", "focusVisible"]);
  const $$m = createComponentFactory()({
    name: "MuiButtonBase",
    selfPropNames: ["LinkComponent", "TouchRippleProps", "action", "centerRipple", "children", "classes", "disableRipple", "disableRipple", "disableTouchRipple", "disabled", "focusRipple", "focusVisibleClassName", "onFocusVisible", "tabIndex", "touchRippleRef"],
    propDefaults: ({
      set
    }) => set({
      component: "button",
      disabled: false,
      disableRipple: false,
      disableTouchRipple: false,
      focusRipple: false,
      LinkComponent: "a",
      centerRipple: false,
      tabIndex: 0
    }),
    autoCallUseClasses: false,
    utilityClass: getButtonBaseUtilityClass,
    slotClasses: (ownerState) => ({
      root: ["root", ownerState.disabled && "disabled", ownerState.focusVisible && "focusVisible"]
    })
  });
  const ButtonBaseRoot = styled$1("button", {
    name: "MuiButtonBase",
    slot: "Root",
    overridesResolver: (props, styles) => styles.root
  })({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    boxSizing: "border-box",
    ["WebkitTapHighlightColor"]: "transparent",
    backgroundColor: "transparent",
    // We disable the focus ring for mouse, touch and keyboard users.
    outline: 0,
    border: 0,
    margin: 0,
    borderRadius: 0,
    padding: 0,
    cursor: "pointer",
    userSelect: "none",
    verticalAlign: "middle",
    ["MozAppearance"]: "none",
    ["WebkitAppearance"]: "none",
    textDecoration: "none",
    // So we take precedent over the style of a native <a /> element.
    color: "inherit",
    "&::-moz-focus-inner": {
      borderStyle: "none"
      // Remove Firefox dotted outline.
    },
    [`&.${buttonBaseClasses.disabled}`]: {
      pointerEvents: "none",
      cursor: "default"
    },
    "@media print": {
      colorAdjust: "exact"
    }
  });
  const ButtonBase = $$m.component(function ButtonBase2({
    allProps,
    props,
    otherProps
  }) {
    const button = createRef(otherProps);
    const ripple = createRef(() => props.touchRippleRef);
    const focus = useIsFocusVisible();
    let keydown = false;
    const [focusVisible, setFocusVisible] = createSignal(false);
    const [mountedState, setMountedState] = createSignal(false);
    const ownerState = mergeProps(allProps, {
      get focusVisible() {
        return focusVisible();
      }
    });
    const classes = $$m.useClasses(ownerState);
    onMount(() => {
      setMountedState(true);
    });
    createEffect(() => {
      if (props.disabled && focusVisible()) {
        setFocusVisible(false);
      }
    });
    createEffect(() => {
      if (focusVisible() && props.focusRipple && !props.disableRipple) {
        ripple.ref.pulsate();
      }
    });
    function useRippleHandler(rippleAction, eventCallback, skipRippleAction = props.disableTouchRipple) {
      return (event) => {
        if (typeof eventCallback === "function") {
          eventCallback(event);
        }
        const ignore = skipRippleAction;
        if (!ignore && ripple.ref) {
          ripple.ref[rippleAction](event);
        }
        return true;
      };
    }
    const handleMouseDown = useRippleHandler("start", otherProps.onMouseDown);
    const handleContextMenu = useRippleHandler("stop", otherProps.onContextMenu);
    const handleDragLeave = useRippleHandler("stop", otherProps.onDragLeave);
    const handleMouseUp = useRippleHandler("stop", otherProps.onMouseUp);
    const handleMouseLeave = useRippleHandler("stop", (event) => {
      if (focusVisible()) {
        event.preventDefault();
      }
      if (typeof otherProps.onMouseLeave === "function") {
        otherProps.onMouseLeave(event);
      }
    });
    const handleTouchStart = useRippleHandler("start", otherProps.onTouchStart);
    const handleTouchEnd = useRippleHandler("stop", otherProps.onTouchEnd);
    const handleTouchMove = useRippleHandler("stop", otherProps.onTouchMove);
    const handleBlur = useRippleHandler("stop", (event) => {
      focus.onBlur(event);
      if (focus.isFocusVisibleRef.current === false) {
        setFocusVisible(false);
      }
      if (typeof otherProps.onFocusOut === "function") {
        otherProps.onFocusOut(event);
      }
    }, false);
    const handleFocus = (event) => {
      if (!button.ref) {
        button.ref = event.currentTarget;
      }
      focus.onFocus(event);
      if (focus.isFocusVisibleRef.current === true) {
        setFocusVisible(true);
        if (props.onFocusVisible) {
          props.onFocusVisible(event);
        }
      }
      if (typeof otherProps.onFocusIn === "function") {
        otherProps.onFocusIn(event);
      }
    };
    const isNonNativeButton = () => {
      return otherProps.component && otherProps.component !== "button" && !(button.ref.tagName === "A" && button.ref.hasAttribute("href"));
    };
    const handleKeyDown2 = (event) => {
      if (props.focusRipple && !keydown && focusVisible() && ripple.ref && event.key === " ") {
        keydown = true;
        ripple.ref.stop(event, () => {
          ripple.ref.start(event);
        });
      }
      if (event.target === event.currentTarget && isNonNativeButton() && event.key === " ") {
        event.preventDefault();
      }
      if (typeof otherProps.onKeyDown === "function") {
        otherProps.onKeyDown(event);
      }
      if (event.target === event.currentTarget && isNonNativeButton() && event.key === "Enter" && !props.disabled) {
        event.preventDefault();
        if (typeof otherProps.onClick === "function") {
          otherProps.onClick(event);
        }
      }
    };
    const handleKeyUp = (event) => {
      if (props.focusRipple && event.key === " " && ripple.ref && focusVisible() && !event.defaultPrevented) {
        keydown = false;
        ripple.ref.stop(event, () => {
          ripple.ref.pulsate(event);
        });
      }
      if (typeof otherProps.onKeyUp === "function") {
        otherProps.onKeyUp(event);
      }
      if (typeof otherProps.onClick === "function" && event.target === event.currentTarget && isNonNativeButton() && event.key === " " && !event.defaultPrevented) {
        otherProps.onClick(event);
      }
    };
    const ComponentProp = createMemo(() => {
      let result = otherProps.component;
      if (result === "button" && (otherProps.href || otherProps.to)) {
        result = props.LinkComponent;
      }
      return result;
    });
    const buttonProps = createMemo(() => {
      const buttonProps2 = {};
      if (ComponentProp() === "button") {
        buttonProps2.type = otherProps.type === void 0 ? "button" : otherProps.type;
        buttonProps2.disabled = props.disabled;
      } else {
        if (!otherProps.href && !otherProps.to) {
          buttonProps2.role = "button";
        }
        if (props.disabled) {
          buttonProps2["aria-disabled"] = props.disabled;
        }
      }
      return buttonProps2;
    });
    const enableTouchRipple = () => mountedState() && !props.disableRipple && !props.disabled;
    return createComponent(ButtonBaseRoot, mergeProps(buttonProps, otherProps, {
      get ["class"]() {
        return clsx(classes.root, otherProps.class);
      },
      ownerState,
      onFocusOut: handleBlur,
      get onClick() {
        return otherProps.onClick;
      },
      onContextMenu: handleContextMenu,
      onFocusIn: handleFocus,
      onKeyDown: handleKeyDown2,
      onKeyUp: handleKeyUp,
      onMouseDown: handleMouseDown,
      onMouseLeave: handleMouseLeave,
      onMouseUp: handleMouseUp,
      onDragLeave: handleDragLeave,
      onTouchEnd: handleTouchEnd,
      onTouchMove: handleTouchMove,
      onTouchStart: handleTouchStart,
      ref: button,
      get tabIndex() {
        return props.disabled ? -1 : props.tabIndex;
      },
      get type() {
        return otherProps.type;
      },
      get as() {
        return ComponentProp();
      },
      get children() {
        return [createMemo(() => props.children), createComponent(Show, {
          get when() {
            return enableTouchRipple();
          },
          get children() {
            return createComponent(TouchRipple, mergeProps({
              ref: (ref) => {
                ripple(ref);
              },
              get center() {
                return props.centerRipple;
              }
            }, () => props.TouchRippleProps || {}));
          }
        })];
      }
    }));
  });
  const ButtonGroupContext = createContext({});
  function getButtonUtilityClass(slot) {
    return generateUtilityClass("MuiButton", slot);
  }
  const buttonClasses = generateUtilityClasses("MuiButton", [
    "root",
    "text",
    "textInherit",
    "textPrimary",
    "textSecondary",
    "outlined",
    "outlinedInherit",
    "outlinedPrimary",
    "outlinedSecondary",
    "contained",
    "containedInherit",
    "containedPrimary",
    "containedSecondary",
    "disableElevation",
    "focusVisible",
    "disabled",
    "colorInherit",
    "textSizeSmall",
    "textSizeMedium",
    "textSizeLarge",
    "outlinedSizeSmall",
    "outlinedSizeMedium",
    "outlinedSizeLarge",
    "containedSizeSmall",
    "containedSizeMedium",
    "containedSizeLarge",
    "sizeMedium",
    "sizeSmall",
    "sizeLarge",
    "fullWidth",
    "startIcon",
    "endIcon",
    "iconSizeSmall",
    "iconSizeMedium",
    "iconSizeLarge"
  ]);
  const $$l = createComponentFactory()({
    name: "MuiButton",
    selfPropNames: ["children", "classes", "color", "disableElevation", "disableFocusRipple", "disabled", "endIcon", "fullWidth", "href", "size", "startIcon", "variant"],
    propDefaults: ({
      set
    }) => {
      const contextProps = useContext(ButtonGroupContext);
      return set({
        get color() {
          return contextProps.color ?? "primary";
        },
        component: "button",
        get disabled() {
          return contextProps.disabled ?? false;
        },
        get disableElevation() {
          return contextProps.disableElevation ?? false;
        },
        get disableFocusRipple() {
          return contextProps.disableFocusRipple ?? false;
        },
        get fullWidth() {
          return contextProps.fullWidth ?? false;
        },
        get size() {
          return contextProps.size ?? "medium";
        },
        get variant() {
          return contextProps.variant ?? "text";
        }
      });
    },
    utilityClass: getButtonUtilityClass,
    slotClasses: (ownerState) => ({
      root: ["root", ownerState.variant, `${ownerState.variant}${capitalize(ownerState.color)}`, `size${capitalize(ownerState.size)}`, `${ownerState.variant}Size${capitalize(ownerState.size)}`, ownerState.color === "inherit" && "colorInherit", ownerState.disableElevation && "disableElevation", ownerState.fullWidth && "fullWidth"],
      label: ["label"],
      startIcon: ["startIcon", `iconSize${capitalize(ownerState.size)}`],
      endIcon: ["endIcon", `iconSize${capitalize(ownerState.size)}`]
    })
  });
  const commonIconStyles = (ownerState) => ({
    ...ownerState.size === "small" && {
      "& > *:nth-of-type(1)": {
        fontSize: 18
      }
    },
    ...ownerState.size === "medium" && {
      "& > *:nth-of-type(1)": {
        fontSize: 20
      }
    },
    ...ownerState.size === "large" && {
      "& > *:nth-of-type(1)": {
        fontSize: 22
      }
    }
  });
  const ButtonRoot = styled$1(ButtonBase, {
    skipProps: skipRootProps.filter((v) => v !== "classes"),
    name: "MuiButton",
    slot: "Root",
    overridesResolver: (props, styles) => {
      const {
        ownerState
      } = props;
      return [styles.root, styles[ownerState.variant], styles[`${ownerState.variant}${capitalize(ownerState.color)}`], styles[`size${capitalize(ownerState.size)}`], styles[`${ownerState.variant}Size${capitalize(ownerState.size)}`], ownerState.color === "inherit" && styles.colorInherit, ownerState.disableElevation && styles.disableElevation, ownerState.fullWidth && styles.fullWidth];
    }
  })(({
    theme,
    ownerState
  }) => ({
    ...theme.typography.button,
    minWidth: 64,
    padding: "6px 16px",
    borderRadius: theme.shape.borderRadius,
    transition: theme.transitions.create(["background-color", "box-shadow", "border-color", "color"], {
      duration: theme.transitions.duration.short
    }),
    "&:hover": {
      textDecoration: "none",
      backgroundColor: alpha(theme.palette.text.primary, theme.palette.action.hoverOpacity),
      // Reset on touch devices, it doesn't add specificity
      "@media (hover: none)": {
        backgroundColor: "transparent"
      },
      ...ownerState.variant === "text" && ownerState.color !== "inherit" && {
        backgroundColor: alpha(theme.palette[ownerState.color].main, theme.palette.action.hoverOpacity),
        // Reset on touch devices, it doesn't add specificity
        "@media (hover: none)": {
          backgroundColor: "transparent"
        }
      },
      ...ownerState.variant === "outlined" && ownerState.color !== "inherit" && {
        border: `1px solid ${theme.palette[ownerState.color].main}`,
        backgroundColor: alpha(theme.palette[ownerState.color].main, theme.palette.action.hoverOpacity),
        // Reset on touch devices, it doesn't add specificity
        "@media (hover: none)": {
          backgroundColor: "transparent"
        }
      },
      ...ownerState.variant === "contained" && {
        backgroundColor: theme.palette.grey.A100,
        boxShadow: theme.shadows[4],
        // Reset on touch devices, it doesn't add specificity
        "@media (hover: none)": {
          boxShadow: theme.shadows[2],
          backgroundColor: theme.palette.grey[300]
        }
      },
      ...ownerState.variant === "contained" && ownerState.color !== "inherit" && {
        backgroundColor: theme.palette[ownerState.color].dark,
        // Reset on touch devices, it doesn't add specificity
        "@media (hover: none)": {
          backgroundColor: theme.palette[ownerState.color].main
        }
      }
    },
    "&:active": {
      ...ownerState.variant === "contained" && {
        boxShadow: theme.shadows[8]
      }
    },
    [`&.${buttonClasses.focusVisible}`]: {
      ...ownerState.variant === "contained" && {
        boxShadow: theme.shadows[6]
      }
    },
    [`&.${buttonClasses.disabled}`]: {
      color: theme.palette.action.disabled,
      ...ownerState.variant === "outlined" && {
        border: `1px solid ${theme.palette.action.disabledBackground}`
      },
      ...ownerState.variant === "outlined" && ownerState.color === "secondary" && {
        border: `1px solid ${theme.palette.action.disabled}`
      },
      ...ownerState.variant === "contained" && {
        color: theme.palette.action.disabled,
        boxShadow: theme.shadows[0],
        backgroundColor: theme.palette.action.disabledBackground
      }
    },
    ...ownerState.variant === "text" && {
      padding: "6px 8px"
    },
    ...ownerState.variant === "text" && ownerState.color !== "inherit" && {
      color: theme.palette[ownerState.color].main
    },
    ...ownerState.variant === "outlined" && {
      padding: "5px 15px",
      border: `1px solid ${theme.palette.mode === "light" ? "rgba(0, 0, 0, 0.23)" : "rgba(255, 255, 255, 0.23)"}`
    },
    ...ownerState.variant === "outlined" && ownerState.color !== "inherit" && {
      color: theme.palette[ownerState.color].main,
      border: `1px solid ${alpha(theme.palette[ownerState.color].main, 0.5)}`
    },
    ...ownerState.variant === "contained" && {
      color: theme.palette.getContrastText(theme.palette.grey[300]),
      backgroundColor: theme.palette.grey[300],
      boxShadow: theme.shadows[2]
    },
    ...ownerState.variant === "contained" && ownerState.color !== "inherit" && {
      color: theme.palette[ownerState.color].contrastText,
      backgroundColor: theme.palette[ownerState.color].main
    },
    ...ownerState.color === "inherit" && {
      color: "inherit",
      borderColor: "currentColor"
    },
    ...ownerState.size === "small" && ownerState.variant === "text" && {
      padding: "4px 5px",
      fontSize: theme.typography.pxToRem(13)
    },
    ...ownerState.size === "large" && ownerState.variant === "text" && {
      padding: "8px 11px",
      fontSize: theme.typography.pxToRem(15)
    },
    ...ownerState.size === "small" && ownerState.variant === "outlined" && {
      padding: "3px 9px",
      fontSize: theme.typography.pxToRem(13)
    },
    ...ownerState.size === "large" && ownerState.variant === "outlined" && {
      padding: "7px 21px",
      fontSize: theme.typography.pxToRem(15)
    },
    ...ownerState.size === "small" && ownerState.variant === "contained" && {
      padding: "4px 10px",
      fontSize: theme.typography.pxToRem(13)
    },
    ...ownerState.size === "large" && ownerState.variant === "contained" && {
      padding: "8px 22px",
      fontSize: theme.typography.pxToRem(15)
    },
    ...ownerState.fullWidth && {
      width: "100%"
    }
  }), ({
    ownerState
  }) => ({
    ...ownerState.disableElevation && {
      boxShadow: "none",
      "&:hover": {
        boxShadow: "none"
      },
      [`&.${buttonClasses.focusVisible}`]: {
        boxShadow: "none"
      },
      "&:active": {
        boxShadow: "none"
      },
      [`&.${buttonClasses.disabled}`]: {
        boxShadow: "none"
      }
    }
  }));
  const ButtonStartIcon = styled$1("span", {
    name: "MuiButton",
    slot: "StartIcon",
    overridesResolver: (props, styles) => {
      const {
        ownerState
      } = props;
      return [styles.startIcon, styles[`iconSize${capitalize(ownerState.size)}`]];
    }
  })(({
    ownerState
  }) => ({
    display: "inherit",
    marginRight: 8,
    marginLeft: -4,
    ...ownerState.size === "small" && {
      marginLeft: -2
    },
    ...commonIconStyles(ownerState)
  }));
  const ButtonEndIcon = styled$1("span", {
    name: "MuiButton",
    slot: "EndIcon",
    overridesResolver: (props, styles) => {
      const {
        ownerState
      } = props;
      return [styles.endIcon, styles[`iconSize${capitalize(ownerState.size)}`]];
    }
  })(({
    ownerState
  }) => ({
    display: "inherit",
    marginRight: -4,
    marginLeft: 8,
    ...ownerState.size === "small" && {
      marginRight: -2
    },
    ...commonIconStyles(ownerState)
  }));
  const Button = $$l.component(function Button2({
    allProps,
    otherProps,
    props,
    classes
  }) {
    const contextProps = useContext(ButtonGroupContext);
    return createComponent(ButtonRoot, mergeProps({
      ownerState: allProps,
      get ["class"]() {
        return clsx(classes.root, otherProps.class, contextProps.class);
      },
      get disabled() {
        return props.disabled;
      },
      get focusRipple() {
        return !props.disableFocusRipple;
      },
      get focusVisibleClassName() {
        var _a2;
        return clsx((_a2 = props.classes) == null ? void 0 : _a2.focusVisible, otherProps.focusVisibleClassName);
      },
      get type() {
        return otherProps.type;
      },
      get href() {
        return props.href;
      }
    }, otherProps, {
      get classes() {
        return props.classes;
      },
      get children() {
        return [createComponent(Show, {
          get when() {
            return !!props.startIcon;
          },
          get children() {
            return createComponent(ButtonStartIcon, {
              get ["class"]() {
                return classes.startIcon;
              },
              ownerState: allProps,
              get children() {
                return props.startIcon;
              }
            });
          }
        }), createMemo(() => props.children), createComponent(Show, {
          get when() {
            return !!props.endIcon;
          },
          get children() {
            return createComponent(ButtonEndIcon, {
              get ["class"]() {
                return classes.endIcon;
              },
              ownerState: allProps,
              get children() {
                return props.endIcon;
              }
            });
          }
        })];
      }
    }));
  });
  const SvgIconContext = createContext();
  const FormControlContext = createContext();
  function useFormControl() {
    return useContext(FormControlContext);
  }
  const FormControlLabelContext = createContext();
  function useFormControlLabel() {
    return useContext(FormControlLabelContext);
  }
  function useControlled(props) {
    const isControlled = props.controlled() !== void 0;
    const [valueState, setValue] = createSignal(props.default());
    const value = createMemo(() => isControlled ? props.controlled() : valueState());
    if (isControlled)
      createEffect(() => {
        setValue(() => value());
      });
    const setValueIfUncontrolled = (newValue) => {
      if (!isControlled) {
        setValue(newValue);
      }
    };
    return [value, setValueIfUncontrolled];
  }
  function getSwitchBaseUtilityClass(slot) {
    return generateUtilityClass("PrivateSwitchBase", slot);
  }
  generateUtilityClasses("PrivateSwitchBase", ["root", "checked", "disabled", "input", "edgeStart", "edgeEnd"]);
  const $$k = createComponentFactory()({
    name: "MuiSwitchBase",
    selfPropNames: ["autoFocus", "checked", "checkedIcon", "classes", "defaultChecked", "disableFocusRipple", "disableRipple", "disabled", "edge", "icon", "id", "inputProps", "inputRef", "name", "onChange", "readOnly", "required", "tabIndex", "type", "value"],
    autoCallUseClasses: false,
    propDefaults: ({
      set
    }) => set({
      disableFocusRipple: false,
      edge: false
    }),
    utilityClass: getSwitchBaseUtilityClass,
    slotClasses: (ownerState) => ({
      root: ["root", !!ownerState.checked && "checked", !!ownerState.disabled && "disabled", ownerState.edge && `edge${capitalize(ownerState.edge)}`],
      input: ["input"]
    })
  });
  const SwitchBaseRoot = styled$1(ButtonBase)(({
    ownerState
  }) => ({
    padding: 9,
    borderRadius: "50%",
    ...ownerState.edge === "start" && {
      marginLeft: ownerState.size === "small" ? -3 : -12
    },
    ...ownerState.edge === "end" && {
      marginRight: ownerState.size === "small" ? -3 : -12
    }
  }));
  const SwitchBaseInput = styled$1("input")({
    cursor: "inherit",
    position: "absolute",
    opacity: 0,
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    margin: 0,
    padding: 0,
    zIndex: 1
  });
  const SwitchBase = $$k.component(function SwitchBase2({
    allProps,
    otherProps,
    props
  }) {
    const formControlLabel = useFormControlLabel();
    const [checked, setCheckedState] = useControlled({
      controlled: () => props.checked ?? (formControlLabel == null ? void 0 : formControlLabel.checked),
      default: () => Boolean(props.defaultChecked),
      name: "SwitchBase",
      state: "checked"
    });
    const muiFormControl = useFormControl();
    const disabled = () => {
      if (typeof (formControlLabel == null ? void 0 : formControlLabel.disabled) !== "undefined") {
        return formControlLabel.disabled;
      } else if (muiFormControl && typeof props.disabled === "undefined") {
        return muiFormControl.disabled;
      } else {
        return props.disabled;
      }
    };
    createEffect(() => {
      if (formControlLabel) {
        formControlLabel.setDisabled(!!disabled());
      }
    });
    const hasLabelFor = () => props.type === "checkbox" || props.type === "radio";
    const ownerState = mergeProps(allProps, {
      get checked() {
        return checked();
      },
      get disabled() {
        return disabled();
      }
    });
    const classes = $$k.useClasses(ownerState);
    const element = createRef(() => props.inputRef);
    const inputValue = () => props.value ?? (formControlLabel == null ? void 0 : formControlLabel.value);
    createEffect(() => {
      if (typeof props.defaultChecked === "boolean")
        element.ref.defaultChecked = props.defaultChecked;
    });
    createEffect(() => {
      const value = checked();
      if (typeof value === "boolean")
        element.ref.checked = value;
    });
    return createComponent(SwitchBaseRoot, mergeProps(otherProps, {
      component: "span",
      get ["class"]() {
        return clsx(classes.root, otherProps.class);
      },
      centerRipple: true,
      get focusRipple() {
        return !props.disableFocusRipple;
      },
      get disabled() {
        return disabled();
      },
      tabIndex: null,
      role: void 0,
      onFocus: (event) => {
        var _a2;
        if (typeof otherProps.onFocus === "function") {
          otherProps.onFocus(event);
        }
        (_a2 = muiFormControl == null ? void 0 : muiFormControl.onFocus) == null ? void 0 : _a2.call(muiFormControl);
      },
      onBlur: (event) => {
        var _a2;
        if (typeof otherProps.onBlur === "function") {
          otherProps.onBlur(event);
        }
        (_a2 = muiFormControl == null ? void 0 : muiFormControl.onBlur) == null ? void 0 : _a2.call(muiFormControl);
      },
      ownerState,
      get children() {
        return [createComponent(SwitchBaseInput, mergeProps({
          as: "input",
          get autofocus() {
            return props.autoFocus;
          },
          get ["class"]() {
            return classes.input;
          },
          get disabled() {
            return disabled();
          },
          get id() {
            return hasLabelFor() ? props.id : void 0;
          },
          get name() {
            return props.name ?? (formControlLabel == null ? void 0 : formControlLabel.name);
          },
          onClick: (event) => {
            var _a2;
            if (event.defaultPrevented) {
              return;
            }
            const newChecked = event.currentTarget.checked;
            event.currentTarget.checked = !newChecked;
            setCheckedState(newChecked);
            if (typeof props.onChange === "function") {
              props.onChange(event, newChecked);
            } else {
              (_a2 = formControlLabel == null ? void 0 : formControlLabel.onChange) == null ? void 0 : _a2.call(formControlLabel, event, newChecked);
            }
            if (typeof otherProps.onClick === "function")
              otherProps.onClick(event);
          },
          get readOnly() {
            return props.readOnly;
          },
          ref: (e) => {
            var _a2;
            element(e);
            if (!props.inputRef)
              (_a2 = formControlLabel == null ? void 0 : formControlLabel.inputRef) == null ? void 0 : _a2.call(formControlLabel, e);
          },
          get required() {
            return props.required;
          },
          ownerState,
          get tabIndex() {
            return props.tabIndex;
          },
          get type() {
            return props.type;
          },
          get value() {
            return inputValue();
          }
        }, () => props.inputProps || {})), createMemo(() => checked() ? props.checkedIcon : props.icon), createMemo(() => otherProps.children)];
      }
    }));
  });
  function getSvgIconUtilityClass(slot) {
    return generateUtilityClass("MuiSvgIcon", slot);
  }
  generateUtilityClasses("MuiSvgIcon", [
    "root",
    "colorPrimary",
    "colorSecondary",
    "colorAction",
    "colorError",
    "colorDisabled",
    "fontSizeInherit",
    "fontSizeSmall",
    "fontSizeMedium",
    "fontSizeLarge"
  ]);
  const _tmpl$$4 = /* @__PURE__ */ template(`<title></title>`);
  const $$j = createComponentFactory()({
    name: "MuiSvgIcon",
    selfPropNames: ["children", "classes", "color", "fontSize", "htmlColor", "inheritViewBox", "shapeRendering", "titleAccess", "viewBox"],
    propDefaults: ({
      set
    }) => {
      const context = useContext(SvgIconContext);
      return set({
        component: "svg",
        color: "inherit",
        get fontSize() {
          return (context == null ? void 0 : context.fontSize) ?? "medium";
        },
        inheritViewBox: false,
        viewBox: "0 0 24 24"
      });
    },
    utilityClass: getSvgIconUtilityClass,
    slotClasses: (o) => ({
      root: ["root", o.color !== "inherit" && `color${capitalize(o.color)}`, `fontSize${capitalize(o.fontSize)}`]
    })
  });
  const SvgIconRoot = styled$1("svg", {
    name: "MuiSvgIcon",
    slot: "Root",
    overridesResolver: (props, styles) => {
      const {
        ownerState
      } = props;
      return [styles.root, ownerState.color !== "inherit" && styles[`color${capitalize(ownerState.color)}`], styles[`fontSize${capitalize(ownerState.fontSize)}`]];
    }
  })(({
    theme,
    ownerState
  }) => {
    var _a2, _b2, _c2, _d2, _e2, _f2, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p;
    return {
      userSelect: "none",
      width: "1em",
      height: "1em",
      display: "inline-block",
      fill: "currentColor",
      flexShrink: 0,
      transition: (_d2 = (_a2 = theme.transitions) == null ? void 0 : _a2.create) == null ? void 0 : _d2.call(_a2, "fill", {
        duration: (_c2 = (_b2 = theme.transitions) == null ? void 0 : _b2.duration) == null ? void 0 : _c2.shorter
      }),
      fontSize: {
        inherit: "inherit",
        small: ((_f2 = (_e2 = theme.typography) == null ? void 0 : _e2.pxToRem) == null ? void 0 : _f2.call(_e2, 20)) || "1.25rem",
        medium: ((_h = (_g = theme.typography) == null ? void 0 : _g.pxToRem) == null ? void 0 : _h.call(_g, 24)) || "1.5rem",
        large: ((_j = (_i = theme.typography) == null ? void 0 : _i.pxToRem) == null ? void 0 : _j.call(_i, 35)) || "2.1875"
      }[ownerState.fontSize],
      // TODO v5 deprecate, v6 remove for sx
      color: ((_l = (_k = theme.palette) == null ? void 0 : _k[ownerState.color]) == null ? void 0 : _l.main) ?? {
        action: (_n = (_m = theme.palette) == null ? void 0 : _m.action) == null ? void 0 : _n.active,
        disabled: (_p = (_o = theme.palette) == null ? void 0 : _o.action) == null ? void 0 : _p.disabled,
        inherit: void 0
      }[ownerState.color]
    };
  });
  const SvgIcon = $$j.component(function SvgIcon2({
    allProps,
    props,
    otherProps,
    classes
  }) {
    return createComponent(SvgIconRoot, mergeProps({
      get ["aria-hidden"]() {
        return props.titleAccess ? void 0 : true;
      },
      get role() {
        return props.titleAccess ? "img" : void 0;
      },
      get viewBox() {
        return !props.inheritViewBox ? props.viewBox : void 0;
      }
    }, {
      ["focusable"]: "false"
    }, {
      get color() {
        return props.htmlColor;
      }
    }, otherProps, {
      get ["class"]() {
        return clsx(classes.root, otherProps.class);
      },
      ownerState: allProps,
      get children() {
        return [createMemo(() => props.children), createComponent(Show, {
          get when() {
            return !!props.titleAccess;
          },
          get children() {
            const _el$ = _tmpl$$4.cloneNode(true);
            insert(_el$, () => props.titleAccess);
            return _el$;
          }
        })];
      }
    }));
  });
  function createSvgIcon(path, displayName) {
    const Component = (props) => createComponent(SvgIcon, mergeProps({
      "data-testid": `${displayName}Icon`
    }, props, {
      children: path
    }));
    return Component;
  }
  const _tmpl$$3 = /* @__PURE__ */ template(`<svg><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>`, 4, true);
  const CheckBoxIcon = createSvgIcon(() => _tmpl$$3.cloneNode(true), "CheckBox");
  const _tmpl$$2 = /* @__PURE__ */ template(`<svg><path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path></svg>`, 4, true);
  const CheckBoxOutlineBlankIcon = createSvgIcon(() => _tmpl$$2.cloneNode(true), "CheckBoxOutlineBlank");
  const _tmpl$$1 = /* @__PURE__ */ template(`<svg><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z"></path></svg>`, 4, true);
  const IndeterminateCheckBoxIcon = createSvgIcon(() => _tmpl$$1.cloneNode(true), "IndeterminateCheckBox");
  function getCheckboxUtilityClass(slot) {
    return generateUtilityClass("MuiCheckbox", slot);
  }
  const checkboxClasses = generateUtilityClasses("MuiCheckbox", [
    "root",
    "checked",
    "disabled",
    "indeterminate",
    "colorPrimary",
    "colorSecondary"
  ]);
  const $$i = createComponentFactory()({
    name: "MuiCheckbox",
    propDefaults: ({
      set
    }) => set({
      color: "primary",
      indeterminate: false,
      size: "medium",
      checkedIcon: () => createComponent(CheckBoxIcon, {}),
      icon: () => createComponent(CheckBoxOutlineBlankIcon, {}),
      indeterminateIcon: () => createComponent(IndeterminateCheckBoxIcon, {})
    }),
    selfPropNames: ["checked", "checkedIcon", "classes", "color", "disableRipple", "disabled", "icon", "id", "indeterminate", "indeterminateIcon", "inputProps", "inputRef", "onChange", "required", "size", "value"],
    utilityClass: getCheckboxUtilityClass,
    slotClasses: (ownerState) => ({
      root: ["root", ownerState.indeterminate && "indeterminate", `color${capitalize(ownerState.color)}`]
    })
  });
  const CheckboxRoot = styled$1(SwitchBase, {
    skipProps: skipRootProps.filter((v) => v !== "classes"),
    name: "MuiCheckbox",
    slot: "Root",
    overridesResolver: (props, styles) => {
      const {
        ownerState
      } = props;
      return [styles.root, ownerState.indeterminate && styles.indeterminate, ownerState.color !== "default" && styles[`color${capitalize(ownerState.color)}`]];
    }
  })(({
    theme,
    ownerState
  }) => ({
    color: theme.palette.text.secondary,
    ...!ownerState.disableRipple && {
      "&:hover": {
        backgroundColor: alpha(ownerState.color === "default" ? theme.palette.action.active : theme.palette[ownerState.color].main, theme.palette.action.hoverOpacity),
        // Reset on touch devices, it doesn't add specificity
        "@media (hover: none)": {
          backgroundColor: "transparent"
        }
      }
    },
    ...ownerState.color !== "default" && {
      [`&.${checkboxClasses.checked}, &.${checkboxClasses.indeterminate}`]: {
        color: theme.palette[ownerState.color].main
      },
      [`&.${checkboxClasses.disabled}`]: {
        color: theme.palette.action.disabled
      }
    }
  }));
  const Checkbox = $$i.component(function Checkbox2({
    allProps,
    classes,
    props
  }) {
    const icon = createMemo(() => props.indeterminate ? props.indeterminateIcon : props.icon);
    const indeterminateIcon = createMemo(() => props.indeterminate ? props.indeterminateIcon : props.checkedIcon);
    const [, baseProps] = splitProps(allProps, ["checkedIcon", "color", "icon", "indeterminate", "indeterminateIcon", "inputProps", "size"]);
    const allClasses = mergeProps(() => props.classes || {}, classes);
    return createComponent(SvgIconContext.Provider, {
      value: {
        get fontSize() {
          return props.size;
        }
      },
      get children() {
        return createComponent(CheckboxRoot, mergeProps({
          type: "checkbox"
        }, baseProps, {
          classes: allClasses,
          get inputProps() {
            return {
              ["data-indeterminate"]: props.indeterminate,
              ...props.inputProps || {}
            };
          },
          get icon() {
            return icon();
          },
          get checkedIcon() {
            return indeterminateIcon();
          },
          ownerState: allProps
        }));
      }
    });
  });
  const reflow = (node) => node.scrollTop;
  function getTransitionProps(props, options) {
    const { timeout, easing: easing2, style: style2 = {} } = props;
    return {
      duration: style2.transitionDuration ?? (typeof timeout === "number" ? timeout : typeof timeout === "string" ? 0 : timeout[options.mode] || 0),
      easing: style2.transitionTimingFunction ?? (typeof easing2 === "object" ? easing2[options.mode] : easing2),
      delay: style2.transitionDelay
    };
  }
  function resolveTransitionTimeout(timeout) {
    if (typeof timeout === "number") {
      return {
        exit: timeout,
        enter: timeout,
        appear: timeout
      };
    } else {
      return {
        exit: (timeout == null ? void 0 : timeout.exit) || 0,
        enter: (timeout == null ? void 0 : timeout.enter) || 0,
        appear: (timeout == null ? void 0 : timeout.appear) ?? (timeout == null ? void 0 : timeout.enter) ?? 0
      };
    }
  }
  function Transition(inProps) {
    const props = mergeProps({
      in: false,
      mountOnEnter: false,
      unmountOnExit: false,
      appear: false,
      enter: true,
      exit: true
    }, inProps);
    const timeouts = createMemo(() => resolveTransitionTimeout(props.timeout));
    let initialStatus;
    if (props.in) {
      if (props.appear) {
        initialStatus = "exited";
      } else {
        initialStatus = "entered";
      }
    } else {
      if (props.unmountOnExit || props.mountOnEnter) {
        initialStatus = "unmounted";
      } else {
        initialStatus = "exited";
      }
    }
    const [status, setStatus] = createSignal(initialStatus);
    let enteredTimeout;
    let exitedTimeout;
    let firstStatusChange = true;
    function onTransitionEnd(ms, cb) {
      const next = () => setTimeout(cb, ms);
      let timeout;
      let stopped = false;
      const stop = () => {
        stopped = true;
        timeout && clearTimeout(timeout);
      };
      if (props.addEndListener) {
        props.addEndListener(() => {
          if (!stopped)
            timeout = next();
        });
      } else {
        timeout = next();
      }
      return stop;
    }
    const result = createMemo(on(() => [status()], () => {
      var _a2, _b2, _c2, _d2;
      const v = status();
      const result2 = v !== "unmounted" ? props.children(v) : void 0;
      if (firstStatusChange) {
        firstStatusChange = false;
        return result2;
      }
      if (v === "entering") {
        (_a2 = props.onEntering) == null ? void 0 : _a2.call(props);
        if (exitedTimeout) {
          exitedTimeout();
          exitedTimeout = void 0;
        }
        enteredTimeout = onTransitionEnd(timeouts().enter, () => setStatus("entered"));
      } else if (v === "entered") {
        (_b2 = props.onEntered) == null ? void 0 : _b2.call(props);
      } else if (v === "exiting") {
        (_c2 = props.onExiting) == null ? void 0 : _c2.call(props);
        if (enteredTimeout) {
          enteredTimeout();
          enteredTimeout = void 0;
        }
        exitedTimeout = onTransitionEnd(timeouts().exit, () => setStatus("exited"));
      } else if (v === "exited") {
        (_d2 = props.onExited) == null ? void 0 : _d2.call(props);
      }
      return result2;
    }));
    createEffect((firstTime) => {
      if (props.in) {
        untrack(() => {
          var _a2;
          return (_a2 = props.onEnter) == null ? void 0 : _a2.call(props);
        });
        setStatus("entering");
      } else {
        if (!firstTime) {
          untrack(() => {
            var _a2;
            return (_a2 = props.onExit) == null ? void 0 : _a2.call(props);
          });
          setStatus("exiting");
        }
      }
      return false;
    }, true);
    onCleanup(() => {
      enteredTimeout == null ? void 0 : enteredTimeout();
      exitedTimeout == null ? void 0 : exitedTimeout();
    });
    return result();
  }
  const TransitionContext = createContext();
  const $$h = createComponentFactory()({
    name: "MuiFader",
    selfPropNames: ["appear", "children", "easing", "in", "timeout"],
    propDefaults: ({
      set
    }) => {
      const theme = useTheme$1();
      return set({
        appear: true,
        get timeout() {
          return {
            enter: theme.transitions.duration.enteringScreen,
            exit: theme.transitions.duration.leavingScreen
          };
        }
      });
    }
  });
  const fadeSelfPropNames = $$h.selfPropNames;
  const Fade = $$h.component(function Fade2({
    props,
    otherProps
  }) {
    const theme = useTheme$1();
    const element = createElementRef(props);
    const timeout = createMemo(() => resolveTransitionTimeout(props.timeout));
    const c = children(() => props.children);
    const context = useContext(TransitionContext);
    return createComponent(Transition, mergeProps({
      get ["in"]() {
        return props.in ?? (context == null ? void 0 : context.in);
      },
      get appear() {
        return props.appear;
      },
      get timeout() {
        return props.timeout;
      }
    }, otherProps, {
      ref: element,
      onEnter: () => {
        var _a2, _b2;
        const e = c();
        reflow(e);
        const transitionProps = getTransitionProps({
          style: otherProps.style,
          timeout: timeout(),
          easing: props.easing
        }, {
          mode: "enter"
        });
        e.style.transition = theme.transitions.create("opacity", transitionProps);
        (_a2 = otherProps.onEnter) == null ? void 0 : _a2.call(otherProps);
        (_b2 = context == null ? void 0 : context.onEnter) == null ? void 0 : _b2.call(context);
      },
      onExit: () => {
        var _a2;
        const e = c();
        const transitionProps = getTransitionProps({
          style: otherProps.style,
          timeout: timeout(),
          easing: props.easing
        }, {
          mode: "enter"
        });
        e.style.transition = theme.transitions.create("opacity", transitionProps);
        (_a2 = otherProps.onExit) == null ? void 0 : _a2.call(otherProps);
      },
      onExited: () => {
        var _a2, _b2;
        (_a2 = otherProps.onExited) == null ? void 0 : _a2.call(otherProps);
        (_b2 = context == null ? void 0 : context.onExited) == null ? void 0 : _b2.call(context);
      },
      children: (state) => {
        const element2 = c();
        if (state === "exited" && !props.in) {
          element2.style.visibility = "hidden";
        } else {
          element2.style.removeProperty("visibility");
        }
        if (state === "entering" || state === "entered") {
          element2.style.opacity = "1";
        } else {
          element2.style.opacity = "0";
        }
        return element2;
      }
    }));
  });
  function isHostComponent(element) {
    return typeof element === "string";
  }
  function getBackdropUtilityClass(slot) {
    return generateUtilityClass("MuiBackdrop", slot);
  }
  generateUtilityClasses("MuiBackdrop", ["root", "invisible"]);
  const $$g = createComponentFactory()({
    name: "BackdropUnstyled",
    selfPropNames: ["children", "classes", "components", "componentsProps", "invisible"],
    propDefaults: ({
      set
    }) => set({
      component: "div",
      components: {},
      componentsProps: {},
      invisible: false
    }),
    utilityClass: getBackdropUtilityClass,
    slotClasses: (ownerState) => ({
      root: ["root", ownerState.invisible && "invisible"]
    })
  });
  const BackdropUnstyled = $$g.component(function BackdropUnstyled2({
    props,
    otherProps,
    allProps,
    classes
  }) {
    const Root = () => props.components.Root || otherProps.component;
    const rootProps = () => props.componentsProps.root || {};
    return createComponent(Dynamic, mergeProps({
      "aria-hidden": true
    }, rootProps, otherProps, () => !isHostComponent(Root()) && {
      ownerState: allProps
    }, {
      get $component() {
        return Root();
      },
      get ["class"]() {
        return clsx(classes.root, rootProps().class, otherProps.class);
      },
      get children() {
        return props.children;
      }
    }));
  });
  const $$f = createComponentFactory()({
    name: "MuiBackdrop",
    selfPropNames: ["classes", "open", "transitionDuration"],
    propDefaults: ({
      set
    }) => set({
      open: false,
      component: "div"
    })
  });
  const BackdropRoot = styled$1("div", {
    name: "MuiBackdrop",
    slot: "Root",
    overridesResolver: (props, styles) => {
      const {
        ownerState
      } = props;
      return [styles.root, ownerState.invisible && styles.invisible];
    }
  })(({
    ownerState
  }) => ({
    position: "fixed",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    right: 0,
    bottom: 0,
    top: 0,
    left: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    WebkitTapHighlightColor: "transparent",
    ...ownerState.invisible && {
      backgroundColor: "transparent"
    }
  }));
  const Backdrop = $$f.component(function Backdrop2({
    props,
    otherProps
  }) {
    const [fadeProps, backdropProps] = splitProps(otherProps, fadeSelfPropNames);
    return createComponent(Fade, mergeProps({
      get ["in"]() {
        return props.open;
      },
      get timeout() {
        return props.transitionDuration;
      }
    }, fadeProps, {
      get children() {
        return createComponent(BackdropUnstyled, mergeProps(backdropProps, {
          get ["class"]() {
            return otherProps.class;
          },
          get invisible() {
            return otherProps.invisible;
          },
          get components() {
            return {
              Root: BackdropRoot,
              ...otherProps.components
            };
          },
          get componentsProps() {
            var _a2, _b2, _c2;
            return {
              root: {
                ...(_a2 = otherProps.componentsProps) == null ? void 0 : _a2.root,
                ...(!((_b2 = otherProps.components) == null ? void 0 : _b2.Root) || !isHostComponent((_c2 = otherProps.components) == null ? void 0 : _c2.Root)) && {
                  //ownerState: { ...baseProps.componentsProps?.root?.ownerState },
                }
              }
            };
          },
          get classes() {
            return props.classes;
          },
          get children() {
            return otherProps.children;
          }
        }));
      }
    }));
  });
  function Portal(props) {
    const container = () => props.container ?? document.body;
    return createComponent(Show, {
      get when() {
        return !props.disablePortal;
      },
      get fallback() {
        return props.children;
      },
      get children() {
        return createComponent(Portal$1, {
          get mount() {
            return container();
          },
          get children() {
            return props.children;
          }
        });
      }
    });
  }
  function isOverflowing(container) {
    const doc = ownerDocument(container);
    if (doc.body === container) {
      return ownerWindow(container).innerWidth > doc.documentElement.clientWidth;
    }
    return container.scrollHeight > container.clientHeight;
  }
  function ariaHidden(element, show) {
    if (show) {
      element.setAttribute("aria-hidden", "true");
    } else {
      element.removeAttribute("aria-hidden");
    }
  }
  function getPaddingRight(element) {
    return parseInt(ownerWindow(element).getComputedStyle(element).paddingRight, 10) || 0;
  }
  function ariaHiddenSiblings(container, mountElement, elementsToExclude = [], show) {
    const blacklist = [mountElement, ...elementsToExclude];
    const blacklistTagNames = ["TEMPLATE", "SCRIPT", "STYLE"];
    [].forEach.call(container.children, (element) => {
      if (blacklist.indexOf(element) === -1 && blacklistTagNames.indexOf(element.tagName) === -1) {
        ariaHidden(element, show);
      }
    });
  }
  function findIndexOf(items, callback) {
    let idx = -1;
    items.some((item, index) => {
      if (callback(item)) {
        idx = index;
        return true;
      }
      return false;
    });
    return idx;
  }
  function handleContainer(containerInfo, props) {
    const restoreStyle = [];
    const container = containerInfo.container;
    if (!props.disableScrollLock) {
      if (isOverflowing(container)) {
        const scrollbarSize = getScrollbarSize(ownerDocument(container));
        restoreStyle.push({
          value: container.style.paddingRight,
          property: "padding-right",
          el: container
        });
        container.style.paddingRight = `${getPaddingRight(container) + scrollbarSize}px`;
        const fixedElements = ownerDocument(container).querySelectorAll(".mui-fixed");
        [].forEach.call(fixedElements, (element) => {
          restoreStyle.push({
            value: element.style.paddingRight,
            property: "padding-right",
            el: element
          });
          element.style.paddingRight = `${getPaddingRight(element) + scrollbarSize}px`;
        });
      }
      const parent = container.parentElement;
      const containerWindow = ownerWindow(container);
      const scrollContainer = (parent == null ? void 0 : parent.nodeName) === "HTML" && containerWindow.getComputedStyle(parent).overflowY === "scroll" ? parent : container;
      restoreStyle.push({
        value: scrollContainer.style.overflow,
        property: "overflow",
        el: scrollContainer
      }, {
        value: scrollContainer.style.overflowX,
        property: "overflow-x",
        el: scrollContainer
      }, {
        value: scrollContainer.style.overflowY,
        property: "overflow-y",
        el: scrollContainer
      });
      scrollContainer.style.overflow = "hidden";
    }
    const restore = () => {
      restoreStyle.forEach(({ value, el, property }) => {
        if (value) {
          el.style.setProperty(property, value);
        } else {
          el.style.removeProperty(property);
        }
      });
    };
    return restore;
  }
  function getHiddenSiblings(container) {
    const hiddenSiblings = [];
    [].forEach.call(container.children, (element) => {
      if (element.getAttribute("aria-hidden") === "true") {
        hiddenSiblings.push(element);
      }
    });
    return hiddenSiblings;
  }
  class ModalManager {
    constructor() {
      __publicField(this, "containers");
      __publicField(this, "modals");
      this.modals = [];
      this.containers = [];
    }
    add(modal, container) {
      let modalIndex = this.modals.findIndex((v) => v.ref === modal.ref);
      if (modalIndex !== -1) {
        return modalIndex;
      }
      modalIndex = this.modals.length;
      this.modals.push(modal);
      ariaHidden(modal.ref, false);
      const hiddenSiblings = getHiddenSiblings(container);
      ariaHiddenSiblings(container, modal.ref, hiddenSiblings, true);
      const containerIndex = findIndexOf(this.containers, (item) => item.container === container);
      if (containerIndex !== -1) {
        this.containers[containerIndex].modals.push(modal);
        return modalIndex;
      }
      this.containers.push({
        modals: [modal],
        container,
        restore: null,
        hiddenSiblings
      });
      return modalIndex;
    }
    mount(modal, props) {
      const containerIndex = findIndexOf(this.containers, (item) => !!item.modals.find((v) => v.ref === modal.ref));
      const containerInfo = this.containers[containerIndex];
      if (!containerInfo.restore) {
        containerInfo.restore = handleContainer(containerInfo, props);
      }
    }
    remove(modal) {
      const modalIndex = this.modals.findIndex((v) => v.ref === modal.ref);
      if (modalIndex === -1) {
        return modalIndex;
      }
      const containerIndex = findIndexOf(this.containers, (item) => !!item.modals.find((v) => v.ref === modal.ref));
      const containerInfo = this.containers[containerIndex];
      containerInfo.modals.splice(containerInfo.modals.findIndex((v) => v.ref === modal.ref), 1);
      this.modals.splice(modalIndex, 1);
      if (containerInfo.modals.length === 0) {
        if (containerInfo.restore) {
          containerInfo.restore();
        }
        ariaHidden(modal.ref, true);
        ariaHiddenSiblings(containerInfo.container, modal.ref, containerInfo.hiddenSiblings, false);
        this.containers.splice(containerIndex, 1);
      } else {
        const nextTop = containerInfo.modals[containerInfo.modals.length - 1];
        ariaHidden(nextTop.ref, false);
      }
      return modalIndex;
    }
    isTopModal(modal) {
      return this.modals.length > 0 && this.modals[this.modals.length - 1].ref === modal.ref;
    }
  }
  function getModalUtilityClass(slot) {
    return generateUtilityClass("MuiModal", slot);
  }
  generateUtilityClasses("MuiModal", ["root", "hidden"]);
  const $$e = createComponentFactory()({
    name: "ModalUnstyled",
    propDefaults: ({
      set
    }) => set({
      closeAfterTransition: false,
      component: "div",
      components: {},
      componentsProps: {},
      disableAutoFocus: false,
      disableEnforceFocus: false,
      disableEscapeKeyDown: false,
      disablePortal: false,
      disableRestoreFocus: false,
      disableScrollLock: false,
      hideBackdrop: false,
      keepMounted: false,
      open: false
    }),
    selfPropNames: ["BackdropComponent", "BackdropProps", "children", "classes", "closeAfterTransition", "components", "componentsProps", "container", "disableAutoFocus", "disableEnforceFocus", "disableEscapeKeyDown", "disablePortal", "disableRestoreFocus", "disableScrollLock", "hideBackdrop", "keepMounted", "onBackdropClick", "onClose", "open", "transition"],
    utilityClass: getModalUtilityClass,
    slotClasses: (ownerState) => ({
      root: ["root", !ownerState.open && ownerState.exited && "hidden"]
    })
  });
  function getContainer(container) {
    return typeof container === "function" ? container() : container;
  }
  const defaultManager = new ModalManager();
  const ModalUnstyled = $$e.component(function ModalUnstyled2({
    allProps,
    otherProps,
    classes,
    props
  }) {
    const element = createElementRef(otherProps);
    const manager = defaultManager;
    const getDoc = () => ownerDocument(element.ref);
    const [exited, setExited] = createSignal(true);
    const handleMounted = () => {
      manager.mount(element, {
        disableScrollLock: props.disableScrollLock
      });
      element.ref.scrollTop = 0;
    };
    const handleOpen = () => {
      const resolvedContainer = getContainer(props.container) || getDoc().body;
      manager.add(element, resolvedContainer);
      if (element.ref) {
        handleMounted();
      }
    };
    const isTopModal = () => manager.isTopModal(element);
    const handleClose = () => manager.remove(element);
    onCleanup(handleClose);
    createEffect((firstTime) => {
      if (firstTime) {
        if (props.open)
          handleOpen();
        if (props.open && isTopModal()) {
          handleMounted();
        } else {
          if (element.ref)
            ariaHidden(element.ref, true);
        }
      } else {
        if (props.open) {
          handleOpen();
        } else if (!props.transition || !props.closeAfterTransition) {
          handleClose();
        }
      }
      return false;
    }, true);
    const handleBackdropClick = (event) => {
      var _a2, _b2;
      if (event.target !== event.currentTarget) {
        return;
      }
      (_a2 = props.onBackdropClick) == null ? void 0 : _a2.call(props, event);
      (_b2 = props.onClose) == null ? void 0 : _b2.call(props, event, "backdropClick");
    };
    const handleKeyDown2 = (event) => {
      var _a2, _b2;
      if (typeof otherProps.onKeyDown === "function")
        (_a2 = otherProps.onKeyDown) == null ? void 0 : _a2.call(otherProps, event);
      if (event.key !== "Escape" || !isTopModal()) {
        return;
      }
      if (!props.disableEscapeKeyDown) {
        event.stopPropagation();
        (_b2 = props.onClose) == null ? void 0 : _b2.call(props, event, "escapeKeyDown");
      }
    };
    const Root = () => props.components.Root || otherProps.component;
    const rootProps = () => props.componentsProps.root || {};
    const noMount = () => !props.keepMounted && !props.open && (!props.transition || exited());
    return createComponent(TransitionContext.Provider, {
      value: {
        get in() {
          return !!props.transition && props.open;
        },
        onEnter: () => {
          props.transition && setExited(false);
        },
        onExited: () => {
          if (props.transition) {
            setExited(true);
            if (props.closeAfterTransition)
              handleClose();
          }
        }
      },
      get children() {
        return createComponent(Show, {
          get when() {
            return !noMount();
          },
          get children() {
            return createComponent(Portal, {
              get container() {
                return props.container;
              },
              get disablePortal() {
                return props.disablePortal;
              },
              get children() {
                return createComponent(Dynamic$1, mergeProps(otherProps, {
                  get component() {
                    return Root();
                  },
                  role: "presentation"
                }, rootProps, () => !isHostComponent(Root()) && {
                  //component: baseProps.component,
                  ownerState: allProps
                }, {
                  onKeyDown: handleKeyDown2,
                  get ["class"]() {
                    return clsx(classes.root, rootProps().class, otherProps.class);
                  },
                  ref: element,
                  get children() {
                    return [createComponent(Show, {
                      get when() {
                        return !props.hideBackdrop && !!props.BackdropComponent;
                      },
                      get children() {
                        return createComponent(Dynamic$1, mergeProps({
                          get component() {
                            return props.BackdropComponent;
                          },
                          get open() {
                            return props.open;
                          },
                          onClick: handleBackdropClick
                        }, () => props.BackdropProps ?? {}));
                      }
                    }), createMemo(() => props.children)];
                  }
                }));
              }
            });
          }
        });
      }
    });
  });
  const $$d = createComponentFactory()({
    name: "MuiModal",
    selfPropNames: ["BackdropComponent", "BackdropProps"]
  });
  const ModalRoot = styled$1("div", {
    name: "MuiModal",
    slot: "Root",
    overridesResolver: (props, styles) => {
      const {
        ownerState
      } = props;
      return [styles.root, !ownerState.open && ownerState.exited && styles.hidden];
    }
  })(({
    theme,
    ownerState
  }) => ({
    position: "fixed",
    zIndex: theme.zIndex.modal,
    right: 0,
    bottom: 0,
    top: 0,
    left: 0,
    ...!ownerState.open && ownerState.exited && {
      visibility: "hidden"
    }
  }));
  const ModalBackdrop = styled$1(Backdrop, {
    name: "MuiModal",
    slot: "Backdrop",
    overridesResolver: (props, styles) => {
      return styles.backdrop;
    }
  })({
    zIndex: -1
  });
  const Modal = $$d.defineComponent(function Modal2(inProps) {
    const props = $$d.useThemeProps({
      props: inProps
    });
    const [, other] = splitProps(props, ["BackdropComponent", "closeAfterTransition", "children", "components", "componentsProps", "disableAutoFocus", "disableEnforceFocus", "disableEscapeKeyDown", "disablePortal", "disableRestoreFocus", "disableScrollLock", "hideBackdrop", "keepMounted"]);
    const baseProps = mergeProps({
      BackdropComponent: ModalBackdrop,
      closeAfterTransition: false,
      components: {},
      componentsProps: {},
      disableAutoFocus: false,
      disableEnforceFocus: false,
      disableEscapeKeyDown: false,
      disablePortal: false,
      disableRestoreFocus: false,
      disableScrollLock: false,
      hideBackdrop: false,
      keepMounted: false
    }, props);
    const [exited] = createSignal(true);
    const commonProps = {
      get closeAfterTransition() {
        return baseProps.closeAfterTransition;
      },
      get disableAutoFocus() {
        return baseProps.disableAutoFocus;
      },
      get disableEnforceFocus() {
        return baseProps.disableEnforceFocus;
      },
      get disableEscapeKeyDown() {
        return baseProps.disableEscapeKeyDown;
      },
      get disablePortal() {
        return baseProps.disablePortal;
      },
      get disableRestoreFocus() {
        return baseProps.disableRestoreFocus;
      },
      get disableScrollLock() {
        return baseProps.disableScrollLock;
      },
      get hideBackdrop() {
        return baseProps.hideBackdrop;
      },
      get keepMounted() {
        return baseProps.keepMounted;
      }
    };
    const ownerState = mergeProps(props, commonProps, {
      get exited() {
        return exited();
      }
    });
    return createComponent(ModalUnstyled, mergeProps({
      get components() {
        return mergeProps({
          Root: ModalRoot
        }, () => baseProps.components);
      },
      componentsProps: {
        get root() {
          return mergeProps(() => baseProps.componentsProps.root || {}, () => (!baseProps.components.Root || !isHostComponent(baseProps.components.Root)) && {
            get ownerState() {
              var _a2;
              return ((_a2 = baseProps.componentsProps.root) == null ? void 0 : _a2.ownerState) || {};
            }
          } || {});
        }
      },
      get BackdropComponent() {
        return baseProps.BackdropComponent;
      }
    }, other, {
      get classes() {
        return ownerState.classes;
      }
    }, commonProps, {
      get children() {
        return props.children;
      }
    }));
  });
  function getPaperUtilityClass(slot) {
    return generateUtilityClass("MuiPaper", slot);
  }
  generateUtilityClasses("MuiPaper", [
    "root",
    "rounded",
    "outlined",
    "elevation",
    "elevation0",
    "elevation1",
    "elevation2",
    "elevation3",
    "elevation4",
    "elevation5",
    "elevation6",
    "elevation7",
    "elevation8",
    "elevation9",
    "elevation10",
    "elevation11",
    "elevation12",
    "elevation13",
    "elevation14",
    "elevation15",
    "elevation16",
    "elevation17",
    "elevation18",
    "elevation19",
    "elevation20",
    "elevation21",
    "elevation22",
    "elevation23",
    "elevation24"
  ]);
  const $$c = createComponentFactory()({
    name: "MuiPaper",
    selfPropNames: ["children", "classes", "elevation", "square", "variant"],
    propDefaults: ({
      set
    }) => set({
      component: "div",
      elevation: 1,
      square: false,
      variant: "elevation"
    }),
    utilityClass: getPaperUtilityClass,
    slotClasses: (o) => ({
      root: ["root", o.variant, !o.square && "rounded", o.variant === "elevation" && `elevation${o.elevation}`]
    })
  });
  const getOverlayAlpha = (elevation) => {
    let alphaValue;
    if (elevation < 1) {
      alphaValue = 5.11916 * elevation ** 2;
    } else {
      alphaValue = 4.5 * Math.log(elevation + 1) + 2;
    }
    return Number((alphaValue / 100).toFixed(2));
  };
  const PaperRoot = styled$1("div", {
    name: "MuiPaper",
    slot: "Root"
  })(({
    theme,
    ownerState
  }) => ({
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    transition: theme.transitions.create("box-shadow"),
    ...!ownerState.square && {
      borderRadius: theme.shape.borderRadius
    },
    ...ownerState.variant === "outlined" && {
      border: `1px solid ${theme.palette.divider}`
    },
    ...ownerState.variant === "elevation" && {
      boxShadow: theme.shadows[ownerState.elevation],
      ...theme.palette.mode === "dark" && {
        backgroundImage: `linear-gradient(${alpha("#fff", getOverlayAlpha(ownerState.elevation))}, ${alpha("#fff", getOverlayAlpha(ownerState.elevation))})`
      }
    }
  }));
  const Paper = $$c.component(function Paper2({
    allProps,
    props,
    otherProps,
    classes
  }) {
    return createComponent(PaperRoot, mergeProps(otherProps, {
      ownerState: allProps,
      get ["class"]() {
        return clsx(classes.root, allProps.class);
      },
      get children() {
        return props.children;
      }
    }));
  });
  const DialogContext = createContext({});
  function getDialogUtilityClass(slot) {
    return generateUtilityClass("MuiDialog", slot);
  }
  const dialogClasses = generateUtilityClasses("MuiDialog", [
    "root",
    "scrollPaper",
    "scrollBody",
    "container",
    "paper",
    "paperScrollPaper",
    "paperScrollBody",
    "paperWidthFalse",
    "paperWidthXs",
    "paperWidthSm",
    "paperWidthMd",
    "paperWidthLg",
    "paperWidthXl",
    "paperFullWidth",
    "paperFullScreen"
  ]);
  const $$b = createComponentFactory()({
    name: "MuiDialog",
    selfPropNames: ["aria-describedby", "aria-labelledby", "children", "classes", "disableEscapeKeyDown", "fullScreen", "fullWidth", "maxWidth", "onBackdropClick", "onClose", "open", "PaperComponent", "PaperProps", "scroll", "TransitionComponent", "transitionDuration", "TransitionProps"],
    utilityClass: getDialogUtilityClass,
    slotClasses: (ownerState) => ({
      root: ["root"],
      container: ["container", `scroll${capitalize(ownerState.scroll)}`],
      paper: ["paper", `paperScroll${capitalize(ownerState.scroll)}`, `paperWidth${capitalize(String(ownerState.maxWidth))}`, ownerState.fullWidth && "paperFullWidth", ownerState.fullScreen && "paperFullScreen"]
    })
  });
  const DialogBackdrop = styled$1(Backdrop, {
    name: "MuiDialog",
    slot: "Backdrop"
    //overrides: (props, styles) => styles.backdrop,
  })({
    // Improve scrollable dialog support.
    zIndex: -1
  });
  const DialogRoot = styled$1(Modal, {
    name: "MuiDialog",
    slot: "Root",
    overridesResolver: (props, styles) => styles.root
  })({
    "@media print": {
      // Use !important to override the Modal inline-style.
      position: "absolute !important"
    }
  });
  const DialogContainer = styled$1("div", {
    name: "MuiDialog",
    slot: "Container",
    overridesResolver: (props, styles) => {
      const {
        ownerState
      } = props;
      return [styles.container, styles[`scroll${capitalize(ownerState.scroll)}`]];
    }
  })(({
    ownerState
  }) => ({
    height: "100%",
    "@media print": {
      height: "auto"
    },
    // We disable the focus ring for mouse, touch and keyboard users.
    outline: 0,
    ...ownerState.scroll === "paper" && {
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    },
    ...ownerState.scroll === "body" && {
      overflowY: "auto",
      overflowX: "hidden",
      textAlign: "center",
      "&:after": {
        content: '""',
        display: "inline-block",
        verticalAlign: "middle",
        height: "100%",
        width: "0"
      }
    }
  }));
  const DialogPaper = styled$1(Paper, {
    name: "MuiDialog",
    slot: "Paper",
    overridesResolver: (props, styles) => {
      const {
        ownerState
      } = props;
      return [styles.paper, styles[`scrollPaper${capitalize(ownerState.scroll)}`], styles[`paperWidth${capitalize(String(ownerState.maxWidth))}`], ownerState.fullWidth && styles.paperFullWidth, ownerState.fullScreen && styles.paperFullScreen];
    }
  })(({
    theme,
    ownerState
  }) => ({
    margin: 32,
    position: "relative",
    overflowY: "auto",
    "@media print": {
      overflowY: "visible",
      boxShadow: "none"
    },
    ...ownerState.scroll === "paper" && {
      display: "flex",
      flexDirection: "column",
      maxHeight: "calc(100% - 64px)"
    },
    ...ownerState.scroll === "body" && {
      display: "inline-block",
      verticalAlign: "middle",
      textAlign: "left"
      // 'initial' doesn't work on IE11
    },
    ...!ownerState.maxWidth && {
      maxWidth: "calc(100% - 64px)"
    },
    ...ownerState.maxWidth === "xs" && {
      maxWidth: theme.breakpoints.unit === "px" ? Math.max(theme.breakpoints.values.xs, 444) : `${theme.breakpoints.values.xs}${theme.breakpoints.unit}`,
      [`&.${dialogClasses.paperScrollBody}`]: {
        [theme.breakpoints.down(Math.max(theme.breakpoints.values.xs, 444) + 32 * 2)]: {
          maxWidth: "calc(100% - 64px)"
        }
      }
    },
    ...ownerState.maxWidth !== "xs" && {
      maxWidth: `${theme.breakpoints.values[ownerState.maxWidth]}${theme.breakpoints.unit}`,
      [`&.${dialogClasses.paperScrollBody}`]: {
        [theme.breakpoints.down(theme.breakpoints.values[ownerState.maxWidth] + 32 * 2)]: {
          maxWidth: "calc(100% - 64px)"
        }
      }
    },
    ...ownerState.fullWidth && {
      width: "calc(100% - 64px)"
    },
    ...ownerState.fullScreen && {
      margin: 0,
      width: "100%",
      maxWidth: "100%",
      height: "100%",
      maxHeight: "none",
      borderRadius: 0,
      [`&.${dialogClasses.paperScrollBody}`]: {
        margin: 0,
        maxWidth: "100%"
      }
    }
  }));
  const Dialog = $$b.defineComponent(function Dialog2(inProps) {
    const ref = createRef(inProps);
    const props = $$b.useThemeProps({
      props: inProps
    });
    const theme = useTheme$1();
    const defaultTransitionDuration = {
      get enter() {
        return theme.transitions.duration.enteringScreen;
      },
      get exit() {
        return theme.transitions.duration.leavingScreen;
      }
    };
    const [, other] = splitProps(props, ["aria-describedby", "aria-labelledby", "BackdropComponent", "BackdropProps", "children", "class", "disableEscapeKeyDown", "fullScreen", "fullWidth", "maxWidth", "onBackdropClick", "onClose", "open", "PaperComponent", "PaperProps", "scroll", "TransitionComponent", "transitionDuration", "TransitionProps"]);
    const baseProps = mergeProps({
      disableEscapeKeyDown: false,
      fullScreen: false,
      fullWidth: false,
      maxWidth: "sm",
      PaperComponent: Paper,
      PaperProps: {},
      scroll: "paper",
      TransitionComponent: Fade,
      transitionDuration: defaultTransitionDuration
    }, props);
    const ownerState = baseProps;
    const classes = $$b.useClasses(ownerState);
    let backdropClick = null;
    const handleMouseDown = (event) => {
      backdropClick = event.target === event.currentTarget;
    };
    const handleBackdropClick = (event) => {
      if (!backdropClick) {
        return;
      }
      backdropClick = null;
      if (props.onBackdropClick) {
        props.onBackdropClick(event);
      }
      if (props.onClose) {
        props.onClose(event, "backdropClick");
      }
    };
    const ariaLabelledby = createUniqueId(() => props["aria-labelledby"]);
    const dialogContextValue = createMemo(() => {
      return {
        titleId: ariaLabelledby()
      };
    });
    return createComponent(DialogRoot, mergeProps({
      get ["class"]() {
        return clsx(classes.root, props.class);
      },
      get BackdropProps() {
        return mergeProps({
          get transitionDuration() {
            return baseProps.transitionDuration;
          },
          get as() {
            return props.BackdropComponent;
          }
        }, () => props.BackdropProps);
      },
      closeAfterTransition: true,
      BackdropComponent: DialogBackdrop,
      get disableEscapeKeyDown() {
        return baseProps.disableEscapeKeyDown;
      },
      get onClose() {
        return props.onClose;
      },
      get open() {
        return props.open;
      },
      ref,
      onClick: handleBackdropClick,
      ownerState
    }, other, {
      get children() {
        return createComponent(baseProps.TransitionComponent, mergeProps({
          appear: true,
          get ["in"]() {
            return props.open;
          },
          get timeout() {
            return baseProps.transitionDuration;
          }
        }, () => props.TransitionProps, {
          get children() {
            return createComponent(DialogContainer, {
              get ["class"]() {
                return clsx(classes.container);
              },
              onMouseDown: handleMouseDown,
              ownerState,
              get children() {
                return createComponent(DialogPaper, mergeProps({
                  get component() {
                    return baseProps.PaperComponent;
                  },
                  elevation: 24,
                  role: "dialog",
                  get ["aria-describedby"]() {
                    return props["aria-describedby"];
                  },
                  get ["aria-labelledby"]() {
                    return ariaLabelledby();
                  }
                }, () => baseProps.PaperProps, {
                  get ["class"]() {
                    return clsx(classes.paper, baseProps.PaperProps.class);
                  },
                  ownerState,
                  get children() {
                    return createComponent(DialogContext.Provider, {
                      get value() {
                        return dialogContextValue();
                      },
                      get children() {
                        return props.children;
                      }
                    });
                  }
                }));
              }
            });
          }
        }));
      }
    }));
  });
  function getDialogActionsUtilityClass(slot) {
    return generateUtilityClass("MuiDialogActions", slot);
  }
  generateUtilityClasses("MuiDialogActions", ["root", "spacing"]);
  const $$a = createComponentFactory()({
    name: "MuiDialogActions",
    selfPropNames: ["children", "classes", "disableSpacing"],
    utilityClass: getDialogActionsUtilityClass,
    slotClasses: (ownerState) => ({
      root: ["root", !ownerState.disableSpacing && "spacing"]
    })
  });
  const DialogActionsRoot = styled$1("div", {
    name: "MuiDialogActions",
    slot: "Root",
    overridesResolver: (props, styles) => {
      const {
        ownerState
      } = props;
      return [styles.root, !ownerState.disableSpacing && styles.spacing];
    }
  })(({
    ownerState
  }) => ({
    display: "flex",
    alignItems: "center",
    padding: 8,
    justifyContent: "flex-end",
    flex: "0 0 auto",
    ...!ownerState.disableSpacing && {
      "& > :not(:first-of-type)": {
        marginLeft: 8
      }
    }
  }));
  const DialogActions = $$a.defineComponent(function DialogActions2(inProps) {
    const props = $$a.useThemeProps({
      props: inProps
    });
    const [, other] = splitProps(props, ["class", "disableSpacing"]);
    const baseProps = mergeProps({
      disableSpacing: false
    }, props);
    const ownerState = baseProps;
    const classes = $$a.useClasses(ownerState);
    return createComponent(DialogActionsRoot, mergeProps({
      get ["class"]() {
        return clsx(classes.root, props.class);
      },
      ownerState
    }, other));
  });
  function getDialogTitleUtilityClass(slot) {
    return generateUtilityClass("MuiDialogTitle", slot);
  }
  const dialogTitleClasses = generateUtilityClasses("MuiDialogTitle", ["root"]);
  function getDialogContentUtilityClass(slot) {
    return generateUtilityClass("MuiDialogContent", slot);
  }
  generateUtilityClasses("MuiDialogContent", ["root", "dividers"]);
  const $$9 = createComponentFactory()({
    name: "MuiDialogContent",
    selfPropNames: ["children", "classes", "dividers"],
    utilityClass: getDialogContentUtilityClass,
    slotClasses: (ownerState) => ({
      root: ["root", ownerState.dividers && "dividers"]
    })
  });
  const DialogContentRoot = styled$1("div", {
    name: "MuiDialogContent",
    slot: "Root",
    overridesResolver: (props, styles) => {
      const {
        ownerState
      } = props;
      return [styles.root, ownerState.dividers && styles.dividers];
    }
  })(({
    theme,
    ownerState
  }) => ({
    flex: "1 1 auto",
    // Add iOS momentum scrolling for iOS < 13.0
    WebkitOverflowScrolling: "touch",
    overflowY: "auto",
    // https://github.com/microsoft/TypeScript/issues/37559
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    padding: "20px 24px",
    ...ownerState.dividers ? {
      padding: "16px 24px",
      borderTop: `1px solid ${theme.palette.divider}`,
      borderBottom: `1px solid ${theme.palette.divider}`
    } : {
      [`.${dialogTitleClasses.root} + &`]: {
        paddingTop: 0
      }
    }
  }));
  const DialogContent = $$9.defineComponent(function DialogContent2(inProps) {
    const props = $$9.useThemeProps({
      props: inProps
    });
    const [, other] = splitProps(props, ["class", "dividers"]);
    const baseProps = mergeProps({
      dividers: false
    }, props);
    const ownerState = mergeProps(props, {
      get dividers() {
        return baseProps.dividers;
      }
    });
    const classes = $$9.useClasses(ownerState);
    return createComponent(DialogContentRoot, mergeProps({
      get ["class"]() {
        return clsx(classes.root, props.class);
      },
      ownerState
    }, other));
  });
  function getTypographyUtilityClass(slot) {
    return generateUtilityClass("MuiTypography", slot);
  }
  generateUtilityClasses("MuiTypography", [
    "root",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "subtitle1",
    "subtitle2",
    "body1",
    "body2",
    "inherit",
    "button",
    "caption",
    "overline",
    "alignLeft",
    "alignRight",
    "alignCenter",
    "alignJustify",
    "noWrap",
    "gutterBottom",
    "paragraph"
  ]);
  const $$8 = createComponentFactory()({
    name: "MuiTypography",
    selfPropNames: ["align", "children", "classes", "gutterBottom", "noWrap", "paragraph", "variant", "variantMapping"],
    propDefaults: ({
      set
    }) => set({
      align: "inherit",
      gutterBottom: false,
      noWrap: false,
      paragraph: false,
      variant: "body1",
      variantMapping: {}
    }),
    utilityClass: getTypographyUtilityClass,
    slotClasses: (ownerState) => ({
      root: ["root", ownerState.variant, ownerState.align !== "inherit" && `align${capitalize(ownerState.align)}`, ownerState.gutterBottom && "gutterBottom", ownerState.noWrap && "noWrap", ownerState.paragraph && "paragraph"]
    })
  });
  const TypographyRoot = styled$1("span", {
    name: "MuiTypography",
    slot: "Root",
    overridesResolver: (props, styles) => {
      const {
        ownerState
      } = props;
      return [styles.root, ownerState.variant && styles[ownerState.variant], ownerState.align !== "inherit" && styles[`align${capitalize(ownerState.align)}`], ownerState.noWrap && styles.noWrap, ownerState.gutterBottom && styles.gutterBottom, ownerState.paragraph && styles.paragraph];
    }
  })(({
    theme,
    ownerState
  }) => ({
    margin: 0,
    color: ownerState.color,
    ...ownerState.variant && theme.typography[ownerState.variant],
    ...ownerState.align !== "inherit" && {
      textAlign: ownerState.align
    },
    ...ownerState.noWrap && {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    },
    ...ownerState.gutterBottom && {
      marginBottom: "0.35em"
    },
    ...ownerState.paragraph && {
      marginBottom: 16
    }
  }));
  const defaultVariantMapping = {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    h5: "h5",
    h6: "h6",
    subtitle1: "h6",
    subtitle2: "h6",
    body1: "p",
    body2: "p",
    inherit: "p"
  };
  const colorTransformations = {
    primary: "primary.main",
    textPrimary: "text.primary",
    secondary: "secondary.main",
    textSecondary: "text.secondary",
    error: "error.main"
  };
  const transformDeprecatedColors = (color) => {
    return colorTransformations[color] || color;
  };
  const Typography = $$8.component(function Typography2({
    allProps,
    classes,
    otherProps,
    props
  }) {
    const Component = () => otherProps.component || (props.paragraph ? "p" : props.variantMapping[props.variant] || defaultVariantMapping[props.variant]) || "span";
    const colorProps = mergeProps(() => {
      const color = transformDeprecatedColors(allProps.color);
      return color ? {
        color
      } : {};
    });
    const ownerState = mergeProps(allProps, colorProps);
    otherProps = extendSxProp(mergeProps(otherProps, colorProps));
    return createComponent(TypographyRoot, mergeProps(otherProps, {
      get as() {
        return Component();
      },
      ownerState,
      get ["class"]() {
        return clsx(classes.root, otherProps.class);
      },
      get children() {
        return props.children;
      }
    }));
  });
  const $$7 = createComponentFactory()({
    name: "MuiDialogTitle",
    selfPropNames: ["children", "classes"],
    utilityClass: getDialogTitleUtilityClass,
    slotClasses: () => ({
      root: ["root"]
    })
  });
  const DialogTitleRoot = styled$1(Typography, {
    name: "MuiDialogTitle",
    slot: "Root",
    overridesResolver: (props, styles) => styles.root
  })({
    padding: "16px 24px",
    flex: "0 0 auto"
  });
  const DialogTitle = $$7.defineComponent(function DialogTitle2(inProps) {
    const props = $$7.useThemeProps({
      props: inProps
    });
    const [, other] = splitProps(props, ["class", "id"]);
    const ownerState = props;
    const classes = $$7.useClasses(ownerState);
    const context = useContext(DialogContext);
    const titleId = () => context.titleId ?? props.id;
    return createComponent(DialogTitleRoot, mergeProps({
      get ["class"]() {
        return clsx(classes.root, props.class);
      },
      ownerState,
      variant: "h6",
      get id() {
        return titleId();
      }
    }, other, {
      get component() {
        return props.component ?? "h2";
      }
    }));
  });
  function getFormControlUtilityClasses(slot) {
    return generateUtilityClass("MuiFormControl", slot);
  }
  generateUtilityClasses("MuiFormControl", ["root", "marginNone", "marginNormal", "marginDense", "fullWidth", "disabled"]);
  const $$6 = createComponentFactory()({
    name: "MuiFormControl",
    selfPropNames: ["children", "classes", "color", "disabled", "error", "focused", "fullWidth", "hiddenLabel", "margin", "required", "size", "variant"],
    propDefaults: ({
      set
    }) => set({
      color: "primary",
      component: "div",
      disabled: false,
      error: false,
      fullWidth: false,
      hiddenLabel: false,
      margin: "none",
      required: false,
      size: "medium",
      variant: "outlined"
    }),
    utilityClass: getFormControlUtilityClasses,
    slotClasses: (ownerState) => ({
      root: ["root", ownerState.margin !== "none" && `margin${capitalize(ownerState.margin)}`, ownerState.fullWidth && "fullWidth"]
    })
  });
  const FormControlRoot = styled$1("div", {
    name: "MuiFormControl",
    slot: "Root",
    overridesResolver: ({
      ownerState
    }, styles) => {
      return {
        ...styles.root,
        ...styles[`margin${capitalize(ownerState.margin)}`],
        ...ownerState.fullWidth && styles.fullWidth
      };
    }
  })(({
    ownerState
  }) => ({
    display: "inline-flex",
    flexDirection: "column",
    position: "relative",
    // Reset fieldset default style.
    minWidth: 0,
    padding: 0,
    margin: 0,
    border: 0,
    verticalAlign: "top",
    ...ownerState.margin === "normal" && {
      marginTop: 16,
      marginBottom: 8
    },
    ...ownerState.margin === "dense" && {
      marginTop: 8,
      marginBottom: 4
    },
    ...ownerState.fullWidth && {
      width: "100%"
    }
  }));
  $$6.component(function FormControl({
    allProps,
    classes,
    otherProps,
    props
  }) {
    const [filled, setFilled] = createSignal(false);
    const [focusedState, setFocused] = createSignal(false);
    createEffect(() => {
      if (props.disabled && focusedState())
        setFocused(false);
    });
    const focused = () => props.focused !== void 0 && !props.disabled ? props.focused : focusedState();
    let registerEffect;
    return createComponent(FormControlContext.Provider, {
      value: {
        get adornedStart() {
          return false;
        },
        setAdornedStart: () => {
          return void 0;
        },
        get margin() {
          return props.margin;
        },
        get color() {
          return props.color;
        },
        get disabled() {
          return props.disabled;
        },
        get error() {
          return props.error;
        },
        get filled() {
          return filled();
        },
        get focused() {
          return focused();
        },
        get fullWidth() {
          return props.fullWidth;
        },
        get hiddenLabel() {
          return props.hiddenLabel;
        },
        get size() {
          return props.size;
        },
        onBlur: () => {
          setFocused(false);
        },
        onEmpty: () => {
          setFilled(false);
        },
        onFilled: () => {
          setFilled(true);
        },
        onFocus: () => {
          setFocused(true);
        },
        registerEffect,
        get required() {
          return props.required;
        },
        get variant() {
          return props.variant;
        }
      },
      get children() {
        return createComponent(FormControlRoot, mergeProps(otherProps, {
          ownerState: allProps,
          get ["class"]() {
            return clsx(classes.root, otherProps.class);
          },
          get children() {
            return props.children;
          }
        }));
      }
    });
  });
  function formControlState(data) {
    const compose = () => {
      return data.states.reduce((acc, state) => {
        acc[state] = data.props[state];
        if (data.muiFormControl) {
          if (typeof data.props[state] === "undefined") {
            acc[state] = data.muiFormControl[state];
          }
        }
        return acc;
      }, {});
    };
    const object = createMutable({});
    createComputed(() => {
      const newObject = compose();
      batch(() => {
        for (const key in newObject) {
          if (object[key] !== newObject[key])
            object[key] = newObject[key];
        }
        const newKeys = Object.keys(newObject);
        for (const key in object) {
          if (!newKeys.includes(key))
            delete object[key];
        }
      });
    });
    return object;
  }
  function getFormControlLabelUtilityClasses(slot) {
    return generateUtilityClass("MuiFormControlLabel", slot);
  }
  const formControlLabelClasses = generateUtilityClasses("MuiFormControlLabel", [
    "root",
    "labelPlacementStart",
    "labelPlacementTop",
    "labelPlacementBottom",
    "disabled",
    "label",
    "error"
  ]);
  const $$5 = createComponentFactory()({
    name: "MuiFormControlLabel",
    propDefaults: ({
      set
    }) => set({
      componentsProps: {},
      labelPlacement: "end"
    }),
    selfPropNames: ["checked", "classes", "componentsProps", "control", "disableTypography", "disabled", "inputRef", "label", "labelPlacement", "name", "onChange", "value"],
    autoCallUseClasses: false,
    utilityClass: getFormControlLabelUtilityClasses,
    slotClasses: (ownerState) => ({
      root: ["root", !!ownerState.disabled && "disabled", `labelPlacement${capitalize(ownerState.labelPlacement)}`, !!ownerState.error && "error"],
      label: ["label", !!ownerState.disabled && "disabled"]
    })
  });
  const FormControlLabelRoot = styled$1("label", {
    name: "MuiFormControlLabel",
    slot: "Root",
    overridesResolver: (props, styles) => {
      const {
        ownerState
      } = props;
      return [{
        [`& .${formControlLabelClasses.label}`]: styles.label
      }, styles.root, styles[`labelPlacement${capitalize(ownerState.labelPlacement)}`]];
    }
  })(({
    theme,
    ownerState
  }) => ({
    display: "inline-flex",
    alignItems: "center",
    cursor: "pointer",
    // For correct alignment with the text.
    verticalAlign: "middle",
    WebkitTapHighlightColor: "transparent",
    marginLeft: -11,
    marginRight: 16,
    [`&.${formControlLabelClasses.disabled}`]: {
      cursor: "default"
    },
    ...ownerState.labelPlacement === "start" && {
      flexDirection: "row-reverse",
      marginLeft: 16,
      marginRight: -11
    },
    ...ownerState.labelPlacement === "top" && {
      flexDirection: "column-reverse",
      marginLeft: 16
    },
    ...ownerState.labelPlacement === "bottom" && {
      flexDirection: "column",
      marginLeft: 16
    },
    [`& .${formControlLabelClasses.label}`]: {
      [`&.${formControlLabelClasses.disabled}`]: {
        color: theme.palette.text.disabled
      }
    }
  }));
  const FormControlLabel = $$5.component(function FormControlLabel2({
    allProps,
    otherProps,
    props
  }) {
    const muiFormControl = useFormControl();
    const [partialContextProps] = splitProps(props, ["checked", "name", "onChange", "value", "inputRef", "disabled"]);
    const [childDisabled, setChildDisabled] = createSignal(props.disabled);
    const contextProps = mergeProps(partialContextProps, {
      setDisabled: (state) => setChildDisabled(state)
    });
    const fcs = formControlState({
      props: allProps,
      muiFormControl,
      states: ["error"]
    });
    const ownerState = mergeProps(allProps, {
      get error() {
        return fcs.error;
      },
      get disabled() {
        return childDisabled();
      }
    });
    const classes = $$5.useClasses(ownerState);
    const isTypography = (v) => v instanceof HTMLElement && v.classList.contains(Typography.toString());
    const Label = createMemo(() => {
      const label = children(() => props.label)();
      if (isTypography(label) || props.disableTypography)
        return label;
      return createComponent(Typography, mergeProps({
        component: "span",
        get ["class"]() {
          return classes.label;
        }
      }, () => props.componentsProps.typography || {}, {
        get children() {
          return props.label;
        }
      }));
    });
    return createComponent(FormControlLabelContext.Provider, {
      value: contextProps,
      get children() {
        return createComponent(FormControlLabelRoot, mergeProps(otherProps, {
          get ["class"]() {
            return clsx(classes.root, otherProps.class);
          },
          ownerState,
          get children() {
            return [createMemo(() => props.control), createMemo(() => Label())];
          }
        }));
      }
    });
  });
  const ListContext = createContext({
    dense: false
  });
  function useListContext() {
    return useContext(ListContext);
  }
  function getListUtilityClass(slot) {
    return generateUtilityClass("MuiList", slot);
  }
  generateUtilityClasses("MuiList", [
    "root",
    "padding",
    "dense",
    "subheader"
  ]);
  const $$4 = createComponentFactory()({
    name: "MuiList",
    selfPropNames: ["children", "classes", "dense", "disablePadding", "subheader"],
    propDefaults: ({
      set
    }) => set({
      component: "ul",
      dense: false,
      disablePadding: false
    }),
    utilityClass: getListUtilityClass,
    slotClasses: (ownerState) => ({
      root: ["root", !ownerState.disablePadding && "padding", ownerState.dense && "dense", !!ownerState.subheader && "subheader"]
    })
  });
  const ListRoot = styled$1("ul", {
    name: "MuiList",
    slot: "Root",
    overridesResolver: (props, styles) => {
      const {
        ownerState
      } = props;
      return [styles.root, !ownerState.disablePadding && styles.padding, ownerState.dense && styles.dense, ownerState.subheader && styles.subheader];
    }
  })(({
    ownerState
  }) => ({
    listStyle: "none",
    margin: 0,
    padding: 0,
    position: "relative",
    ...!ownerState.disablePadding && {
      paddingTop: 8,
      paddingBottom: 8
    },
    ...ownerState.subheader && {
      paddingTop: 0
    }
  }));
  const List = $$4.component(function List2({
    allProps,
    classes,
    otherProps,
    props
  }) {
    return createComponent(ListContext.Provider, {
      value: {
        get dense() {
          return props.dense;
        }
      },
      get children() {
        return createComponent(ListRoot, mergeProps(otherProps, {
          get ["class"]() {
            return clsx(classes.root, otherProps.class);
          },
          ownerState: allProps,
          get children() {
            return [createMemo(() => props.subheader), createMemo(() => props.children)];
          }
        }));
      }
    });
  });
  function getListItemButtonUtilityClass(slot) {
    return generateUtilityClass("MuiListItemButton", slot);
  }
  const listItemButtonClasses = generateUtilityClasses("MuiListItemButton", [
    "root",
    "focusVisible",
    "dense",
    "alignItemsFlexStart",
    "disabled",
    "divider",
    "gutters",
    "selected"
  ]);
  const $$3 = createComponentFactory()({
    name: "MuiListItemButton",
    selfPropNames: ["alignItems", "autoFocus", "children", "classes", "dense", "disableGutters", "disabled", "divider", "selected"],
    propDefaults: ({
      set
    }) => set({
      alignItems: "center",
      autoFocus: false,
      component: "div",
      dense: false,
      disableGutters: false,
      divider: false,
      selected: false,
      disabled: false
    }),
    utilityClass: getListItemButtonUtilityClass,
    slotClasses: (ownerState) => ({
      root: ["root", ownerState.dense && "dense", !ownerState.disableGutters && "gutters", ownerState.divider && "divider", ownerState.disabled && "disabled", ownerState.alignItems === "flex-start" && "alignItemsFlexStart", ownerState.selected && "selected"]
    })
  });
  const ListItemButtonRoot = styled$1(ButtonBase, {
    skipProps: skipRootProps.filter((v) => v !== "classes"),
    name: "MuiListItemButton",
    slot: "Root",
    overridesResolver: (props, styles) => {
      return [styles.root, props.ownerState.dense && styles.dense, props.ownerState.alignItems === "flex-start" && styles.alignItemsFlexStart, props.ownerState.divider && styles.divider, !props.ownerState.disableGutters && styles.gutters];
    }
  })(({
    theme,
    ownerState
  }) => ({
    display: "flex",
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    position: "relative",
    textDecoration: "none",
    boxSizing: "border-box",
    textAlign: "left",
    paddingTop: 8,
    paddingBottom: 8,
    transition: theme.transitions.create("background-color", {
      duration: theme.transitions.duration.shortest
    }),
    "&:hover": {
      textDecoration: "none",
      backgroundColor: theme.palette.action.hover,
      // Reset on touch devices, it doesn't add specificity
      "@media (hover: none)": {
        backgroundColor: "transparent"
      }
    },
    [`&.${listItemButtonClasses.selected}`]: {
      backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
      [`&.${listItemButtonClasses.focusVisible}`]: {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity + theme.palette.action.focusOpacity)
      }
    },
    [`&.${listItemButtonClasses.selected}:hover`]: {
      backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity),
      // Reset on touch devices, it doesn't add specificity
      "@media (hover: none)": {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity)
      }
    },
    [`&.${listItemButtonClasses.focusVisible}`]: {
      backgroundColor: theme.palette.action.focus
    },
    [`&.${listItemButtonClasses.disabled}`]: {
      opacity: theme.palette.action.disabledOpacity
    },
    ...ownerState.divider && {
      borderBottom: `1px solid ${theme.palette.divider}`,
      backgroundClip: "padding-box"
    },
    ...ownerState.alignItems === "flex-start" && {
      alignItems: "flex-start"
    },
    ...!ownerState.disableGutters && {
      paddingLeft: 16,
      paddingRight: 16
    },
    ...ownerState.dense && {
      paddingTop: 4,
      paddingBottom: 4
    }
  }));
  $$3.component(function ListItemButton({
    allProps,
    classes,
    otherProps,
    props
  }) {
    const context = useListContext();
    const childContext = {
      get dense() {
        return props.dense || context.dense || false;
      },
      get alignItems() {
        return props.alignItems;
      },
      get disableGutters() {
        return props.disableGutters;
      }
    };
    const ownerState = mergeProps(allProps, {
      get dense() {
        return childContext.dense;
      }
    });
    const element = createElementRef(otherProps);
    createEffect(() => {
      if (props.autoFocus) {
        if (element.ref) {
          element.ref.focus();
        }
      }
    });
    return createComponent(ListContext.Provider, {
      value: childContext,
      get children() {
        return createComponent(ListItemButtonRoot, mergeProps(otherProps, {
          ref: element,
          get focusVisibleClassName() {
            var _a2;
            return clsx((_a2 = props.classes) == null ? void 0 : _a2.focusVisible, otherProps.focusVisibleClassName);
          },
          ownerState,
          classes,
          get children() {
            return props.children;
          }
        }));
      }
    });
  });
  function getListItemSecondaryActionClassesUtilityClass(slot) {
    return generateUtilityClass("MuiListItemSecondaryAction", slot);
  }
  generateUtilityClasses("MuiListItemSecondaryAction", [
    "root",
    "disableGutters"
  ]);
  const $$2 = createComponentFactory()({
    name: "MuiListItemSecondaryAction",
    selfPropNames: ["alignItems", "children", "classes"],
    propDefaults: ({
      set
    }) => set({}),
    autoCallUseClasses: false,
    utilityClass: getListItemSecondaryActionClassesUtilityClass,
    slotClasses: (ownerState) => ({
      root: ["root", ownerState.disableGutters && "disableGutters"]
    })
  });
  const ListItemSecondaryActionRoot = styled$1("div", {
    name: "MuiListItemSecondaryAction",
    slot: "Root",
    overridesResolver: (props, styles) => {
      const {
        ownerState
      } = props;
      return [styles.root, ownerState.disableGutters && styles.disableGutters];
    }
  })(({
    ownerState
  }) => ({
    position: "absolute",
    right: 16,
    top: "50%",
    transform: "translateY(-50%)",
    ...ownerState.disableGutters && {
      right: 0
    }
  }));
  const ListItemSecondaryAction = $$2.component(function ListItemSecondaryAction2({
    allProps,
    otherProps,
    props
  }) {
    const context = useListContext();
    const ownerState = mergeProps({
      get disableGutters() {
        return !!context.disableGutters;
      }
    }, allProps);
    const classes = $$2.useClasses(ownerState);
    return createComponent(ListItemSecondaryActionRoot, mergeProps(otherProps, {
      get ["class"]() {
        return clsx(classes.root, otherProps.class);
      },
      ownerState,
      get children() {
        return props.children;
      }
    }));
  });
  function getListItemUtilityClass(slot) {
    return generateUtilityClass("MuiListItem", slot);
  }
  const listItemClasses = generateUtilityClasses("MuiListItem", [
    "root",
    "container",
    "focusVisible",
    "dense",
    "alignItemsFlexStart",
    "disabled",
    "divider",
    "gutters",
    "padding",
    "button",
    "secondaryAction",
    "selected"
  ]);
  const $$1 = createComponentFactory()({
    name: "MuiListItem",
    selfPropNames: ["alignItems", "autoFocus", "children", "classes", "components", "componentsProps", "dense", "disableGutters", "disablePadding", "divider", "secondaryAction"],
    propDefaults: ({
      set
    }) => set({
      component: "li",
      alignItems: "center",
      autoFocus: false,
      components: {},
      componentsProps: {},
      dense: false,
      disableGutters: false,
      disablePadding: false,
      divider: false
    }),
    utilityClass: getListItemUtilityClass,
    slotClasses: (ownerState) => ({
      root: ["root", ownerState.dense && "dense", !ownerState.disableGutters && "gutters", !ownerState.disablePadding && "padding", ownerState.divider && "divider", ownerState.alignItems === "flex-start" && "alignItemsFlexStart"],
      container: ["container"]
    })
  });
  const ListItemRoot = styled$1("div", {
    name: "MuiListItem",
    slot: "Root",
    overridesResolver: (props, styles) => {
      const {
        ownerState
      } = props;
      return [styles.root, ownerState.dense && styles.dense, ownerState.alignItems === "flex-start" && styles.alignItemsFlexStart, ownerState.divider && styles.divider, !ownerState.disableGutters && styles.gutters, !ownerState.disablePadding && styles.padding, ownerState.button && styles.button];
    }
  })(({
    theme,
    ownerState
  }) => ({
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    position: "relative",
    textDecoration: "none",
    width: "100%",
    boxSizing: "border-box",
    textAlign: "left",
    ...!ownerState.disablePadding && {
      paddingTop: 8,
      paddingBottom: 8,
      ...ownerState.dense && {
        paddingTop: 4,
        paddingBottom: 4
      },
      ...!ownerState.disableGutters && {
        paddingLeft: 16,
        paddingRight: 16
      },
      ...!!ownerState.secondaryAction && {
        // Add some space to avoid collision as `ListItemSecondaryAction`
        // is absolutely positioned.
        paddingRight: 48
      }
    },
    ...!!ownerState.secondaryAction && {
      [`& > .${listItemButtonClasses.root}`]: {
        paddingRight: 48
      }
    },
    [`&.${listItemClasses.focusVisible}`]: {
      backgroundColor: theme.palette.action.focus
    },
    [`&.${listItemClasses.selected}`]: {
      backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
      [`&.${listItemClasses.focusVisible}`]: {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity + theme.palette.action.focusOpacity)
      }
    },
    [`&.${listItemClasses.disabled}`]: {
      opacity: theme.palette.action.disabledOpacity
    },
    ...ownerState.alignItems === "flex-start" && {
      alignItems: "flex-start"
    },
    ...ownerState.divider && {
      borderBottom: `1px solid ${theme.palette.divider}`,
      backgroundClip: "padding-box"
    }
  }));
  const ListItem = $$1.component(function ListItem2({
    allProps,
    classes,
    otherProps,
    props
  }) {
    const element = createElementRef(otherProps);
    const context = useListContext();
    const childContext = {
      get dense() {
        return props.dense || context.dense || false;
      },
      get alignItems() {
        return props.alignItems;
      },
      get disableGutters() {
        return props.disableGutters;
      }
    };
    createEffect(() => {
      if (props.autoFocus) {
        if (element.ref) {
          element.ref.focus();
        }
      }
    });
    const ownerState = mergeProps(allProps, {
      get dense() {
        return childContext.dense;
      }
    });
    const Root = () => props.components.Root || ListItemRoot;
    const rootProps = () => props.componentsProps.root || {};
    const [, componentProps] = splitProps(mergeProps({
      get class() {
        return clsx(classes.root, rootProps().class, otherProps.class);
      }
    }, otherProps), ["component", "ref"]);
    return createComponent(ListContext.Provider, {
      value: childContext,
      get children() {
        return createComponent(Dynamic, mergeProps({
          get $component() {
            return Root();
          },
          get as() {
            return otherProps.component;
          },
          ref: element,
          ownerState
        }, () => !isHostComponent(Root()) && {
          ownerState: mergeProps(ownerState, () => rootProps().ownerState || {})
        }, componentProps, {
          get children() {
            return [createMemo(() => props.children), createComponent(Show, {
              get when() {
                return !!props.secondaryAction;
              },
              get children() {
                return createComponent(ListItemSecondaryAction, {
                  get children() {
                    return props.secondaryAction;
                  }
                });
              }
            })];
          }
        }));
      }
    });
  });
  function getListItemTextUtilityClass(slot) {
    return generateUtilityClass("MuiListItemText", slot);
  }
  const listItemTextClasses = generateUtilityClasses("MuiListItemText", ["root", "multiline", "dense", "inset", "primary", "secondary"]);
  const $ = createComponentFactory()({
    name: "MuiListItemText",
    selfPropNames: ["children", "classes", "disableTypography", "inset", "primary", "primaryTypographyProps", "secondary", "secondaryTypographyProps"],
    propDefaults: ({
      set
    }) => set({
      disableTypography: false,
      inset: false
    }),
    utilityClass: getListItemTextUtilityClass,
    slotClasses: (ownerState) => ({
      root: ["root", ownerState.inset && "inset", ownerState.dense && "dense", !!ownerState.primary && !!ownerState.secondary && "multiline"],
      primary: ["primary"],
      secondary: ["secondary"]
    })
  });
  const ListItemTextRoot = styled$1("div", {
    name: "MuiListItemText",
    slot: "Root",
    overridesResolver: (props, styles) => {
      const {
        ownerState
      } = props;
      return [{
        [`& .${listItemTextClasses.primary}`]: styles.primary
      }, {
        [`& .${listItemTextClasses.secondary}`]: styles.secondary
      }, styles.root, ownerState.inset && styles.inset, ownerState.primary && ownerState.secondary && styles.multiline, ownerState.dense && styles.dense];
    }
  })(({
    ownerState
  }) => ({
    flex: "1 1 auto",
    minWidth: 0,
    marginTop: 4,
    marginBottom: 4,
    ...ownerState.primary && ownerState.secondary && {
      marginTop: 6,
      marginBottom: 6
    },
    ...ownerState.inset && {
      paddingLeft: 56
    }
  }));
  const ListItemText = $.component(function ListItemText2({
    allProps,
    classes,
    otherProps,
    props
  }) {
    const context = useListContext();
    const ownerState = mergeProps(allProps, {
      get dense() {
        return context.dense;
      }
    });
    const isDefined = (v) => v !== "undefined" && v !== null;
    const isTypography = (v) => v instanceof HTMLElement && v.classList.contains(Typography.toString());
    const primary = createMemo(() => {
      const primary2 = children(() => props.primary ?? props.children)();
      if (isDefined(primary2) && !isTypography(primary2) && !props.disableTypography) {
        return createComponent(Typography, mergeProps({
          get variant() {
            return context.dense ? "body2" : "body1";
          },
          get ["class"]() {
            return classes.primary;
          },
          component: "span",
          display: "block"
        }, () => props.primaryTypographyProps || {}, {
          children: primary2
        }));
      } else {
        return primary2;
      }
    });
    const secondary = createMemo(() => {
      const secondary2 = children(() => props.secondary)();
      if (isDefined(secondary2) && !isTypography(secondary2) && !props.disableTypography) {
        return createComponent(Typography, mergeProps({
          variant: "body2",
          get ["class"]() {
            return classes.secondary;
          },
          sx: {
            display: "block",
            color: "text.secondary"
          }
        }, () => props.secondaryTypographyProps || {}, {
          get component() {
            var _a2;
            return ((_a2 = props.secondaryTypographyProps) == null ? void 0 : _a2.component) ?? "p";
          },
          children: secondary2
        }));
      } else {
        return secondary2;
      }
    });
    return createComponent(ListItemTextRoot, mergeProps(otherProps, {
      get ["class"]() {
        return clsx(classes.root, otherProps.class);
      },
      ownerState,
      get children() {
        return [createMemo(() => primary()), createMemo(() => secondary())];
      }
    }));
  });
  const SettingItem = (props) => {
    return createComponent(ListItem, {
      disablePadding: true,
      get children() {
        return createComponent(ListItemText, {
          get primary() {
            return createComponent(FormControlLabel, {
              get label() {
                return props.label;
              },
              get control() {
                return createComponent(Checkbox, {
                  get checked() {
                    return props.checked;
                  },
                  onChange: (ev) => {
                    props.onChanged(!ev.target.checked);
                  }
                });
              }
            });
          }
        });
      }
    });
  };
  const SettingsDialog = (props) => {
    const [settings2, setSettings] = createSignal(loadSettings());
    const handleCheck = (feature) => (checked) => {
      setSettings((prev) => ({
        ...prev,
        features: {
          ...prev.features,
          [feature]: checked
        }
      }));
    };
    const save = () => {
      saveSettings(settings2());
      document.location.reload();
    };
    const handleClose = () => {
      props.setOpen(false);
    };
    return createComponent(Dialog, {
      get open() {
        return props.open;
      },
      onClose: handleClose,
      "aria-labelledby": "alert-dialog-title",
      "aria-describedby": "alert-dialog-description",
      get children() {
        return [createComponent(DialogTitle, {
          id: "alert-dialog-title",
          children: "設定"
        }), createComponent(DialogContent, {
          get children() {
            return createComponent(List, {
              get children() {
                return [createComponent(SettingItem, {
                  label: "addFooterMenu",
                  get checked() {
                    var _a2;
                    return ((_a2 = settings2().features) == null ? void 0 : _a2.addFooterMenu) ? true : false;
                  },
                  get onChanged() {
                    return handleCheck("addFooterMenu");
                  }
                }), createComponent(SettingItem, {
                  label: "hideFooterBottom",
                  get checked() {
                    var _a2;
                    return ((_a2 = settings2().features) == null ? void 0 : _a2.hideFooterBottom) ? true : false;
                  },
                  get onChanged() {
                    return handleCheck("hideFooterBottom");
                  }
                }), createComponent(SettingItem, {
                  label: "hideGoods",
                  get checked() {
                    var _a2;
                    return ((_a2 = settings2().features) == null ? void 0 : _a2.hideGoods) ? true : false;
                  },
                  get onChanged() {
                    return handleCheck("hideGoods");
                  }
                }), createComponent(SettingItem, {
                  label: "hideSong",
                  get checked() {
                    var _a2;
                    return ((_a2 = settings2().features) == null ? void 0 : _a2.hideSong) ? true : false;
                  },
                  get onChanged() {
                    return handleCheck("hideSong");
                  }
                }), createComponent(SettingItem, {
                  label: "showCompleted",
                  get checked() {
                    var _a2;
                    return ((_a2 = settings2().features) == null ? void 0 : _a2.showCompleted) ? true : false;
                  },
                  get onChanged() {
                    return handleCheck("showCompleted");
                  }
                })];
              }
            });
          }
        }), createComponent(DialogActions, {
          get children() {
            return createComponent(Button, {
              onClick: save,
              children: "Save"
            });
          }
        })];
      }
    });
  };
  const _tmpl$ = /* @__PURE__ */ template(`<a href="javascript:void(0)">*rdas設定*<i class="icon iconArrowOrangeRight"></i></a>`);
  const Wrapper = () => {
    const [open, setOpen] = createSignal(false);
    const handleClick = () => {
      setOpen(true);
    };
    return [(() => {
      const _el$ = _tmpl$.cloneNode(true);
      _el$.$$click = handleClick;
      return _el$;
    })(), createComponent(SettingsDialog, {
      get open() {
        return open();
      },
      setOpen: (v) => setOpen(v)
    })];
  };
  const applySettings = () => {
    const footerMenu = document.querySelector(".footerMenu");
    if (!footerMenu) {
      return;
    }
    footerMenu.appendChild(createElement$2("li", (li) => {
      render$1(() => createComponent(Wrapper, {}), li);
    }));
  };
  delegateEvents(["click"]);
  const settings = loadSettings();
  if (location.href.includes("https://animestore.docomo.ne.jp/animestore/tp_pc")) {
    applySettings();
    if ((_a = settings.features) == null ? void 0 : _a.addFooterMenu) {
      applyAddFooterMenu();
    }
    if ((_b = settings.features) == null ? void 0 : _b.hideFooterBottom) {
      applyHideFooterBottom();
    }
    if ((_c = settings.features) == null ? void 0 : _c.hideGoods) {
      applyHideGoods();
    }
    if ((_d = settings.features) == null ? void 0 : _d.hideSong) {
      applyHideSong();
    }
  }
  if (location.href.includes(
    "https://animestore.docomo.ne.jp/animestore/mpa_cmp_pc"
  )) {
    if ((_e = settings.features) == null ? void 0 : _e.showCompleted) {
      applyGetCompleted();
    }
  }
  if (location.href.includes("https://animestore.docomo.ne.jp/animestore/CP/")) {
    if ((_f = settings.features) == null ? void 0 : _f.showCompleted) {
      applyShowCompletedToCP();
    }
  }
  if (location.href.includes(
    "https://animestore.docomo.ne.jp/animestore/sc_d_pc?partId=*"
  ))
    ;
})();
