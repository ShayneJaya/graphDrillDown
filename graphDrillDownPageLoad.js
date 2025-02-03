// create a new mutation observer to monitor changes in the DOM reference:https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
const observer = new MutationObserver((mutationsList) => {
  // iterate through all observed mutations
  for (const mutation of mutationsList) {
      // check if the mutation type is 'childList', meaning elements were added or removed
      if (mutation.type === 'childList') {
          // attempt to find the tooltip (modal) in the DOM
          const toolTip = document.querySelector(toolTipQuerySelector);
          if (toolTip) {
              addButtonToTooltip(toolTip); // call function to add the button
          } else {
              buttonAdded = false; // reset flag when tooltip is removed or closed
          }
      }
  }
});

// start observing the body element for child node changes (added or removed elements)
observer.observe(document.body, {
childList: true, // watch for direct additions or removals of child elements
subtree: false   // do not monitor changes deep within child elements
});
