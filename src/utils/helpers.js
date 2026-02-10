export const calculateNut = (d) => {
    if(!d) return ''; 
    const v = parseFloat(d.replace(',', '.')); 
    if(isNaN(v)) return '';
    if(v > 10 && v <= 12) return '4'; 
    if(v > 12 && v <= 17) return '5'; 
    if(v > 17 && v <= 22) return '6';
    if(v > 22 && v <= 30) return '8'; 
    if(v > 30 && v <= 38) return '10'; 
    if(v > 38 && v <= 44) return '12'; 
    if(v > 44 && v <= 50) return '14';
    return 'Keine Norm';
};

export const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('de-DE');
};
