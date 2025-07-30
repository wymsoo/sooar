document.addEventListener("DOMContentLoaded", ()=>{

    //     const options = {
    //     root: null, // Use the viewport as the root
    //     rootMargin: '0px 0px 0% 0px', // Trigger when the element is 50% in view
    //     threshold: 0 // Trigger as soon as any part of the element is visible
    // };
    const tracker = {}
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry =>{
            if (entry.isIntersecting){
                if (entry.target in tracker){
                    clearInterval(tracker[entry.target]);
                    delete tracker[entry.target];
                }
                entry.target.classList.add('in-view');
                return
            } else {
                if (entry.target in tracker){
                    clearInterval(tracker[entry.target]);
                    delete tracker[entry.target];
                }
                tracker[entry.target] = setTimeout(()=>{
                    entry.target.classList.remove('in-view');
                }, 500)
            }
            
        });
    });

    const allAnimatedElements = document.querySelectorAll('.animate');

    allAnimatedElements.forEach((element)=> observer.observe(element));
})