// global variable declaration
// define the icon class to be used for the button icon
// change the value to customize the icon (reference: https://static.oracle.com/cdn/fnd/gallery/2507.0.0/images/preview/index.html)
const iconClass = "oj-ux-ico-arrow-circle-down"; 
// define the key identifier for extracting the required value from the tooltip. What element will the getKeyValue search for?
const keyIdentifier = "EMPLOYEE_ID"; 
// reference the name of the apex ajax callback process that will handle the request
const ajaxCallback = "REDIRECT_USER"; 
// (leave unchanged) selector string to identify the tooltip modal in the DOM
const toolTipQuerySelector = 'section.ovis.oj-popup.svelte-1wc7iob';
// function to add a button to the tooltip footer

function addButtonToTooltip(toolTip) {
  //console.log('Button Added to ToolTip');
  if (buttonAdded) return; // prevent adding multiple buttons
  // create the button and append it to the tooltip footer
  const button = createButton();
  toolTip.querySelector('footer').appendChild(button);
  // attach a click event listener to handle button click
  button.addEventListener('click', () => handleButtonClick(toolTip));
}

// function to create a styled button element
function createButton() {
  //console.log('Button Created');
  // create a div element and apply oracle jet (oj) button classes
  const button = document.createElement('div');
  button.classList.add('oj-button', 'normal', 'oj-button-half-chrome', 'oj-button-icon-only', 'oj-complete', 'svelte-16rn59g', 'oj-default', 'oj-enabled');
  // define the inner html structure with an icon
  button.innerHTML = `
    <button class="oj-button-button" aria-label="Drill Down - View Details" title="Drill Down - View Details">
      <div class="oj-button-label">
        <span class="oj-button-icon oj-start oj-ux-icon ${iconClass}"></span>
      </div>
    </button>
  `;
  return button;
}

// function to handle the user's button click event
async function handleButtonClick(toolTip) {
  // retrieve the key value from the tooltip (e.g., employee id)
  const keyValue = getKeyValue(toolTip);
  // if no key value is found, alert a message and exit the function
  if (!keyValue) {
    apex.message.showErrors( [
    {
        type:       "error",
        location:   [ "page"],
        message:    `Key "${keyIdentifier}" not found in tooltip.`,
        unsafe:     false
    }
    ] );

    return; 
  }
  //console.log(`${keyIdentifier} = value:`, keyValue);
  try {
    // send an asynchronous ajax request to the oracle apex server
    const response = await apex.server.process(ajaxCallback, {
      x01: keyValue // send the extracted key value as parameter x01
    }, { dataType: 'JSON' }); // expect a json response
    //console.log('server response:', response);
    // check if the server response contains a url to redirect the user
    if (response.url) {
      window.location.href = response.url; // uncomment this line to enable redirection
    } 
    // check if the server returned an error message
    else if (response.error) {
      apex.message.showErrors( [
    {
        type:       "error",
        location:   [ "page"],
        message:    `An error occurred during the AJAX request.Server Error:  ${response.error}`,
        unsafe:     false
    }
    ] ); // show an alert with the error message
    }
  } catch (error) {
    // handle any errors that occur during the ajax request
    console.error('ajax request failed:', error);
    apex.message.showErrors([
      {
        type: "error",
        location: ["page"],
        message: "An error occurred during the AJAX request.",
        unsafe: false
      }
    ]); // display an error alert
  }
}

// function to extract the key value from the tooltip table
function getKeyValue(toolTip) {
  // find the row where the key identifier is located
  const keyValueRow = Array.from(toolTip.querySelectorAll('tr')).find(row => {
    const labelCell = row.querySelector('td b');
    return labelCell && labelCell.textContent.trim() === keyIdentifier;
  });

  if (keyValueRow) {
    // retrieve the corresponding value from the second cell in the row. i.e the value for that identifier
    const keyValueCell = keyValueRow.querySelectorAll('td')[1];
    return keyValueCell ? keyValueCell.textContent.trim() : null;
  }
  return null; // return null if the key value is not found
}
