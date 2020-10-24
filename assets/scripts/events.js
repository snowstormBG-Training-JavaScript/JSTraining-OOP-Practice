const buttons = document.querySelectorAll('div > button');

// button.onclick = function {}
//
const buttonClickHandler = e => {
    console.log(e);
    // e.disabled = true;
    e.target.disabled = true;
}   // or onCLick
//
// const anotherButtonHandler = () =>{
//     console.log('second event handler triggered')
// }
//
// button.onclick = buttonClickHandler; //downside is that we can add only 1 handler
// button.removeEventListener('click', buttonClickHandler, true);
// button.addEventListener('click', anotherButtonHandler);

// const boundFn = buttonClickHandler.bind(this);
// button.addEventListener('click', buttonClickHandler);
buttons.forEach((btn) => {
    btn.addEventListener("mouseenter", buttonClickHandler);
})

// setTimeout( () => {
//     //TO remove you need exact same reference, which is lost if using .bind()
//     //To resolve this, just store the binding in a constant.
//     button.removeEventListener('click', buttonClickHandler);
// }, 2000);

window.addEventListener('scroll', scrollHandler);

//=================
// INFINITE SCROLL
//=================
let curElementNumber = 0;

function scrollHandler() {
    const distanceToBottom = document.body.getBoundingClientRect().bottom;

    if (distanceToBottom < document.documentElement.clientHeight + 150) {
        const newDataElement = document.createElement('div');
        curElementNumber++;
        newDataElement.innerHTML = `<p>Element ${curElementNumber}</p>`;

        let colorHex = Math.round(Math.random() * 1000000).toString();
        while (colorHex.length < 6){
            colorHex = '0' + colorHex;
        }

        newDataElement.style.backgroundColor = `#${colorHex}`;
        document.body.append(newDataElement);
    }

}