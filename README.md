# Tooltip Button with AJAX Integration

## Overview
This solution dynamically adds a button to a tooltip (modal-like popup) in an Oracle APEX application. When clicked, the button extracts a specific value from the tooltip content and sends it to an APEX AJAX process, which redirects the user to a new page.

## Features
- Observes DOM changes to detect tooltip openings
- Dynamically adds a button when the tooltip appears
- Extracts a predefined key value from the tooltip
- Sends the extracted value to an APEX AJAX callback
- Handles AJAX responses and redirects the user if needed
- Logs debugging information to the console
- Displays error messages if the AJAX request fails

## Installation & Configuration
1. **Include the JavaScript file** in your Oracle APEX page (or insert the script into the page inline).
2. Modify the following constants in the script to match your APEX setup:
   ```javascript
   // define the icon class for the button
   const iconClass = "oj-ux-ico-arrow-circle-down"; 
   
   // define the key identifier for extracting the required value from the tooltip
   const keyIdentifier = "EMPLOYEE_ID"; 
   
   // reference the name of the apex ajax callback process that will handle the request
   const ajaxCallback = "REDIRECT_USER";  
   ```
3. Modify the following varaibles in the AJAX call to match your APEX setup:
   ```sql
   l_host varchar2(400) := 'https://<host>.adb.us-ashburn-1.oraclecloudapps.com'; 
    -- format: https://<guid>-<adb-name>.adb.<region>.oraclecloudapps.com
    -- define the target page number for redirection
    l_page_number number := NULL; -- CHANGE PAGE NUMBER. Ex:2
    -- define the page item that will receive the primary key value on target page
    l_page_item varchar(100) := NULL; --CHANGE PAGE ITEM. Ex: 'P2_EMPLOYEE_ID'
   ```
4. Ensure you create an **AJAX callback process** in APEX with the name **matching** the `ajaxCallback` value above. This will handle incoming requests and process the extracted tooltip data.
5. Adjust the `toolTipQuerySelector` variable if the tooltip selector in your APEX instance is different.

## How It Works
1. The **MutationObserver** detects when the tooltip appears in the DOM.
2. When detected, the script appends a button to the tooltip's footer.
3. Clicking the button triggers an AJAX request, sending the extracted value (`keyIdentifier`) to the server.
4. The server processes the request and responds with a redirection URL.
5. If successful, the user is redirected; if an error occurs, it is displayed on the page.

- The PL/SQL process also returns an error message in JSON format if something goes wrong on the server side.


## Notes
- Ensure the `ajaxCallback` name matches the APEX AJAX process.
- Update `keyIdentifier` to match the data label in your tooltip.
- Modify the `iconClass` to change the button's appearance.
- The tooltip selector (`toolTipQuerySelector`) should match your APEX implementation.


