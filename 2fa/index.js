$(document).ready(()=>{
    const qrcode = document.getElementById("qrcode");
    const urlParams = new URLSearchParams(window.location.search);
    const name = 'MCTest';
    new QRCode(qrcode,`otpauth://totp/${name}:${urlParams.get('username')}?secret=${urlParams.get('secret')}&issuer=MCTest`);
    document.getElementById("code").innerText = urlParams.get('secret').replace('=','');
});
