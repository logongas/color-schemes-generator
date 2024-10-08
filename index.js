let numPaletas=9;

function getHTMLPaleta(indexPaleta,isCentralColor) {
    var titulo;
    var classNameInput;
    if (isCentralColor) {
        titulo="Color central";
        classNameInput="c-paleta__hex  c-paleta__hex--central";
    } else {
        titulo="&nbsp;";
        classNameInput="c-paleta__hex";
    }
    
return `
            <div class="c-paleta" id="paleta${indexPaleta}" >
                <div class="c-paleta__titulo">${titulo}</div>     
                <div class="c-paleta__color">
                </div> 
                <div class="${classNameInput}">
                    <label id='caption'>#</label>
                    <input type="text"  value="00FF00" >
                </div>                 
                <div class="c-paleta__slider-hue">
                    <input type="range" min="0" max="360" value="180" >
                    <input type="number" min="0" max="360" value="180" >
                </div> 
                <div class="c-paleta__slider-saturation">
                    <input type="range" min="0" max="100" value="50">
                    <input type="number" min="0" max="100" value="50">
                </div> 
                <div class="c-paleta__slider-lightness">
                    <input type="range" min="0" max="100" value="50">
                    <input type="number" min="0" max="100" value="50">
                </div>                 
            </div>
           
`
}


function refreshPaleta(indexPaleta, color,noUpdateChart) {
    let rgbColor;
    let hslColor;

    if (isRgbColor(color)) {
        rgbColor=color;
        hslColor=rgbToHsl(rgbColor);
    } else if (isHslColor(color)) {
        hslColor=color;
        rgbColor=hslToRgb(hslColor);
    } else {
        throw Exception("El color no es válido");
    }

    $("#paleta" + indexPaleta + "> .c-paleta__color").css("background-color", "hsl(" + hslColor.h + "," + hslColor.s + "%," + hslColor.l + "%)");
    valRgbTextColor(indexPaleta, rgbColor);
    valHSLSliderColor(indexPaleta, hslColor);
    valHSLNumberColor(indexPaleta, hslColor);
    
    if (!noUpdateChart) {
        updateChart();
    }
}



function getColorCentral() {
    var indexColorCentral=Math.round(numPaletas/2)-1;
    var hslColorCentral=valHSLNumberColor(indexColorCentral);
    return hslColorCentral;
}


$(document).ready(function () {
    
    createChart();
    const params = new URLSearchParams(window.location.search);  
    var indexColorCentral=Math.round(numPaletas/2)-1;
    
    //Generar las paletas
    for (let i = 0; i < numPaletas; i++) {
        var isCentralColor;
        if (i===indexColorCentral) {
            isCentralColor=true;
        } else {
            isCentralColor=false;
        }
        $(".l-paletas").append(getHTMLPaleta(i,isCentralColor));
    }

    if (params.get("minLightness")) {
        $("#minLightness").val(params.get("minLightness"));
    }
    if (params.get("maxSaturation")) {
        $("#maxSaturation").val(params.get("maxSaturation"));
    }
    if (params.get("rotate-hue")) {
        $("#rotate-hue").val(params.get("rotate-hue"));
    }
    if (params.get("ecuacion")) {
        $("input[name='ecuacion']").val([params.get("ecuacion")]);
    }
    if (params.get("tasa-crecimiento")) {
        $("#tasa-crecimiento").val(params.get("tasa-crecimiento"));
    }


    eventsChange();
    var hueRandom=Math.floor(Math.random() * 365);
    refreshPaleta(indexColorCentral,  {
        h: hueRandom,
        s: 50,
        l: 50 
    });
    generarScheme();

    //Asignar colores iniciales
    for (let i = 0; i < numPaletas; i++) {
        let textHslColor=params.get("p"+i); 
        let textRgbColor=params.get("r"+i); 
        let hslColor;
        if ((typeof textHslColor !== 'undefined') && (textHslColor!=null)) {
            let arrHslColor=textHslColor.split("-");
            hslColor = {
                h: arrHslColor[0],
                s: arrHslColor[1],
                l: arrHslColor[2]
            }
            refreshPaleta(i, hslColor);
        } else if ((typeof textRgbColor !== 'undefined') && (textRgbColor!=null)) { 
            refreshPaleta(i, hexToRgb(textRgbColor));
        }
    }



});
function eventsChange() {

    for (let i = 0; i < numPaletas; i++) {
        $("#paleta" + i).find("input[type=range]").change(i, function (eventData) {
            let indexPaleta = eventData.data;
            let hslColor = valHSLSliderColor(indexPaleta);
            refreshPaleta(indexPaleta, hslColor);
        });
        $("#paleta" + i).find("input[type=number]").change(i, function (eventData) {
            let indexPaleta = eventData.data;
            let hslColor = valHSLNumberColor(indexPaleta);
            refreshPaleta(indexPaleta, hslColor);
        });
        $("#paleta" + i).find("input[type=text]").change(i, function (eventData) {
            let indexPaleta = eventData.data;
            let rgbColor = valRgbTextColor(indexPaleta);
            refreshPaleta(indexPaleta, rgbColor);
        });
    }

}


function valRgbTextColor(indexPaleta, rgbColor) {
    if (rgbColor) {
        $("#paleta" + indexPaleta + "> .c-paleta__hex > input[type=text]").val(rgbToHex(rgbColor));
    }

    rgbColor = hexToRgb($("#paleta" + indexPaleta + "> .c-paleta__hex > input[type=text]").val());
    return rgbColor;
}


function valHSLSliderColor(indexPaleta, hslColor) {
    let nameH = "#paleta" + indexPaleta + "> .c-paleta__slider-hue > input[type=range]";
    let nameS = "#paleta" + indexPaleta + "> .c-paleta__slider-saturation > input[type=range]";
    let nameL = "#paleta" + indexPaleta + "> .c-paleta__slider-lightness > input[type=range]";
    let h;
    let s;
    let l;
    if (hslColor) {
        h = hslColor.h;
        s = hslColor.s;
        l = hslColor.l;
        $(nameH).val(h);
        $(nameS).val(s);
        $(nameL).val(l);
        
        let coloresDegradado;
        
        coloresDegradado = "";
        for (let i = 0; i < 360; i++) {
            let hslColorDegradado = {
                h: i, s: s, l: l
            };
            coloresDegradado = coloresDegradado + " , #" + rgbToHex(hslToRgb(hslColorDegradado));
        }
        $(nameH).css("background-image", "linear-gradient(to right" + coloresDegradado + ")");
        
        
        coloresDegradado = "";
        for (let i = 0; i < 100; i++) {
            let hslColorDegradado = {
                h: h, s: i, l: l
            };
            coloresDegradado = coloresDegradado + " , #" + rgbToHex(hslToRgb(hslColorDegradado));
        }
        $(nameS).css("background-image", "linear-gradient(to right" + coloresDegradado + ")");
        
        
        coloresDegradado = "";
        for (let i = 0; i < 100; i++) {
            let hslColorDegradado = {
                h: h, s: s, l: i
            };
            coloresDegradado = coloresDegradado + " , #" + rgbToHex(hslToRgb(hslColorDegradado));
        }
        $(nameL).css("background-image", "linear-gradient(to right" + coloresDegradado + ")");
    }

    h = $(nameH).val() * 1;
    s = $(nameS).val() * 1;
    l = $(nameL).val() * 1;
    return {
        h: h,
        s: s,
        l: l
    };
}

function valHSLNumberColor(indexPaleta, hslColor) {
    let h;
    let s;
    let l;
    if (hslColor) {
        h = hslColor.h;
        s = hslColor.s;
        l = hslColor.l;
        $("#paleta" + indexPaleta + "> .c-paleta__slider-hue > input[type=number]").val(h);
        $("#paleta" + indexPaleta + "> .c-paleta__slider-saturation > input[type=number]").val(s);
        $("#paleta" + indexPaleta + "> .c-paleta__slider-lightness > input[type=number]").val(l);
    }
    h = $("#paleta" + indexPaleta + "> .c-paleta__slider-hue > input[type=number]").val() * 1;
    s = $("#paleta" + indexPaleta + "> .c-paleta__slider-saturation > input[type=number]").val() * 1;
    l = $("#paleta" + indexPaleta + "> .c-paleta__slider-lightness > input[type=number]").val() * 1;
    return {
        h: h,
        s: s,
        l: l
    };
}



    let colores=[];
    let puntos=[];
    let chartColores;

function updateChart() {
    colores.length = 0;
    puntos.length = 0;


    for (let i = 0; i < numPaletas; i++) {
        let hslColor=valHSLSliderColor(i);
        var x=hslColor.l;
        var y=hslColor.s;
        let punto={
            x:x,
            y:y
        }
        puntos.push(punto);
        colores.push("#"+rgbToHex(hslToRgb(hslColor)));
    }

    chartColores.update();
    generarTablasDatos();
}

function generarTablasDatos() {
    generarTablaLightnessSaturation();
    generarTablaColoresRGB();
    generarTablaColoresHSL();
    generarLinkPermanente();
}


function generarTablaLightnessSaturation() {
    var datos="";

    for (let i = 0; i < numPaletas; i++) {
        let hslColor=valHSLSliderColor(i);
        if (i!=0) {
            datos=datos+"\n";
        }
        datos=datos+hslColor.l+","+hslColor.s;
    }
    $("#tabla_lightness_saturation").html(datos);
}

function generarTablaColoresRGB() {
    var datos="";
    var datosReverse="";

    for (let i = 0; i < numPaletas; i++) {
        let rgbColor=valRgbTextColor(i);
        
        if (rgbColor===null) {
            break;
        }
        
        if (i!=0) {
            datos=datos+", ";
            datosReverse=", "+datosReverse;
        }
        datos=datos+"#"+rgbToHex(rgbColor)+"";

    }
    $("#tabla_colores_rgb").html(datos);    
}
function generarTablaColoresHSL() {
    var datos="";
    var datosReverse="";

    for (let i = 0; i < numPaletas; i++) {
        let hslColor=valHSLSliderColor(i);
        if (i!=0) {
            datos=datos+",\n";
            datosReverse=",\n"+datosReverse;
        }
        datos=datos+"hsl("+hslColor.h+"deg "+hslColor.s+"% "+hslColor.l+"%)";
    }
    $("#tabla_colores_hsl").html(datos);       
}

function generarLinkPermanente() {
   let url = new URL(window.location.href);

    for (let i = 0; i < numPaletas; i++) {
        hslColor=valHSLNumberColor(i);
        url.searchParams.set('p'+i,hslColor.h+"-"+hslColor.s+"-"+hslColor.l );
    }
    
    url.searchParams.set('minLightness', $("#minLightness").val());
    url.searchParams.set('maxSaturation',$("#maxSaturation").val() );
    url.searchParams.set('rotate-hue',$("#rotate-hue").val() );
    url.searchParams.set('ecuacion',$("input[name='ecuacion']:checked").val() );
    url.searchParams.set('tasa-crecimiento',$("#tasa-crecimiento").val());
    
    $("#enlacePermanente").html(url.toString());
    $("#enlacePermanente").attr("href",url.toString());
   
    
}

function createChart() {
    var ctx = document.getElementById('chartColores').getContext('2d');
    chartColores = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                    data: puntos,
                    borderWidth: 2,
                    borderHoverWidth: 2,
                    pointRadius: 15,
                    pointHoverRadius: 15,
                    borderColor: "#FFFFFF",
                    backgroundColor: colores,
                    pointBorderColor: '#FFFFFF',
                    borderColor:"hsl(210,98%,5%)",
                    fill: false,
                    showLine: true

                }]
        },
        options: {
            layout: {
                padding: {
                    left: 20,
                    right: 20,
                    top: 20,
                    bottom: 20
                }
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        return "Color Nº " + tooltipItem.index+":(" + tooltipItem.xLabel + "," + tooltipItem.yLabel + ")";
                    }
                }
            },
            legend: {
              display:false  
            },
            showLine: true,
            aspectRatio: 2,
            scales: {
                xAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                            max:100
                            
			},
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Luminosidad',
                            fontSize:25
                            
                        }
                    }
                ],
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                            max:100
			},                        
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Saturación',
                            fontSize:25
                        }
                    }
                ],
            },
            dragData: true,
            dragX: true,
            dragOptions: {
                magnet: {
                    to: Math.round 
                }
            },
            onDragStart: function (e) {
              // do something
              console.log('start',e);
            },
            onDrag: function (e, datasetIndex, index, value) {
                let indexPaleta = index;
                let hslColor = valHSLSliderColor(indexPaleta);
                hslColor.s=Math.round(value.y);
                hslColor.l=Math.round(value.x);
                refreshPaleta(indexPaleta, hslColor,false);
            },
            onDragEnd: function (e, datasetIndex, index, value) {
              let indexPaleta = index;
              let hslColor = valHSLSliderColor(indexPaleta);
              refreshPaleta(indexPaleta, hslColor);
            }
        }
    });
}








