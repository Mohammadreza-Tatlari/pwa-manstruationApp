//consts for form
const newPeriodFromEl = document.getElementsByTagName("form")
[0];
const startDateInputEl = document.getElementById("start-date");
const endDateInputEl = document.getElementById("end-date");
const pastPeriodContainer = document.getElementById('past-periods')

//add the storage key as an app-wide constant 
const STORAGE_KEY = "period-tracker"

//listen to form submissions
newPeriodFromEl.addEventListener("submit", (event) => {
  //prevent from submitting to the server
  event.preventDefault();

  //get the start and end dates from the form
  const startDate = startDateInputEl.value;
  const endDate = endDateInputEl.value;

  //checks validations
  if (checkDatesInvalid(startDate, endDate)) {
    //exit if dates are invalid
    return;
  }

  //store the new period on our client-side storage
  storeNewPeriod(startDate, endDate);

  //refresh UI
  renderPastPeriods();

  //Reset the form
  newPeriodFromEl.reset();
});

//checks that end  date is after start date and neither is null
function checkDatesInvalid(startDate, endDate) {
  if (!startDate || !endDate || startDate > endDate) {
    // To make the validation robust we could:
    // 1. add error messaging based on error type
    // 2. Alert assistive technology users about the error
    // 3. move focus to the error location
    // instead, for now, we clear the dates if either
    // or both are invalid
    alert("Date are invalid. Reconsider the information")
    newPeriodFromEl.reset();
    return true;
  }
  else{
    return false;
  }
}

function storeNewPeriod(startDate, endDate){
    //gets data from stroage
    const periods = getAllStoredPeriods();

    //Add the new Period object to the end of the array of period objects.

    periods.push({startDate , endDate})
    //sort array from newest
    periods.sort((a , b) => {
        return new Date(b.startDate) - new Date(a.startDate)
    });

    //store the updated array back in the storage

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(periods))
}

function getAllStoredPeriods(){
    //get the string of period data from localStorage
    const data = window.localStorage.getItem(STORAGE_KEY)

    //if no period is stored, default to an empty array
    // otherwise return the stored data as parsed JSON
    const periods = data ? JSON.parse(data) : [];
    console.dir(periods);
    console.log(periods);
    return periods;
}

function renderPastPeriods() {
  
  const pastePeriodHeader = document.createElement("h2");
  const pastPeriodList = document.createElement("ul")
  const periods = getAllStoredPeriods();
  
  //exit if there are no periods
  if (periods.length === 0) {
    return
  }
  
  //clear the list for re-render
  pastPeriodContainer.innerHTML = "";
  pastPeriodContainer.textContent= "Past Periods";

  periods.forEach((period) => {
    const periodEl = document.createElement("li");
    periodEl.textContent = `Form ${formatDate(
      period.startDate,
    )} to ${formatDate(period.endDate)}`;
    pastPeriodList.appendChild(periodEl)
  });

  pastPeriodContainer.appendChild(pastePeriodHeader);
  pastPeriodContainer.appendChild(pastPeriodList)
}

function formatDate(dateString){
  //convert the date string to a date object.
  const date = new Date(dateString)

  //format the date into a locale-specific string
  //include your locale for better user experience
  return date.toLocaleDateString("en-US", {timeZone: "UTC"});

}

//start the app by rendering the past periods
renderPastPeriods();







