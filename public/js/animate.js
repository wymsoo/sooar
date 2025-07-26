document.addEventListener("DOMContentLoaded", ()=>{

    //     const options = {
    //     root: null, // Use the viewport as the root
    //     rootMargin: '0px 0px 0% 0px', // Trigger when the element is 50% in view
    //     threshold: 0 // Trigger as soon as any part of the element is visible
    // };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry =>{
            if (entry.isIntersecting){
                entry.target.classList.add('in-view');
                return
            }
                entry.target.classList.remove('in-view');

            
        });
    });

    const allAnimatedElements = document.querySelectorAll('.animate');

    allAnimatedElements.forEach((element)=> observer.observe(element));
})