async function loadPurchaseResults() {
    const searchParams = new URLSearchParams(window.location.search);
    const session_id = searchParams.get('session_id');
    const type = searchParams.get('type');
    const purchaseid = searchParams.get('purchaseid')
    const amount = searchParams.get('amount');
    const idx = amount.length - 1 - 1;
    const price = amount.slice(0, idx) + '.' + amount.slice(idx);
    const id = searchParams.get('id');

    let msg;

    if (type == 'report') {
        msg = `<br> Please patiently wait for your report. The completion of your report takes 3-5 days. You will receive an email upon completion of the report. You can view your reports via <a href='/students/'> this link </a>.`
    } else if (type == 'meeting') {
        msg = `<br> To book a session with the instructor, please go to <a href='/students/f2fbooking'> this link </a>.`
    }


    const response = await fetch(`/checkout/session_status?session_id=${session_id}`);
    const data = await response.json();
    if (data.status === 'open') {
        $('#checkoutInfo').html(`Payment Error: Purchase Incomplete. Please try to purchase again in <a href='/students/f2fpurchase'> this link </a>.
            If problem persists, please call 61234567.`);
    } else if (data.status === 'complete') {
        $('#checkoutInfo').html(`
            Status: ${data.status}<br>
            Payment Status: ${data.payment_status}<br>
            Purchased Product: ${id} <br>
            Paid Amount: ${price} <br>
            Customer Email: ${data.customer_email}${msg}
        `);

    }

    const emaildata = {
        purchaseid
    }

    fetch('/mail/send',{
        method: "POST",
        headers: {
            "Content-type": 'application/json'
        },
        body: JSON.stringify(emaildata)
    }).then((res)=>res.json()).then((data)=>{
        if (data.success){
            alert(data.msg)
        }
    }).catch((e)=>console.error(e))
}