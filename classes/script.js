class Sticker {
  constructor (parent, key, id, zIndexer) {
    this._elem = document.createElement('textarea');
    this._elem.className = 'sticker';

    this._parent = parent;
    this._parent.appendChild(this._elem);

    this._zIndexer = zIndexer;

    this._initRelocation();
    this._initRemove();
    this._initTopState();

    this._watchSize();
    this._watchText();
  }

  create(w, h, x, y) {
    this._setW(w);
    this._setH(h);
    this._setX(x);
    this._setY(y);
    this._setText('');
    this._setMaxZ();
  }

  _setW(value) {
    this._w = value;
    this._elem.style.width = value + 'px';
  }

  _getW() {
    return this._w
  }

  _setH(value) {
    this._h = value;
    this._elem.style.height = value + 'px';
  }

  _getH() {
    return this._h;
  }

  _setX(value) {
    this._x = value;
    this._elem.style.left = value + 'px';
  }

  _getX() {
    return this._x;
  }

  _setY(value) {
    this._y = value;
    this._elem.style.top = value + 'px';
  }

  _getY() {
    return this._h;
  }

  _setZ(value) {
    this._z = value;
    this._elem.style.zIndex = value;
  }

  getZ() {
    return this._z;
  }

  _setText(text) {
    this.text = text;
    this._elem.value = text;
  }

  _getText() {
    return this._text;
  }

  _setMaxZ() {
    let maxZ = this._zIndexer.getMaxZ();

    if(maxZ !== this.getZ() || maxZ === 0) {
      this._setZ(maxZ + 1);
    }
  } 

  _watchSize() {
    this._elem.addEventListener('mouseup', () => {
      let newWidth = parseInt(this._elem.clientWidth);
      let newHeight = parseInt(this._elem.clientHeight);

      if (newWidth !== this._getW()) {
        this._setW(newWidth);
      }

      if (newHeight !== this._getH()) {
        this._setH(newHeight);
      }
    })
  }

  _watchText() {
    this._elem.addEventListener('blur', () => {
      let newText = this._elem.value;

      if(newText !== this._getText()) {
        this._setText(newText);
      }
    })
  }

  _initTopState() {
    this._elem.addEventListener('click', () => {
      this._setMaxZ();
    })

    this._elem.addEventListener('dragstart', () => {
      this._setMaxZ();
    })
  }

  _initRemove() {
    this._elem.addEventListener('mousedown', event => {
      if(event.wich == 2) {
        this._parent.removeChild(this._elem);
      }
      event.preventDefault();
    })
  }

  _initRelocation() {
    this._elem.draggable = true;

    let correctionX = 0;
    let correctionY = 0;

    this._elem.addEventListener('dragstart', event => {
      correctionX = this._getX() - event.pageX;
      correctionY = this._getY() - event.pageY;
    })

    this._elem.addEventListener('dragend', event => {
      this._setX(correctionX + event.pageX);
      this._setY(correctionY + event.pageY);

      this._elem.blur();
    })
  }
}

class ZIndexer {
  constructor() {
    this._stickers = [];
  }

  add(sticker) {
    this._stickers.push(sticker);
  }

  getMaxZ() {
    if(this._stickers.length !== 0) {
      console.log('stickers', this._stickers);
      let zindexes = [];
      console.log('zindexes', zindexes);

      this._stickers.forEach(sticker => {
        console.log(sticker.style);
        zindexes.push(sticker.getZ());
      })

      return Math.max.apply(null, zindexes);
    } else return 0;
  }
}

class Stock {
  constructor(key, id = null) {
    this._storage = new Storage(key);
    this._id = id;
  }

  save(value) {
    let data = this._extract();
    data[this._id] = value;
    this._compact(data);
  }

  remove() {
    let data = this._extract();
    delete data[this._id];
    this._compact(data);
  }

  _compact(data) {
    this._storage.save(JSON.stringify(data));
  }

  _extract() {
    let data = this._storage.get();

    if(data === null) {
      return {}
    } else {
      return JSON.parse(data);
    }
  }
}
class Storage {
  constructor(key) {
    this._key = key;
  }

  save(data) {
    localStorage.setItem(this._key, data);
  }

  get() {
    return localStorage.getItem(this._key);
  }
}

let key = 'stickers';
let id = 0;
let zIndexer = new ZIndexer;

window.addEventListener('dblclick', event => {
  id ++;

  let sticker = new Sticker(document.body, key, id, zIndexer);
  sticker.create(150, 200, event.pageX, event.pageY);

  zIndexer.add(sticker);
})