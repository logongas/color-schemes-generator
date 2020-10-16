/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSL representation
 */
function rgbToHsl(rgbColor) {
  r=rgbColor.r;
  g=rgbColor.g;
  b=rgbColor.b;
  r /= 255, g /= 255, b /= 255;

  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }

    h /= 6;
  }

  return { h:Math.round(h*360), s:Math.round(s*100), l:Math.round(l*100) };
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
function hslToRgb(hslColor) {
  h=hslColor.h/360;
  s=hslColor.s/100;
  l=hslColor.l/100;
    
  var r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return { r:Math.round(r * 255), g:Math.round(g * 255), b:Math.round(b * 255) };
}

function rgbToHex(rgbColor) {
    return (componentToHex(rgbColor.r) + componentToHex(rgbColor.g) + componentToHex(rgbColor.b)).toUpperCase();
}

function hexToRgb(hex) {
 var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

function isHslColor(color) {
    return ( (typeof color !== 'undefined') && (typeof color.h !== 'undefined') && (typeof color.s !== 'undefined') && (typeof color.l !== 'undefined'));
}
function isRgbColor(color) {
    return ((typeof color !== 'undefined') && (typeof color.r !== 'undefined') && (typeof color.g !== 'undefined') && (typeof color.b !== 'undefined'));
}








function inverseGammaRGB(ic) {
    
    var c = ic/255.0;
    if ( c <= 0.04045 ) {
        return c/12.92;
    } else {
        return Math.pow(((c+0.055)/(1.055)),2.4);
    }
}

function gammaRGB(v) {
    if(v<=0.0031308) {
        v *= 12.92;
    } else {
        v = 1.055*Math.pow(v,1.0/2.4)-0.055;
    }
    return v*255; 
                           
}

function luminosidadAparente(rgbColor) {
var rY = 0.212655;
var gY = 0.715158;
var bY = 0.072187;
    
    return gammaRGB(
            rY*inverseGammaRGB(rgbColor.r) +
            gY*inverseGammaRGB(rgbColor.g) +
            bY*inverseGammaRGB(rgbColor.b)
    );
}