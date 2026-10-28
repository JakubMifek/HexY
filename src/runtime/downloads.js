import { DomainError } from '../domain/errors.js';

export class Downloads {
  /** @type {Set<string>} */
  urls = new Set();

  /** @param {string} content @param {string} name @param {string} type */
  save(content, name, type) {
    let url;
    const anchor = document.createElement('a');
    try {
      url = URL.createObjectURL(new Blob([content], { type }));
      this.urls.add(url);
      anchor.href = url;
      anchor.download = name;
      document.body.append(anchor);
      anchor.click();
    } catch {
      throw new DomainError('exportFailed');
    } finally {
      anchor.remove();
    }
  }

  dispose() {
    for (const url of this.urls) URL.revokeObjectURL(url);
    this.urls.clear();
  }
}
