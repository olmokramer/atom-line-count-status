'use babel';
import './line-count-status-element.js';

var statusBarTile;

export var config = {
  format: {
    type: 'string',
    default: 'Lines: %s'
  }
};

export function activate() {}

export function deactivate() {
  statusBarTile.getItem().destroy();
  statusBarTile.destroy();
  statusBarTile = null;
}

export function consumeStatusBarService(statusBar) {
  statusBarTile = statusBar.addLeftTile({
    item: document.createElement('line-count-status')
  });
}
