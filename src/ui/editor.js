import { ALPHABETS } from '../domain/answers.js';
import { button, element, field, input, select } from './dom.js';
import { DIFFICULTIES } from '../domain/difficulty.js';

/** @typedef {import('./preparation-strings.js').PreparationTexts} Texts
 * @typedef {import('../runtime/preparation.js').Preparation} Preparation */

/** @param {Texts} t @param {Preparation} model
 * @param {(action: () => void) => void} run @param {() => void} save
 * @param {AbortSignal} signal */
export function editorView(t, model, run, save, signal) {
  const pack = model.editing;
  if (!pack) throw new Error('Editor requires a draft');
  const panel = element('section', '', {
    class: 'editor panel',
    'aria-labelledby': 'editor-heading',
  });
  panel.append(
    element('h2', t.editor, { id: 'editor-heading' }),
    element('p', t.editorHelp),
  );
  const navigation = select(
    'edit-position',
    pack.questions.map((question, index) => [
      String(index),
      `${index + 1} · ${question.initial} · ${question.id}`,
    ]),
    String(model.position),
  );
  navigation.addEventListener(
    'change',
    () =>
      run(() => {
        model.position = Number(navigation.value);
      }),
    { signal },
  );
  panel.append(
    metadataFields(t, model, signal),
    field(t.position, navigation),
    questionFields(t, model, signal),
  );
  if (pack.mode !== 'letters') {
    const previous = button(
      t.moveUp,
      'move-up',
      () => run(() => model.move(-1)),
      signal,
    );
    const next = button(
      t.moveDown,
      'move-down',
      () => run(() => model.move(1)),
      signal,
    );
    previous.disabled = model.position === 0;
    next.disabled = model.position === pack.questions.length - 1;
    panel.append(previous, next);
  }
  panel.append(
    button(t.save, 'save-pack', save, signal),
    button(
      t.cancel,
      'cancel-edit',
      () => run(() => model.cancelEditor()),
      signal,
    ),
  );
  return panel;
}

/** @param {Texts} t @param {Preparation} model @param {AbortSignal} signal */
function metadataFields(t, model, signal) {
  const pack = model.editing;
  if (!pack) throw new Error('Editor requires a draft');
  const metadata = element('div', '', { class: 'setup-grid' });
  const labels = {
    id: t.packId,
    title: t.title,
    authors: t.authors,
    license: t.license,
  };
  for (const key of /** @type {const} */ ([
    'id',
    'title',
    'authors',
    'license',
  ])) {
    metadata.append(
      editField(
        labels[key],
        `pack-${key}`,
        pack[key],
        (text) => {
          model.invalidate();
          if (key === 'authors') pack[key] = lines(text);
          else pack[key] = text;
        },
        signal,
      ),
    );
  }
  const difficulty = select(
    'pack-difficulty',
    [
      ...(Array.isArray(pack.difficulty) ? [['mixed', t.mixedDifficulty]] : []),
      ...DIFFICULTIES.map((level) => [level, t.difficulties[level]]),
    ],
    Array.isArray(pack.difficulty) ? 'mixed' : pack.difficulty,
  );
  difficulty.addEventListener(
    'change',
    () => {
      if (difficulty.value === 'mixed') return;
      model.invalidate();
      const level = DIFFICULTIES.find((level) => level === difficulty.value);
      if (!level) throw new Error('Unsupported difficulty control value');
      pack.difficulty = level;
      for (const question of pack.questions) question.difficulty = level;
      const mixed = difficulty.querySelector('option[value="mixed"]');
      mixed?.remove();
    },
    { signal },
  );
  metadata.append(field(t.difficulty, difficulty));
  return metadata;
}

/** @param {Texts} t @param {Preparation} model @param {AbortSignal} signal */
function questionFields(t, model, signal) {
  const pack = model.editing;
  if (!pack) throw new Error('Editor requires a draft');
  const question = pack.questions[model.position];
  const categories = /** @type {Record<string, string>} */ (t.categories);
  const grid = element('div', '', { class: 'setup-grid question-editor' });
  const id = input('question-id', 'text', question.id);
  id.readOnly = true;
  grid.append(field(t.questionId, id));
  const initial = select(
    'question-initial',
    ALPHABETS[pack.language].map((value) => [value, value]),
    question.initial,
  );
  initial.disabled = pack.mode === 'letters';
  initial.addEventListener(
    'change',
    () => {
      model.invalidate();
      question.initial = initial.value;
    },
    { signal },
  );
  grid.append(field(t.initial, initial));
  for (const key of /** @type {const} */ ([
    'text',
    'answer',
    'aliases',
    'category',
    'sources',
  ])) {
    const labels = {
      text: t.question,
      answer: t.answer,
      aliases: t.aliases,
      category: `${t.category} · ${Object.hasOwn(categories, question.category) ? categories[question.category] : question.category}`,
      sources: t.provenance,
    };
    grid.append(
      editField(
        labels[key],
        `question-${key}`,
        question[key],
        (value) => {
          model.invalidate();
          if (key === 'aliases' || key === 'sources')
            question[key] = lines(value);
          else question[key] = value;
        },
        signal,
      ),
    );
  }
  grid.append(originView(t, question));
  return grid;
}

/** @param {Texts} t @param {import('../domain/types.js').Question} question */
function originView(t, question) {
  const origins = question.origins
    ?.map(
      (origin) =>
        `${origin.packId} / ${origin.questionId} — ${origin.authors.join(', ')} — ${origin.license}`,
    )
    .join('\n');
  return element('p', `${t.origins}: ${origins}`, {
    class: 'muted provenance',
  });
}

/** @param {string} label @param {string} id @param {string | string[]} value
 * @param {(value: string) => void} change @param {AbortSignal} signal */
function editField(label, id, value, change, signal) {
  const control = document.createElement('textarea');
  control.id = id;
  control.value = Array.isArray(value) ? value.join('\n') : value;
  control.rows = 2;
  control.addEventListener('input', () => change(control.value), { signal });
  return field(label, control);
}

/** @param {string} text */
function lines(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}
