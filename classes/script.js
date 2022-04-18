class Sticker {
  constructor (parent, key, id, zIndexer) {
    this._elem = document.createElement('textarea');
    this._elem.className = 'sticker';

    this._parent = parent;
    this._parent = document.appendChild(this._elem);

    this._zIndexer = zIndexer;

    this._watchSize();
    this._watchText();
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
    this._elem.style.zIndex = value + 'px';
  }

  getZ() {
    return parseInt(this._elem.style.zIndex) ;
  }

  _setText(text) {
    this._text = text;
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
}