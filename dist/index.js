"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/index.ts
var src_exports = {};
__export(src_exports, {
  HtmlButton: () => HtmlButton,
  HtmlMeshBuilder: () => HtmlMeshBuilder
});
module.exports = __toCommonJS(src_exports);

// src/htmlMeshBuilder.ts
var import_dom_to_image_more = __toESM(require("dom-to-image-more"));
var import_core = require("@babylonjs/core");
var _HtmlMeshBuilder = class _HtmlMeshBuilder {
  static CreatePlane(name, options, scene) {
    return __async(this, null, function* () {
      const mainElement = document.createElement("div");
      const hoverElement = document.createElement("div");
      const clickElement = document.createElement("div");
      if (options.image) {
        mainElement.style.width = options.image.width + "px";
        mainElement.style.height = options.image.height + "px";
        clickElement.style.width = options.image.width + "px";
        clickElement.style.height = options.image.height + "px";
        hoverElement.style.width = options.image.width + "px";
        hoverElement.style.height = options.image.height + "px";
      }
      mainElement.innerHTML = options.html;
      if (options.hoverHtml) {
        hoverElement.innerHTML = options.hoverHtml;
      } else {
        hoverElement.innerHTML = options.html;
      }
      if (options.clickHtml) {
        clickElement.innerHTML = options.clickHtml;
      } else {
        clickElement.innerHTML = options.html;
      }
      if (mainElement) {
        const mainImage = yield _HtmlMeshBuilder.CreateImageData(mainElement);
        if (mainImage == null) {
          return null;
        }
        const hoverImage = defaultImageIfNull(yield _HtmlMeshBuilder.CreateImageData(hoverElement), mainImage);
        const clickImage = defaultImageIfNull(yield _HtmlMeshBuilder.CreateImageData(clickElement), mainImage);
        const plane = yield _HtmlMeshBuilder.BuildPlane(name, options, mainImage, scene);
        const mainTexture = new import_core.Texture(mainImage.base64Url, scene);
        const hoverTexture = new import_core.Texture(hoverImage.base64Url, scene);
        const clickTexture = new import_core.Texture(clickImage.base64Url, scene);
        plane.material.opacityTexture = mainTexture;
        plane.material.emissiveTexture = mainTexture;
        plane.actionManager = new import_core.ActionManager(scene);
        plane.actionManager.registerAction(new import_core.SetValueAction(
          import_core.ActionManager.OnPointerOverTrigger,
          plane.material,
          "emissiveTexture",
          hoverTexture
        ));
        plane.actionManager.registerAction(new import_core.SetValueAction(
          import_core.ActionManager.OnPointerOverTrigger,
          plane.material,
          "opacityTexture",
          hoverTexture
        ));
        plane.actionManager.registerAction(new import_core.SetValueAction(
          import_core.ActionManager.OnPointerOutTrigger,
          plane.material,
          "emissiveTexture",
          mainTexture
        ));
        plane.actionManager.registerAction(new import_core.SetValueAction(
          import_core.ActionManager.OnPointerOutTrigger,
          plane.material,
          "opacityTexture",
          mainTexture
        ));
        plane.actionManager.registerAction(new import_core.SetValueAction(
          import_core.ActionManager.OnPickDownTrigger,
          plane.material,
          "emissiveTexture",
          clickTexture
        ));
        plane.actionManager.registerAction(new import_core.SetValueAction(
          import_core.ActionManager.OnPickDownTrigger,
          plane.material,
          "opacityTexture",
          clickTexture
        ));
        plane.actionManager.registerAction(new import_core.SetValueAction(
          import_core.ActionManager.OnPickUpTrigger,
          plane.material,
          "emissiveTexture",
          hoverTexture
        ));
        plane.actionManager.registerAction(new import_core.SetValueAction(
          import_core.ActionManager.OnPickUpTrigger,
          plane.material,
          "opacityTexture",
          hoverTexture
        ));
        return plane;
      } else {
        console.error("Element not found");
        return null;
      }
    });
  }
  static CreateTexture(base64, scene) {
    return __async(this, null, function* () {
      return new import_core.Texture(base64, scene);
    });
  }
  static CreateImageData(node) {
    return __async(this, null, function* () {
      const bytes = new TextEncoder().encode(node.innerHTML);
      const digest = yield crypto.subtle.digest("SHA-256", bytes);
      const resultBytes = [...new Uint8Array(digest)];
      const hash = resultBytes.map((x) => x.toString(16).padStart(2, "0")).join("");
      const data = _HtmlMeshBuilder.imageCache.get(hash);
      if (!data) {
        document.body.appendChild(node);
        const image64 = yield import_dom_to_image_more.default.toPng(node, {
          bgcolor: "transparent",
          height: node.clientHeight,
          width: node.clientWidth
        });
        document.body.removeChild(node);
        _HtmlMeshBuilder.imageCache.set(node.innerHTML, image64);
        try {
          const image = new Image();
          image.decoding = "sync";
          image.loading = "eager";
          image.src = image64;
          let retries = 1;
          try {
            yield image.decode();
          } catch (err) {
            console.warn("Image decode failed, retrying");
            while (retries < 3) {
              try {
                console.warn("Retrying attempt " + retries);
                yield image.decode();
                break;
              } catch (err2) {
                retries++;
                console.warn("Retry attempt " + retries + " failed");
              }
            }
          }
          if (retries > 1) {
            console.warn("Image decode succeeded after " + retries + " retries. You may be trying to create too many or too complex html nodes");
          }
          const width = image.width;
          const height = image.height;
          const output = { width, height, base64Url: image64 };
          _HtmlMeshBuilder.imageCache.set(hash, output);
          return output;
        } catch (err) {
          console.error(err);
          console.error(node);
          return null;
        }
      } else {
        return data;
      }
    });
  }
  static BuildPlane(name, options, image, scene) {
    return __async(this, null, function* () {
      if (!options.width && !options.height) {
        options.width = 1;
        options.height = 1;
      } else {
        if (options.width) {
          options.height = options.width * (image.height / image.width);
        } else {
          if (options.height) {
            options.width = options.height * (image.width / image.height);
          }
        }
      }
      const plane = import_core.MeshBuilder.CreatePlane(name, { width: options.width, height: options.height }, scene);
      const mat = new import_core.StandardMaterial(name + "Material", scene);
      plane.material = mat;
      mat.disableLighting = true;
      return plane;
    });
  }
};
_HtmlMeshBuilder.imageCache = /* @__PURE__ */ new Map();
var HtmlMeshBuilder = _HtmlMeshBuilder;
function defaultImageIfNull(image, defaultImage) {
  if (image == null) {
    return defaultImage;
  } else {
    return image;
  }
}

// src/htmlButton.ts
var import_core2 = require("@babylonjs/core");
var _HtmlButton = class _HtmlButton {
  constructor(name, id, scene, buttonOptions, meshOptions) {
    this._mesh = null;
    this.onReadyObservable = new import_core2.Observable();
    this.onPointerObservable = new import_core2.Observable();
    this.transform = new import_core2.TransformNode(id, scene);
    this.setup(name, scene, buttonOptions, meshOptions).then((node) => {
      if (node) {
        node.parent = this.transform;
      }
      this.onReadyObservable.notifyObservers(this);
    });
  }
  get mesh() {
    return this._mesh;
  }
  setup(name, scene, buttonOptions, meshOptions) {
    return __async(this, null, function* () {
      if (!buttonOptions) {
        buttonOptions = {};
        buttonOptions.mainStyle = _HtmlButton.DEFAULT_STYLE;
      }
      if (!buttonOptions.hoverStyle) {
        buttonOptions.hoverStyle = _HtmlButton.DEFAULT_HOVER_STYLE;
      }
      if (!buttonOptions.clickStyle) {
        buttonOptions.clickStyle = _HtmlButton.DEFAULT_CLICK_STYLE;
      }
      const defaultOptions = { html: `        
            <button style='${buttonOptions.mainStyle}'>${name}</button>
        `, hoverHtml: `
         <button style='${buttonOptions.hoverStyle}'>${name}</button>
        `, clickHtml: `
         <button style='${buttonOptions.clickStyle}'>${name}</button>
        `, height: 0.1, image: { width: 256, height: 256 } };
      if (!meshOptions) {
        meshOptions = defaultOptions;
      } else {
        if (!meshOptions.html) {
          meshOptions.html = defaultOptions.html;
        }
        if (!meshOptions.hoverHtml) {
          meshOptions.hoverHtml = defaultOptions.hoverHtml;
        }
        if (!meshOptions.clickHtml) {
          meshOptions.clickHtml = defaultOptions.clickHtml;
        }
        if (!meshOptions.height) {
          meshOptions.height = defaultOptions.height;
        }
        if (!meshOptions.image) {
          meshOptions.image = defaultOptions.image;
        }
      }
      const button = yield HtmlMeshBuilder.CreatePlane(name + "-mesh", meshOptions, scene);
      if (button == null) {
        return null;
      }
      this._mesh = button;
      button.rotation.y = Math.PI;
      button.id = this.transform.id;
      if (button.actionManager != null) {
        button.actionManager.registerAction(new import_core2.ExecuteCodeAction(import_core2.ActionManager.OnPointerOverTrigger, (evt) => {
          this.onPointerObservable.notifyObservers(evt);
        }));
        button.actionManager.registerAction(new import_core2.ExecuteCodeAction(import_core2.ActionManager.OnPointerOutTrigger, (evt) => {
          this.onPointerObservable.notifyObservers(evt);
        }));
        button.actionManager.registerAction(new import_core2.ExecuteCodeAction(import_core2.ActionManager.OnPickTrigger, (evt) => {
          this.onPointerObservable.notifyObservers(evt);
        }));
      }
      return button;
    });
  }
  dispose() {
    if (this._mesh != null) {
      this._mesh.dispose(false, true);
      this._mesh = null;
    }
    this.onPointerObservable.clear();
    this.onReadyObservable.clear();
    this.transform.dispose(false, true);
  }
};
_HtmlButton.DEFAULT_STYLE = "border-style: outset; border-radius: 32px; background: #000000; width: 100%; height: 100%; color: #ffffff; font-size: 64px";
_HtmlButton.DEFAULT_HOVER_STYLE = "border-style: outset; border-radius: 32px; background: #333366; width: 100%; height: 100%; color: #ffffee; font-size: 68px";
_HtmlButton.DEFAULT_CLICK_STYLE = "border-style: inset;border-radius: 32px; background: #666633; width: 100%; height: 100%; color: #000000; font-size: 60px";
var HtmlButton = _HtmlButton;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HtmlButton,
  HtmlMeshBuilder
});
//# sourceMappingURL=index.js.map