import { mergeAttributes, Node } from "@tiptap/core";
import { CTA_ATTR_KEYS, CTA_DEFAULTS, ctaHtml, type CtaAttrs } from "@/lib/cta";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    cta: {
      insertCta: (attrs: CtaAttrs) => ReturnType;
    };
  }
}

type CtaOptions = {
  // Called when the editor clicks "Editar" on a block already in the text.
  onEdit: (position: number, attrs: CtaAttrs) => void;
};

// A CTA is one atomic block. Its settings live in data-cta-* attributes
// (the saved HTML is just an empty <div data-cta …>); lib/cta.ts expands it
// into the real markup when the article is rendered.
export const CtaNode = Node.create<CtaOptions>({
  name: "cta",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  addOptions() {
    return { onEdit: () => {} };
  },

  addAttributes() {
    return Object.fromEntries(
      CTA_ATTR_KEYS.map((key) => [
        key,
        {
          default: CTA_DEFAULTS.box[key],
          parseHTML: (element: HTMLElement) =>
            element.getAttribute(`data-cta-${key.toLowerCase()}`) ?? CTA_DEFAULTS.box[key],
          renderHTML: (attributes: Record<string, unknown>) => ({
            [`data-cta-${key.toLowerCase()}`]: String(attributes[key] ?? ""),
          }),
        },
      ]),
    );
  },

  parseHTML() {
    return [{ tag: "div[data-cta]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes({ "data-cta": "" }, HTMLAttributes)];
  },

  addCommands() {
    return {
      insertCta:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs }),
    };
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      const dom = document.createElement("div");
      dom.className = "cta-node";
      dom.contentEditable = "false";

      const render = (attrs: CtaAttrs) => {
        dom.innerHTML = `${ctaHtml(attrs, { preview: true })}<div class="cta-node__controls"><button type="button" data-action="edit">Editar</button><button type="button" data-action="remove">Remover</button></div>`;
      };
      render(node.attrs as CtaAttrs);

      dom.addEventListener("click", (event) => {
        const action = (event.target as HTMLElement).closest("button")?.dataset.action;
        const position = getPos();
        if (position === undefined) return;
        if (action === "edit") {
          this.options.onEdit(position, node.attrs as CtaAttrs);
        } else if (action === "remove") {
          editor.chain().focus().deleteRange({ from: position, to: position + node.nodeSize }).run();
        }
      });

      return {
        dom,
        update: (updated) => {
          if (updated.type.name !== this.name) return false;
          node = updated;
          render(updated.attrs as CtaAttrs);
          return true;
        },
        // The block's own buttons handle their clicks; keep ProseMirror out.
        stopEvent: (event) => (event.target as HTMLElement).closest("button") !== null,
        ignoreMutation: () => true,
      };
    };
  },
});
