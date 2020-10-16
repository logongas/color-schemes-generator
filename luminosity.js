


$(document).ready(function () {
    


createChartLuminosidad();

});







function createChartLuminosidad() {
    let colores=[];
    let puntos=[];

    for (let i = 0; i < 359; i++) {
        let rgbColor=hslToRgb({h:i,s:100,l:50});
        let luminosidad=luminosidadAparente(rgbColor);
        var x=i;
        var y=luminosidad;
        let punto={
            x:x,
            y:y
        }
        puntos.push(punto);
        colores.push("#"+rgbToHex(rgbColor));
    }
    
    
    var ctx = document.getElementById('chartLuminosidad').getContext('2d');
    var chartLuminosidad = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                    data: puntos,
                    borderWidth: 0,
                    borderHoverWidth: 0,
                    pointRadius: 3,
                    pointHoverRadius: 3,
                    borderColor: "#FFFFFF",
                    backgroundColor: colores,
                    pointBorderColor: '#FFFFFF',
                    borderColor:"hsl(210,98%,5%)",
                    fill: false,
                    showLine: false

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
                        return "Matiz:" + tooltipItem.xLabel + ", Liminosidad:" + tooltipItem.yLabel + "";
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
                            max:400
                            
			},
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Matiz',
                            fontSize:25
                            
                        }
                    }
                ],
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                            max:300
			},                        
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Luminosidad Aparente',
                            fontSize:25
                        }
                    }
                ],
            }
        }
    });
}





