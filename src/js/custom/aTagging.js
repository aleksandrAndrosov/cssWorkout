(function aTagging(){
    const tag='?btag=xxxx';
    const links = document.querySelectorAll('a');
    Array.prototype.map.call(links,a=>a.href += tag);
})();