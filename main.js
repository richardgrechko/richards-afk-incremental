/*
---=== Formatting ===---
*/
if (!window.commaFormat) {
	function commaFormat(num) {
		let portions = num.split(".")
		portions[0] = portions[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
		if (portions.length == 1)
			return portions[0]
		return portions[0] + "." + portions[1]
	}
}
function fallback(num,alt) {
	return (isNaN(num.sign) || isNaN(num.layer) || isNaN(num.mag)) ? alt : num
}
function fallbackgte(num1,num2) {
	return fallback(num1,new Decimal(0)).gte(fallback(num2,new Decimal(1)))
}
function fallbacklt(num1,num2) {
	return fallback(num1,new Decimal(0)).lt(fallback(num2,new Decimal(1)))
}
function fullFormat(options) {
	options = {
		num: options.num || new Decimal("1"),
		precision: options.precision ?? 3,
	}
	if (Decimal.gte(options.num,"10^^1e6")) {
		return "F" + fullFormat({num: options.num.slog().floor(), precision: 0});
	} else if (Decimal.gte(options.num,"10^^10")) {
		return fullFormat({num: new Decimal(10).pow(options.num.slog().sub(options.num.slog().floor())), precision: 3}) + "F" + fullFormat({num: options.num.slog().floor(), precision: 0});
	} else if (Decimal.gte(options.num,"ee10")) {
		return "e" + fullFormat({num: options.num.log10().floor(), precision: 0});
	} else if (Decimal.gte(options.num,"e10")) {
		return fullFormat({num: new Decimal(10).pow(options.num.log10().sub(options.num.log10().floor())), precision: 3}) + "e" + fullFormat({num: options.num.log10().floor(), precision: 0});
	} else if (Decimal.gte(options.num,"1000000")) {
		return commaFormat(options.num.floor().toString());
	} else if (Decimal.gte(options.num,"1000")) {
		return commaFormat(Number(options.num).toFixed(options.precision));
	} else if (Decimal.gte(options.num,"0")) {
		return Number(options.num).toFixed(options.precision);
	};
}
function measureOoMsPerSec(previous,latest) {
	if (latest.eq(0) || previous.eq(0))
		return new Decimal(0)
	else
		return latest.log10().sub(previous.log10()).div(dt)
}
/*
---=== Data ===---
*/
window.afkData = {
	points: new Decimal(0),
	previousPoints: new Decimal(0),
	pointGain: new Decimal(1),
	pointMulti: new Decimal(1),
	pointExp: new Decimal(1),
	pointRoot: new Decimal(1),
	power: new Decimal(0),
	previousPower: new Decimal(0),
	powerGain: new Decimal(0),
	ranks: new Decimal(0),
	infinities: new Decimal(0),
	previousInfinities: new Decimal(0),
	infinityPassive: new Decimal(0),
	infinityMulti: new Decimal(0),
	infinityExp: new Decimal(0),
	infinityRoot: new Decimal(1),
	stars: new Decimal(0),
	blueStars: new Decimal(0),
	greenStars: new Decimal(0),
	yellowStars: new Decimal(0),
	orangeStars: new Decimal(0),
	redStars: new Decimal(0),
	pinkStars: new Decimal(0),
	silverStars: new Decimal(0),
	greyStars: new Decimal(0),
	finalStars: new Decimal(0),
	eternities: new Decimal(0),
	previousEternities: new Decimal(0),
	eternityPassive: new Decimal(0),
};
/*
---=== Updates ===---
*/
var dt1,dt2,dt;
setInterval(_=>{
	document.getElementById("points").innerText = `Points: ${fullFormat({num: afkData.points,precision:3})}`
	if (Decimal.lt(measureOoMsPerSec(afkData.previousPoints,afkData.points),20)) {
		document.getElementById("pointGain").innerText = `(+${fullFormat({num: fallback(afkData.pointGain,new Decimal(1)),precision:3})}×${fullFormat({num: afkData.pointMulti,precision:2})}^${fullFormat({num: afkData.pointExp,precision:2})}/s)`
	} else {
		document.getElementById("pointGain").innerText = `(+${fullFormat({num: fallback(measureOoMsPerSec(afkData.previousPoints,afkData.points),new Decimal(1)),precision:3})} OoMs/s)`
	}
	if (Decimal.gte(afkData.points,Number.MAX_VALUE)) {
		document.getElementById("pointSoftcap").innerText = `Your points have been rooted by ${fullFormat({num: afkData.pointRoot,precision:3})} due to softcap.`
	} else {
		document.getElementById("pointSoftcap").innerText = ``
	}
	document.getElementById("power").innerText = `Power: ${fullFormat({num: afkData.power,precision:3})}`
	if (Decimal.lt(measureOoMsPerSec(afkData.previousPower,afkData.power),20)) {
		document.getElementById("powerGain").innerText = `(+${fullFormat({num: fallback(afkData.powerGain,new Decimal(1)),precision:3})}/s)`
	} else {
		document.getElementById("powerGain").innerText = `(+${fullFormat({num: fallback(measureOoMsPerSec(afkData.previousPower,afkData.power),new Decimal(1)),precision:3})} OoMs/s)`
	}
	document.getElementById("ranks").innerText = `Rank ${fullFormat({num: afkData.ranks,precision:0})}`
	document.getElementById("infinities").innerText = `Infinities: ${fullFormat({num: afkData.infinities,precision:3})}`
	if (Decimal.lt(measureOoMsPerSec(afkData.previousInfinities,afkData.infinities),20)) {
		document.getElementById("infinityGain").innerText = `(+${fullFormat({num: fallback(afkData.infinityPassive,new Decimal(1)),precision:3})}×${fullFormat({num: afkData.infinityMulti,precision:2})}^${fullFormat({num: afkData.infinityExp,precision:2})}/s)`
	} else {
		document.getElementById("infinityGain").innerText = `(+${fullFormat({num: fallback(measureOoMsPerSec(afkData.previousInfinities,afkData.infinities),new Decimal(1)),precision:3})} OoMs/s)`
	}
	if (Decimal.gte(afkData.infinities,2147483648)) {
		document.getElementById("infinitySoftcap").innerText = `Your infinities have been rooted by ${fullFormat({num: afkData.infinityRoot,precision:3})} due to softcap.`
	} else {
		document.getElementById("infinitySoftcap").innerText = ``
	}
	document.getElementById("stars").innerText = `Stars: ${fullFormat({num: afkData.stars,precision:0})}`
	document.getElementById("blueStars").innerText = `Blue Stars: ${fullFormat({num: afkData.blueStars,precision:0})}`
	document.getElementById("greenStars").innerText = `Green Stars: ${fullFormat({num: afkData.greenStars,precision:0})}`
	document.getElementById("yellowStars").innerText = `Yellow Stars: ${fullFormat({num: afkData.yellowStars,precision:0})}`
	document.getElementById("orangeStars").innerText = `Orange Stars: ${fullFormat({num: afkData.orangeStars,precision:0})}`
	document.getElementById("redStars").innerText = `Red Stars: ${fullFormat({num: afkData.redStars,precision:0})}`
	document.getElementById("pinkStars").innerText = `Pink Stars: ${fullFormat({num: afkData.pinkStars,precision:0})}`
	document.getElementById("silverStars").innerText = `Silver Stars: ${fullFormat({num: afkData.silverStars,precision:0})}`
	document.getElementById("greyStars").innerText = `Grey Stars: ${fullFormat({num: afkData.greyStars,precision:0})}`
	document.getElementById("finalStars").innerText = `Final Stars: ${fullFormat({num: afkData.finalStars,precision:0})}`
	document.getElementById("eternities").innerText = `Eternities: ${fullFormat({num: afkData.eternities,precision:3})}`
	if (Decimal.lt(measureOoMsPerSec(afkData.previousEternities,afkData.eternities),20)) {
		document.getElementById("eternityGain").innerText = `(+${fullFormat({num: fallback(afkData.eternityPassive,new Decimal(1)),precision:3})}/s)`
	} else {
		document.getElementById("eternityGain").innerText = `(+${fullFormat({num: fallback(measureOoMsPerSec(afkData.previousEternities,afkData.eternities),new Decimal(1)),precision:3})} OoMs/s)`
	}
},50)
if (!window.update) {
	function update() {
		dt1 = Date.now()
		dt = (dt1-dt2)/1000
		dt2 = Date.now();
		afkData.points = fallback(afkData.points, new Decimal(0));
		afkData.pointGain = fallback(afkData.pointGain, new Decimal(1));
		afkData.pointMulti = fallback(afkData.pointMulti, new Decimal(1));
		afkData.pointExp = fallback(afkData.pointExp, new Decimal(1));
		afkData.pointRoot = fallback(afkData.pointRoot, new Decimal(1));
		afkData.power = fallback(afkData.power, new Decimal(0));
		afkData.powerGain = fallback(afkData.powerGain, new Decimal(0));
		afkData.ranks = fallback(afkData.ranks, new Decimal(0));
		afkData.infinities = fallback(afkData.infinities, new Decimal(-1));
		afkData.infinityPassive = fallback(afkData.infinityPassive, new Decimal(0));
		afkData.stars = fallback(afkData.stars, new Decimal(0));
		afkData.blueStars = fallback(afkData.blueStars, new Decimal(0));
		afkData.greenStars = fallback(afkData.greenStars, new Decimal(0));
		afkData.yellowStars = fallback(afkData.yellowStars, new Decimal(0));
		afkData.orangeStars = fallback(afkData.orangeStars, new Decimal(0));
		afkData.redStars = fallback(afkData.redStars, new Decimal(0));
		afkData.pinkStars = fallback(afkData.pinkStars, new Decimal(0));
		afkData.silverStars = fallback(afkData.silverStars, new Decimal(0));
		afkData.greyStars = fallback(afkData.greyStars, new Decimal(0));
		afkData.finalStars = fallback(afkData.finalStars, new Decimal(0));
		afkData.eternities = fallback(afkData.eternities, new Decimal(0));
		afkData.eternityPassive = fallback(afkData.eternityPassive, new Decimal(0));
		afkData.previousPoints = fallback(afkData.points, new Decimal(0));
		afkData.previousPower = fallback(afkData.power, new Decimal(0));
		afkData.points = afkData.points.add(afkData.pointGain.mul(afkData.pointMulti).mul(afkData.power.add(1)).pow(afkData.pointExp).root(afkData.pointRoot).mul(dt));
		afkData.pointGain = afkData.points.div(25).add(1).root(3).mul(afkData.power.add(1).pow(2)).mul(new Decimal("e1e4").pow(afkData.greyStars.div(2).pow(1.25)));
		afkData.pointMulti = afkData.points.add(1).log(50).add(1).pow(2.5).mul(new Decimal(2).pow(afkData.infinities.add(afkData.power.add(1).log(5)).div(10).root(1.25)).mul(new Decimal(2).pow(afkData.ranks.root(1.1))).mul(new Decimal("e25").pow(afkData.stars.pow(1.5))).mul(new Decimal("e100").pow(afkData.blueStars.pow(1.5))));
		afkData.pointExp = afkData.points.add(1).log10().add(1).log10().add(1).add(afkData.infinities.div(50).root(5).add(afkData.eternities.div(25).root(1.5)).add(afkData.power.add(1).log10().div(10)).add(afkData.ranks.div(500))).add(afkData.blueStars.div(5)).add(afkData.redStars.div(5)).add(afkData.silverStars.div(2).pow(1.25)).root(2.5).add(afkData.finalStars.div(10).root(2));
		afkData.power = afkData.power.add(afkData.powerGain.mul(dt));
		afkData.powerGain = afkData.points.add(1).log(2).root(1.375).div(100).mul(afkData.power.add(1).root(3)).mul(afkData.pinkStars.add(1).pow(2));
		if (Decimal.gte(afkData.points,Number.MAX_VALUE)) {
			afkData.pointRoot = afkData.points.add(1).log(Number.MAX_VALUE) // this is to softcap points
		} else {
			afkData.pointRoot = new Decimal(1)
		}
		if (Decimal.gte(afkData.points.add(1).log(16).add(1).sub(new Decimal(1e6).log(16)).floor(),new Decimal(0))) {
			afkData.ranks = afkData.points.add(1).log(16).add(1).sub(new Decimal(1e6).log(16))
				.mul(afkData.orangeStars.div(10).add(1).root(2)).floor()
		} else {
			afkData.ranks = new Decimal(0)
		}
		if (Decimal.gte(afkData.points,new Decimal(Number.MAX_VALUE).mul(new Decimal(2).pow(afkData.infinities.root(2)))) && Decimal.gte(afkData.infinities,25)) {
			afkData.previousInfinities = afkData.infinities;
			afkData.infinities = afkData.infinities.add(afkData.infinityPassive.mul(afkData.infinityMulti).pow(afkData.infinityExp).root(afkData.infinityRoot).mul(dt))
			afkData.infinityPassive = afkData.points.log(new Decimal(Number.MAX_VALUE).mul(new Decimal(2).pow(afkData.infinities.root(2)))).pow(25).mul(afkData.eternities.root(1.5).add(1)).root(10)
				.mul(afkData.infinities.div(100).root(afkData.infinities.add(1).log10().root(1.1)))
				.mul(new Decimal(2).pow(afkData.stars.root(afkData.infinities.add(1).log(1_000_000).root(3))))
			afkData.infinityMulti = afkData.infinities.log(25).pow(2) // ok
				.mul(new Decimal(12.5).pow(afkData.blueStars.root(1.5)))
				.mul(afkData.yellowStars.div(25).add(1).pow(1.1))
				.mul(new Decimal(25).pow(afkData.finalStars.pow(1.25)))
			afkData.infinityExp = afkData.infinities.log(25).pow(5).log(25).add(1)
				.add(afkData.infinities.add(1).log10().add(1).log10().root(2)).root(4)
				.add(afkData.greenStars.div(10))
				.add(afkData.yellowStars.div(10).root(1.5))
				.add(afkData.stars.div(100).root(2))
		} else if (Decimal.gte(afkData.points,new Decimal(Number.MAX_VALUE).mul(new Decimal(2).pow(afkData.infinities.root(2)))) && Decimal.lt(afkData.infinities,25)) {
			afkData.previousInfinities = new Decimal(0);
			afkData.infinities = afkData.infinities.add(afkData.eternities.root(1.5).add(1));
			afkData.points = new Decimal(0);
			afkData.pointGain = new Decimal(1);
			afkData.pointMulti = new Decimal(1);
			afkData.pointExp = new Decimal(1);
			afkData.power = new Decimal(0);
		}
		if (Decimal.gte(afkData.infinities,2147483648)) {
			afkData.infinityRoot = afkData.infinities.add(1).log(2147483648).root(2.5)
		} else {
			afkData.infinityRoot = new Decimal(1)
		}
		if (Decimal.gte(afkData.infinities.add(1).log(6).add(1).sub(new Decimal(1e6).log(6)).floor(),new Decimal(0))) {
			afkData.stars = afkData.infinities.add(1).log(6).add(1).sub(new Decimal(1e6).log(6)).floor()
		} else {
			afkData.stars = new Decimal(0)
		}
		if (Decimal.gte(afkData.stars.div(2).root(1.5).floor(),new Decimal(0))) {
			afkData.blueStars = afkData.stars.div(2).root(1.5).floor()
		} else {
			afkData.blueStars = new Decimal(0)
		}
		if (Decimal.gte(afkData.blueStars.div(2).root(1.25).floor(),new Decimal(0))) {
			afkData.greenStars = afkData.blueStars.div(2).root(1.25).floor()
		} else {
			afkData.greenStars = new Decimal(0)
		}
		if (Decimal.gte(afkData.greenStars.div(1.5).root(1.25).floor(),new Decimal(0))) {
			afkData.yellowStars = afkData.greenStars.div(1.5).root(1.25).floor()
		} else {
			afkData.yellowStars = new Decimal(0)
		}
		if (Decimal.gte(afkData.yellowStars.div(1.5).root(1.25).floor(),new Decimal(0))) {
			afkData.orangeStars = afkData.yellowStars.div(1.5).root(1.25).floor()
		} else {
			afkData.orangeStars = new Decimal(0)
		}
		if (Decimal.gte(afkData.orangeStars.div(1.5).root(1.5).floor(),new Decimal(0))) {
			afkData.redStars = afkData.orangeStars.div(1.5).root(1.5).floor()
		} else {
			afkData.redStars = new Decimal(0)
		}
		if (Decimal.gte(afkData.redStars.div(1.5).root(1.75).floor(),new Decimal(0))) {
			afkData.pinkStars = afkData.redStars.div(1.5).root(1.75).floor()
		} else {
			afkData.pinkStars = new Decimal(0)
		}
		if (Decimal.gte(afkData.pinkStars.div(1.5).root(2).floor(),new Decimal(0))) {
			afkData.silverStars = afkData.pinkStars.div(1.5).root(2).floor()
		} else {
			afkData.silverStars = new Decimal(0)
		}
		if (Decimal.gte(afkData.silverStars.div(1.5).root(2.5).floor(),new Decimal(0))) {
			afkData.greyStars = afkData.silverStars.div(1.5).root(2.5).floor()
		} else {
			afkData.greyStars = new Decimal(0)
		}
		if (Decimal.gte(afkData.greyStars.div(1.5).root(3).floor(),new Decimal(0))) {
			afkData.finalStars = afkData.greyStars.div(1.5).root(3).floor()
		} else {
			afkData.finalStars = new Decimal(0)
		}
		if (Decimal.gte(afkData.infinities,new Decimal(Number.MAX_VALUE).mul(new Decimal(2).pow(afkData.eternities.root(2)))) && Decimal.gte(afkData.eternities,10)) {
			afkData.previousEternities = afkData.eternities;
			afkData.eternities = afkData.eternities.add(afkData.eternityPassive.mul(dt))
			afkData.eternityPassive = afkData.infinities.log(new Decimal(Number.MAX_VALUE).mul(new Decimal(2).pow(afkData.eternities.root(2)))).pow(4).root(1.5)
		} else if (Decimal.gte(afkData.infinities,new Decimal(Number.MAX_VALUE).mul(new Decimal(2).pow(afkData.eternities.root(2)))) && Decimal.lt(afkData.eternities,10)) {
			afkData.previousEternities = new Decimal(0);
			afkData.eternities = afkData.eternities.add(1);
			afkData.infinities = new Decimal(0);
			afkData.infinityPassive = new Decimal(0);
			afkData.infinityMulti = new Decimal(0);
			afkData.infinityExp = new Decimal(0);
			afkData.points = new Decimal(0);
			afkData.pointGain = new Decimal(1);
			afkData.pointMulti = new Decimal(1);
			afkData.pointExp = new Decimal(1);
			afkData.power = new Decimal(0);
		}
		requestAnimationFrame(update)
	}
	update()
}
