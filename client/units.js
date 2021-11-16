const volume = {
	cups   : {
		cups  : 1,
		ml    : 236.6,
		tsp   : 48,
		tbsp  : 16,
		liter : 0.2366
	},
	ml : {
		cups  : 0.004227,
		ml    : 1,
		tsp   : 0.2029,
		tbsp  : 0.06763,
		liter : 0.001,
	},
	tsp   : {
		cups  : 0.02083,
		ml    : 4.929,
		tsp   : 1,
		tbsp  : 0.3333,
		liter : 0.004929,
	},
	tbsp  : {
		cups  : 0.0625,
		ml    : 14.79,
		tsp   : 3,
		tbsp  : 1,
		liter : 0.01479,
	},
	liter : {
		cups  : 4.227,
		ml    : 1000,
		tsp   : 202.9,
		tbsp  : 67.63,
		liter : 1,
	},
};
const weight = {
	grams : {
		grams : 1,
		lb : 0.002205,
		oz : 0.03527
	},
	lb : {
		grams : 453.6,
		lb : 1,
		oz : 16
	},
	oz : {
		grams : 28.35,
		lb : 0.0625,
		oz : 1
	}
};
const useFractions = {
	cups : true,
	tsp  : true,
	tbsp : true,
	oz   : true,
	//pint : true,
	//quart : true,
};
const alias = {
	teaspoon      : 'tsp',
	tablespoon    : 'tbsp',
	l             : 'liter',
	litre         : 'liter',
	millilitre    : 'ml',
	milliliter    : 'ml',
	pound         : 'lb',
	g             : 'grams',
	gram          : 'grams',
	ounce         : 'oz',
	cup           : 'cups',
	stick         : 'sticks',
};

const staples = [
	'butter',
	'flour',
	'eggs'
];


const toFraction = (val)=>{
	let scalar = Math.floor(val);
	let [frac] = Object.entries({'zero':0,'⅛':1/8,'¼':1/4,'⅜':3/8,'½':1/2,'⅝':5/8,'¾':3/4,'⅞':7/8,'one':1})
		.reduce((acc, [str, num])=>{
			const delta = Math.pow(val - scalar - num, 2);
			if(delta < acc[1]) return [str, delta];
			return acc;
		}, ['one', 1]);
	if(frac == 'one'){ frac = false; scalar += 1}
	if(frac == 'zero'){ frac = false; }
	return `${scalar || ''}${frac || ''}`.trim();
};




//Take a raw string of quantity and/or unit and returns the normalized unit
// and numerical quantity, even expressed as fraction
const parse = (raw)=>{
	let qty=0, unit, parts=[];
	raw.split(' ').map(p=>{
		const [num]= p.match(/\d*\.?\d+/) || [];
		const [frac] = p.match(/\d+\/\d+/) || [];
		const [text] = p.match(/[a-zA-Z]+/) || [];

		if(frac){
			const [a,b] = frac.split('/');
			qty += Number(a)/Number(b)
		}else if(num){
			qty += Number(num)
		}
		if(text){
			const name = text.toLowerCase();
			if(weight[name] || volume[name]){
				unit = name;
			}else if(alias[name]){
				unit = alias[name];
			}else{
				parts.push(text);
			}
		}
	})
	return {qty, unit, name : parts.join(' ')};
};

// Converts a value from one unit to another, including converting to fraction notation
const convert = (val, from_unit, to_unit)=>{
	if(volume[from_unit] && volume[from_unit][to_unit]){
		val = volume[from_unit][to_unit] * val;
	}
	if(weight[from_unit] && weight[from_unit][to_unit]){
		val = weight[from_unit][to_unit] * val;
	}
	if(useFractions[to_unit]) val = toFraction(val);
	if(typeof val == 'number' && val !== Math.floor(val)) val = val.toFixed(1);

	return val;
}

module.exports = {
	parse,
	convert,
	weight,
	volume
}