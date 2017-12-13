const trunToPi = angle => {
	return angle*Math.PI/180;
}

const getB = (x,y,len,agl) => {
	let arr = [];
	arr[0] = x+len*Math.cos(agl);
	arr[1] = y+len*Math.sin(agl);
	return arr;
}

const getO = (x,y,r,agl) => {
	let arr = [];
	arr[0] = x+r*Math.cos(agl);
	arr[1] = y-r*Math.sin(agl);
	return arr;
}

const [x1,y1] = [10,20];
const lAB = 30;
const a1 = 90,
	  a2 = 180;
const angle1 = trunToPi(a1);  // AB与x轴夹角

const [x2,y2] = getB(x1,y1,lAB,angle1);  // 得到B坐标 没毛病

const angle2 = trunToPi(a2);  // 弧度

const r = (lAB/2)/Math.sin(angle2/2); // 没毛病

const angle3 = trunToPi(90-a1-a2/2);

const [xo,yo] = getO(x1,y1,r,angle3);

const angle4 = parseFloat(a2/30);

for(let i = 0;i<=30;i++){
	let x3 = xo - r*Math.cos(trunToPi(i*angle4+90-a1-a2/2));
	let y3 = yo + r*Math.sin(trunToPi(i*angle4+90-a1-a2/2));
	console.log(x3+' -- '+y3)
}


