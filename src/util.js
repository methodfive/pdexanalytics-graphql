export function isEmpty(e) {
    return e == null || e.length === 0;
}

export function isNumber(n){
    return Number(n)=== n;
}

export function convertToNumber(e) {
    if(isEmpty(e))
        return;

    return Number(e);
}