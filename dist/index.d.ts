import { Scene, Nullable, AbstractMesh, Texture, TransformNode, Observable, ActionEvent } from '@babylonjs/core';

type HtmlMeshOptions = {
    html: string;
    width?: number;
    height?: number;
    image?: {
        width: number;
        height: number;
    };
    hoverHtml?: string;
    clickHtml?: string;
};
type HtmlImageData = {
    base64Url: string;
    width: number;
    height: number;
};
declare class HtmlMeshBuilder {
    static CreatePlane(name: string, options: HtmlMeshOptions, scene: Scene): Promise<Nullable<AbstractMesh>>;
    static CreateTexture(base64: string, scene: Scene): Promise<Texture>;
    private static imageCache;
    static CreateImageData(node: HTMLElement): Promise<Nullable<HtmlImageData>>;
    private static BuildPlane;
}

type ButtonOptions = {
    template?: string;
    hoverStyle?: string;
    mainStyle?: string;
    clickStyle?: string;
};
declare class HtmlButton {
    static DEFAULT_STYLE: string;
    static DEFAULT_HOVER_STYLE: string;
    static DEFAULT_CLICK_STYLE: string;
    private _mesh;
    readonly transform: TransformNode;
    readonly onReadyObservable: Observable<HtmlButton>;
    readonly onPointerObservable: Observable<ActionEvent>;
    constructor(name: string, id: string, scene: Scene, buttonOptions?: ButtonOptions, meshOptions?: HtmlMeshOptions);
    get mesh(): Nullable<AbstractMesh>;
    private setup;
    dispose(): void;
}

export { HtmlButton, HtmlMeshBuilder };
