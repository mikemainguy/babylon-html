import {HtmlMeshBuilder, HtmlMeshOptions} from "./htmlMeshBuilder";
import {
    AbstractMesh,
    ActionEvent,
    ActionManager,
    ExecuteCodeAction, Nullable,
    Observable,
    Scene,
    TransformNode
} from "@babylonjs/core";

export type ButtonOptions ={
    template?: string,
    hoverStyle?: string,
    mainStyle?: string,
    clickStyle?: string,
}

export class HtmlButton {
    public static DEFAULT_STYLE = "border-style: outset; border-radius: 32px; background: #000000; width: 100%; height: 100%; color: #ffffff; font-size: 64px";
    public static DEFAULT_HOVER_STYLE = "border-style: outset; border-radius: 32px; background: #333366; width: 100%; height: 100%; color: #ffffee; font-size: 68px";
    public static DEFAULT_CLICK_STYLE = "border-style: inset;border-radius: 32px; background: #666633; width: 100%; height: 100%; color: #000000; font-size: 60px";
    private _mesh: Nullable<AbstractMesh> = null;
    public readonly transform: TransformNode
    public readonly onReadyObservable = new Observable<HtmlButton>();
    public readonly onPointerObservable: Observable<ActionEvent> = new Observable<ActionEvent>();
    constructor(name: string, id: string, scene: Scene, buttonOptions?: ButtonOptions, meshOptions?: HtmlMeshOptions) {
        this.transform = new TransformNode(id, scene);
        this.setup(name, scene, buttonOptions, meshOptions).then((node) => {
            if (node) {
                node.parent = this.transform;
            }
            this.onReadyObservable.notifyObservers(this);
        });
    }
    public get mesh(): Nullable<AbstractMesh> {
        return this._mesh;
    }
    private async setup(name: string, scene: Scene, buttonOptions?: ButtonOptions, meshOptions?: HtmlMeshOptions): Promise<Nullable<AbstractMesh>> {
        if (!buttonOptions) {
            buttonOptions = {};
            buttonOptions.mainStyle = HtmlButton.DEFAULT_STYLE;
        }
        if (!buttonOptions.hoverStyle) {
            buttonOptions.hoverStyle = HtmlButton.DEFAULT_HOVER_STYLE;
        }
        if (!buttonOptions.clickStyle) {
            buttonOptions.clickStyle = HtmlButton.DEFAULT_CLICK_STYLE;
        }
        const defaultOptions = {html:  `        
            <button style='${buttonOptions.mainStyle}'>${name}</button>
        `, hoverHtml: `
         <button style='${buttonOptions.hoverStyle}'>${name}</button>
        `, clickHtml: `
         <button style='${buttonOptions.clickStyle}'>${name}</button>
        `, height: .1, image: {width:256, height: 256}};
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
        const button = await HtmlMeshBuilder.CreatePlane(name+ '-mesh', meshOptions, scene);
        if (button == null) {
            return null;
        }
        this._mesh = button;
        button.rotation.y = Math.PI;
        button.id = this.transform.id;
        if (button.actionManager != null) {
            button.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPointerOverTrigger, (evt) => {
                this.onPointerObservable.notifyObservers(evt);
            }));
            button.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPointerOutTrigger, (evt) => {
                this.onPointerObservable.notifyObservers(evt);
            }));
            button.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickTrigger, (evt) => {
                this.onPointerObservable.notifyObservers(evt);
            }));
        }
        return button;
    }
    public dispose() {
        if (this._mesh != null) {
            this._mesh.dispose( false, true);
            this._mesh = null;
        }
        this.onPointerObservable.clear();
        this.onReadyObservable.clear();
        this.transform.dispose( false, true);
    }
}