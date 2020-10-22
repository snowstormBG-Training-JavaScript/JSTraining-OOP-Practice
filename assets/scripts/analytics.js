

// setInterval( () => {
//     console.log('SEEEENDING data')
// }, 15000);

const intervalId = setInterval( (data) => {
    console.log(data)
}, 1500, ["array of arguments to pass onto the handler function", "yes"]);

const stopAnalyticsBtn = document.getElementById('start-analytics-btn');
stopAnalyticsBtn.addEventListener('click', () => {
    clearInterval(intervalId);
    console.log('stopped inside the analytics js file');
});


