export const currencyFormatter = data => {
	return ((data.amount * 100) / 100).toLocaleString(data.currency, {
		style: "currency",
		currency: data.currency,
	});
};

export const capitalizeFirstLetter = string => {
	return string.charAt(0).toUpperCase() + string.slice(1);
};
