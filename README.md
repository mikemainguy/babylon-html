# Babylonjs HTML Renderer
Rendering HTML inside a Babylonjs WebXR scene.

## Usage
### Simplest form 

Create a simple button with label 'Button 1234' and id 'button1234id'.

```typescript
const button1 = new HtmlButton('Button', 'id-button', scene);
```


### More Complex Example


```typescript
import { Button } from '@babylonjs/gui/2D/controls/button';
const baseStyle = "border-radius: 32px; background: #COLOR; width: 100%; height: 100%; color: #000000; font-size: 64px";

const button1 = new HtmlButton('Button 1234', 'test', scene,
            {mainStyle: baseStyle.replace('COLOR', '0000cc'),
             hoverStyle: baseStyle.replace('COLOR', '0033dd'),
             clickStyle: baseStyle.replace('COLOR', '5555ee')
            },
            {html: null, image: {width: 256, height: 256}, height: .04});
button1.transform.position.y = 1;
button1.transform.rotation.y = Math.PI;
```

This creates a plane that is .04 units high with a 256x256 image texture mapped to 
the emissive texture of the plane. The plane is rotated 180 degrees around the y-axis and it's
position is set to 1 unit above the origin.

you can pass arbitrary css to the style property of the options object. The css will be applied to the
button.  If you omit hover or click styles they will default to the main style.
