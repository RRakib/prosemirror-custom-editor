import {
  joinUp,
  lift,
  setBlockType,
  toggleMark,
  wrapIn
} from 'prosemirror-commands';
import { redo, undo } from 'prosemirror-history';
import { wrapInList } from 'prosemirror-schema-list';
import {
  addColumnAfter,
  deleteColumn,
  addRowAfter,
  deleteRow,
  setCellAttr,
  deleteTable
} from 'prosemirror-tables';

import schema from './schema';
import icons from './icons';
import { MenuItem } from 'prosemirror-menu';

const markActive = type => state => {
  const { from, $from, to, empty } = state.selection;

  return empty
    ? type.isInSet(state.storedMarks || $from.marks())
    : state.doc.rangeHasMark(from, to, type);
};

const blockActive = (type, attrs = {}) => state => {
  const { $from, to, node } = state.selection;

  if (node) {
    return node.hasMarkup(type, attrs);
  }

  return to <= $from.end() && $from.parent.hasMarkup(type, attrs);
};

const headingItem = level => {
  return new MenuItem({
    icon: icons['heading' + level],
    active: blockActive(schema.nodes.heading, { level }),
    content: `Heading ${level}`,
    run: (state, dispatch, view) => {
      const isActive = blockActive(schema.nodes.heading, { level })(state);
      if (isActive) {
        return setBlockType(schema.nodes.paragraph)(state, dispatch, view);
      }
      setBlockType(schema.nodes.heading, { level })(state, dispatch, view);
    }
  });
};

export default {
  heading: {
    1: headingItem(1),
    2: headingItem(2),
    3: headingItem(3),
  },
  marks: {
    strong: new MenuItem({
      icon: icons.boldText,
      title: 'Toggle strong',
      content: icons.strong,
      active: markActive(schema.marks.strong),
      run: toggleMark(schema.marks.strong)
    }),
    em: new MenuItem({
      icon: icons.em,
      title: 'Toggle emphasis',
      content: icons.em,
      active: markActive(schema.marks.em),
      run: toggleMark(schema.marks.em)
    }),
    code: new MenuItem({
      title: 'Toggle code',
      content: icons.code,
      active: markActive(schema.marks.code),
      run: toggleMark(schema.marks.code)
    }),
    subscript: new MenuItem({
      title: 'Toggle subscript',
      content: icons.subscript,
      active: markActive(schema.marks.subscript),
      run: toggleMark(schema.marks.subscript),
    }),
    superscript: new MenuItem({
      title: 'Toggle superscript',
      content: icons.superscript,
      active: markActive(schema.marks.superscript),
      run: toggleMark(schema.marks.superscript)
    }),
    underline: new MenuItem({
      icon: icons.underline,
      title: 'Toggle underline',
      content: icons.underline,
      active: markActive(schema.marks.underline),
      run: toggleMark(schema.marks.underline)
    }),
    strikethrough: new MenuItem({
      title: 'Toggle strikethrough',
      content: icons.strikethrough,
      active: markActive(schema.marks.strikethrough),
      run: toggleMark(schema.marks.strikethrough)
    })
  },
  blocks: {
    blockquote: new MenuItem({
      title: 'Wrap in block quote',
      content: icons.blockquote,
      active: blockActive(schema.nodes.blockquote),
      enable: wrapIn(schema.nodes.blockquote),
      run: wrapIn(schema.nodes.blockquote)
    }),
    bullet_list: new MenuItem({
      title: 'Wrap in bullet list',
      content: icons.bullet_list,
      active: blockActive(schema.nodes.bullet_list),
      enable: () => true,
      run: (state, dispatch, view) => {
        const isActive = lift(state);
        if (isActive) {
          return lift(state, dispatch, view);
        }
        wrapInList(schema.nodes.bullet_list)(state, dispatch, view);
      }
    }),
    ordered_list: new MenuItem({
      title: 'Wrap in ordered list',
      content: icons.ordered_list,
      active: blockActive(schema.nodes.ordered_list),
      enable: () => true,
      run: (state, dispatch, view) => {
        const isActive = lift(state);
        if (isActive) {
          return lift(state, dispatch, view);
        }
        wrapInList(schema.nodes.ordered_list)(state, dispatch, view);
      }
    }),
    join_up: new MenuItem({
      title: 'Join with above block',
      content: icons.join_up,
      enable: joinUp,
      run: joinUp
    })
  },
  history: {
    undo: new MenuItem({
      title: 'Undo last change',
      content: icons.undo,
      enable: undo,
      run: undo
    }),
    redo: new MenuItem({
      title: 'Redo last undone change',
      content: icons.redo,
      enable: redo,
      run: redo
    })
  }
};
