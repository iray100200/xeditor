import { Subject } from 'rxjs';
import { Editor, Element } from 'slate'
import { ReactEditor } from 'slate-react';

import { MarkdownElementType } from './custom-types';
import { PluginInstance } from './plugins/plugin'

declare type SlateEventType = 'insertText' | 'insertBreak' | 'deleteBackward'

export class SlateEvent<T = unknown> extends Event {
  private readonly $values: any[] = []

  set $value(value: unknown) {
    this.$values.push(value)
  }

  get $value(): T {
    return this.$values[this.$values.length - 1]
  }

  get $firstValue(): unknown {
    return this.$values[0]
  }

  get data(): T {
    return this.$value
  }

  constructor(type: SlateEventType, options) {
    super(type, options)
  }
}

/**
 * @param next filter function
 * @returns [value, terminate]
 */
export function filter<T>(next: (data: T) => boolean) {
  return (data: T): [T, boolean] => {
    const result = !next(data)
    return [data, result]
  }
}

export function map<T, S>(next: (data: T) => S) {
  return (data: T): [S] => {
    const result = next(data)
    return [result]
  }
}

export function is(type: MarkdownElementType | RegExp) {
  return (data, editor: Editor) => {
    const node = editor.above({
      match: node => Element.isElement(node) && (type instanceof RegExp ? type.test(node.type) : type === node.type)
    })
    return [data, !node]
  }
}

export class Pipe {
  constructor(private type: SlateEventType, private manager: Manager) {

  }

  // toto: fix event
  pipe<T = unknown, S = unknown>(...fns: Function[]) {
    const subscribe = new Subject<SlateEvent<S>>()
    this.manager.getEventTarget(this.type).addEventListener(this.type, (event: Event) => {
      if (event instanceof SlateEvent) {
        let next: unknown = (event as SlateEvent<T>).$firstValue
        for (const fn of fns) {
          let [_next, terminate] = fn(next, this.manager.editor)
          next = _next
          if (terminate) {
            return
          }
        }
        (event as SlateEvent<S>).$value = next as S
        subscribe.next(event as SlateEvent<S>)
      }
    })

    return {
      end: (handler: (event: SlateEvent<S>) => void) => {
        subscribe.subscribe((event: SlateEvent<S>) => {
          handler(event)
        })
      }
    }
  }
}

export class Manager {
  private events = {
    insertText: {
      eventTarget: new EventTarget(),
      type: 'insertText'
    },
    deleteBackward: {
      eventTarget: new EventTarget(),
      type: 'deleteBackward'
    }
  }

  constructor(public editor: Editor) {
    this.editor.on = this.on.bind(this)
    this.editor.proxy = this.proxy.bind(this)
    this.delegateInsertText()
    this.delegateDeleteBackward()
  }

  on(type: SlateEventType, handler: (event: SlateEvent) => void) {
    const { eventTarget } = this.events[type]
    eventTarget.addEventListener(type, (event: Event) => {
      if (event instanceof SlateEvent) {
        handler(event)
      }
    })
  }

  getEventTarget(type: SlateEventType): EventTarget {
    return this.events[type].eventTarget
  }

  getEvent(type: SlateEventType): Event {
    return this.events[type].event
  }

  proxy(type: SlateEventType) {
    return new Pipe(type, this)
  }

  private delegateInsertText() {
    this.editor.insertText = new Proxy(this.editor.insertText, {
      apply: (target: typeof this.editor.insertText, thisArg: Editor, argList: [string]) => {
        const event = new SlateEvent<string>('insertText', {
          cancelable: true
        })
        const { eventTarget } = this.events.insertText
        event.$value = argList[0]
        eventTarget.dispatchEvent(event)
        if (!event.defaultPrevented) {
          target.apply(thisArg, argList)
        }
      }
    })
  }

  private delegateDeleteBackward() {
    this.editor.deleteBackward = new Proxy(this.editor.deleteBackward, {
      apply: (target: typeof this.editor.delegateDeleteBackward, thisArg: Editor) => {
        const event = new SlateEvent<string>('deleteBackward', {
          cancelable: true
        })
        const { eventTarget } = this.events.deleteBackward
        eventTarget.dispatchEvent(event)
        if (!event.defaultPrevented) {
          target.apply(thisArg)
        }
      }
    })
  }

  static apply(editor: Editor, ...plugins: any[]) {
    new Manager(editor)
    plugins.forEach((Plugin: typeof PluginInstance) => {
      new Plugin(editor)
    })
    return editor
  }
}
