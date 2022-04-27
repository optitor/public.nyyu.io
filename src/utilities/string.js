import QRCode from 'qrcode';

export const capitalizeFirstLetter = (string) => {
    if(!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export const generateQR = async text => {
    try {
        return await QRCode.toDataURL(text);
    } catch(err) {
        console.log(err);
    }
}

export function validURL(str) {
    const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
}

const censorWord = (str) => {
    const repeatLength = str.length >= 5? 3: str.length - 2;
    return str[0] + "*".repeat(repeatLength) + str.slice(-1);
};
 
export const censorEmail = (email) => {
    if(!email) return '';
    var arr = email.split("@");
    return censorWord(arr[0]) + "@" + censorWord(arr[1]);
};