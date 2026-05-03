export const formatPrice = (price) => {
    const num = typeof price === 'number' ? price : parseFloat(price);
    if (isNaN(num)) return '0';
    // Форматирование: без дробной части, с разделителем тысяч (пробел)
    return num.toLocaleString('ru-RU', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        useGrouping: true,
    });
};