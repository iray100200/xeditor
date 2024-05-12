import { Editor } from 'slate';

export interface Plugin {
  apply(): void;
}

export class PluginInstance implements Plugin {
  constructor(public editor: Editor) {
    this.apply()
  }

  apply() {
    throw new Error('You should override this function')
  }
}
