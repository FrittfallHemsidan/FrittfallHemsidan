"use strict"

const canvas = document.querySelector("canvas")
const Start = document.querySelector("#Start")
const ctx = canvas.getContext("2d")
const boom = document.getElementById("boom")
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

let DistansfronAxeltillKolv = 0.45;
let KolvArea = 0.01;
let KolvTryck = 4.7*(10**6);
let KolvKraft = KolvArea * KolvTryck * 2; // 2st kolvar

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


let TyngdKraft = g*TotalMassa;
let luftmotstandet = -(C*P*A*(V**2))/2;
let TotalKraft = luftmotstandet + TyngdKraft + S;
let Acceleration = TotalKraft/TotalMassa;

/*
for T = StartTid:TidIntervall:slutTid  
clf

%%% GRAFIK
axis([0 310 0 Axis])
xlabel('Bredd [m]') 
ylabel('Höjd [m]') 
text(-50,Bromshojd,'Börjar Bromsa')
text(200,Tak-20,"Hastighet = "+ V +" m/s")
text(200,Tak-30,"Acceleration = " + Acceleration + " m/s^2")
text(200,Tak-40,"Höjd = " + HissHojd + " m")
text(200,Tak-50,"Tid = " + T + " s")
rectangle('Position',[40 Tak+5 25 0.1])
rectangle('Position',[52.5 HissHojd+5 0.1 Tak-HissHojd])
rectangle('Position',[50 HissHojd 5 5])

pause(0)
%%%

%%% Bromsar
if HissHojd < Bromshojd
luftmotstandet = -(C*P*A*V^2)/2;
TotalKraft = luftmotstandet + TyngdKraft + S;

Acceleration = TotalKraft/HissMassa;
V = V + Acceleration*TidIntervall;
HissHojd = HissHojd - V*TidIntervall;
%%%

%%% Bromsar inte
else
luftmotstandet = -(C*P*A*V^2)/2;
TotalKraft = luftmotstandet + TyngdKraft;

Acceleration = TotalKraft/HissMassa;
V = V + Acceleration*TidIntervall;
HissHojd = HissHojd - V*TidIntervall;
%%%


end

if HissHojd < 0
    disp("Krash")
    break
elseif V < 0
    break

axis([0 310 0 Axis])
xlabel('Bredd [m]') 
ylabel('Höjd [m]') 
text(-50,Bromshojd,'Börjar Bromsa')
text(200,Tak-20,"Hastighet = "+ V +" m/s")
text(200,Tak-30,"Acceleration = " + Acceleration + " m/s^2")
text(200,Tak-40,"Höjd = " + HissHojd + " m")
text(200,Tak-50,"Tid = " + T + " s")
rectangle('Position',[40 Tak+5 25 0.1])
rectangle('Position',[52.5 HissHojd+5 0.1 Tak-HissHojd])
rectangle('Position',[50 HissHojd 5 5])



 */



let ascpet = height/width
ctx.canvas.height = 2000
ctx.canvas.width = 2000

let canvasWidth =  ctx.canvas.width
let canvasHeight =  ctx.canvas.height



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
    ctx.strokeStyle = "deepskyblue";
    ctx.lineWidth = 3;
    ctx.beginPath()
    ctx.moveTo(((TowerCenter)-L/2),Top)
    ctx.lineTo(((TowerCenter)-L/2),TowerBottom)
    ctx.stroke();
    ctx.beginPath()
    ctx.moveTo(((TowerCenter)+L/2),Top)
    ctx.lineTo(((TowerCenter)+L/2),TowerBottom)
    ctx.stroke();

    for (let index = 0; index < (TowerBottom/L-11); index++) {
        ctx.beginPath()
        ctx.moveTo(((TowerCenter)-L/2),Top+(L*index))
        ctx.lineTo(((TowerCenter)+L/2),((L*index)+L+Top))
        ctx.stroke();
        ctx.beginPath()
        ctx.moveTo(((TowerCenter)+L/2),(L*index)+Top)
        ctx.lineTo(((TowerCenter)-L/2),((L*index)+L+Top))
        ctx.stroke();
    }

}

function drawCarriage(CurrentHeight){
    ctx.fillStyle = "darkslategray";
    ctx.fillRect(TowerCenter-L,Top+CurrentHeight-L*1.5, L*2,L*1.5);
}
let startTid = 0

Start.addEventListener("click" ,func => {

    if (start){
        start = false
        
    }
    else{
        start = true 
        startTid = d.getTime()
        
        TotalMassa = HissMassa + Number(MassaInput.value)
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

    // console.log( ctx.canvas.width, ctx.canvas.height)

    // console.log(ascpet)

    // ctx.canvas.height = height
    // canvas.style.width=width;
    // canvas.style.height=height;



    ctx.fillStyle = Bg;
    ctx.fillRect(0, 0, ctx.canvas.width, canvasHeight);
    ctx.fillStyle = "green";
    ctx.fillRect(0, canvasHeight*0.9, ctx.canvas.width, canvasHeight);
 
    drawTower()
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
    T += TidIntervall
    //Bromsar
    if (HissHojd < Bromshojd){
    
    luftmotstandet = -(C*P*A*(V**2))/2;
    TotalKraft = luftmotstandet + TyngdKraft + S;
    
    Acceleration = TotalKraft/TotalMassa;
    V = V + Acceleration*TidIntervall;
    HissHojd = HissHojd - V*TidIntervall;
    }
    //

    // Bromsar inte
    else{
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
    }
    else if (V < 0){
        let newd = new Date()
        let exaktTid = newd.getTime() - startTid
        console.log(exaktTid)
        start=false
    }
}



    requestAnimationFrame(animate)
}

animate()