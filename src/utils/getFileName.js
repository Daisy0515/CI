export default function getFileName() {
    let d = new Date();
    let curr_date = d.getDate();
    let curr_month = d.getMonth() + 1;
    let curr_year = d.getFullYear();
    String(curr_month).length < 2 ?
        (curr_month = "0" + curr_month) :
        curr_month;
    String(curr_date).length < 2 ? (curr_date = "0" + curr_date) : curr_date;
    let yyyyMMdd = curr_year + "" + curr_month + "" + curr_date;
    let mm = Date.now();
    return {
        yyyyMMdd: yyyyMMdd,
        mm: mm
    }
}
