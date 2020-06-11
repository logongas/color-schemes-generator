let numPaletas=9;

function getHTMLPaleta(indexPaleta) {
return `
            <div class="c-paleta" id="paleta${indexPaleta}" >
                <div class="c-paleta__color">
                </div> 
                <div class="c-paleta__hex">
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
    updateQueryString(indexPaleta);
    
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
 
    
    //Generar las paletas
    for (let i = 0; i < numPaletas; i++) {
        $(".l-paletas").append(getHTMLPaleta(i));
    }

    eventsChange();
    
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
        } else {
            hslColor = {
                h: Math.round(((360 / (numPaletas + 1))) * (i + 1)),
                s: Math.round(((100 / (numPaletas + 1))) * (i + 1)),
                l: Math.round(((100 / (numPaletas + 1))) * (i + 1))
            }
            refreshPaleta(i, hslColor);
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

function updateQueryString(indexPaleta) {
   let url = new URL(window.location.href);
   hslColor=valHSLNumberColor(indexPaleta);
    url.searchParams.set('p'+indexPaleta,hslColor.h+"-"+hslColor.s+"-"+hslColor.l );
    history.replaceState( undefined , undefined, url.toString() );
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
        if (i!=0) {
            datos=datos+",";
            datosReverse=","+datosReverse;
        }
        datos=datos+"#"+rgbToHex(rgbColor);
        datosReverse="#"+rgbToHex(rgbColor)+datosReverse;
    }
    $("#tabla_colores_rgb").html(datos+"\n"+datosReverse);    
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
        datos=datos+"hsl("+hslColor.h+","+hslColor.s+","+hslColor.l+")";
        datosReverse="hsl("+hslColor.h+","+hslColor.s+","+hslColor.l+")"+datosReverse;
    }
    $("#tabla_colores_hsl").html(datos+"\n\n\n"+datosReverse);       
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

			},
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Lightness',
                            fontSize:25
                        }
                    }
                ],
                yAxes: [
                    {
                        ticks: {

			},                        
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Saturation',
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








