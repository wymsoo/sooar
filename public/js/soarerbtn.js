const outerCircle = document.querySelector('.outer-circle');

outerCircle.addEventListener('mouseover', () => {
    if (window.screen.width>500)
    {outerCircle.style.transform = 'scale(1.5,1.5)';}
});

outerCircle.addEventListener('mouseout', () => {
    outerCircle.style.transform = 'scale(1,1)';
});

function gotochat(id){
    $('#popup_chat').toggle()
}