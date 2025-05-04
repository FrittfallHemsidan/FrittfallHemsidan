"use strict"

const canvas = document.querySelector("canvas")
const Start = document.querySelector("#Start")
const ctx = canvas.getContext("2d")
const boom = document.getElementById("boom")
const BG = document.getElementById("BG")
const Bass = document.getElementById("Bass")
const bildHiss = document.getElementById("hiss")
const SpeedCont = document.querySelector("#Speed")
const AccCont = document.querySelector("#Acc")
const HojdCont = document.querySelector("#Hojd")
const TidCont = document.querySelector("#Tid")
const MassaInput = document.querySelector("#kg")


const d = new Date();

let boomradius = 1
let boomExpansion = 0.01
let krash = false


let speed = 0
let start = false
let width =  window.innerWidth
let height =  window.innerHeight;


const imageWidth = 120
const imageHeight = 40

let BromsSkivaFriktion = 0.35;
let BromsSkivaRadie = 0.5;

let DistansfronAxeltillKolv = 0.6;
let KolvArea = (0.25**2)*Math.PI;
let KolvTryck =  0.1*(10^6);
let KolvKraft = KolvArea * KolvTryck * 2; // 2st kolvar
let MaxTryck = 20 * (10**5)
let kP = 0.011 * (10**6) // P-koefficienten för PID reglering


let SpoleRadie = 1;
let HissMassa = 1000;
let personMassa = 0
let TotalMassa = HissMassa + personMassa
const g = 9.82;


//  Beräkna Spännkraft
let MomentfronBromsskiva = -BromsSkivaFriktion*KolvKraft*DistansfronAxeltillKolv;
let S = MomentfronBromsskiva/SpoleRadie;


let TidIntervall = 0.01667;
let StartTid = 0;
let slutTid = 15;
let T = 0

let HissHojd = 80;
let Tak = HissHojd;
let Bromshojd = 30;
let Axis = HissHojd + 10;
let V = 0;
let bromssandeAcceleration = 0;
let C = 1.05; // luftmotståndskoefficienten för en Kub
let A = 25; // tvärsnittsarea för en kub med sida 5m är 25m^2
let P = 1.2041; // luft densitet


// start Värden
let TyngdKraft = g*TotalMassa;
let luftmotstandet = -(C*P*A*(V**2))/2;
let TotalKraft = luftmotstandet + TyngdKraft + S;
let Acceleration = TotalKraft/TotalMassa;
let MalAcc = 0


let ascpet = height/width
ctx.canvas.height = 2000
ctx.canvas.width = 2000

let canvasWidth =  ctx.canvas.width
let canvasHeight =  ctx.canvas.height


// Lite listor för att plotta
let SparadeFelAcc = [];
let SparadeTryck = [];
let SparadeAcc = [];
let SparadeMalAcc = [];
let SparadeHojd = [];
let SparadeTid = [];


let CarriageHeight = 0
let Bg = ctx.createLinearGradient(0,0, 0,canvasHeight);

Bg.addColorStop(0, "#0484fc")
Bg.addColorStop(0.1, "#0494fc")
Bg.addColorStop(0.2, "#048cfc")
Bg.addColorStop(0.3, "#0494fc")
Bg.addColorStop(0.5, "#099ffc")
Bg.addColorStop(0.6, "#44b7fc")
Bg.addColorStop(0.7, "#5cccfc")
Bg.addColorStop(0.89, "#9fe9fc")
Bg.addColorStop(0.9, "#90e3fc")
Bg.addColorStop(1, "#b4f2fc")



let L = 20
let Top = 200
const startHojd = HissHojd
let TowerCenter = ((canvasWidth/2)+canvasWidth*0.2)
let TowerBottom =  canvasHeight*0.95
const m = ((TowerBottom-Top)/80)


function drawTower (){
    ctx.drawImage(Bass,TowerCenter-L*4,TowerBottom-20,L*8,L*4)
    ctx.strokeStyle = "deepskyblue";
    ctx.lineWidth = 3;
    ctx.beginPath()
    ctx.moveTo(((TowerCenter)-L/2),Top-40)
    ctx.lineTo(((TowerCenter)-L/2),TowerBottom)
    ctx.stroke();
    ctx.beginPath()
    ctx.moveTo(((TowerCenter)+L/2),Top-40)
    ctx.lineTo(((TowerCenter)+L/2),TowerBottom)
    ctx.stroke();

    for (let index = 0; index < (TowerBottom/L-9); index++) {
        ctx.beginPath()
        ctx.moveTo(((TowerCenter)-L/2),Top-L+(L*index))
        ctx.lineTo(((TowerCenter)+L/2),((L*index)+Top))
        ctx.stroke();
        ctx.beginPath()
        ctx.moveTo(((TowerCenter)+L/2),(L*index)+Top-L)
        ctx.lineTo(((TowerCenter)-L/2),((L*index)+Top))
        ctx.stroke();
    }

}

function drawCarriage(CurrentHeight){
    // ctx.fillStyle = "darkslategray";
    // ctx.fillRect(TowerCenter-L,Top+CurrentHeight-L*1.5, L*2,L*1.5);

    ctx.drawImage(bildHiss,TowerCenter-L,Top+CurrentHeight-L*1.5, L*2,L*1.5)
}
let startTid = 0

Start.addEventListener("click" ,func => {
    let isnum = /^\d+$/.test(MassaInput.value);
    if (isnum) {
        if (start){
            start = false
            
        }
        else{
            start = true 
            startTid = d.getTime()
            
            TotalMassa = HissMassa + Number(MassaInput.value)
            TyngdKraft = g*TotalMassa;
            console.log(TotalMassa)
        }
    }
    else{
        alert(`Hur mycket är ${MassaInput.value} i kg?`)
    }
})

function animate() {


    SpeedCont.innerHTML = `${V.toFixed(2)} m/s`
    AccCont.innerHTML = `${Acceleration.toFixed(2)} m/s^2`
    HojdCont.innerHTML = `${HissHojd.toFixed(2)} m`
    TidCont.innerHTML = `${T.toFixed(2)} s`
    
    width =  window.innerWidth
    height =  window.innerHeight;
    ascpet = width/height
    ctx.canvas.width  = canvasWidth*ascpet

    TowerCenter = ((ctx.canvas.width/2)+ctx.canvas.width*0.2)


    // ctx.fillStyle = Bg;
    // ctx.fillRect(0, 0, ctx.canvas.width, canvasHeight);
    // ctx.fillStyle = "green";
    // ctx.fillRect(0, canvasHeight*0.9, ctx.canvas.width, canvasHeight);

    if (width > 500) {
        ctx.drawImage(BG,0,0,2857*2,canvasHeight)
    }
    else {
        ctx.drawImage(BG,-2100,0,2857*2,canvasHeight)
    }

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2.5;
    ctx.beginPath()
    ctx.moveTo(((TowerCenter)),Top-L)
    ctx.lineTo(((TowerCenter)),(startHojd-HissHojd)*m+Top)
    ctx.stroke();




    drawTower()

    ctx.fillStyle = "gold";
    ctx.beginPath()
    ctx.arc(TowerCenter,Top-40,1*m,0, 2 * Math.PI);
    ctx.fill()

    drawCarriage((startHojd-HissHojd)*m)

    
    
    if (krash) {
        ctx.drawImage(boom, TowerCenter-(imageWidth*boomradius/2), TowerBottom-(imageHeight*boomradius)+30,imageWidth*boomradius,imageHeight*boomradius);
        boomradius += boomExpansion
        if (boomradius > 6.5) {
            boomExpansion = -0.8
        }
        else if(boomradius < 0){
            boomExpansion = 0
            boomradius = 0
        }
    } 



    if (start){
        //console.log(HissHojd,V,Acceleration,TidIntervall)
    T += TidIntervall
    // console.log(MomentfronBromsskiva,KolvKraft)
    //Bromsar

    

    if (HissHojd < Bromshojd){
        // console.log("startbromsa",T)
       
    MalAcc = (-1*(V**2))/(2*HissHojd) // Beräkna målacceleration
    //console.log(`MalAcc: ${MalAcc}`)

    // SIMULUERING
    luftmotstandet = -(C*P*A*(V**2))/2;
    TotalKraft = luftmotstandet + TyngdKraft + S;
    //console.log(`TotalKraftKomponenter: ${luftmotstandet} + ${TyngdKraft} + ${S}`)
    Acceleration = TotalKraft/TotalMassa;
    // console.log(`Acceleration: ${Acceleration}`)
    V = V + Acceleration*TidIntervall;
    // console.log(`Hastiget: ${V}`)
    HissHojd = HissHojd - V*TidIntervall;

    //REGLERING  
    let FelAcc = MalAcc-Acceleration // Beräkna felet
    // console.log(`FelAcc: ${FelAcc}`)
    //Beräkna nya bromskraften
    // console.log(KolvTryck - kP*FelAcc)
    KolvTryck = Math.min(KolvTryck - kP*FelAcc,MaxTryck);
    // console.log(KolvTryck)
    KolvKraft = KolvArea * KolvTryck * 2 // 2st kolvar
    MomentfronBromsskiva = -BromsSkivaFriktion*KolvKraft*DistansfronAxeltillKolv;
    S = MomentfronBromsskiva/SpoleRadie;
       
    SparadeFelAcc.push(FelAcc)
    SparadeTryck.push(KolvTryck)
    SparadeAcc.push(Acceleration)
    SparadeMalAcc.push(MalAcc)
    SparadeHojd.push(HissHojd)
    SparadeTid.push(T)
    }
    //

    // Bromsar inte
    else {
    luftmotstandet = -(C*P*A*(V**2))/2;
    TotalKraft = luftmotstandet + TyngdKraft;

    Acceleration = TotalKraft/TotalMassa;
    V = V + Acceleration*TidIntervall;
    HissHojd = HissHojd - V*TidIntervall;
    }
    //

    

    if (HissHojd < 0){
        start=false
        krash = true
        HissHojd = -0.01
        let exaktTid = d.getTime() - startTid
        console.log(exaktTid)

                const FelAccData = {
            labels: SparadeTid,
            datasets: [{
              fill: false,
              lineTension: 0,
              backgroundColor: "rgba(0,0,255,1.0)",
              borderColor: "rgba(0,0,255,1.0)",
              data: SparadeFelAcc
            }]
          }
          const MalAccData = {
            labels: SparadeTid,
            datasets: [{
              fill: false,
              lineTension: 0,
              backgroundColor: "rgba(36,161,49,1.0)",
              borderColor: "rgba(36, 161, 49, 0.9)",
              data: SparadeMalAcc
            }]
          }
          const AccPlotData = {
            labels: SparadeTid,
            datasets: [{
              fill: false,
              lineTension: 0,
              backgroundColor: "rgba(162,73,17,1.0)",
              borderColor: "rgba(162, 73, 17, 0.7)",
              data: SparadeAcc
            }]
          }
          const TryckData = {
            labels: SparadeTid,
            datasets: [{
              fill: false,
              lineTension: 0,
              backgroundColor: "rgba(125,17,161,1.0)",
              borderColor: "rgba(125, 17, 161, 0.5)",
              data: SparadeTryck
            }]
          }

        new Chart("FelAccPlot",{
            type: "line",
            data: FelAccData,
            options: {legend: {display: false}}
        })
        new Chart("MalAccPlot",{
            type: "line",
            data: MalAccData,
            options: {legend: {display: false}}
        })
        new Chart("AccPlot",{
            type: "line",
            data: AccPlotData,
            options: {legend: {display: false}}
        })
        new Chart("TryckPlot",{
            type: "line",
            data: TryckData,
            options: {legend: {display: false}}
        })
    }
    else if (V < 0.01){
        let newd = new Date()
        
        let exaktTid = newd.getTime() - startTid
        console.log(`StopTid: ${exaktTid}`)
        start=false

        const FelAccData = {
            labels: SparadeTid,
            datasets: [{
              fill: false,
              lineTension: 0,
              backgroundColor: "rgba(0,0,255,1.0)",
              borderColor: "rgba(0,0,255,1.0)",
              data: SparadeFelAcc
            }]
          }
          const MalAccData = {
            labels: SparadeTid,
            datasets: [{
              fill: false,
              lineTension: 0,
              backgroundColor: "rgba(36,161,49,1.0)",
              borderColor: "rgba(36, 161, 49, 0.9)",
              data: SparadeMalAcc
            }]
          }
          const AccPlotData = {
            labels: SparadeTid,
            datasets: [{
              fill: false,
              lineTension: 0,
              backgroundColor: "rgba(162,73,17,1.0)",
              borderColor: "rgba(162, 73, 17, 0.7)",
              data: SparadeAcc
            }]
          }
          const TryckData = {
            labels: SparadeTid,
            datasets: [{
              fill: false,
              lineTension: 0,
              backgroundColor: "rgba(125,17,161,1.0)",
              borderColor: "rgba(125, 17, 161, 0.5)",
              data: SparadeTryck
            }]
          }

        new Chart("FelAccPlot",{
            type: "line",
            data: FelAccData,
            options: {legend: {display: false}}
        })
        new Chart("MalAccPlot",{
            type: "line",
            data: MalAccData,
            options: {legend: {display: false}}
        })
        new Chart("AccPlot",{
            type: "line",
            data: AccPlotData,
            options: {legend: {display: false}}
        })
        new Chart("TryckPlot",{
            type: "line",
            data: TryckData,
            options: {legend: {display: false}}
        })

        //console.log(SparadeFelAcc,SparadeTryck,SparadeAcc,SparadeMalAcc,SparadeHojd)
    }
}



    requestAnimationFrame(animate)
}

animate()
