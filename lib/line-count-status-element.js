'use babel';
import { Disposable, CompositeDisposable, TextEditor } from 'atom';
import 'object-assign-shim';

var prototype = Object.create(HTMLElement.prototype);

function addEventListener(el, event, cb) {
  el.addEventListener(event, cb);
  return new Disposable(() => el.removeEventListener(event, cb));
}

Object.assign(prototype, {
  createdCallback() {
    this.classList.add('inline-block');
    this.createLink();
    this.disposable = new CompositeDisposable(
      atom.workspace.observeActivePaneItem(paneItem =>
        this.update(paneItem)
      ),
      atom.config.observe('line-count-status.format', () =>
        this.update()
      ),
      addEventListener(this.link, 'click', function() {
        if(!atom.packages.isPackageLoaded('go-to-line')) return;
        var textEditorView = atom.views.getView(atom.workspace.getActiveTextEditor());
        atom.commands.dispatch(textEditorView, 'go-to-line:toggle');
      })
    );
  },

  destroy() {
    this.removeChild(this.link);
    this.disposable.dispose();
    [this.link, this.disposable] = [];
  },

  createLink() {
    this.link = document.createElement('a');
    this.link.classList.add('inline-block');
    this.appendChild(this.link);
  },

  update(paneItem = atom.workspace.getActivePaneItem()) {
    var format = atom.config.get('line-count-status.format');
    if(paneItem instanceof TextEditor) {
      this.link.innerHTML = format.replace('%s', paneItem.getLineCount());
      this.style.display = '';
    } else {
      this.style.display = 'none';
    }
  }
});

document.registerElement('line-count-status', { prototype });
