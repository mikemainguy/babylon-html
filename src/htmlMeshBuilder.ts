import domtoimage from 'dom-to-image-more';
import {
    AbstractMesh,
    ActionManager,
    MeshBuilder, Nullable,
    Scene, SetValueAction,
    StandardMaterial,
    Texture
} from "@babylonjs/core";
export type HtmlMeshOptions = {
    html: string,
    width?: number,
    height?: number,
    image?: {
        width: number,
        height: number
    }
    hoverHtml?: string,
    clickHtml?: string
}
export type HtmlImageData = {
    base64Url: string,
    width: number,
    height: number
}

export class HtmlMeshBuilder {
    public static async CreatePlane(name: string, options: HtmlMeshOptions, scene: Scene): Promise<Nullable<AbstractMesh>> {

        const mainElement = document.createElement('div');
        const hoverElement = document.createElement('div');
        const clickElement = document.createElement('div');

        if (options.image) {
            mainElement.style.width = options.image.width+'px';
            mainElement.style.height = options.image.height+'px';
            clickElement.style.width = options.image.width+'px';
            clickElement.style.height = options.image.height+'px';
            hoverElement.style.width = options.image.width+'px';
            hoverElement.style.height = options.image.height+'px';
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
            const mainImage = await HtmlMeshBuilder.CreateImageData(mainElement);
            if (mainImage == null) {
                return null;
            }
            const hoverImage =
                defaultImageIfNull(await HtmlMeshBuilder.CreateImageData(hoverElement), mainImage);

            const clickImage =
                defaultImageIfNull(await HtmlMeshBuilder.CreateImageData(clickElement), mainImage);

            const plane = await HtmlMeshBuilder.BuildPlane(name, options, mainImage, scene);
            const mainTexture = new Texture(mainImage.base64Url, scene);
            const hoverTexture = new Texture(hoverImage.base64Url, scene);
            const clickTexture = new Texture(clickImage.base64Url, scene);
            (plane.material as StandardMaterial).opacityTexture =  mainTexture;
            (plane.material as StandardMaterial).emissiveTexture = mainTexture;
            plane.actionManager = new ActionManager(scene);
            plane.actionManager.registerAction(new SetValueAction(ActionManager.OnPointerOverTrigger,
                plane.material, 'emissiveTexture', hoverTexture
            ));
            plane.actionManager.registerAction(new SetValueAction(ActionManager.OnPointerOverTrigger,
                plane.material, 'opacityTexture', hoverTexture
            ));
            plane.actionManager.registerAction(new SetValueAction(ActionManager.OnPointerOutTrigger,
                plane.material, 'emissiveTexture', mainTexture
            ));
            plane.actionManager.registerAction(new SetValueAction(ActionManager.OnPointerOutTrigger,
                plane.material, 'opacityTexture', mainTexture
            ));
            plane.actionManager.registerAction(new SetValueAction(ActionManager.OnPickDownTrigger,
                plane.material, 'emissiveTexture', clickTexture
            ));
            plane.actionManager.registerAction(new SetValueAction(ActionManager.OnPickDownTrigger,
                plane.material, 'opacityTexture', clickTexture
            ));
            plane.actionManager.registerAction(new SetValueAction(ActionManager.OnPickUpTrigger,
                plane.material, 'emissiveTexture', hoverTexture
            ));
            plane.actionManager.registerAction(new SetValueAction(ActionManager.OnPickUpTrigger,
                plane.material, 'opacityTexture', hoverTexture
            ));


            return plane;
        } else {
            console.error('Element not found');
            return null;
        }
    }

    public static async CreateTexture(base64: string, scene: Scene): Promise<Texture> {
        return new Texture(base64, scene);
    }
    private static imageCache: Map<string, HtmlImageData> = new Map<string, HtmlImageData>();

    public static async CreateImageData(node: HTMLElement): Promise<Nullable<HtmlImageData>> {
        const bytes = new TextEncoder().encode(node.innerHTML);
        const digest = await crypto.subtle.digest('SHA-256', bytes);
        const resultBytes = [...new Uint8Array(digest)];
        const hash = resultBytes.map(x => x.toString(16).padStart(2, '0')).join("");

        const data =HtmlMeshBuilder.imageCache.get(hash);
        if (!data) {
            document.body.appendChild(node);
            const image64 = await domtoimage.toPng(node, {
                bgcolor: 'transparent',
                height: node.clientHeight,
                width: node.clientWidth
            });
            document.body.removeChild(node);
            HtmlMeshBuilder.imageCache.set(node.innerHTML, image64);


            try {
                const image = new Image();
                image.decoding = 'sync';
                image.loading = 'eager';
                image.src = image64;
                let retries = 1;
                try {
                    await image.decode();
                } catch (err) {
                    console.warn('Image decode failed, retrying')
                    while (retries < 3) {
                        try {
                            console.warn('Retrying attempt ' + retries);
                            await image.decode();
                            break;
                        } catch (err) {
                            retries++;
                            console.warn('Retry attempt ' + retries + ' failed');
                        }
                    }
                }
                if (retries > 1) {
                    console.warn('Image decode succeeded after ' + retries + ' retries. You may be trying to create too many or too complex html nodes');
                }
                const width = image.width;
                const height = image.height;
                const output = {width: width, height: height, base64Url: image64};
                HtmlMeshBuilder.imageCache.set(hash, output);
                return output;
            } catch (err) {
                console.error(err);
                console.error(node);
                return null;
            }
        } else {
            return data;
        }
    }
    private static async BuildPlane(name: string, options: HtmlMeshOptions, image: HtmlImageData, scene: Scene) {
        if (!options.width && !options.height) {
            options.width = 1;
            options.height = 1;
        } else {
            if (options.width) {
                options.height = options.width*(image.height/image.width);
            } else {
                if (options.height) {
                    options.width = options.height*(image.width/image.height);
                }
            }
        }
        const plane = MeshBuilder.CreatePlane(name, {width: options.width, height: options.height}, scene);
        const mat = new StandardMaterial(name+'Material', scene);
        plane.material = mat;
        mat.disableLighting = true;
        return plane;
    }
}

function defaultImageIfNull(image: Nullable<HtmlImageData>, defaultImage: HtmlImageData): HtmlImageData {
    if (image == null) {
        return defaultImage;
    } else {
        return image;
    }
}