import { addClass, removeClass } from './utils/domManipulation';

export default class DropElement {
  el:HTMLElement | null = null;

  dropCb:Function | null = null;

  constructor(el:HTMLElement) {
    this.el = el;
    this.el.ondrop = this.dropHandler.bind(this);
    this.el.ondragover = DropElement.dragOverHandler;
    this.el.ondragenter = this.dragEnterHandler.bind(this);
    this.el.ondragleave = this.dragLeaveHandler.bind(this);
  }

  dragEnterHandler(event:DragEvent) {
    addClass(this.el!, 'bg-green-500');
    event.preventDefault();
  }

  static dragOverHandler(event:DragEvent) {
    event.preventDefault();
  }

  dragLeaveHandler(event:DragEvent) {
    removeClass(this.el!, 'bg-green-500');
    event.preventDefault();
  }

  dropHandler(ev:DragEvent) {
    removeClass(this.el!, 'bg-green-500');
    ev.preventDefault();
    if (this.dropCb) {
      this.dropCb(ev);
    }
  }
}
