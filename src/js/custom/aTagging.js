(function aTagging(){
    const tag='?btag=xxxx';
    const links = document.getElementsByTagName('a');
    Array.prototype.map.call(links,a=>a.href += tag);
})();