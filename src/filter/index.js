function filterOne(n1, n2) {
    return n1.replace(/你/, '您') + n2



};

function filterTwo(n1, n2) {
    return '过滤器2:'
    n1 + n2;


};
export {
    filterOne,
    filterTwo
}