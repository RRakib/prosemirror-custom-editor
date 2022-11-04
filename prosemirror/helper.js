import { DOMSerializer } from 'prosemirror-model';

export const serializer = schema => {
  const serializer = DOMSerializer.fromSchema(schema);

  return doc => {
    const container = document.createElement('article');
    container.appendChild(serializer.serializeFragment(doc.content));
    return container.innerHTML;
  };
};
