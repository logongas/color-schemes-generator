function generarScheme() {   
       
    
    
    
    var minLightness=parseInt($("#minLightness").val(),10);
    var lightnessRange=getLightnessRange(minLightness);
    
    var ecuacion=$("input[name='ecuacion']:checked").val();
    if (ecuacion==="parabola") {
        functionSaturationFromLightness=getFunctionParabolaSaturationFromLightness(lightnessRange)
    } else if (ecuacion==="logistica") {
        functionSaturationFromLightness=getFunctionLogisticaModelSaturationFromLightness();
    } else if (ecuacion==="constante") {
        functionSaturationFromLightness=getFunctionConstanteModelSaturationFromLightness();        
    } else {
        alert("Ecuación desconocida");
        exit;
    }
    
    var incLightness=(lightnessRange.realMaxLightness-lightnessRange.realMinLightness)/(numPaletas-1);
    var h=getColorCentral().h;
    var lightness=lightnessRange.realMinLightness;
    for(var i=0;i<numPaletas;i++) {
        refreshPaleta(i, {
            h:rotateHue(h,i),
            s:Math.round(functionSaturationFromLightness(lightness)),
            l:Math.round(lightness)
        });
        
        lightness=lightness+incLightness;
    } 
    
}

function getLightnessRange(minLightness) {;    
    var hslColorCentral=getColorCentral();
    var rangeLightness=Math.abs(Math.min(hslColorCentral.l-minLightness,100-hslColorCentral.l));

    
    return {
        realMinLightness:hslColorCentral.l-rangeLightness,  
        realMaxLightness:hslColorCentral.l+rangeLightness
    }
}

function getFunctionParabolaSaturationFromLightness(lightnessRange) {
    var maxSaturation=parseInt($("#maxSaturation").val(),10);
    
    var hslColorCentral=getColorCentral();
    
    var matrix=[
        [lightnessRange.realMinLightness*lightnessRange.realMinLightness,lightnessRange.realMinLightness,1],
        [lightnessRange.realMaxLightness*lightnessRange.realMaxLightness,lightnessRange.realMaxLightness,1],
        [hslColorCentral.l*hslColorCentral.l,hslColorCentral.l,1]
    ];
    var vector=[maxSaturation,maxSaturation,hslColorCentral.s];
    
    var result=resolveEquationsSystem(matrix,vector);
    var functionParabolaSaturationFromLightness=function(lightness) {
        return Math.round((result[0]*lightness*lightness)+(result[1]*lightness)+result[2])
    }
    
    return functionParabolaSaturationFromLightness;
}


function getFunctionLogisticaModelSaturationFromLightness() {
     var hslColorCentral=getColorCentral();
    
    var maxSaturation=parseInt($("#maxSaturation").val(),10);
    var b=parseFloat($("#tasa-crecimiento").val(),10);
    var amplitudSaturation=(maxSaturation-hslColorCentral.s);
    var a=amplitudSaturation*2;
        
    return function (lightness) {
        saturation=(a/(1+Math.exp(-(b/100)*(lightness-hslColorCentral.l))))+(hslColorCentral.s-amplitudSaturation);
        
        return saturation;
    }
}

function getFunctionConstanteModelSaturationFromLightness() {
     var hslColorCentral=getColorCentral();
   
    return function (lightness) {
        return hslColorCentral.s;
    }
}




function rotateHue(h,index) {   
    
    var rotateHue=parseInt($("#rotate-hue").val(),10);
    
    a=(rotateHue*2)/(numPaletas-1);
    b=-rotateHue;
    
    
    var realRotare;
    
    if (rotateHue>0) {    
        realRotare=Math.round((a*index)+b);
    } else {
        realRotare=0;
    }
    
    realH=h+realRotare;
    if (realH<0) {
        realH=360-realRotare;
    }

    return realH;
    
}
